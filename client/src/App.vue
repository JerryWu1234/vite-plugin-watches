<template>
  <main class="h-screen text-gray-700 dark:text-gray-200 w-screen grid grid-rows-[min-content_1fr]">
    <Suspense>
      <router-view />
      <template #fallback>
        loading
      </template>
    </Suspense>
  </main>
</template>
