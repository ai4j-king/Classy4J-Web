<template>
  <div class="knowledge-create">
    <!-- 顶部导航 -->
    <div class="nav-header">
      <div class="back-title">
        <el-button :link="true" @click="handleBack">
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
      <!-- 左侧内容区域 -->
      <div class="left-section">
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
            <!-- 未选择文件时显示上传区域 -->
            <el-upload
              v-if="!selectedFile"
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

            <!-- 选择文件后显示文件信息 -->
            <div v-else class="file-list">
              <div class="file-item">
                <div class="file-icon">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="file-info">
                  <div class="file-name">{{ selectedFile.name }}</div>
                  <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
                </div>
                <div class="file-actions">
                  <el-button
                    class="delete-btn"
                    :link="true"
                    @click="handleRemoveFile"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <!-- 创建空知识库 -->
            <div class="create-knowledge-base">
              <el-button :link="true" class="create-empty-base" @click="handleCreateEmpty">
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

      <!-- 右侧文件预览区 -->
      <div class="right-section">
        <!-- 文件名展示区 -->
        <div class="file-header">
          <h3 class="preview-title">文件预览</h3>
          <template v-if="selectedFile">
            <p class="selected-file-name">{{ selectedFile.name }}</p>
          </template>
        </div>
        
        <!-- 文件内容展示区 -->
        <TextRelatedDocPreview :file="selectedFile?.raw || null" />
      </div>
    </div>

    <!-- 添加创建空知识库的模态框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="创建空知识库"
      width="480px"
      :close-on-click-modal="false"
      :show-close="true"
      custom-class="create-knowledge-dialog"
    >
      <div class="dialog-content">
        <p class="dialog-tip">空知识库中还没有文档，你可以在今后任何时候上传文档至该知识库。</p>
        <div class="knowledge-name-input">
          <div class="input-label">知识库名称</div>
          <el-input
            v-model="knowledgeName"
            placeholder="请输入知识库名称"
            :maxlength="50"
            show-word-limit
          />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button type="primary" @click="handleCreate" :loading="creating">创建</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  ArrowRight,
  Document,
  Connection,
  Link,
  Upload,
  Folder,
  Delete
} from '@element-plus/icons-vue'
import { createEmptyKnowledge } from '@/api/knowledge'
import TextRelatedDocPreview from '@/components/TextRelatedDocPreview.vue'

const router = useRouter()
const selectedSource = ref('text')
const createNewBase = ref(false)
const webUrl = ref('')
const hasSelectedFile = ref(false)
const showCreateDialog = ref(false)
const knowledgeName = ref('')
const creating = ref(false)
const selectedFile = ref(null)

// 返回上一页
const handleBack = () => {
  router.back()
}

// 选择数据源
const selectSource = (source) => {
  selectedSource.value = source
  hasSelectedFile.value = false
}

// 文件大小格式化
const formatFileSize = (size) => {
  const sizeInMB = size / (1024 * 1024)
  return `${sizeInMB.toFixed(2)}MB`
}

// 处理文件变化
const handleFileChange = (file) => {
  console.log('Selected file:', file)
  hasSelectedFile.value = true
  selectedFile.value = file
}

// 处理删除文件
const handleRemoveFile = () => {
  selectedFile.value = null
  hasSelectedFile.value = false
}

// 处理下一步
const handleNextStep = () => {
  // if (!knowledgeName.value) {
  //   ElMessage.warning('请输入知识库名称')
  //   return
  // }
  // if (!webUrl.value) {
  //   ElMessage.warning('请输入网站 URL')
  //   return
  // }
  router.push('/knowledge/create/step-two')
}

// 点击创建空知识库按钮
const handleCreateEmpty = () => {
  showCreateDialog.value = true
  createNewBase.value = true
}

// 处理创建知识库
const handleCreate = async () => {
  if (!knowledgeName.value.trim()) {
    ElMessage.warning('请输入知识库名称')
    return
  }

  try {
    creating.value = true
    await createEmptyKnowledge(knowledgeName.value.trim())
    ElMessage.success('创建成功')
    showCreateDialog.value = false
    // TODO: 根据需求决定是否跳转到其他页面
  } catch (error) {
    ElMessage.error(error.message || '创建失败')
  } finally {
    creating.value = false
  }
}
</script>

<style scoped>
.knowledge-create {
  padding: 0 24px;
  height: 100%;
  background-color: var(--el-bg-color);
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
  height: 93%;
}

.left-section {
  flex: 1;
  max-width: 50%;
  overflow: auto;
}

.right-section {
  flex: 1;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
}

/* 缩小左侧内容 */
.section-title {
  font-size: 14px;
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
  height: 60px;
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
    font-size: 20px;
  }
}

.upload-section {
  background-color: white;
  border-radius: 8px;
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
  padding: 20px 0;
  text-align: center;
}

.upload-icon {
  font-size: 32px;
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
  font-size: 10px;
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
    min-width: 100px;
    font-size: 12px;
  }
}

.create-knowledge-base {
  text-align: center;
}

.create-empty-base {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--el-text-color-regular);

  .el-icon {
    font-size: 14px;
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

.create-knowledge-dialog {
  :deep(.el-dialog__header) {
    margin: 0;
    padding: 20px 24px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    
    .el-dialog__title {
      font-size: 16px;
      font-weight: 500;
    }
  }

  :deep(.el-dialog__body) {
    padding: 24px;
  }

  :deep(.el-dialog__footer) {
    padding: 16px 24px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}

.dialog-content {
  .dialog-tip {
    margin: 0 0 24px;
    font-size: 14px;
    color: var(--el-text-color-regular);
  }
}

.knowledge-name-input {
  .input-label {
    font-size: 14px;
    color: var(--el-text-color-primary);
    margin-bottom: 8px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 右侧文件浏览区样式 */
.file-header {
  padding: 5px 10px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background-color: var(--el-color-primary-light-9);
}

.preview-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 12px;
  color: var(--el-text-color-primary);
}

.selected-file-name {
  font-size: 14px;
  margin: 0;
  color: var(--el-text-color-regular);
}

.file-list {
  border: 2px solid var(--el-border-color);
  border-radius: 8px;
  padding: 16px;
  background-color: white;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-color-danger-light-9);
  border-radius: 4px;
  color: var(--el-color-danger);

  .el-icon {
    font-size: 24px;
  }
}

.file-info {
  flex: 1;
  min-width: 0;

  .file-name {
    font-size: 14px;
    color: var(--el-text-color-primary);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .file-size {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.file-actions {
  .delete-btn {
    color: var(--el-text-color-secondary);
    
    &:hover {
      color: var(--el-color-danger);
    }

    .el-icon {
      font-size: 16px;
    }
  }
}
</style> 