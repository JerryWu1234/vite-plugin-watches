<script setup lang="ts">
import { useCodeMirror } from '../src/util/codemirror'
const props = defineProps<{ code: string }>()
const { code } = toRefs(props)
const fromEl = ref<HTMLTextAreaElement>()

onMounted(() => {
  useCodeMirror(fromEl, code, {
    mode: 'javascript',
    readOnly: false,
    lineNumbers: true,
    scrollbarStyle: 'null',
  })
})
</script>

<template>
  <div class="w-full h-[calc(100% - 45px)]] ">
    <textarea ref="fromEl" v-text="from" />
    <div class="text-right py-2 border-t border-main px-1">
      <button class="btn !cursor-pointer">
        submit
      </button>
    </div>
  </div>
</template>

<style lang="postcss">
.CodeMirror{
  height: 100%
}
.diff-added {
  @apply bg-green-400/15;
}
.diff-removed {
  @apply bg-red-400/15;
}
.diff-added-inline {
  @apply bg-green-400/30;
}
.diff-removed-inline {
  @apply bg-red-400/30;
}
</style>
