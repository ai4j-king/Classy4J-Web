<template>
  <nav class="navigation">
    <div class="nav-left">
      <img src="../assets/logo.png" alt="Logo" class="logo">
      <el-menu
        mode="horizontal"
        :router="true"
        class="nav-menu"
      >
        <el-menu-item index="/">全部</el-menu-item>
        <el-menu-item index="/chatHelper">聊天助手</el-menu-item>
        <el-menu-item index="/agent">Agent</el-menu-item>
        <el-menu-item index="/knowledge">知识库</el-menu-item>
        <el-menu-item index="/workflow">工作流</el-menu-item>
      </el-menu>
    </div>
    <div class="nav-right">
      <el-button type="primary">
        <el-icon><Plus /></el-icon>
        新开窗口
      </el-button>
      <el-button>
        <el-icon><Search /></el-icon>
      </el-button>
      <el-button>
        <el-icon><Bell /></el-icon>
      </el-button>
      <el-avatar size="small" src="https://avatars.githubusercontent.com/u/1?v=4" />
    </div>
  </nav>
</template>

<script setup>
import { Plus, Search, Bell } from '@element-plus/icons-vue'
</script>

<style scoped>
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  height: 32px;
  width: auto;
}

.nav-menu {
  border-bottom: none;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.el-menu--horizontal) {
  border-bottom: none;
}

:deep(.el-menu-item) {
  font-size: 14px;
}
</style> 