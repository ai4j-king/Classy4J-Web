<template>
  <div class="knowledge-view">
    <!-- 顶部导航 -->
    <div class="nav-header">
      <div class="nav-left">
        <el-button-group>
          <el-button type="primary" plain>知识库</el-button>
          <el-button>API</el-button>
        </el-button-group>
      </div>
      <div class="nav-right">
        <el-button-group>
          <el-button>
            <el-checkbox v-model="showAllKnowledge" />
            所有知识库
            <el-tooltip
              content="选择以显示工作区内所有知识库。只有工作区所有者才能管理所有知识库。"
              placement="top"
              effect="light"
              :show-after="100"
            >
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-button>
          <div class="tag-select-wrapper">
            <MultiSelectDropdown
              v-model="selectedTags"
              :options="availableTags"
              placeholder="全部标签"
            >
              <template #prefix>
                <el-icon><Setting /></el-icon>
              </template>
            </MultiSelectDropdown>
          </div>
        </el-button-group>
        <el-input
          v-model="searchQuery"
          placeholder="搜索"
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary">
          <el-icon><Plus /></el-icon>
          外部知识库 API
        </el-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <el-row :gutter="24">
        <!-- 创建知识库卡片 -->
        <el-col :span="8">
          <div class="create-card">
            <el-button type="primary" plain class="create-btn" @click="handleCreate">
              <el-icon><Plus /></el-icon>
              创建知识库
            </el-button>
            <div class="hint-text">
              导入您自己的文本或数据源，或通过 Webhook 变更写入数据库。LLM 的上下文。
            </div>
            <el-link type="primary" class="link-text">
              连接外部知识库
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-link>
          </div>
        </el-col>

        <!-- 知识库列表 -->
        <el-col :span="8" v-for="item in knowledgeList" :key="item.id">
          <el-card class="knowledge-card" shadow="hover">
            <div class="card-header">
              <h3 class="card-title">{{ item.name }}</h3>
              <el-button-group>
                <el-button link>
                  <el-icon><Document /></el-icon>
                </el-button>
                <el-button link>
                  <el-icon><InfoFilled /></el-icon>
                </el-button>
              </el-button-group>
            </div>
            <div class="card-content">
              <div class="card-stats">
                <span class="stat-item">{{ item.documentCount }} 个文档</span>
                <span class="stat-divider">|</span>
                <span class="stat-item">{{ item.wordCount }}</span>
              </div>
              <p class="card-description">{{ item.description }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  Plus,
  Search,
  Setting,
  QuestionFilled,
  ArrowRight,
  Document,
  InfoFilled
} from '@element-plus/icons-vue'
import MultiSelectDropdown from '@/components/MultiSelectDropdown.vue'
import { useRouter } from 'vue-router'
import { fetchKnowledgeList as fetchKnowledgeListAPI } from '@/api/knowledge'

const router = useRouter()

const searchQuery = ref('')
const showAllKnowledge = ref(false)
const selectedTags = ref([])
const knowledgeList = ref([])
const availableTags = ref([
  '插件',
  '代码',
  '数据库',
  'API',
  '图片',
  '视频',
  '天气',
  '金融',
  '设计',
  '旅行'
])

const handleCreate = () => {
  router.push('/knowledge/create')
}

// 获取知识库列表数据
const fetchKnowledgeList = async () => {
  try {
    const data = await fetchKnowledgeListAPI()
    knowledgeList.value = data.datasets
    console.log('获取知识库列表成功:', data)
  } catch (error) {
    console.error('获取知识库列表失败:', error)
    ElMessage.error('获取知识库列表失败')
  }
}

onMounted(() => {
  fetchKnowledgeList()
})
</script>

<style scoped>
.knowledge-view {
  padding: 16px 24px;
  height: 100%;
  background-color: var(--el-bg-color);
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;

  :deep(.el-button-group) {
    .el-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;

      .el-checkbox {
        margin-right: 4px;
      }

      .el-icon {
        margin-left: 4px;
      }
    }
  }
}

.search-input {
  width: 240px;
}

.tag-select-wrapper {
  display: inline-flex;
  align-items: center;
  min-width: 150px;

  :deep(.el-input__wrapper) {
    border-radius: 0;
    box-shadow: none;
    
  }
}

:deep(.el-checkbox) {
  margin-right: 0;
  
  .el-checkbox__inner {
    width: 14px;
    height: 14px;
    margin-right: 5px;
  }
}

.main-content {
  padding: 0;
}

.el-row {
  margin-bottom: -16px;
  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  margin-bottom: 16px;
}

.create-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 100%;
  margin-bottom: 0;
}

.knowledge-card {
  height: 100%;
  margin-bottom: 0;
  background-color: var(--el-color-primary-light-9);
  transition: all 0.3s ease;
}

.create-btn {
  height: 40px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.hint-text {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.link-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

:deep(.el-button) {
  .el-icon {
    font-size: 14px;
    margin-left: 5px;
  }
}

:deep(.el-tooltip__trigger) {
  display: inline-flex;
  align-items: center;
}

:deep(.el-tooltip__popper.is-light) {
  max-width: 300px;
  line-height: 1.5;
  padding: 8px 12px;
  font-size: 12px;
  color: #606266;
  border-color: #e4e7ed;
}

.knowledge-list {
  margin-top: 0;
}

.knowledge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.stat-divider {
  color: #dcdfe6;
}

.card-description {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.5;
}
</style>