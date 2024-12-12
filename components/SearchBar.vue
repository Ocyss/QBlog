<script setup>
const searchQuery = ref('')
const selectedLanguage = ref('En')

function handleSearch() {
  // 实现搜索逻辑
  console.log('Searching:', searchQuery.value)
}

// 可以暴露搜索状态和方法给父组件
defineExpose({
  searchQuery,
  selectedLanguage,
  handleSearch,
})
</script>

<template>
  <div class="flex items-center space-x-4 w-full ">
    <div class="relative flex items-center  w-full">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Article name, tag, category..."
        class="pl-12 pr-4 py-3 bg-[#E6EBF3] rounded-2xl w-[640px] focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-[#8B8B8B] text-base"
        @input="handleSearch"
      >
      <div class="absolute left-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#8B8B8B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M21 21L16.65 16.65" stroke="#8B8B8B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
  </div>
</template>
