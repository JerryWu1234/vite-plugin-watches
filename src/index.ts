import { resolve } from 'path'
import type { ModuleNode, Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { red } from 'kolorist'
import sirv from 'sirv'
import { createRPCServer } from 'vite-dev-rpc'
import { createFilter } from '@rollup/pluginutils'
import { propagateUpdate } from './utils'
import type { ModuleInfo, RPCFunctions, TransformInfo, Update } from './types'

function vitePlugin() {
  let config: ResolvedConfig
  const transformMap: Record<string, TransformInfo[]> = {}
  const dummyLoadPluginName = '__load__'
  const updateList: Record<string, string> = {}
  const filter = createFilter()
  return <Plugin>{
    name: 'vite-plugin-watches',
    apply: 'serve',
    async handleHotUpdate(ctx) {
      delete transformMap[ctx.file]
      delete updateList[ctx.file]
    },
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
        let code = args[0]
        const id = args[1]

        if (updateList[id] && !transformMap[id]) {
          if (!updateList[id])
            return
          code = updateList[id]
          // console.log(id)
        }

        const _result = await _transform.apply(this, [code, id])

        const result = typeof _result === 'string' ? _result : _result?.code
        if (filter(id) && result != null) {
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
    serve.middlewares.use('/__debugger__', sirv(resolve(`${__dirname}`, '../client/dist'), {
      dev: true,
      single: true,
    }))

    createRPCServer<RPCFunctions>('vite-plugin-watches', serve.ws, {
      updateCode(code: string, id: string) {
        const updates: Update[] = []
        const timestamp = Date.now()
        const c = serve.moduleGraph.getModulesByFile(id)
        const graph = [...c!][0]
        updateList[id] = code

        if (graph) {
          serve.moduleGraph.invalidateModule(graph)
          delete transformMap[id]
        }
        const boundaries = new Set<{
          boundary: ModuleNode
          acceptedVia: ModuleNode
        }>()
        console.log(graph)
        const hasDeadEnd = propagateUpdate(graph!, boundaries)

        if (hasDeadEnd) {
          serve.ws.send({
            type: 'full-reload',
          })
          return
        }

        updates.push(
          ...[...boundaries].map(({ boundary, acceptedVia }) => {
            return {
              type: `${boundary.type}-update` as Update['type'],
              timestamp,
              path: acceptedVia.url,
              acceptedPath: acceptedVia.url,
            }
          }),
        )

        serve.ws.send({
          type: 'update',
          updates,
        })
      },
      clear(id: string) {
        if (id) {
          const m = serve.moduleGraph.getModuleById(id)
          if (m)
            serve.moduleGraph.invalidateModule(m)
          delete transformMap[id]
        }
      },
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
