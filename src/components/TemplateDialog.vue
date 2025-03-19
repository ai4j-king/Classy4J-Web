<template>
  <el-dialog
    v-model="dialogVisible"
    title="从应用模板创建"
    width="80%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="template-container">
      <!-- 左侧筛选栏 -->
      <div class="filter-sidebar">
        <!-- 推荐 -->
        <div
          class="category-item recommend-item"
          :class="{ active: selectedCategory === 'recommend' }"
          @click="selectedCategory = 'recommend'"
        >
          推荐
        </div>

        <div class="filter-group">
          <h3>分类</h3>
          <div class="category-list">
            <div
              v-for="category in categories"
              :key="category.value"
              class="category-item"
              :class="{ active: selectedCategory === category.value }"
              @click="selectedCategory = category.value"
            >
              {{ category.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="content-area">
        <!-- 搜索栏 -->
        <div class="search-bar">
          <el-select
            v-model="selectedTypes"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="选择类型"
            class="filter-select"
          >
            <el-option label="助手" value="assistant" />
            <el-option label="Agent" value="agent" />
            <el-option label="人力资源" value="hr" />
            <el-option label="编程" value="programming" />
            <el-option label="工作流" value="workflow" />
            <el-option label="写作" value="writing" />
          </el-select>
          <el-input
            v-model="searchQuery"
            placeholder="搜索所有模板..."
            :prefix-icon="Search"
            clearable
          />
        </div>

        <!-- 模板列表 -->
        <div class="template-list">
          <el-card 
            v-for="template in filteredTemplates" 
            :key="template.id" 
            class="template-card" 
            shadow="hover"
            :class="{ active: selectedTemplate === template.id }"
            @click="handleSelectTemplate(template)"
          >
            <div class="template-header">
              <el-avatar :size="32" :src="template.icon" />
              <div class="template-info">
                <h4>{{ template.name }}</h4>
                <div class="template-tags">
                  <el-tag size="small" :type="template.type === 'CHATFLOW' ? 'primary' : 'success'">
                    {{ template.type }}
                  </el-tag>
                  <el-tag size="small" type="info">{{ template.category }}</el-tag>
                </div>
              </div>
            </div>
            <p class="template-desc">{{ template.description }}</p>
          </el-card>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleCreate" :disabled="!selectedTemplate">
          使用此模板
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'create'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

// 分类配置
const categories = [
  { label: '助手', value: 'assistant' },
  { label: 'Agent', value: 'agent' },
  { label: '人力资源', value: 'hr' },
  { label: '编程', value: 'programming' },
  { label: '工作流', value: 'workflow' },
  { label: '写作', value: 'writing' }
]

// 筛选和搜索
const selectedCategory = ref('')
const selectedTypes = ref([])
const searchQuery = ref('')
const selectedTemplate = ref(null)

// 模拟模板数据
const templates = [
  {
    id: 1,
    name: '不同类型的评测处理',
    type: 'CHATFLOW',
    category: '工作流',
    icon: 'https://example.com/icon1.png',
    description: '不同类型的评测处理链路，适用于需要根据分类对不同的评测做相应的处理，可导入评测结果文本文件并自动化处理评测结果。'
  },
  {
    id: 2,
    name: 'help me think(deepseek r1)',
    type: 'CHATFLOW',
    category: '助手',
    description: '使用Deepseek r1模型多轮对话LLM'
  },
  {
    id: 3,
    name: 'GPT-Researcher',
    type: 'AGENT',
    category: 'Agent',
    description: 'GPT-Researcher 是互联网上研究工具的专家，它可以通过一个主题分解为子任务，并从互联网搜集信息来完成研究任务。'
  }
]

// 过滤模板
const filteredTemplates = computed(() => {
  let result = templates

  // 按分类筛选
  if (selectedCategory.value && selectedCategory.value !== 'recommend') {
    result = result.filter(t => {
      const categoryMap = {
        assistant: '助手',
        agent: 'Agent',
        hr: '人力资源',
        programming: '编程',
        workflow: '工作流',
        writing: '写作'
      }
      return t.category === categoryMap[selectedCategory.value]
    })
  }

  // 按类型筛选（多选）
  if (selectedTypes.value.length > 0) {
    result = result.filter(t => {
      const typeMap = {
        assistant: '助手',
        agent: 'Agent',
        hr: '人力资源',
        programming: '编程',
        workflow: '工作流',
        writing: '写作'
      }
      return selectedTypes.value.some(type => typeMap[type] === t.category)
    })
  }

  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t => 
      t.name.toLowerCase().includes(query) || 
      t.description.toLowerCase().includes(query)
    )
  }

  return result
})

const handleSelectTemplate = (template) => {
  selectedTemplate.value = template.id
}

const handleClose = () => {
  dialogVisible.value = false
  selectedTemplate.value = null
  selectedCategory.value = ''
  selectedTypes.value = []
  searchQuery.value = ''
}

const handleCreate = () => {
  if (!selectedTemplate.value) return
  const template = templates.find(t => t.id === selectedTemplate.value)
  emit('create', template)
  handleClose()
}
</script>

<style scoped>
.template-container {
  display: flex;
  gap: 24px;
  height: 600px;
}

.filter-sidebar {
  width: 200px;
  border-right: 1px solid #e4e7ed;
  padding-right: 24px;
}

.filter-group {
  margin-top: 24px;
  margin-bottom: 24px;
}

.filter-group h3 {
  font-size: 14px;
  color: #333;
  margin-bottom: 16px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-item {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  color: #606266;
  transition: all 0.3s;
}

.category-item:hover {
  background-color: #f5f7fa;
}

.category-item.active {
  background-color: #ecf5ff;
  color: #409eff;
  font-weight: 500;
}

.recommend-item {
  margin-bottom: 8px;
  font-size: 14px;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-bar {
  display: flex;
  gap: 12px;
}

.filter-select {
  width: 240px;
}

.template-list {
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding-right: 12px;
}

.template-card {
  cursor: pointer;
  transition: all 0.3s;
}

.template-card:hover {
  border-color: #409eff;
}

.template-card.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.template-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.template-info {
  flex: 1;
}

.template-info h4 {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 500;
}

.template-tags {
  display: flex;
  gap: 8px;
}

.template-desc {
  margin: 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 