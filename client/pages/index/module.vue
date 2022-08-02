<script setup lang="ts">
import { onReFresh, refresh } from '../../src/util/data'
import { rpc } from '../../src/util/rpc'

const route = useRoute()
const id = computed(() => route?.query.id as string)

const content = ref()
async function pageRefresh() {
  try {
    await rpc.clear(id.value)
    await fetch(id.value)

    const list = await refresh()
    content.value = list.modules.filter(item => item.id === id.value)
  }
  catch (_) {}
}

onMounted(() => {
  pageRefresh()
})
</script>

<template>
  <div class="grid grid-cols-1 grid-rows-[calc(100%-54px)_54px] h-full overflow-hidden">
    <Edior :code="content?.[0]?.plugins[0]?.result || ''" />
  </div>
</template>
