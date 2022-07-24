import { resolve } from 'path'
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { red } from 'kolorist'
import sirv from 'sirv'
import { createRPCServer } from 'vite-dev-rpc'
import { createFilter } from '@rollup/pluginutils'
import type { ModuleInfo, RPCFunctions, TransformInfo } from './types'

function vitePlugin() {
  let config: ResolvedConfig
  const transformMap: Record<string, TransformInfo[]> = {}
  const dummyLoadPluginName = '__load__'

  const filter = createFilter()
  return <Plugin>{
    name: 'vite-plugin-watches',
    apply: 'serve',
    configResolved(resolvedConfig) {
      config = resolvedConfig
      config.plugins.forEach(loopPlugin)
    },
    configureServer,
  }

  function loopPlugin(plugin: Plugin) {
    if (plugin.transform) {
      const _transform = plugin.transform
      plugin.transform = async function (...args) {
        const code = args[0]
        const id = args[1]

        const _result = await _transform.apply(this, args)

        const result = typeof _result === 'string' ? _result : _result?.code

        if (filter(id) && result != null && !id.includes('plugin-vue:export-helper')) {
          // the last plugin must be `vite:import-analysis`, if it's already there, we reset the stack

          if (transformMap[id] && transformMap[id].slice(-1)[0]?.name === 'plugin-vue:export-helper')
            delete transformMap[id]

          // initial tranform (load from fs), add a dummy
          if (!transformMap[id])
            transformMap[id] = [{ name: dummyLoadPluginName, result: code }]

          transformMap[id].push({ name: plugin.name, result })
          return _result
        }
      }
    }
  }

  function configureServer(serve: ViteDevServer) {
    serve.middlewares.use('/__debugger__', sirv(resolve(`${__dirname}`, '../client/dist')))

    createRPCServer<RPCFunctions>('vite-plugin-watches', serve.ws, {
      list() {
        const modules = Object.keys(transformMap).map((id): ModuleInfo => {
          const plugins = transformMap[id]
          const deps = Array.from(serve.moduleGraph.getModuleById(id)?.importedModules || [])
            .map(i => i.id || '')
            .filter(Boolean)
          return {
            id,
            plugins,
            deps,
          }
        })

        return {
          root: config.root,
          modules,
        }
      },
    })

    serve.httpServer?.once('listening', () => {
      const protocol = config.server?.https ? 'https' : 'http'
      const port = config.server?.port
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log(`  > Inspect: ${red(`${protocol}://localhost:${port}/__debugger__/`)}\n`)
      }, 0)
    })
  }
}
export default vitePlugin
