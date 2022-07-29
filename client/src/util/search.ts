import { computed, ref } from 'vue'
import Fuse from 'fuse.js'
import { list } from './data'
export const searchValue = ref<string>('')
export const searchResults = computed(() => {
  const data = list.value?.modules || []

  if (searchValue.value === '')
    return data
  const fuseobj = new Fuse(data, {
    shouldSort: true,
    keys: ['id'],
  })
  return fuseobj.search(searchValue.value).map(v => v.item)
})
