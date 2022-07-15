import { createRPCClient } from 'vite-dev-rpc'
import { hot } from 'vite-hot-client'
import type { RPCFunctions } from '../../../src/types'
export const rpc = createRPCClient<RPCFunctions>('vite-plugin-watches', hot as any)
