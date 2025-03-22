<template>
  <div class="chat-assistant-layout">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="nav-items">
        <div class="nav-item active">
          <el-icon><ChatLineRound /></el-icon>
          <span>聊天助手</span>
        </div>
        <div class="nav-item">
          <el-icon><Operation /></el-icon>
          <span>编排</span>
        </div>
        <div class="nav-item">
          <el-icon><Document /></el-icon>
          <span>访问日志</span>
        </div>
      </div>
    </div>

    <!-- 右侧主要内容区域 -->
    <div class="main-content">
      <!-- 顶部标题栏 -->
      <div class="top-bar">
        <div class="left-section">
          <h2 class="page-title">编排</h2>
        </div>
        <div class="right-section">
          <div class="model-selector" @click="showModelSelector = true">
            <div class="selected-model">
              <el-avatar :size="20" :src="getCurrentModelIcon()" class="model-icon" />
              <span>{{ selectedModel }}</span>
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </div>
          </div>
          <el-button type="primary" @click="handlePublish">发布</el-button>
        </div>
      </div>

      <!-- 主要工作区域 -->
      <div class="workspace">
        <!-- 左侧编辑区域 -->
        <div class="edit-area">
          <!-- 提示词编辑器 -->
          <div class="prompt-editor">
            <div class="editor-header">
              <span>提示词</span>
              <el-button type="primary" @click="handleGenerate">生成</el-button>
            </div>
            <el-input
              v-model="prompt"
              type="textarea"
              :rows="12"
              placeholder="在这里输入提示词..."
              resize="none"
            />
          </div>

          <!-- 工具栏 -->
          <div class="tools-section">
            <div class="tool-item">
              <div class="tool-header">
                <span>变量</span>
                <el-popover
                  v-model:visible="showVariableTypes"
                  placement="bottom-start"
                  :width="200"
                  trigger="click"
                  popper-class="variable-types-popover"
                >
                  <template #reference>
                    <el-button link type="primary">
                      <el-icon><Plus /></el-icon>添加
                    </el-button>
                  </template>
                  
                  <div class="variable-types-menu">
                    <div class="variable-type-item" @click="handleAddVariable('text')">
                      <el-icon><Tickets /></el-icon>
                      <span>文本</span>
                    </div>
                    <div class="variable-type-item" @click="handleAddVariable('paragraph')">
                      <el-icon><List /></el-icon>
                      <span>段落</span>
                    </div>
                    <div class="variable-type-item" @click="handleAddVariable('select')">
                      <el-icon><Select /></el-icon>
                      <span>下拉选项</span>
                    </div>
                    <div class="variable-type-item" @click="handleAddVariable('number')">
                      <el-icon><DataLine /></el-icon>
                      <span>数字</span>
                    </div>
                    <div class="variable-type-item" @click="handleAddVariable('api')">
                      <el-icon><Connection /></el-icon>
                      <span>基于 API 的变量</span>
                    </div>
                  </div>
                </el-popover>
              </div>
              <div class="tool-content">
                <p class="placeholder">变量能使用户输入表单引入提示词或开场白，你可以试试在提示词中输入自己的变量</p>
              </div>
            </div>

            <div class="tool-item">
              <div class="tool-header">
                <span>知识库</span>
                <el-button link type="primary">
                  <el-icon><Plus /></el-icon>添加
                </el-button>
              </div>
              <div class="tool-content">
                <p class="placeholder">可直接在提示词中输入（/input），您可以在这里输入人工指令</p>
              </div>
            </div>

            <div class="tool-item">
              <div class="tool-header">
                <span>元数据过滤</span>
                <el-button link type="primary">
                  <el-icon><Plus /></el-icon>添加
                </el-button>
              </div>
              <div class="tool-content">
                <p class="placeholder">点击添加元数据过滤</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧预览区域 -->
        <div class="preview-area">
          <div class="preview-header">
            <h3>调试与预览</h3>
          </div>
          <div class="chat-preview">
            <div class="messages-container">
              <!-- 消息列表 -->
              <div v-for="(message, index) in chatMessages" :key="index" class="message-item" :class="message.role">
                <div class="message-content">{{ message.content }}</div>
              </div>
            </div>
            <div class="input-container">
              <el-input
                v-model="testMessage"
                placeholder="和机器人聊天"
                @keyup.enter="handleSendTest"
              >
                <template #append>
                  <el-button @click="handleSendTest">
                    <el-icon><Position /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模型选择器弹窗 -->
    <el-drawer
      v-model="showModelSelector"
      title="模型"
      size="400px"
      :with-header="false"
    >
      <div class="model-drawer-content">
        <!-- 模型选择 -->
        <div class="model-section">
          <h3>模型</h3>
          <el-select
            v-model="selectedModel"
            class="model-select"
            placeholder="搜索或选择模型"
            filterable
            :filter-method="filterModels"
            :remote-method="filterModels"
            remote
          >
            <el-option
              v-for="model in filteredModels"
              :key="model.value"
              :label="model.label"
              :value="model.value"
            >
              <div class="model-option">
                <el-avatar :size="24" :src="model.icon" />
                <span>{{ model.label }}</span>
              </div>
            </el-option>
          </el-select>
        </div>

        <!-- 参数配置 -->
        <div class="params-section">
          <h3>参数</h3>
          <div class="param-list">
            <div class="param-item">
              <div class="param-row">
                <el-switch v-model="params.temperature.enabled" />
                <div class="param-label">
                  <span>温度</span>
                  <el-tooltip content="控制输出的随机性，较高的值会使输出更加随机和创造性，较低的值会使输出更加集中和确定性">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
                <div class="param-control">
                  <el-slider
                    v-model="params.temperature.value"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    :disabled="!params.temperature.enabled"
                  />
                  <el-input-number
                    v-model="params.temperature.value"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    :disabled="!params.temperature.enabled"
                    controls-position="right"
                    class="param-input"
                  />
                </div>
              </div>
            </div>

            <div class="param-item">
              <div class="param-row">
                <el-switch v-model="params.topP.enabled" />
                <div class="param-label">
                  <span>Top P</span>
                  <el-tooltip content="控制模型输出的多样性，较高的值会产生更多样的输出">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
                <div class="param-control">
                  <el-slider
                    v-model="params.topP.value"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    :disabled="!params.topP.enabled"
                  />
                  <el-input-number
                    v-model="params.topP.value"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    :disabled="!params.topP.enabled"
                    controls-position="right"
                    class="param-input"
                  />
                </div>
              </div>
            </div>

            <div class="param-item">
              <div class="param-row">
                <el-switch v-model="params.presencePenalty.enabled" />
                <div class="param-label">
                  <span>存在惩罚</span>
                  <el-tooltip content="控制模型重复同样内容的倾向">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
                <div class="param-control">
                  <el-slider
                    v-model="params.presencePenalty.value"
                    :min="0"
                    :max="2"
                    :step="0.1"
                    :disabled="!params.presencePenalty.enabled"
                  />
                  <el-input-number
                    v-model="params.presencePenalty.value"
                    :min="0"
                    :max="2"
                    :step="0.1"
                    :disabled="!params.presencePenalty.enabled"
                    controls-position="right"
                    class="param-input"
                  />
                </div>
              </div>
            </div>

            <div class="param-item">
              <div class="param-row">
                <el-switch v-model="params.frequencyPenalty.enabled" />
                <div class="param-label">
                  <span>频率惩罚</span>
                  <el-tooltip content="控制模型使用高频词的倾向">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
                <div class="param-control">
                  <el-slider
                    v-model="params.frequencyPenalty.value"
                    :min="0"
                    :max="2"
                    :step="0.1"
                    :disabled="!params.frequencyPenalty.enabled"
                  />
                  <el-input-number
                    v-model="params.frequencyPenalty.value"
                    :min="0"
                    :max="2"
                    :step="0.1"
                    :disabled="!params.frequencyPenalty.enabled"
                    controls-position="right"
                    class="param-input"
                  />
                </div>
              </div>
            </div>

            <div class="param-item">
              <div class="param-row">
                <el-switch v-model="params.maxTokens.enabled" />
                <div class="param-label">
                  <span>最大标记</span>
                  <el-tooltip content="控制模型输出的最大token数量">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
                <div class="param-control">
                  <el-slider
                    v-model="params.maxTokens.value"
                    :min="1"
                    :max="512"
                    :disabled="!params.maxTokens.enabled"
                  />
                  <el-input-number
                    v-model="params.maxTokens.value"
                    :min="1"
                    :max="512"
                    :disabled="!params.maxTokens.enabled"
                    controls-position="right"
                    class="param-input"
                  />
                </div>
              </div>
            </div>

            <div class="param-item">
              <div class="param-row">
                <el-switch v-model="params.responseFormat.enabled" />
                <div class="param-label">
                  <span>回复格式</span>
                  <el-tooltip content="设置模型回复的格式">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
                <div class="param-control">
                  <el-select
                    v-model="params.responseFormat.value"
                    placeholder="请选择"
                    :disabled="!params.responseFormat.enabled"
                    class="format-select"
                  >
                    <el-option label="默认" value="default" />
                    <el-option label="JSON" value="json" />
                    <el-option label="Markdown" value="markdown" />
                  </el-select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="drawer-footer">
          <el-button type="primary" @click="handleMultiModelTest">多个模型进行测试</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 提示词生成器弹窗 -->
    <PromptGenerator
      v-model:visible="showPromptGenerator"
      :model-name="selectedModel"
      :model-icon="getCurrentModelIcon()"
      @generate="handlePromptGenerated"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowRight,
  ArrowDown,
  Plus,
  Position,
  ChatLineRound,
  Operation,
  Document,
  QuestionFilled,
  Monitor,
  Connection,
  Files,
  Edit,
  DataAnalysis,
  Promotion,
  Notebook,
  Guide,
  Tickets,
  List,
  Select,
  DataLine
} from '@element-plus/icons-vue'
import PromptGenerator from '@/components/PromptGenerator.vue'
import { ElMessage } from 'element-plus'
import { sendChatMessage } from '@/api/chatAssistant'
import { updateAppConfig, updateAppStatus, getAppConfig } from '@/api/apps'

