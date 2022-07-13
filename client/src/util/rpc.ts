import { createRPCClient } from 'vite-dev-rpc'
import { hot } from 'vite-hot-client'

export const rpc = createRPCClient('vite-plugin-watches', hot as any)
