import { computed } from 'vue'
import { list } from './data'

export const searchResults = computed(() => {
  const data = list.value?.modules || []
  return data
})
