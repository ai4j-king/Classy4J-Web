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
        <div class="step active">
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
        <h2 class="section-title">1、分段设置</h2>
        
        <!-- 分段模式选择 -->
        <div class="segment-mode-selector">
          <div class="mode-item" 
               :class="{ active: segmentMode === 'general' }"
               @click="segmentMode = 'general'">
            <div class="mode-header">
              <el-icon><Setting /></el-icon>
              <span>通用</span>
            </div>
            <div class="mode-desc">通用文本分段模式，检索和召回的块是相同的</div>
          </div>
          <div class="mode-item"
               :class="{ active: segmentMode === 'parentChild' }"
               @click="segmentMode = 'parentChild'">
            <div class="mode-header">
              <el-icon><Connection /></el-icon>
              <span>父子分段</span>
            </div>
            <div class="mode-desc">使用父子模式时，子块用于检索，父块用于上下文</div>
          </div>
        </div>

        <!-- 通用设置内容 -->
        <div v-if="segmentMode === 'general'" class="setting-section">
          <div class="setting-inputs-row">
            <!-- 分段标识符 -->
            <div class="setting-item">
              <div class="setting-label">
                分段标识符
                <el-tooltip content="用于分段的标识符" placement="top">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              <el-input v-model="segmentIdentifier" placeholder="\n\n" />
            </div>

            <!-- 分段最大长度 -->
            <div class="setting-item">
              <div class="setting-label">
                分段最大长度
                <el-tooltip content="每个分段的最大长度" placement="top">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              <div class="setting-input-with-unit">
                <el-input-number v-model="maxLength" :min="1" :max="1000" />
                <span class="unit">tokens</span>
              </div>
            </div>

            <!-- 分段重叠长度 -->
            <div class="setting-item">
              <div class="setting-label">
                分段重叠长度
                <el-tooltip content="相邻分段之间的重叠长度" placement="top">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              <div class="setting-input-with-unit">
                <el-input-number v-model="overlapLength" :min="0" :max="100" />
                <span class="unit">tokens</span>
              </div>
            </div>
          </div>

          <!-- 文本预处理规则 -->
          <div class="preprocessing-rules">
            <div class="rules-title">文本预处理规则</div>
            <div class="rule-list">
              <el-checkbox v-model="rules.replaceSpaces">替换掉连续的空格、换行符和制表符</el-checkbox>
              <el-checkbox v-model="rules.removeUrls">删除所有 URL 和电子邮件地址</el-checkbox>
            </div>
            <div class="action-buttons">
              <el-button @click="handlePreview">
                <el-icon><View /></el-icon>
                预览效果
              </el-button>
              <el-button @click="handleReset">重置</el-button>
            </div>
          </div>
        </div>

        <!-- 父子分段设置内容 -->
        <div v-if="segmentMode === 'parentChild'" class="setting-section">
          <!-- 父块用作上下文 -->
          <div class="parent-context">
            <div class="section-subtitle">父块用作上下文</div>
            <div class="setting-inputs-row">
              <div class="setting-item">
                <div class="setting-label">
                  分段标识符
                  <el-tooltip content="用于分段的标识符" placement="top">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
                <el-input v-model="parentSegmentIdentifier" placeholder="\n\n" />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  分段最大长度
                  <el-tooltip content="每个分段的最大长度" placement="top">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
                <div class="setting-input-with-unit">
                  <el-input-number v-model="parentMaxLength" :min="1" :max="1000" />
                  <span class="unit">tokens</span>
                </div>
              </div>
            </div>
            <el-radio-group v-model="parentMode" class="mode-options">
              <el-radio label="paragraph">段落</el-radio>
              <el-radio label="full">全文</el-radio>
            </el-radio-group>
          </div>

          <!-- 子块用于检索 -->
          <div class="child-search">
            <div class="section-subtitle">子块用于检索</div>
            <div class="setting-inputs-row">
              <div class="setting-item">
                <div class="setting-label">
                  分段标识符
                  <el-tooltip content="用于分段的标识符" placement="top">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
                <el-input v-model="childSegmentIdentifier" placeholder="\n" />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  分段最大长度
                  <el-tooltip content="每个分段的最大长度" placement="top">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
                <div class="setting-input-with-unit">
                  <el-input-number v-model="childMaxLength" :min="1" :max="1000" />
                  <span class="unit">tokens</span>
                </div>
              </div>
            </div>

            <!-- 文本预处理规则 -->
            <div class="preprocessing-rules">
              <div class="rules-title">文本预处理规则</div>
              <div class="rule-list">
                <el-checkbox v-model="childRules.replaceSpaces">替换掉连续的空格、换行符和制表符</el-checkbox>
                <el-checkbox v-model="childRules.removeUrls">删除所有 URL 和电子邮件地址</el-checkbox>
              </div>
              <div class="action-buttons">
                <el-button @click="handlePreview">
                  <el-icon><View /></el-icon>
                  预览效果
                </el-button>
                <el-button @click="handleReset">重置</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 2、索引方式 -->
        <h2 class="section-title">2、索引方式</h2>
        
        <!-- 索引模式选择 -->
        <div class="index-mode-selector">
          <div class="mode-item" 
               :class="{ active: indexMode === 'highQuality' }"
               @click="indexMode = 'highQuality'">
            <div class="mode-header">
              <el-icon><Star /></el-icon>
              <span>高质量</span>
              <el-tag size="small" type="info" class="mode-tag">推荐</el-tag>
            </div>
            <div class="mode-desc">调用嵌入模型处理文本以实现更精确的检索，可以帮助LLM生成高质量的答案。</div>
          </div>
          <div class="mode-item"
               :class="{ active: indexMode === 'economic' }"
               @click="indexMode = 'economic'">
            <div class="mode-header">
              <el-icon><Money /></el-icon>
              <span>经济</span>
            </div>
            <div class="mode-desc">每个数据块使用10个关键词进行检索，不会消耗任何tokens，但会以牺牲检索质量为代价。</div>
          </div>
        </div>

        <!-- 警告提示 -->
        <div class="warning-message" v-if="indexMode === 'highQuality'">
          <el-icon><Warning /></el-icon>
          <span>使用高质量模式进行嵌入后，无法切换回经济模式。</span>
        </div>

        <!-- Embedding 模型选择 -->
        <div v-if="indexMode === 'highQuality'" class="setting-section compact">
          <div class="setting-item">
            <div class="setting-label">
              Embedding 模型
            </div>
            <el-select v-model="embeddingModel" class="full-width">
              <el-option label="embedding-2" value="embedding-2" />
            </el-select>
          </div>
        </div>
        <!-- 检索设置选择 -->
        <div v-if="indexMode === 'highQuality'" class="setting-section compact">
          <div class="setting-item">
            <div class="setting-label">
              检索设置
            </div>
            <el-select v-model="retrievalSelect" class="full-width">
              <el-option label="向量检索" value="01" />
              <el-option label="全文检索" value="02" />
              <el-option label="混合检索" value="03" />
            </el-select>
          </div>
        </div>

        <!-- 经济模式检索设置 -->
        <div v-if="indexMode === 'economic'" class="setting-section compact">
          <div class="setting-item">
            <div class="setting-label">
              倒排索引
              <el-tooltip content="倒排索引是一种高效检索的技术组织，每个关键词对应它所在的文档" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <div class="setting-inputs-row">
              <el-input-number v-model="topK" :min="1" :max="10" class="flex-grow" />
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧预览区域 -->
      <div class="right-section">
        <div class="file-header">
          <h3 class="preview-title">文件预览</h3>
          <template v-if="selectedFile">
            <p class="selected-file-name">{{ selectedFile.name }}</p>
          </template>
        </div>
        <TextRelatedDocPreview :file="selectedFile?.raw || null" />
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <div class="footer-actions">
      <el-button @click="handlePrevStep">上一步</el-button>
      <el-button type="primary" @click="handleNextStep">保存并处理</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  ArrowRight, 
  Setting,
  QuestionFilled,
  Connection,
  Search,
  View,
  Star,
  Money,
  Warning
} from '@element-plus/icons-vue'
import TextRelatedDocPreview from '@/components/TextRelatedDocPreview.vue'
import { saveAndHandle } from '@/api/knowledge'
import { ElMessage } from 'element-plus'

