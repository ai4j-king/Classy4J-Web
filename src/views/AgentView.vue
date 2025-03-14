<template>
  <div class="agent">
    <div class="page-header">
      <h1>Agent</h1>
      <el-button type="primary">
        <el-icon><Plus /></el-icon>
        创建Agent
      </el-button>
    </div>
    
    <div class="agent-list">
      <el-empty description="暂无Agent，点击右上角创建" />
    </div>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
</script>

<style scoped>
.agent {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
}

.agent-list {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 