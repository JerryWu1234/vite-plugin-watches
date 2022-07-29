<script setup lang="ts">
import { toggle } from '../src/util/operate'
import { searchValue } from '../src/util/search'
</script>

<template>
  <nav class="font-light px-6 border-b border-main flex gap-4 h-54px children:my-auto">
    <span class="text-md">Vite</span>
    <input v-model="searchValue" type="text" class="border border-main rounded py-1 px-3 bg-transparent !outline-none" placeholder="serch">
    <div class="flex-auto" />
    <button class="icon-btn text-lg" title="Toggle Dark Mode" @click="toggle()">
      <carbon-moon />
      <!-- <carbon-sun /> -->
    </button>
  </nav>
</template>
