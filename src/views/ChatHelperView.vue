<template>
  <div class="home">
    <div class="section">
      <h2 class="section-title">创建应用</h2>
      <div class="card-list">
        <el-card class="action-card" shadow="hover">
          <div class="card-content">
            <el-icon class="icon"><Plus /></el-icon>
            <span>创建空白应用</span>
          </div>
        </el-card>
        <el-card class="action-card" shadow="hover">
          <div class="card-content">
            <el-icon class="icon"><Upload /></el-icon>
            <span>从历史模板创建</span>
          </div>
        </el-card>
        <el-card class="action-card" shadow="hover">
          <div class="card-content">
            <el-icon class="icon"><Document /></el-icon>
            <span>导入DSL文件</span>
          </div>
        </el-card>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">最近使用</h2>
      <div class="card-list">
        <el-card class="app-card" shadow="hover">
          <div class="app-info">
            <el-avatar :size="40" src="https://avatars.githubusercontent.com/u/1?v=4" />
            <div class="app-details">
              <h3>知识库 + 智能机器人</h3>
              <p>CHATFLOW</p>
            </div>
          </div>
        </el-card>
        <el-card class="app-card" shadow="hover" @click="router.push('/chat')">
          <div class="app-info">
            <el-avatar :size="40" src="https://avatars.githubusercontent.com/u/2?v=4" />
            <div class="app-details">
              <h3>智能聊天助手</h3>
              <p>智能聊天助手</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, Upload, Document } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.home {
  padding: 20px;
}

.section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
  color: #333;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.action-card {
  cursor: pointer;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 10px;
}

.icon {
  font-size: 24px;
  color: #409EFF;
}

.app-card {
  cursor: pointer;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
}

.app-details h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.app-details p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #666;
}
</style> 