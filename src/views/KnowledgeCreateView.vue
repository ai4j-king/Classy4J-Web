<template>
  <div class="knowledge-create">
    <!-- 顶部导航 -->
    <div class="nav-header">
      <div class="back-title">
        <el-button link @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <span class="title">知识库</span>
      </div>
      <!-- 步骤指示器移到这里 -->
      <div class="steps">
        <div class="step active">
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
        <div class="step">
          <span class="step-number">STEP 3</span>
          <span class="step-text">知识库管理</span>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <h2 class="section-title">选择数据源</h2>
      
      <!-- 数据源选项 -->
      <div class="source-options">
        <div class="option-group">
          <el-button 
            class="source-option" 
            :class="{ active: selectedSource === 'text' }"
            @click="selectSource('text')"
          >
            <el-icon><Document /></el-icon>
            <span>导入已有文本</span>
          </el-button>
          <el-button 
            class="source-option"
            :class="{ active: selectedSource === 'notion' }"
            @click="selectSource('notion')"
          >
            <el-icon><Connection /></el-icon>
            <span>同步自 Notion 内容</span>
          </el-button>
          <el-button 
            class="source-option"
            :class="{ active: selectedSource === 'web' }"
            @click="selectSource('web')"
          >
            <el-icon><Link /></el-icon>
            <span>同步自 Web 站点</span>
          </el-button>
        </div>
      </div>

      <!-- 上传区域 -->
      <div class="upload-section" v-if="selectedSource === 'text'">
        <div class="upload-area">
          <el-upload
            class="upload-drop"
            drag
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :show-file-list="false"
          >
            <div class="upload-content">
              <el-icon class="upload-icon"><Upload /></el-icon>
              <div class="upload-hint">
                <p>拖拽文件到此处，或者<em>选择文件</em></p>
                <p class="file-types">
                  支持的文件格式：TXT、MARKDOWN、MDX、PDF、HTML、XLSX、XLS、DOC、DOCX、CSV、EML、MSG、PPTX、XML、EPUB、PPT、MD、HTM 等文件格式，单个文件大小不超过 15MB。
                </p>
              </div>
            </div>
          </el-upload>
        </div>

        <div class="action-buttons">
          <!-- 创建空知识库 -->
          <div class="create-knowledge-base">
            <el-button link class="create-empty-base" @click="createNewBase = !createNewBase">
              <el-icon :class="{ active: createNewBase }"><Folder /></el-icon>
              创建一个空知识库
            </el-button>
          </div>

          <!-- 下一步按钮 -->
          <div class="next-step-button">
            <el-button 
              type="primary" 
              :disabled="!hasSelectedFile"
              @click="handleNextStep"
            >
              下一步
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <!-- Notion 同步区域 -->
      <div class="notion-section" v-if="selectedSource === 'notion'">
        <div class="notion-connect">
          <el-button type="primary">连接 Notion</el-button>
          <p class="connect-hint">授权后，可以选择要同步的 Notion 页面或数据库</p>
        </div>
      </div>

      <!-- Web 站点同步区域 -->
      <div class="web-section" v-if="selectedSource === 'web'">
        <div class="web-input">
          <el-input
            v-model="webUrl"
            placeholder="请输入网站 URL"
            clearable
          >
            <template #append>
              <el-button type="primary">开始抓取</el-button>
            </template>
          </el-input>
          <p class="web-hint">支持抓取公开可访问的网页内容</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  ArrowRight,
  Document,
  Connection,
  Link,
  Upload,
  Folder
} from '@element-plus/icons-vue'

const router = useRouter()
const selectedSource = ref('text')
const createNewBase = ref(false)
const webUrl = ref('')
const hasSelectedFile = ref(false)

// 返回上一页
const handleBack = () => {
  router.back()
}

// 选择数据源
const selectSource = (source) => {
  selectedSource.value = source
  hasSelectedFile.value = false
}

// 处理文件变化
const handleFileChange = (file) => {
  console.log('Selected file:', file)
  hasSelectedFile.value = true
}

// 处理下一步
const handleNextStep = () => {
  // TODO: 实现下一步逻辑
  console.log('Next step')
}
</script>

<style scoped>
.knowledge-create {
  padding: 0 24px;
  height: 100vh;
  background-color: var(--el-bg-color);
}

.nav-header {
  padding: 16px 0;
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
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 24px;
  color: var(--el-text-color-primary);
}

.source-options {
  margin-bottom: 24px;
}

.option-group {
  display: flex;
  gap: 16px;
}

.source-option {
  flex: 1;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background-color: white;
  transition: all 0.3s;

  &:hover {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
  }

  &.active {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }

  .el-icon {
    font-size: 24px;
  }
}

.upload-section {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
}

.upload-drop {
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    border-color: var(--el-color-primary);
  }
}

.upload-content {
  padding: 40px 0;
  text-align: center;
}

.upload-icon {
  font-size: 48px;
  color: var(--el-text-color-secondary);
  margin-bottom: 16px;
}

.upload-hint {
  color: var(--el-text-color-regular);

  em {
    color: var(--el-color-primary);
    font-style: normal;
    cursor: pointer;
  }
}

.file-types {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.next-step-button {
  .el-button {
    min-width: 120px;
  }
}

.create-knowledge-base {
  text-align: center;
}

.create-empty-base {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--el-text-color-regular);

  .el-icon {
    font-size: 16px;
    transition: color 0.3s;
    margin-left: 4px;

    &.active {
      color: var(--el-color-primary);
    }
  }

  &:hover {
    color: var(--el-color-primary);
  }
}

.notion-section,
.web-section {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
}

.notion-connect,
.web-input {
  max-width: 400px;
  margin: 0 auto;
}

.connect-hint,
.web-hint {
  margin-top: 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: auto;
  background-color: transparent;
}

:deep(.el-button) {
  .el-icon {
    font-size: 16px;
  }
}
</style> 