<script setup lang="ts">
import { useCodeMirror } from '../src/util/codemirror'
import { rpc } from '../src/util/rpc'
const props = defineProps<{ code: string }>()
const code = computed(() => props.code)
const fromEl = ref<HTMLTextAreaElement>()
const route = useRoute()
let mirror: CodeMirror.EditorFromTextArea

const id = computed(() => route?.query.id as string)
onMounted(() => {
  mirror = useCodeMirror(fromEl, code, {
    mode: 'javascript',
    lineNumbers: true,
    scrollbarStyle: 'null',
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
  })

  watchEffect(async () => {
    function style() {
      if (code.value.match(/^import\s/))
        return 'javascript'

      if (code.value.includes('<template>\n'))
        return 'vue'
      if (code.value.includes('<html>\n'))
        return 'html'
      if (code.value.match(/^[.#].+\{/))
        return 'css'
      return 'javascript'
    }
    mirror.setOption('mode', style())
  })
})

const updatecode = async () => {
  await rpc.updateCode(mirror.getValue(), id.value)
}
</script>

<template>
  <div class="w-full h-[calc(100% - 45px)]] ">
    <textarea ref="fromEl" v-text="code" />
    <div class="text-right py-2 border-t border-main px-1">
      <button class="btn !cursor-pointer" @click="updatecode">
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
