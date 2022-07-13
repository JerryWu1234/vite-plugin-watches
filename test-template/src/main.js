import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

// ABCDE
if (import.meta.hot) {
  import.meta.hot.on('my:greetings', (data) => {
    debugger
    console.log(data.msg, '>>>>>>>>') // hello
  })
}

