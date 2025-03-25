<template>
  <div class="page-container">
    <!-- 左侧导航栏 -->
    <div class="side-nav">
      <div class="nav-item" :class="{ active: currentNav === 'doc' }" @click="switchNav('doc')">
        <el-icon><Document /></el-icon>
      </div>
      <div class="nav-item" :class="{ active: currentNav === 'history' }" @click="switchNav('history')">
        <el-icon><Timer /></el-icon>
      </div>
      <div class="nav-item" :class="{ active: currentNav === 'settings' }" @click="switchNav('settings')">
        <el-icon><Setting /></el-icon>
      </div>
    </div>

    <!-- 右侧主要内容区域 -->
    <div class="main-container">
      <!-- 文档列表页面 -->
      <div v-if="currentNav === 'doc'" class="doc-list">
        <!-- 页面标题 -->
        <div class="page-title">
          <h2>文档</h2>
        </div>

        <!-- 顶部搜索区域 -->
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="搜索"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <div class="right-buttons">
            <el-button plain>
              <el-icon><RefreshRight /></el-icon>
              元数据
            </el-button>
            <el-button type="primary">
              <el-icon><Plus /></el-icon>
              添加文件
            </el-button>
          </div>
        </div>

        <!-- 文件列表表格 -->
        <el-table
          :data="filteredTableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column label="#" width="60" type="index" />
          <el-table-column prop="name" label="名称" min-width="200" />
          <el-table-column prop="segmentMode" label="分段模式" width="100">
            <template #default="{ row }">
              <el-tag size="small" effect="plain" round>通用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="charCount" label="字符数" width="100" />
          <el-table-column prop="recallCount" label="召回次数" width="100" />
          <el-table-column prop="uploadTime" label="上传时间" width="160" sortable />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <div class="status-cell">
                <div class="status-dot" :class="row.status" />
                <span>{{ row.status === 'active' ? '可用' : '不可用' }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <div class="operation-cell">
                <el-switch
                  v-model="row.isEnabled"
                  inline-prompt
                  size="small"
                />
                <el-dropdown trigger="click">
                  <el-button link type="primary">
                    <el-icon><More /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>编辑</el-dropdown-item>
                      <el-dropdown-item>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>

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
      </div>

      <!-- 设置页面 -->
      <KnowledgeSettingsView v-else-if="currentNav === 'settings'" />

      <!-- 历史记录页面 -->
      <div v-else-if="currentNav === 'history'" class="history-view">
        <!-- TODO: 实现历史记录页面 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Search,
  Plus,
  More,
  RefreshRight,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Document,
  Timer,
  Setting
} from '@element-plus/icons-vue'
import KnowledgeSettingsView from './KnowledgeSettingsView.vue'

// 当前选中的导航项
const currentNav = ref('doc')

// 导航切换处理
const switchNav = (nav) => {
  currentNav.value = nav
}

// 搜索关键词
const searchQuery = ref('')

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '4b0f3ef2-674c-4ab7-b7bf-3ae73d0ba628.pptx',
    segmentMode: 'general',
    charCount: '531',
    recallCount: '0',
    uploadTime: '2025-03-25 02:18',
    status: 'active',
    isEnabled: true
  },
  {
    id: 2,
    name: '3-大模型基石-transformer (1).pdf',
    segmentMode: 'general',
    charCount: '1.9k',
    recallCount: '0',
    uploadTime: '2025-03-25 01:50',
    status: 'active',
    isEnabled: true
  }
])

// 过滤后的表格数据
const filteredTableData = computed(() => {
  if (!searchQuery.value) return tableData.value
  const query = searchQuery.value.toLowerCase()
  return tableData.value.filter(item => 
    item.name.toLowerCase().includes(query)
  )
})

// 选择变化处理
const handleSelectionChange = (selection) => {
  console.log('selected:', selection)
}
</script>

<style scoped>
.page-container {
  display: flex;
  height: 100vh;
  background-color: var(--el-bg-color);
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

.main-container {
  flex: 1;
  overflow: auto;
}

.doc-list {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-title {
  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  .search-input {
    width: 240px;

    :deep(.el-input__wrapper) {
      padding-left: 8px;
    }

    :deep(.el-input__prefix) {
      font-size: 16px;
    }
  }

  .right-buttons {
    display: flex;
    gap: 8px;
  }
}

:deep(.el-table) {
  --el-table-border-color: var(--el-border-color-lighter);
  --el-table-header-bg-color: var(--el-fill-color-light);
  
  .el-table__header th {
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}

.status-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;

    &.active {
      background-color: var(--el-color-success);
    }

    &.inactive {
      background-color: var(--el-color-danger);
    }
  }
}

.operation-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.pagination-left {
  .el-button-group {
    .el-button {
      padding: 8px 12px;
    }
  }
}

.pagination-right {
  display: flex;
  align-items: center;
  gap: 8px;

  .page-size-text {
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }

  .el-button {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style> 