const router = useRouter()
const selectedFile = ref(null)
const segmentMode = ref('general')

// 通用分段设置
const segmentIdentifier = ref('\\n\\n')
const maxLength = ref(500)
const overlapLength = ref(50)
const rules = ref({
  replaceSpaces: true,
  removeUrls: false
})

// 父子分段设置
const parentMode = ref('paragraph')
const parentSegmentIdentifier = ref('\\n\\n')
const parentMaxLength = ref(500)
const childSegmentIdentifier = ref('\\n')
const childMaxLength = ref(200)
const childRules = ref({
  replaceSpaces: true,
  removeUrls: false
})

// 检索设置
const searchMethod = ref('hybrid')
const enableRerank = ref(true)
const topK = ref(2)
const scoreThreshold = ref('')

// 索引方式设置
const indexMode = ref('highQuality')
const embeddingModel = ref('embedding-2')
const retrievalSelect = ref('01')

// 处理预览
const handlePreview = () => {
  // TODO: 实现预览逻辑
}

// 处理重置
const handleReset = () => {
  segmentIdentifier.value = '\\n\\n'
  maxLength.value = 500
  overlapLength.value = 50
  rules.value = {
    replaceSpaces: true,
    removeUrls: false
  }
}

// 处理上一步
const handlePrevStep = () => {
  router.push('/knowledge/create')
}

