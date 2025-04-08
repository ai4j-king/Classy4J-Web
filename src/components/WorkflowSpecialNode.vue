<template>
  <div class="workflow-node" :class="data.nodeType">
    <Handle type="target" :position="Position.Left" />
    <div class="node-content">
      <el-icon><component :is="data.icon" /></el-icon>
      <span>{{ data.label }}</span>
      <div v-if="data.info" class="node-info">{{ data.info }}</div>
      <el-button
        class="node-delete"
        type="danger"
        size="small"
        circle
        @click.stop="$emit('delete', id)"
      >
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { Delete } from '@element-plus/icons-vue'

defineProps({
  id: String,
  data: Object
})

defineEmits(['delete'])
</script>

<style scoped>
.workflow-node {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 15px;
  min-width: 120px;
  position: relative;
}

.node-content {
  text-align: center;
}

.el-icon {
  font-size: 24px;
  margin-bottom: 8px;
  display: block;
}

.node-info {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.node-delete {
  position: absolute;
  top: -8px;
  right: -8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.workflow-node:hover .node-delete {
  opacity: 1;
}

/* 节点类型样式 */
.start .el-icon { color: #409EFF; }
.llm .el-icon { color: #E6A23C; }
.reply .el-icon { color: #F56C6C; }
.knowledge .el-icon { color: #67C23A; }
</style>