// 获取路由参数
const route = useRoute()
// 应用ID
const appId = ref(route.params.id)

// 加载应用配置
const loadAppConfig = async () => {
  try {
    const { data } = await getAppConfig(appId.value)
    prompt.value = data.prompt || ''
    selectedModel.value = data.model || 'gpt-3.5-turbo-0125'
    
    // 加载参数配置
    if (data.params) {
      Object.keys(data.params).forEach(key => {
        if (params[key]) {
          params[key] = { ...params[key], ...data.params[key] }
        }
      })
    }
  } catch (error) {
    console.error('加载应用配置失败:', error)
    ElMessage.error('加载应用配置失败，请重试')
  }
}

onMounted(() => {
  loadAppConfig()
})

// 状态变量
const prompt = ref('')
const testMessage = ref('')
const showModelSelector = ref(false)
const showPromptGenerator = ref(false)
const generatorPrompt = ref('')
const selectedExample = ref(null)

// 模型列表
const models = [
  {
    label: 'gpt-3.5-turbo-0125',
    value: 'gpt-3.5-turbo-0125',
    icon: 'path/to/gpt-icon.png'
  },
  {
    label: 'gpt-4',
    value: 'gpt-4',
    icon: 'path/to/gpt4-icon.png'
  },
  {
    label: 'claude-3-opus',
    value: 'claude-3-opus',
    icon: 'path/to/claude-icon.png'
  },
  {
    label: 'claude-3-sonnet',
    value: 'claude-3-sonnet',
    icon: 'path/to/claude-icon.png'
  }
]

