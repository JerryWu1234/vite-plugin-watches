<template>
  <main class="">
    <Suspense>
      <router-view />
      <template #fallback>
        loading
      </template>
    </Suspense>
  </main>
</template>
