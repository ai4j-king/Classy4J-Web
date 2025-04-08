<template>
  <BaseEdge
    :id="id"
    :path="path"
    :marker-end="markerEnd"
    class="workflow-edge"
    :style="style"
  />
</template>

<script setup>
import { BaseEdge, getBezierPath } from '@vue-flow/core'

const props = defineProps({
  id: String,
  sourceX: Number,
  sourceY: Number,
  targetX: Number,
  targetY: Number,
  sourcePosition: String,
  targetPosition: String,
  data: Object,
  markerEnd: String,
  style: Object
})

const path = getBezierPath({
  sourceX: props.sourceX,
  sourceY: props.sourceY,
  sourcePosition: props.sourcePosition,
  targetX: props.targetX,
  targetY: props.targetY,
  targetPosition: props.targetPosition,
})
</script>

<style>
.workflow-edge {
  stroke: #b1b1b7;
  stroke-width: 2;
}

.workflow-edge.selected {
  stroke: #409EFF;
}
</style>