const searchQuery = ref('')
const filteredModels = ref(models)

const filterModels = (query) => {
  searchQuery.value = query
  if (query) {
    filteredModels.value = models.filter(model => 
      model.label.toLowerCase().includes(query.toLowerCase())
    )
  } else {
    filteredModels.value = models
  }
}

const selectedModel = ref('gpt-3.5-turbo-0125')

// 参数配置
const params = reactive({
  temperature: {
    enabled: false,
    value: 0
  },
  topP: {
    enabled: false,
    value: 1
  },
  presencePenalty: {
    enabled: false,
    value: 0
  },
  frequencyPenalty: {
    enabled: false,
    value: 0
  },
  maxTokens: {
    enabled: false,
    value: 512
  },
  responseFormat: {
    enabled: false,
    value: 'default'
  }
})

// 示例项配置
const exampleItems = [
  {
    icon: 'Monitor',
    title: 'Python 代码助手',
    description: '我需要一个 Python 编程助手，帮助我编写、优化和调试代码，提供最佳实践建议。'
  },
  {
    icon: 'Connection',
    title: '翻译机器人',
    description: '作为一个翻译助手，帮助用户进行多语言之间的翻译，并解释语言和文化差异。'
  },
  {
    icon: 'Files',
    title: '总结会议记录',
    description: '分析会议记录，提取关键信息，生成简洁的会议总结，包括决策和行动项。'
  },
  {
    icon: 'Edit',
    title: '润色文章',
    description: '帮助改进文章的语言表达，提升文章质量，使其更加专业和易读。'
  },
  {
    icon: 'DataAnalysis',
    title: '职业分析师',
    description: '分析职业发展方向，提供行业洞察，帮助制定职业规划和提升建议。'
  },
  {
    icon: 'Promotion',
    title: 'Excel 公式专家',
    description: '帮助用户理解和使用 Excel 公式，解决数据处理问题，提供最佳实践。'
  },
  {
    icon: 'Notebook',
    title: '旅行规划助手',
    description: '制定旅行计划，推荐景点和行程，考虑预算和时间安排。'
  },
  {
    icon: 'Guide',
    title: 'Git 大师',
    description: '解答 Git 相关问题，提供版本控制建议，帮助处理代码管理问题。'
  }
]

