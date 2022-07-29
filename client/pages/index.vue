<script setup lang="ts">
import { searchResults } from '../src/util/search'

const route = useRoute()
const isRoot = computed(() => route.path === '/')
// console.log(searchResults)
</script>

<template>
  <nav-bar />
  <div class="h-[calc(100vh-54px)]]">
    <list :modules="searchResults" />
  </div>

  <div
    v-if="!isRoot"
    class="fixed left-0 top-0 right-0 bottom-0 transition-all flex overflow-hidden bg-black/50"
    :class="isRoot ? 'pointer-events-none opacity-0' : 'opacity-100'"
  >
    <router-link class="min-w-200px h-full flex-auto" to="/" />
    <div
      class="bg-white border-main border-l h-full overflow-hidden shadow-lg transition-transform transform duration-300"
      :class="isRoot ? 'translate-x-100%' : 'translate-x-0'"
    >
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
  </div>
</template>
