<template>
  <div class="chat-container">
    <div class="chat-header">
      <el-page-header @back="goBack" :icon="ArrowLeft">
        <template #content>
          <div class="header-content">
            <el-avatar :size="32" src="https://avatars.githubusercontent.com/u/2?v=4" />
            <span class="title">智能聊天助手</span>
          </div>
        </template>
      </el-page-header>
    </div>

    <div class="chat-content">
      <template v-if="chatMessages.length > 0">
        <div class="message-list">
          <div v-for="(msg, index) in chatMessages" :key="index" 
               :class="['message', msg.type === 'user' ? 'message-user' : 'message-assistant']">
            <div class="message-content">{{ msg.content }}</div>
          </div>
        </div>
      </template>
      <el-empty v-else description="开始新的对话" />
    </div>

    <div class="chat-input">
      <el-input
        v-model="inputMessage"
        type="textarea"
        :rows="3"
        placeholder="输入消息..."
        resize="none"
        @keyup.enter.exact="handleSend"
      />
      <el-button 
        type="primary" 
        :icon="Message" 
        class="send-button"
        :loading="loading"
        @click="handleSend"
      >发送</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { sendChatMessage } from '../api/chat'

const router = useRouter()
const inputMessage = ref('')
const chatMessages = ref([])
const loading = ref(false)

const goBack = () => {
  router.back()
}

const handleSend = async () => {
  if (!inputMessage.value.trim()) {
    ElMessage.warning('请输入消息内容')
    return
  }

  const userMessage = inputMessage.value.trim()
  // 添加用户消息到列表
  chatMessages.value.push({
    type: 'user',
    content: userMessage
  })

  // 清空输入框
  inputMessage.value = ''

  try {
    loading.value = true
    // 调用API发送消息
    const response = await sendChatMessage(userMessage)
    // 添加助手回复到列表
    chatMessages.value.push({
      type: 'assistant',
      content: response.data
    })
  } catch (error) {
    ElMessage.error('发送消息失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
}

.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  font-size: 16px;
  font-weight: 500;
}

.chat-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  margin-bottom: 12px;
}

.message-content {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 8px;
  word-break: break-word;
}

.message-user {
  justify-content: flex-end;
}

.message-user .message-content {
  background-color: #409EFF;
  color: white;
}

.message-assistant .message-content {
  background-color: #f4f4f5;
  color: #333;
}

.chat-input {
  padding: 16px 24px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
}

.chat-input :deep(.el-textarea__inner) {
  resize: none;
}

.send-button {
  align-self: flex-end;
}
</style> 