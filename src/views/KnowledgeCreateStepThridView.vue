<template>
  <div class="knowledge-create">
    <!-- 顶部导航 -->
    <div class="nav-header">
      <div class="back-title">
        <el-button :link="true" @click="router.push('/knowledge')">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <span class="title">知识库</span>
      </div>
      <!-- 步骤指示器 -->
      <div class="steps">
        <div class="step">
          <span class="step-number">STEP 1</span>
          <span class="step-text">选择数据源</span>
        </div>
        <div class="step-arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="step">
          <span class="step-number">STEP 2</span>
          <span class="step-text">文本分段与清洗</span>
        </div>
        <div class="step-arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="step active">
          <span class="step-number">STEP 3</span>
          <span class="step-text">知识库管理</span>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧内容区域 -->
      <div class="left-section">
        <div class="upload-info">
          <div class="info-header">
            <el-icon><Document /></el-icon>
            <span>文档已上传</span>
          </div>
          <div class="file-info">
            <div class="file-name">{{ processStatus.fileName }}</div>
            <div class="file-status">
              <el-tag 
                :type="processStatus.status === 'completed' ? 'success' : processStatus.status === 'failed' ? 'danger' : 'warning'"
                size="small"
              >
                {{ processStatus.status === 'completed' ? '已完成' : processStatus.status === 'failed' ? '失败' : '处理中' }}
              </el-tag>
            </div>
          </div>
          <div class="process-info">
            <div class="info-item">
              <span class="label">分段模式</span>
              <span class="value">{{ processStatus.segmentMode }}</span>
            </div>
            <div class="info-item">
              <span class="label">文本预处理规则</span>
              <span class="value">{{ processStatus.preprocessRules }}</span>
            </div>
            <div class="info-item">
              <span class="label">索引方式</span>
              <span class="value">{{ processStatus.indexMode }}</span>
            </div>
            <div class="info-item">
              <span class="label">检索设置</span>
              <span class="value">{{ processStatus.searchSettings }}</span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <el-button @click="handleAccessApi">Access the API</el-button>
          <el-button type="primary" @click="handleNewTask">
            前往文档
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- 右侧提示区域 -->
      <div class="right-section">
        <div class="tip-header">
          <el-icon><InfoFilled /></el-icon>
          <span>接下来该做什么</span>
        </div>
        <div class="tip-content">
          当文档完成索引后，您可以使用API直接调用或者在上方新建任务继续添加文档。您也可以在建议检索库中使用ChatGPT来访问这些文档。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  ArrowRight,
  Document,
  InfoFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 文档处理状态
const processStatus = ref({
  fileName: '3-大模型基石-transformer (1).pdf',
  status: 'completed', // 'processing' | 'completed' | 'failed'
  segmentMode: '500',
  preprocessRules: '替换掉连续的空格、换行符和制表符',
  indexMode: '经济',
  searchSettings: '倒排索引'
})

// API调用示例
const apiExample = `
// 使用Python发起API请求
import requests

url = "https://api.example.com/v1/knowledge/query"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "query": "你的问题",
    "knowledge_base_id": "kb_123456",
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result["answer"])
`.trim()

// 处理新任务按钮点击
const handleNewTask = () => {
  router.push('/knowledge/docs')
}

// 处理访问API按钮点击
const handleAccessApi = async () => {
  try {
    await navigator.clipboard.writeText(apiExample)
    ElMessage.success('API调用示例已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败，请手动复制代码')
    console.error('Failed to copy:', err)
  }
}

// 监听状态变化
watch(() => processStatus.value.status, (newStatus) => {
  if (newStatus === 'completed') {
    ElMessage.success('文档处理完成')
  } else if (newStatus === 'failed') {
    ElMessage.error('文档处理失败')
  }
})
</script>

<style scoped>
.knowledge-create {
  padding: 0 24px;
  height: 100%;
  background-color: var(--el-bg-color);
  position: relative;
}

.nav-header {
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--el-border-color);
}

.back-title {
  display: flex;
  align-items: center;
  gap: 8px;

  .title {
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}

.steps {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.step {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-secondary);

  &.active {
    color: var(--el-color-primary);

    .step-number {
      background-color: var(--el-color-primary);
      color: white;
    }
  }
}

.step-arrow {
  color: var(--el-text-color-secondary);
  display: flex;
  align-items: center;
  
  .el-icon {
    font-size: 20px;
  }
}

.step-number {
  padding: 2px 8px;
  border-radius: 12px;
  background-color: var(--el-fill-color-light);
  font-size: 12px;
}

.step-text {
  font-size: 14px;
}

.main-content {
  padding: 24px 0;
  margin: 0 auto;
  display: flex;
  gap: 24px;
  height: calc(100% - 120px);
}

.left-section {
  flex: 1;
  max-width: 50%;
}

.right-section {
  flex: 1;
  max-width: 50%;
  background-color: var(--el-color-info-light-9);
  border-radius: 8px;
  padding: 16px;
}

.upload-info {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--el-border-color-lighter);
}

.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;

  .el-icon {
    color: var(--el-color-success);
  }
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.file-name {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.process-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;

  .label {
    color: var(--el-text-color-secondary);
  }

  .value {
    color: var(--el-text-color-primary);
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 500;

  .el-icon {
    color: var(--el-color-info);
  }
}

.tip-content {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.file-status {
  .el-tag {
    min-width: 60px;
    text-align: center;
  }
}
</style> 