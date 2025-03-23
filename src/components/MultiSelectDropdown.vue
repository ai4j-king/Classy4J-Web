<template>
  <div class="multi-select-dropdown">
    <div class="select-input" @click="showDropdown = true">
      <div class="selected-tags" v-if="modelValue.length > 0">
        <el-tag
          v-for="item in modelValue"
          :key="item"
          closable
          @close="removeTag(item)"
        >
          {{ item }}
        </el-tag>
      </div>
      <div v-else class="placeholder">{{ placeholder }}</div>
      <el-icon class="arrow-icon" :class="{ 'is-reverse': showDropdown }">
        <ArrowDown />
      </el-icon>
    </div>
    
    <div v-show="showDropdown" class="dropdown-panel">
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="options-list">
        <label
          v-for="option in filteredOptions"
          :key="option"
          class="option-item"
        >
          <el-checkbox
            v-model="selectedValues"
            :label="option"
            @change="handleChange"
          >
            {{ option }}
          </el-checkbox>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ArrowDown, Search } from '@element-plus/icons-vue'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请选择'
  }
})

const emit = defineEmits(['update:modelValue'])

const showDropdown = ref(false)
const searchQuery = ref('')
const selectedValues = ref(props.modelValue)

// 监听点击外部关闭下拉面板
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.multi-select-dropdown')
  if (dropdown && !dropdown.contains(event.target)) {
    showDropdown.value = false
  }
}

// 添加和移除点击外部事件监听
watch(showDropdown, (newVal) => {
  if (newVal) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})

// 过滤选项
const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  return props.options.filter(option =>
    option.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 处理选项变化
const handleChange = () => {
  emit('update:modelValue', selectedValues.value)
}

// 移除标签
const removeTag = (tag) => {
  selectedValues.value = selectedValues.value.filter(item => item !== tag)
  handleChange()
}

// 处理搜索
const handleSearch = () => {
  // 可以添加额外的搜索逻辑
}

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  selectedValues.value = newVal
})
</script>

<style scoped>
.multi-select-dropdown {
  position: relative;
  width: 100%;
}

.select-input {
  min-height: 32px;
  padding: 4px 30px 4px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  
  &:hover {
    border-color: #409eff;
  }
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 2px 0;
}

.placeholder {
  color: #909399;
  font-size: 14px;
}

.arrow-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.3s;
  color: #909399;
  
  &.is-reverse {
    transform: translateY(-50%) rotate(180deg);
  }
}

.dropdown-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.search-box {
  padding: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.options-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 4px 0;
}

.option-item {
  display: block;
  padding: 8px 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f7fa;
  }
}

:deep(.el-tag) {
  margin: 2px;
}

:deep(.el-checkbox) {
  width: 100%;
  height: 100%;
  margin-right: 0;
  padding: 0;
}

:deep(.el-checkbox__label) {
  font-size: 14px;
}
</style>