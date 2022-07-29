import { createEventHook } from '@vueuse/core'
import { computed, ref } from 'vue'
import { rpc } from './rpc'
export const onReFresh = createEventHook<void>()
export const list = ref(await rpc.list())

export const root = computed(() => list.value.root)

export const refresh = async () => {
  list.value = await rpc.list()
  return list.value
}
