<template>
  <div class="workflow-container">
    <div class="left-panel">
      <div class="app-info">
        <el-icon class="app-icon"><Monitor /></el-icon>
        <span class="app-name">工作流应用</span>
      </div>
      <div class="nav-menu">
        <div class="menu-item active">
          <el-icon><Connection /></el-icon>
          <span>编排</span>
        </div>
        <div class="menu-item">
          <el-icon><Link /></el-icon>
          <span>访问API</span>
        </div>
        <div class="menu-item">
          <el-icon><Document /></el-icon>
          <span>日志与标注</span>
        </div>
        <div class="menu-item">
          <el-icon><DataLine /></el-icon>
          <span>监测</span>
        </div>
      </div>
    </div>
    <div class="right-panel" @click="closeContextMenu">
      <VueFlow
        :nodes="nodes"
        :edges="edges"
        :class="{ dark }"
        class="workflow-canvas"
        :default-viewport="{ zoom: 1.5 }"
        :min-zoom="0.2"
        :max-zoom="4"
        @paneContextMenu="handleContextMenu"
      >
        <template #node-start="props">
          <WorkflowStartNode :id="props.id" :data="props.data"/>
        </template>

        <template #node-output>
          <WorkflowLLMNode/>
        </template>

        <template #node-llm>
          <WorkflowLLMNode/>
        </template>

        <template #node-llm1>
          <WorkflowLLMNode/>
        </template>

        <template #node-llm2>
          <WorkflowLLMNode/>
        </template>


        <div v-if="contextMenuVisible" class="context-menu" :style="{
          left: contextMenuPosition.x + 'px',
          top: contextMenuPosition.y + 'px'
        }">
          <div class="context-menu-item" @click="handleAddNode">添加节点</div>
          <div class="context-menu-item" @click="handleAddComment">添加注释</div>
          <div class="context-menu-item" @click="handleRun">运行</div>
        </div>
        <Background pattern-color="#aaa" :gap="16" />

        <MiniMap />

        <Controls position="top-left">
          <ControlButton title="Reset Transform" @click="resetTransform">
            <Icon name="reset" />
          </ControlButton>

          <ControlButton title="Shuffle Node Positions" @click="updatePos">
            <Icon name="update" />
          </ControlButton>

          <ControlButton title="Toggle Dark Mode" @click="toggleDarkMode">
            <Icon v-if="dark" name="sun" />
            <Icon v-else name="moon" />
          </ControlButton>

          <ControlButton title="Log `toObject`" @click="logToObject">
            <Icon name="log" />
          </ControlButton>
        </Controls>

      </VueFlow>
      
      <AddNodeDialog
        v-model:visible="showAddNodeDialog"
        @select="handleNodeSelect"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { VueFlow, Position, Handle, useVueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/controls/dist/style.css'
import { Monitor, Connection, Link, Document, DataLine, House } from '@element-plus/icons-vue'
import { Background } from '@vue-flow/background'
import { ControlButton, Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import Icon from '../components/WorkflowIcon.vue'
import { ElMessage } from 'element-plus'
import WorkflowStartNode from '../components/WorkflowStartNode.vue'
import WorkflowLLMNode from '../components/WorkflowLLMNode.vue'
import AddNodeDialog from '../components/AddNodeDialog.vue'

const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const { addNodes, project } = useVueFlow()

const initialNodes = [
  {
    id: '1',
    type: 'start',
    data: { color: '#6F3381' },
    position: { x: 50, y: 200 },    
  },
  {
    id: '2',
    type: 'output',    
    position: { x: 210, y: 200 },
    targetPosition: Position.Left,
  },
  {
    id: '3',
    type: 'output',    
    position: { x: 350, y: 200 },
    targetPosition: Position.Left,
  },
  {
    id: '4',
    type: 'output',    
    position: { x: 350, y: 260 },
    targetPosition: Position.Left,
  },
  {
    id: '5',
    type: 'output',    
    position: { x: 480, y: 200 },
    targetPosition: Position.Left,
  }
]

const initialEdges = [
  { 
    id: 'e1a-2', 
    source: '1', 
    sourceHandle: 'start-right',
    target: '2', 
    animated: true,
    style: { stroke: '#6F3381'},
  },
  { 
    id: 'e2-3', 
    source: '2', 
    sourceHandle: 'llm-right',
    target: '3', 
    animated: true,
    style: { stroke: '#6F3381'},
  },
  { 
    id: 'e2-4', 
    source: '2', 
    sourceHandle: 'llm-right',
    target: '4', 
    animated: true,
    style: { stroke: '#6F3381'},
  },
  { 
    id: 'e3-5', 
    source: '3', 
    sourceHandle: 'llm-right',
    target: '5', 
    animated: true,
    style: { stroke: '#6F3381'},
  }
] 

const nodes = ref(initialNodes) 
const edges = ref(initialEdges)
const dark = ref(false)

const handleContextMenu = (event) => {
  event.preventDefault()
  const { left, top } = event.target.getBoundingClientRect()
  const { viewport } = useVueFlow()
  const position = project({ x: event.clientX - left, y: event.clientY - top })
  contextMenuPosition.value = position
  contextMenuVisible.value = true
}

const showAddNodeDialog = ref(false)

const handleAddNode = () => {
  showAddNodeDialog.value = true
  contextMenuVisible.value = false

  console.log('handleAddNode called.' + showAddNodeDialog.value)
}

const handleNodeSelect = (nodeType) => {
  const newNode = {
    id: `node-${Date.now()}`,
    type: nodeType,
    position: contextMenuPosition.value
  }
  addNodes([newNode])
}

const handleAddComment = () => {
  const newNode = {
    id: `comment-${Date.now()}`,
    type: 'default',
    label: '注释',
    position: contextMenuPosition.value,
    style: { background: '#f0f0f0', padding: '10px' }
  }
  addNodes([newNode])
  contextMenuVisible.value = false
}

const handleRun = () => {
  ElMessage.success('开始运行工作流')
  contextMenuVisible.value = false
}

const closeContextMenu = () => {
  contextMenuVisible.value = false
}

const logToObject = () => {
  console.log(toObject())
} 

/**
 * Resets the current viewport transformation (zoom & pan)
 */
const resetTransform = () => {
  setViewport({ x: 0, y: 0, zoom: 1 })
} 
const toggleDarkMode = () => {
  dark.value = !dark.value
}
const updatePos = () => {
  nodes.value = nodes.value.map((node) => {
    return {
      ...node,
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
    }
  })
}
</script>

<style scoped>
.workflow-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 64px);
}

