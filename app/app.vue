<!-- app.vue -->
<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
/* Colamos seu CSS global aqui com :global ou scoped */
:global(body) {
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #f0f0f0;
}
</style>