<template>
  <div class="layout-container">
    <header class="header">
      <Navigation />
    </header>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import Navigation from './Navigation.vue'
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
}

.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
  width: 100%;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
}
</style> 