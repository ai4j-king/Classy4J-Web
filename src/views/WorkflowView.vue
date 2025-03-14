<template>
  <div class="workflow">
    <div class="page-header">
      <h1>工作流</h1>
      <el-button type="primary">
        <el-icon><Plus /></el-icon>
        创建工作流
      </el-button>
    </div>
    
    <div class="workflow-list">
      <el-empty description="暂无工作流，点击右上角创建" />
    </div>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
</script>

<style scoped>
.workflow {
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

.workflow-list {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 