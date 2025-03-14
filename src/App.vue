<script setup>
  import Layout from './components/Layout.vue'
</script>

<template>
  <Layout />
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  height: 100vh;
  min-height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #f5f7fa;
}
</style>