// 变量类型选择相关
const showVariableTypes = ref(false)

// 添加聊天消息列表
const chatMessages = ref([])

// 方法
const handlePublish = async () => {
  try {
    // 更新应用配置
    await updateAppConfig(appId, {
      prompt: prompt.value,
      model: selectedModel.value,
      params: params
    })

    // 更新应用状态为已发布
    await updateAppStatus(appId, {
      status: 'PUBLISHED'
    })

    ElMessage.success('发布成功')
  } catch (error) {
    console.error('发布失败:', error)
    ElMessage.error('发布失败，请重试')
  }
}

const handleGenerate = () => {
  showPromptGenerator.value = true
}

const handleSendTest = async () => {
  if (!testMessage.value.trim()) return

  // 添加用户消息到列表
  chatMessages.value.push({
    role: 'user',
    content: testMessage.value
  })

  try {
    // 发送请求到后端
    const response = await sendChatMessage({
      message: testMessage.value,
      model: selectedModel.value
    })

    // 添加助手回复到列表
    chatMessages.value.push({
      role: 'assistant',
      content: response.data
    })
  } catch (error) {
    ElMessage.error('发送消息失败，请重试')
    console.error('发送消息失败:', error)
  }

  // 清空输入框
  testMessage.value = ''
}

const handleMultiModelTest = () => {
  // 实现多模型测试逻辑
  showModelSelector.value = false
}

