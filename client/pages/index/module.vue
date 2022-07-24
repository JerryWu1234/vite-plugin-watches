<script setup lang="ts">
import { list } from '../../src/util/data'

const route = useRoute()
const id = computed(() => route?.query.id as string)

const content = computed(() => {
  return list.value.modules.filter(item => item.id === id.value)
})
// {{ }}
</script>

<template>
  <div class="grid grid-cols-1 grid-rows-[calc(100%-54px)_54px] h-full overflow-hidden">
    <Edior :code="content[0]?.plugins[0]?.result" />
  </div>
</template>
