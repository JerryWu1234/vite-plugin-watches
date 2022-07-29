import type { Ref, WritableComputedRef } from 'vue'
import { watch } from 'vue'
import Codemirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/pug/pug'
import 'codemirror/mode/sass/sass'
import 'codemirror/mode/vue/vue'
import 'codemirror/mode/handlebars/handlebars'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/addon/display/placeholder'
import 'codemirror/lib/codemirror.css'

export const useCodeMirror = (
  textarea: Ref<HTMLTextAreaElement | null | undefined>,
  input: Ref<string> | WritableComputedRef<string>,
  options: CodeMirror.EditorConfiguration = {},
) => {
  const mirror = Codemirror.fromTextArea(textarea.value!, {
    theme: 'vars',
    ...options,
  })
  let skip = false
  mirror.on('change', () => {
    if (skip) {
      skip = false
      return
    }

    input.value = mirror.getValue()
    console.log('input.value ', input.value)
  })

  watch(
    input,
    (v) => {
      if (v !== mirror.getValue()) {
        skip = true
        const selections = mirror.listSelections()
        mirror.replaceRange(v, mirror.posFromIndex(0), mirror.posFromIndex(Infinity))
        mirror.setSelections(selections)
      }
    },
    { immediate: true },
  )
  return mirror
}
