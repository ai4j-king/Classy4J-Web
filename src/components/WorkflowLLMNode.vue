<template>
  <div class="start-node">
    <el-icon class="icon-home"><Platform /></el-icon>
    <span>LLM</span>
  </div>

  <Handle 
    id="llm-left"
    type="target"
    :position="Position.Left"
    :style="{ height: '15px', width: '5px', backgroundColor: '#91f', filter: 'invert(100%)' }"
  />

  <Handle
    id="llm-right"
    type="target"
    :position="Position.Right"
    :style="{ height: '15px', width: '5px', backgroundColor: '#11f', filter: 'invert(100%)' }"
  />
</template>

<script setup>
import { Handle, Position, useNodesData, useNodeConnections } from '@vue-flow/core'

const connections = useNodeConnections({
  handleType: 'target',
})

const nodesData = useNodesData(() => connections.value[0]?.source)

</script>

<style scoped>
.start-node {
  font-size: 10px; 
  background: '#fff';
  width: 100px;   
  display: flex; 
  align-items: left; 
  gap: 5px    
}
.icon-home {
  margin-top: 3px;
  color: #1577c8;
}
</style>