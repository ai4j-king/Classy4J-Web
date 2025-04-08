<template>
  <div class="start-node">
    <el-icon class="icon-home"><HomeFilled /></el-icon>
    <span>开始</span>
  </div>
  <Handle id="start-right" type="source" :position="Position.Right" class="node-handle" 
  :style="{ height: '15px', width: '5px', backgroundColor: '#abc', filter: 'invert(100%)' }"
  />
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
})

</script>

<style scoped>
.start-node {
  font-size: 10px; /* 全局设置标签文字大小 */
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
.node-handle {
  width: 6px;
  height: 16px;  
}
</style>