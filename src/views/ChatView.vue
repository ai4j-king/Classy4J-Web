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
      <el-empty description="开始新的对话" />
    </div>

    <div class="chat-input">
      <el-input
        v-model="inputMessage"
        type="textarea"
        :rows="3"
        placeholder="输入消息..."
        resize="none"
      />
      <el-button type="primary" :icon="Message" class="send-button">发送</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Message } from '@element-plus/icons-vue'

const router = useRouter()
const inputMessage = ref('')

const goBack = () => {
  router.back()
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
  display: flex;
  align-items: center;
  justify-content: center;
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