.left-panel {
  width: 12%;
  background-color: #f5f7fa;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
}

.app-info {
  height: 15%;
  padding: 20px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.app-icon {
  font-size: 32px;
  color: var(--el-color-primary);
  margin-bottom: 8px;
}

.app-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.nav-menu {
  height: 85%;
  padding: 16px 0;
}

.menu-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item:hover {
  background-color: #e6f2ff;
  color: var(--el-color-primary);
}

.menu-item.active {
  background-color: #e6f2ff;
  color: var(--el-color-primary);
  font-weight: 500;
}

.menu-item .el-icon {
  font-size: 18px;
}

.right-panel {
  width: 88%;
  height: 100%;
  background-color: #fff;
}

.workflow-canvas {
  width: 100%;
  height: 100%;
}

.context-menu {
  position: absolute;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  z-index: 9999;
}

.context-menu-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.context-menu-item:hover {
  background-color: #f5f7fa;
  color: var(--el-color-primary);
}

:deep(.vue-flow__node) {
  font-size: 10px; /* 全局设置标签文字大小 */
  padding: 6px 10px;
  background: '#fff';
  border: 1px solid var(--el-color-primary);
  border-radius: 5px;
  width: 100px;
  display: flex;
  align-items: left;
  justify-content: left;
  gap: 2px;
  height: 30px;
  transition: background-color 0.3s;
}

:deep(.vue-flow__node.selected) {
  background-color: #c9def5;
  border-color: var(--el-color-primary);
}

:deep(.vue-flow__handle) {
    border-radius:2px
}

</style>
