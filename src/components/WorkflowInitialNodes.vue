<template>
    <NodeToolbar :is-visible="data.toolbarVisible" :position="data.toolbarPosition">
      <button>delete</button>
      <button>copy</button>
      <button>expand</button>
    </NodeToolbar>
  
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
</template>

<script lang="ts" setup>
import { Handle, Position } from '@vue-flow/core'
// @ts-ignore
import { NodeToolbar } from '@vue-flow/node-toolbar'

interface NodeData {
  toolbarVisible: boolean
  toolbarPosition: Position
}

interface Props {
  data: NodeData
  label: string
}

defineProps<Props>()
</script>