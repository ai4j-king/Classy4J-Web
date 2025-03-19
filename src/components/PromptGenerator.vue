<template>
  <el-dialog
    v-model="dialogVisible"
    title="提示词生成器"
    width="1000px"
    :close-on-click-modal="false"
    class="prompt-generator-dialog"
  >
    <div class="prompt-generator-content">
      <p class="generator-desc">提示词生成器使用配置的模型来优化提示词，以获得更高的质量和更好的结构。你可以在提示词中使用 {{input}} 来引用用户输入。</p>
      
      <!-- 模型信息 -->
      <div class="model-info">
        <el-avatar :size="24" :src="modelIcon" />
        <span>{{ modelName }}</span>
      </div>

      <div class="generator-layout">
        <!-- 左侧编辑区域 -->
        <div class="left-section">
          <div class="try-section">
            <h4>试一试</h4>
            <div class="example-items">
              <div
                v-for="(item, index) in exampleItems"
                :key="index"
                class="example-item"
                :class="{ active: selectedExample === index }"
                @click="handleSelectExample(index)"
              >
                <div class="item-icon">
                  <el-icon><component :is="item.icon" /></el-icon>
                </div>
                <div class="item-content">
                  <div class="item-title">{{ item.title }}</div>
                  <div class="item-desc">{{ item.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 提示词输入区域 -->
          <div class="prompt-input">
            <h4>指令</h4>
            <el-input
              v-model="promptText"
              type="textarea"
              :rows="6"
              placeholder="写下清晰、具体的说明..."
              resize="none"
            />
          </div>
        </div>

        <!-- 右侧预览区域 -->
        <div class="right-section">
          <div v-if="!generatedContent" class="preview-placeholder">
            <el-icon :size="48" class="placeholder-icon"><EditPen /></el-icon>
            <p>在左侧描述您的用例，编排预览将在此处显示</p>
          </div>
          <div v-else class="preview-content">
            <div class="preview-header">
              <h4>生成结果</h4>
              <el-button link type="primary" @click="handleCopy">
                <el-icon><CopyDocument /></el-icon>
                复制
              </el-button>
            </div>
            <div class="preview-text">{{ generatedContent }}</div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleGenerate" :loading="generating">生成</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref,watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Monitor,
  Connection,
  Files,
  Edit,
  DataAnalysis,
  Promotion,
  Notebook,
  Guide,
  EditPen,
  CopyDocument
} from '@element-plus/icons-vue'

const props = defineProps({
  modelName: {
    type: String,
    required: true
  },
  modelIcon: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'generate'])

// 状态变量
const dialogVisible = ref(false)
const promptText = ref('')
const selectedExample = ref(null)
const generatedContent = ref('')
const generating = ref(false)

// 监听visible属性变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
})

// 监听对话框状态变化
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
  if (!newVal) {
    // 重置状态
    promptText.value = ''
    selectedExample.value = null
    generatedContent.value = ''
  }
})

// 示例项配置
const exampleItems = [
  {
    icon: 'Monitor',
    title: 'Python 代码助手',
    description: '我是一个 Python 编程助手。请帮我分析并优化以下代码：{{input}}'
  },
  {
    icon: 'Connection',
    title: '翻译机器人',
    description: '我是一个翻译助手。请将以下文本翻译成中文，并解释其中的文化差异：{{input}}'
  },
  {
    icon: 'Files',
    title: '总结会议记录',
    description: '请帮我总结以下会议记录的要点，包括主要决策和行动项：{{input}}'
  },
  {
    icon: 'Edit',
    title: '润色文章',
    description: '请帮我润色以下文章，使其更加专业和易读：{{input}}'
  },
  {
    icon: 'DataAnalysis',
    title: '职业分析师',
    description: '根据以下工作经历和技能背景，为我提供职业发展建议：{{input}}'
  },
  {
    icon: 'Promotion',
    title: 'Excel 公式专家',
    description: '请解释以下 Excel 公式的含义，并提供优化建议：{{input}}'
  },
  {
    icon: 'Notebook',
    title: '旅行规划助手',
    description: '根据以下预算和时间安排，帮我规划最佳旅行路线：{{input}}'
  },
  {
    icon: 'Guide',
    title: 'Git 大师',
    description: '请帮我解决以下 Git 问题，并提供最佳实践建议：{{input}}'
  }
]

// 处理示例选择
const handleSelectExample = (index) => {
  selectedExample.value = index
  promptText.value = exampleItems[index].description
}

// 处理生成
const handleGenerate = async () => {
  if (!promptText.value.trim()) {
    ElMessage.warning('请输入提示词内容')
    return
  }

  generating.value = true
  try {
    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 1500))
    generatedContent.value = `基于您的描述，以下是优化后的提示词：\n\n${promptText.value}\n\n您可以根据需要调整和修改这个提示词。`
    
    emit('generate', generatedContent.value)
  } catch (error) {
    ElMessage.error('生成失败，请重试')
  } finally {
    generating.value = false
  }
}

// 处理取消
const handleCancel = () => {
  dialogVisible.value = false
}

// 处理复制
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(generatedContent.value)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}
</script>

<style scoped>
.prompt-generator-dialog {
  :deep(.el-dialog__body) {
    padding: 0 20px;
  }
}

.prompt-generator-content {
  padding: 20px 0;
}

.generator-desc {
  margin: 0 0 20px;
  color: #606266;
  font-size: 14px;
}

.model-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 24px;
}

.generator-layout {
  display: flex;
  gap: 24px;
  min-height: 500px;
}

.left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.right-section {
  flex: 1;
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.preview-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  gap: 16px;

  .placeholder-icon {
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
}

.preview-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }
}

.preview-text {
  flex: 1;
  background-color: #fff;
  border-radius: 4px;
  padding: 16px;
  white-space: pre-wrap;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;
}

.try-section {
  h4 {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 500;
  }
}

.example-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.example-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #409eff;
    background-color: #ecf5ff;
  }

  &.active {
    border-color: #409eff;
    background-color: #ecf5ff;
  }
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: #409eff;
  color: #fff;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #303133;
}

.item-desc {
  font-size: 12px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.prompt-input {
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}

</style> 