<template>
  <div class="knowledge-label">
    <!-- 左侧导航栏 -->
    <div class="side-nav">
      <el-tooltip content="文档" placement="right">
        <div class="nav-item" :class="{ active: currentNav === 'doc' }" @click="switchNav('doc')">
          <el-icon><Document /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="召回测试" placement="right">
        <div class="nav-item" :class="{ active: currentNav === 'history' }" @click="switchNav('history')">
          <el-icon><Timer /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="设置" placement="right">
        <div class="nav-item" :class="{ active: currentNav === 'settings' }" @click="switchNav('settings')">
          <el-icon><Setting /></el-icon>
        </div>
      </el-tooltip>
    </div>

    <div class="right-content">
      <!-- 顶部标题栏 -->
      <div class="page-header">
      <div class="back-title">
        <el-button :link="true" @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <span class="title">标签管理</span>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleAddSegment">
          <el-icon><Plus /></el-icon>
          添加分段
        </el-button>
        <el-switch v-model="isEnabled" active-text="可用" inactive-text="已禁用" class="el-switch"/>
        <el-button @click="handleSegmentSettings">
          <el-icon><Setting /></el-icon>
          分段设置
        </el-button>
        <el-dropdown trigger="click">
          <el-button>
            <el-icon><MoreFilled /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleRename">重命名</el-dropdown-item>
              <el-dropdown-item @click="handleArchive">归档</el-dropdown-item>
              <el-dropdown-item @click="handleDelete">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button @click="handleToggleIcon">
          <el-icon><View /></el-icon>
          切换图标
        </el-button>
      </div>
    </div>

    <div class="main-content">
      <div class="content-wrapper">
        <!-- 左侧标签列表区域 -->
        <div class="left-panel">
        <!-- 搜索和操作区域 -->
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="搜索标签"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 分段列表 -->
        <div class="segment-list">
          <div v-for="(segment, index) in filteredLabels" :key="index" class="segment-item" :class="{ 'edited': segment.isEdited }">
            <div class="segment-header">
              <div class="segment-info">
                <span class="segment-index"># {{ index + 1 }}</span>
                <span class="segment-stats">
                  <span>{{ segment.charCount }} 字符</span>
                  <span>{{ segment.recallCount }} 召回次数</span>
                </span>
              </div>
              <div class="segment-status">
                <el-tag size="small" :type="segment.isEnabled ? 'success' : 'info'">
                  {{ segment.isEnabled ? '已启用' : '已禁用' }}
                </el-tag>
              </div>
            </div>
            <div class="segment-content">
              <div class="segment-title">{{ segment.name }}</div>
              <div class="segment-description">{{ segment.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧元数据区域 -->
      <div class="right-panel">
        <div class="metadata-section">
          <h3>
            元数据
            <el-tooltip content="元数据是关于文档的数据，用于描述文档的属性。元数据可以帮助您更好地组织和管理文档。" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
            <el-button link type="primary" class="edit-button" style="float: right;">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
          </h3>
          <div class="info-item">
            <span class="label">document_name：</span>
            <span class="value">{{ documentInfo.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">uploader：</span>
            <span class="value">{{ documentInfo.uploader }}</span>
          </div>
          <div class="info-item">
            <span class="label">upload_date：</span>
            <span class="value">{{ documentInfo.uploadDate }}</span>
          </div>
          <div class="info-item">
            <span class="label">last_update_date：</span>
            <span class="value">{{ documentInfo.lastUpdateDate }}</span>
          </div>
        </div>

        <div class="metadata-section">
          <h3>文档信息</h3>
          <div class="info-item">
            <span class="label">文档名称：</span>
            <span class="value">{{ documentInfo.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">上传者：</span>
            <span class="value">{{ documentInfo.uploader }}</span>
          </div>
          <div class="info-item">
            <span class="label">上传日期：</span>
            <span class="value">{{ documentInfo.uploadDate }}</span>
          </div>
          <div class="info-item">
            <span class="label">最后更新：</span>
            <span class="value">{{ documentInfo.lastUpdateDate }}</span>
          </div>
        </div>

        <div class="metadata-section">
          <h3>技术参数</h3>
          <div class="info-item">
            <span class="label">原始文件名：</span>
            <span class="value">{{ documentInfo.originalFileName }}</span>
          </div>
          <div class="info-item">
            <span class="label">文件大小：</span>
            <span class="value">{{ documentInfo.fileSize }}</span>
          </div>
          <div class="info-item">
            <span class="label">段落数量：</span>
            <span class="value">{{ documentInfo.paragraphCount }}</span>
          </div>
          <div class="info-item">
            <span class="label">平均段落长度：</span>
            <span class="value">{{ documentInfo.avgParagraphLength }}</span>
          </div>
          <div class="info-item">
            <span class="label">引入时间：</span>
            <span class="value">{{ documentInfo.importTime }}</span>
          </div>
        </div>
      </div>

      </div>
    </div>
    <!-- 底部分页器 -->
    <div class="pagination-container">
      <div class="pagination-left">
        <el-button-group>
          <el-button :disabled="true">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <el-button>
            <span>1/1</span>
          </el-button>
          <el-button :disabled="true">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </el-button-group>
      </div>
      <div class="pagination-right">
        <span class="page-size-text">1</span>
        <el-dropdown trigger="click">
          <el-button>
            10
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>10</el-dropdown-item>
              <el-dropdown-item>25</el-dropdown-item>
              <el-dropdown-item>50</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 添加/编辑标签对话框 -->
    <el-dialog
      v-model="showLabelDialog"
      :title="dialogTitle"
      width="480px"
      :close-on-click-modal="false"
    >
      <el-form :model="labelForm" label-width="80px">
        <el-form-item label="标签名称">
          <el-input v-model="labelForm.name" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="labelForm.description"
            type="textarea"
            placeholder="请输入标签描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showLabelDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSaveLabel">确定</el-button>
        </span>
      </template>
    </el-dialog>
    </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Delete,
  ArrowDown,
  ArrowRight
} from '@element-plus/icons-vue'

// 文档信息数据
const documentInfo = ref({
  name: '4b0f3ef2-674c-4ab7-b7bf-3ae73d0ba628.pptx',
  uploader: 'jun.hai',
  uploadDate: '2025-03-25 02:18',
  lastUpdateDate: '2025-03-25 23:17',
  originalFileName: '4b0f3ef2-674c-4ab7-b7bf-3ae73d0ba628.pptx',
  fileSize: '259.52KB',
  paragraphCount: '6',
  avgParagraphLength: '108 characters',
  importTime: '2025-03-25 02:18'
})

const router = useRouter()

// 搜索相关
const searchQuery = ref('')

// 标签数据
const labels = ref([
  {
    name: '重要文档',
    description: '包含重要业务信息的文档',
    createTime: '2024-03-25 02:18'
  },
  {
    name: '技术文档',
    description: '技术相关的文档和说明',
    createTime: '2024-03-25 02:18'
  }
])

// 过滤后的标签列表
const filteredLabels = computed(() => {
  if (!searchQuery.value) return labels.value
  return labels.value.filter(label =>
    label.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    label.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 返回上一页
const handleBack = () => {
  router.back()
}

</script>

<style scoped>
.knowledge-label {
  display: flex;
  height: 100%;
  width: 100%;
}

.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.nav-sidebar {
  width: 5%;
  background-color: #001529;
  height: 100%;
  flex-shrink: 0;
}

.nav-menu {
  border-right: none;
}

.nav-menu .el-menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 60px;
  padding: 8px 0;
}

.nav-menu .el-menu-item span {
  font-size: 12px;
  margin-top: 4px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 8%;
  padding: 0 20px;
  border-bottom: 1px solid #e4e7ed;
}

.back-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title {
  font-size: 20px;
  font-weight: 600;
}

.main-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 20px;
  gap: 20px;
  height: 92%;
  overflow: hidden;
}

.content-wrapper {
  display: flex;
  flex: 1;
  gap: 20px;
  min-height: 0;
}

.left-panel {
  width: 70%;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: auto;
}

.right-panel {
  width: 30%;
  flex-shrink: 0;
  background-color: #f5f7fa;
  border-left: 1px solid #e4e7ed;
  padding: 10px;
  overflow-y: auto;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.label-list {
  flex: 1;
  margin-bottom: 20px;
  overflow: auto;
}

.operation-cell {
  display: flex;
  gap: 8px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-left,
.pagination-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-size-text {
  color: #606266;
}

.metadata-section {
  background: #ffffff;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.metadata-section h3 {
  margin: 0 0 16px 0;
  font-size: 12px;
  color: #303133;
  font-weight: 600;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.info-item {
  display: flex;
  margin-bottom: 1px;
  font-size: 12px;
  line-height: 1.6;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.info-item:hover {
  background-color: #f5f7fa;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .label {
  color: #606266;
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
}

.info-item .value {
  color: #303133;
  word-break: break-all;
}

.side-nav {
  width: 48px;
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-lighter);
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.nav-item {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  color: var(--el-text-color-secondary);
  transition: all 0.3s;

  &:hover {
    background-color: var(--el-fill-color-light);
    color: var(--el-color-primary);
  }

  &.active {
    background-color: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }

  .el-icon {
    font-size: 18px;
  }
}

.el-switch{
 margin-left: 5px;
 margin-right: 5px;
}

.segment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.segment-item {
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: var(--el-fill-color);
  }

  &.edited {
    border-left: 3px solid var(--el-color-primary);
  }
}

.segment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.segment-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.segment-index {
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.segment-stats {
  display: flex;
  gap: 16px;
  color: var(--el-text-color-regular);
  font-size: 13px;
}

.segment-content {
  margin-top: 8px;
}

.segment-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.segment-description {
  color: var(--el-text-color-regular);
  font-size: 13px;
  line-height: 1.5;
}
</style>