// 获取当前选中模型的图标
const getCurrentModelIcon = () => {
  const currentModel = models.find(m => m.value === selectedModel.value)
  return currentModel?.icon || ''
}

// 处理示例选择
const handleSelectExample = (index) => {
  selectedExample.value = index
  generatorPrompt.value = exampleItems[index].description
}

// 处理提示词生成完成
const handlePromptGenerated = (generatedPrompt) => {
  prompt.value = generatedPrompt
}

// 处理添加变量
const handleAddVariable = (type) => {
  showVariableTypes.value = false
  // TODO: 根据不同类型添加对应的变量配置
  console.log('添加变量类型:', type)
}
</script>

<style scoped>
.chat-assistant-layout {
  display: flex;
  height: 100%;
  background-color: #f5f7fa;
}

.sidebar {
  width: 15%;
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  padding: 20px 0;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-item:hover {
  background-color: #f5f7fa;
}

.nav-item.active {
  background-color: #ecf5ff;
  color: #409eff;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-bar {
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.model-selector {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.model-selector:hover {
  opacity: 0.8;
}

.selected-model {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  min-width: 200px;
}

.model-icon {
  flex-shrink: 0;
}

.arrow-icon {
  margin-left: auto;
  color: #909399;
  transition: transform 0.3s;
}

.model-selector:hover .arrow-icon {
  color: #409eff;
}

.workspace {
  flex: 1;
  display: flex;
  gap: 10px;
  padding: 5px;
  overflow: hidden;
}

.edit-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
}

.prompt-editor {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.tools-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tool-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tool-content {
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}

.placeholder {
  color: #909399;
  font-size: 14px;
}

.preview-area {
  width: 40%;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.preview-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.chat-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  
  &.user {
    align-self: flex-end;
    
    .message-content {
      background-color: #409eff;
      color: #fff;
      border-radius: 8px 8px 0 8px;
    }
  }
  
  &.assistant {
    align-self: flex-start;
    
    .message-content {
      background-color: #f4f4f5;
      color: #303133;
      border-radius: 8px 8px 8px 0;
    }
  }
}

.message-content {
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.input-container {
  margin-top: 16px;
}

:deep(.el-input-group__append) {
  padding: 0;
}

:deep(.el-input-group__append button) {
  border: none;
  margin: 0;
  height: 100%;
}

.model-drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.model-section {
  margin-bottom: 24px;
}

.model-section h3,
.params-section h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}

.model-select {
  width: 100%;
}

.model-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.params-section {
  flex: 1;
  overflow-y: auto;
}

.param-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.param-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.param-row {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.param-label {
  min-width: 80px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #606266;
}

.param-control {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.param-input {
  width: 80px;
}

.format-select {
  width: 100%;
}

.drawer-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
  text-align: right;
}

:deep(.el-drawer__body) {
  padding: 0;
  overflow: hidden;
}

:deep(.el-slider) {
  flex: 1;
  margin-right: 12px;
}

:deep(.el-switch) {
  margin-right: 8px;
}

:deep(.el-input-number) {
  width: 80px;
}

:deep(.el-input-number .el-input__wrapper) {
  padding-right: 45px;
}

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

.try-section {
  margin-bottom: 24px;

  h4 {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 500;
  }
}

.example-items {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

.variable-types-menu {
  padding: 4px 0;
}

.variable-type-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s;
  color: #606266;
  
  &:hover {
    background-color: #f5f7fa;
    color: #409eff;
  }
  
  .el-icon {
    font-size: 16px;
  }
  
  span {
    font-size: 14px;
  }
}

.add-variable-btn {
  padding: 0;
  height: auto;
  
  &:hover {
    color: #409eff;
  }
}

:deep(.variable-types-popover) {
  padding: 0;
  
  .el-popover__title {
    margin: 0;
    padding: 8px 12px;
    font-size: 14px;
    border-bottom: 1px solid #e4e7ed;
  }
}
</style>