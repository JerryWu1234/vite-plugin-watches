<script setup lang="ts">
import { root } from '../src/util/data'

defineProps<{
  modules: Array<{
    id: string
    plugins: any[]
  }>
}>()
</script>

<template>
  <router-link
    v-for="m in modules" :key="m.id" :to="`/module?id=${encodeURIComponent(m.id)}`"
    class="block border-b border-main px-3 py-2 text-left font-mono text-sm"
  >
    <template v-if="m.id.startsWith(root)">
      <span class="opacity-50">.</span>
      <span>{{ m.id.slice(root.length) }}</span>
    </template>
    <span v-else>{{ m.id }}</span>
  </router-link>
</template>
