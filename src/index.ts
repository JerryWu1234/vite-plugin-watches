import { resolve } from 'path'
import type { Plugin, ViteDevServer } from 'vite'
import type { ResolvedConfig } from 'vitest'
import sirv from 'sirv'

function vitePlugin() {
  // const config: ResolvedConfig
  const configureServer = (serve: ViteDevServer) => {
    serve.middlewares.use('/__debugger__', sirv(resolve(`${__dirname}`, '../client/dist')))
  }
  return <Plugin>{
    name: 'vite-plugin-watches',
    apply: 'serve',
    // configResolved(conf) {
    //   config = conf
    // },
    configureServer,
  }
}
export default vitePlugin
