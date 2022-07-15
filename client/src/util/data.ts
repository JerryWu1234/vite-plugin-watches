import { computed, ref } from 'vue'
import { rpc } from './rpc'

export const list = ref(await rpc.list())

export const root = computed(() => list.value.root)
