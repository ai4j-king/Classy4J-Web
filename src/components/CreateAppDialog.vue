<template>
  <el-dialog
    v-model="dialogVisible"
    title="创建空白应用"
    width="60%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="create-app-container">
      <!-- 应用类型选择 -->
      <div class="section">
        <h3 class="section-title">选择应用类型</h3>
        <div class="app-types">
          <div class="type-group">
            <h4>新手适用</h4>
            <div class="type-cards">
              <div
                class="type-card"
                :class="{ active: selectedType === 'chat' }"
                @click="selectedType = 'chat'"
              >
                <el-icon class="card-icon"><ChatRound /></el-icon>
                <div class="card-content">
                  <h5>聊天助手</h5>
                  <p>简单配置即可构建基于 LLM 的对话机器人</p>
                </div>
              </div>
              <div
                class="type-card"
                :class="{ active: selectedType === 'agent' }"
                @click="selectedType = 'agent'"
              >
                <el-icon class="card-icon"><Connection /></el-icon>
                <div class="card-content">
                  <h5>Agent</h5>
                  <p>具备推理与自主工具调用的智能助手</p>
                </div>
              </div>
              <div
                class="type-card"
                :class="{ active: selectedType === 'doc' }"
                @click="selectedType = 'doc'"
              >
                <el-icon class="card-icon"><Document /></el-icon>
                <div class="card-content">
                  <h5>文本生成应用</h5>
                  <p>用于文本生成任务的 AI 助手</p>
                </div>
              </div>
            </div>
          </div>

          <div class="type-group">
            <h4>进阶用户适用</h4>
            <div class="type-cards">
              <div
                class="type-card beta"
                :class="{ active: selectedType === 'chatflow' }"
                @click="selectedType = 'chatflow'"
              >
                <el-icon class="card-icon"><ChatDotRound /></el-icon>
                <div class="card-content">
                  <h5>Chatflow <el-tag size="small">BETA</el-tag></h5>
                  <p>支持记忆的复杂多轮对话工作流</p>
                </div>
              </div>
              <div
                class="type-card beta"
                :class="{ active: selectedType === 'workflow' }"
                @click="selectedType = 'workflow'"
              >
                <el-icon class="card-icon"><SetUp /></el-icon>
                <div class="card-content">
                  <h5>工作流 <el-tag size="small">BETA</el-tag></h5>
                  <p>面向具有自动化任务的编排工作流</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 应用信息 -->
      <div class="section">
        <h3 class="section-title">应用名称 & 图标</h3>
        <el-input v-model="appName" placeholder="给你的应用起个名字" />
      </div>

      <div class="section">
        <h3 class="section-title">描述 (可选)</h3>
        <el-input
          v-model="appDescription"
          type="textarea"
          :rows="3"
          placeholder="输入应用的描述"
          resize="none"
        />
      </div>

      <!-- 底部提示和帮助 -->
      <div class="help-section">
        <el-link type="primary" :underline="false">
          <el-icon><QuestionFilled /></el-icon>
          没有想法？试试我们的模板
        </el-link>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleCreate" :disabled="!canCreate">
          创建应用
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  ChatRound,
  ChatDotRound,
  Connection,
  Document,
  SetUp,
  QuestionFilled
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createChatHelper } from '@/api/chatAssistant'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const templateDialogVisible = ref(false)

const emit = defineEmits(['update:visible'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const selectedType = ref('')
const appName = ref('')
const appDescription = ref('')

const canCreate = computed(() => {
  return selectedType.value && appName.value.trim()
})

const router = useRouter()

const handleClose = () => {
  dialogVisible.value = false
  // 重置表单
  selectedType.value = ''
  appName.value = ''
  appDescription.value = ''
}

const handleCreate = async () => {
  try {
    if (!appName.value.trim()) {
      ElMessage.warning('请输入应用名称')
      return
    }
    if (!selectedType.value) {
      ElMessage.warning('请选择应用类型')
      return
    }

    await createChatHelper()
    ElMessage.success('已创建应用')
    emit('update:visible', false)

    routeBySelectedType()
  } catch (error) {
    ElMessage.error('创建应用失败：' + (error.response?.data?.message || error.message))
  }
}

const routeBySelectedType = () => {
  switch (selectedType.value) {
    case 'chat':
      router.push('/chat-assistant/create')
      break
    case 'agent':
      router.push('/agent-assistant/create')
      break
    case 'workflow':
      router.push('/workflow/create')
      break
    default:
      ElMessage.error('未知的应用类型')
      return
  }
}

</script>

<style scoped>
.create-app-container {
  padding: 0 20px;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #333;
}

.app-types {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.type-group h4 {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.type-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.type-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.type-card:hover {
  border-color: #409eff;
}

.type-card.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.type-card.beta {
  opacity: 0.8;
}

.card-icon {
  font-size: 24px;
  color: #409eff;
}

.card-content h5 {
  margin: 0 0 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-content p {
  margin: 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.help-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 32px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 