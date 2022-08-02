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
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/css-hint'
import 'codemirror/addon/hint/html-hint'
import 'codemirror/addon/hint/anyword-hint'
import 'codemirror/addon/hint/show-hint.css'
export const useCodeMirror = (
  textarea: Ref<HTMLTextAreaElement | null | undefined>,
  input: Ref<string> | WritableComputedRef<string>,
  options: CodeMirror.EditorConfiguration = {},
) => {
  const mirror = Codemirror.fromTextArea(textarea.value!, {
    ...options,
    extraKeys: {
      Tab: 'autocomplete',
    },
  })

  mirror.on('keypress', () => {
    mirror.showHint()
  })

  watch(
    input,
    (v) => {
      if (v !== mirror.getValue()) {
        // skip = true
        const selections = mirror.listSelections()
        mirror.replaceRange(v, mirror.posFromIndex(0), mirror.posFromIndex(Infinity))
        mirror.setSelections(selections)
      }
    },
    { immediate: true },
  )
  return mirror
}
