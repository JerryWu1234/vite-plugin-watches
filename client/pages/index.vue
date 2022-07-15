<script setup lang="ts">
import { searchResults } from '../src/util/search'
console.log(searchResults)
</script>

<template>
  <nav-bar />
  <div class="h-[calc(100vh-54px)]]">
    <list :modules="searchResults" />
  </div>

  <div>
    <Suspense>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <template #fallback>
        Loading...
      </template>
    </Suspense>
  </div>
</template>
