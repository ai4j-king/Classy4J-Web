<template>
  <div class="workflow">
    <div class="page-header">
      <h1>工作流</h1>
      <el-button type="primary" @click="createWorkflow">
        <el-icon><Plus /></el-icon>
        创建工作流
      </el-button>
    </div>
    
    <div class="workflow-list" v-if="!currentWorkflow">
      <el-empty description="暂无工作流，点击右上角创建" />
    </div>

    <div class="workflow-canvas" v-else>
      <div class="workflow-tools">
        <el-button-group>
          <el-button type="primary" plain>
            <el-icon><ZoomIn /></el-icon>
          </el-button>
          <el-button type="primary" plain>
            <el-icon><ZoomOut /></el-icon>
          </el-button>
          <el-button type="primary" plain>
            <el-icon><RefreshRight /></el-icon>
          </el-button>
        </el-button-group>
      </div>
      
      <div class="workflow-nodes">
        <div class="node start">
          <el-icon><VideoPlay /></el-icon>
          <span>开始</span>
        </div>
        <div class="node knowledge">
          <el-icon><Files /></el-icon>
          <span>知识检索</span>
          <div class="node-info">gpt-3.5-turbo</div>
        </div>
        <div class="node llm">
          <el-icon><Monitor /></el-icon>
          <span>LLM</span>
          <div class="node-info">gpt-4</div>
        </div>
        <div class="node multimodal">
          <el-icon><PictureFilled /></el-icon>
          <span>多模态处理</span>
        </div>
        <div class="node system">
          <el-icon><Setting /></el-icon>
          <span>系统提示</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, ZoomIn, ZoomOut, RefreshRight, VideoPlay, Files, Monitor, PictureFilled, Setting } from '@element-plus/icons-vue'

const currentWorkflow = ref(true) // 设置为 true 以显示工作流画布

const createWorkflow = () => {
  currentWorkflow.value = true
}
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

.workflow-canvas {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  min-height: 600px;
  position: relative;
}

.workflow-tools {
  position: absolute;
  right: 20px;
  top: 20px;
}

.workflow-nodes {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 100px 20px;
}

.node {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 15px;
  min-width: 120px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}

.node .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
  display: block;
}

.node span {
  display: block;
  font-size: 14px;
}

.node-info {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.start .el-icon {
  color: #409EFF;
}

.knowledge .el-icon {
  color: #67C23A;
}

.llm .el-icon {
  color: #E6A23C;
}

.multimodal .el-icon {
  color: #F56C6C;
}

.system .el-icon {
  color: #909399;
}
</style>