<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加节点"
    width="300px"
    :close-on-click-modal="false"
    class="add-node-dialog"
  >
    <div class="search-box">
      <el-input
        v-model="searchText"
        placeholder="搜索节点"
        :prefix-icon="Search"
        clearable
      />
    </div>
    
    <el-tabs v-model="activeTab" class="node-tabs">
      <el-tab-pane label="节点" name="nodes">
        <div class="node-list">
          <div class="node-category">
            <div class="category-title">功能节点</div>
            <div class="node-item">
              <el-icon><ChatLineRound /></el-icon>
              <span>LLM</span>
            </div>
            <div class="node-item">
              <el-icon><Connection /></el-icon>
              <span>知识检索</span>
            </div>
            <div class="node-item">
              <el-icon><Flag /></el-icon>
              <span>结束</span>
            </div>
            <div class="node-item">
              <el-icon><Avatar /></el-icon>
              <span>Agent</span>
            </div>
          </div>             
          <div class="node-category">
            <div class="category-title">问题理解</div>                    
            <div class="node-item">
              <el-icon><QuestionFilled /></el-icon>
              <span>问题分类器</span>
            </div>
          </div>
          <div class="node-category">
            <div class="category-title">逻辑</div>
            <div class="node-item">
              <el-icon><Files /></el-icon>
              <span>条件分支</span>
            </div>
            <div class="node-item">
              <el-icon><Postcard /></el-icon>
              <span>送代</span>
            </div>
            <div class="node-item">
              <el-icon><CircleClose /></el-icon>
              <span>循环</span>
            </div>
          </div>

          <div class="node-category">
            <div class="category-title">转换</div>
            <div class="node-item">
              <el-icon><Edit /></el-icon>
              <span>代码执行</span>
            </div>
            <div class="node-item">
              <el-icon><CopyDocument /></el-icon>
              <span>模板转换</span>
            </div>
            <div class="node-item">
              <el-icon><Box /></el-icon>
              <span>空量聚合器</span>
            </div>
            <div class="node-item">
              <el-icon><Document /></el-icon>
              <span>文档提取器</span>
            </div>
            <div class="node-item">
              <el-icon><Coin /></el-icon>
              <span>空量赋值</span>
            </div>
            <div class="node-item">
              <el-icon><DataLine /></el-icon>
              <span>参数提取器</span>
            </div>
          </div>
          <div class="node-category">
            <div class="category-title">工具</div>                    
            <div class="node-item">
              <el-icon><Link /></el-icon>
              <span>HTTP 请求</span>
            </div>
            <div class="node-item">
              <el-icon><Grid /></el-icon>
              <span>列表操作</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="工具" name="tools">
        <div class="node-list">
          <div class="node-category">
            <div class="node-item">
              <el-icon><Link /></el-icon>
              <span>HTTP 请求</span>
            </div>
            <div class="node-item">
              <el-icon><Grid /></el-icon>
              <span>列表操作</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Search, ChatLineRound, Connection, Finished, Avatar, QuestionFilled, 
         Files, Postcard, CircleClose, Edit, CopyDocument, Box, Document, 
         Coin, DataLine, Link, Grid } from '@element-plus/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'select'])

const dialogVisible = ref(props.visible)
const searchText = ref('')
const activeTab = ref('nodes')

watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
})

watch(() => dialogVisible.value, (newVal) => {
  emit('update:visible', newVal)
})

const handleNodeSelect = (nodeType) => {
  emit('select', nodeType)
  dialogVisible.value = false
}
</script>

<style scoped>
.add-node-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.search-box {
  padding: 2px;  
}

.node-tabs {
  padding: 0 16px;
}

.node-list {
  max-height: 500px;
  overflow-y: auto;
}

.node-category {
  margin-bottom: 5px;
  color: black;
}

.category-title {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 5px;
  color: blue;
}

.node-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.node-item:hover {
  background-color: var(--el-fill-color-light);
}

.node-item .el-icon {
  font-size: 16px;
  margin-right: 8px;
}

.node-item span {
  font-size: 14px;
}
</style>