// 处理下一步
const handleNextStep = async () => {
  try {
    const data = {
      segmentMode: segmentMode.value,
      // 通用设置
      general: segmentMode.value === 'general' ? {
        segmentIdentifier: segmentIdentifier.value,
        maxLength: maxLength.value,
        overlapLength: overlapLength.value,
        rules: rules.value
      } : null,
      // 父子分段设置
      parentChild: segmentMode.value === 'parentChild' ? {
        parent: {
          segmentIdentifier: parentSegmentIdentifier.value,
          maxLength: parentMaxLength.value,
          mode: parentMode.value
        },
        child: {
          segmentIdentifier: childSegmentIdentifier.value,
          maxLength: childMaxLength.value,
          rules: childRules.value
        }
      } : null,
      // 索引设置
      indexing: {
        mode: indexMode.value,
        highQuality: indexMode.value === 'highQuality' ? {
          embeddingModel: embeddingModel.value,
          retrievalSelect: retrievalSelect.value
        } : null,
        economic: indexMode.value === 'economic' ? {
          topK: topK.value
        } : null
      }
    }

    await saveAndHandle(data)
    ElMessage.success('保存成功')
    router.push('/knowledge/create/step-three')
  } catch (error) {
    ElMessage.error(error.message || '保存失败')
  }
}
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

.section-title {
  font-size: 14px;
  margin-bottom: 16px;
  color: #076bb3;
  font-weight: bold;
}

.setting-section {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--el-border-color-lighter);
}

.setting-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;

  .el-icon {
    font-size: 16px;
    color: var(--el-color-primary);
  }
}

.setting-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 16px;
}

.setting-item {
  margin-bottom: 16px;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  font-size: 14px;

  .el-icon {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    cursor: help;
  }
}

.setting-input-with-unit {
  display: flex;
  align-items: center;
  gap: 8px;

  .unit {
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }
}

.rule-list {
  display: flex;
  flex-direction: column;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.search-setting {
  margin-bottom: 16px;
}

.search-options {
  margin-top: 8px;
}

.file-header {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.preview-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  color: var(--el-text-color-primary);
}

.selected-file-name {
  font-size: 14px;
  margin: 8px 0 0;
  color: var(--el-text-color-secondary);
}

.footer-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 24px;
  background-color: white;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: space-between;
}

.setting-inputs-row {
  display: flex;
  gap: 24px;
  margin-bottom: 8px;

  .setting-item {
    flex: 1;
    margin-bottom: 0;
  }

  .el-input,
  .el-input-number {
    width: 100%;
  }
}

.setting-input-with-unit {
  display: flex;
  align-items: center;
  gap: 8px;

  .el-input-number {
    flex: 1;
  }

  .unit {
    color: var(--el-text-color-secondary);
    font-size: 14px;
    white-space: nowrap;
  }
}

.segment-mode-selector {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.mode-item {
  flex: 1;
  padding: 10px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;

  .mode-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;

    .el-icon {
      font-size: 16px;
      margin-bottom: 0;
      color: var(--el-text-color-secondary);
    }

    span {
      display: inline;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 0;
    }
  }

  &:hover {
    border-color: var(--el-color-primary-light-5);
  }

  &.active {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);

    .el-icon {
      color: var(--el-color-primary);
    }
  }
}

.mode-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.3;
  margin-left: 22px;
}

.preprocessing-rules {
  margin-top: 9px;
  padding-top: 8px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.rules-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
}

.section-subtitle {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
  color: var(--el-text-color-primary);
}

.parent-context,
.child-search {
  margin-bottom: 10px;
}

.mode-options {
  margin-top: 2px;
}

.index-mode-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.mode-tag {
  margin-left: 4px;
  font-size: 11px;
  padding: 0 4px;
  height: 18px;
  line-height: 16px;
}

.warning-message {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: var(--el-color-warning-light-9);
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 12px;
  color: var(--el-color-warning);

  .el-icon {
    font-size: 14px;
  }
}

.setting-section.compact {
  padding: 12px;
  margin-bottom: 12px;
}

.full-width {
  width: 100%;
}

.flex-grow {
  flex-grow: 1;
}

.mode-item {
  padding: 8px 12px;
}

.mode-desc {
  font-size: 12px;
  line-height: 1.2;
  margin-top: 4px;
  margin-left: 22px;
}

.setting-item {
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.setting-label {
  margin-bottom: 6px;
}
</style> 