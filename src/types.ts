export interface ModulesList {
  root: string
  modules: ModuleInfo[]
}
export interface ModuleInfo {
  id: string
  plugins: string[]
  deps: string[]
}
export interface RPCFunctions {
  list(): ModulesList
}
export interface TransformInfo {
  name: string
  result: string
}
