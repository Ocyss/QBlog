<script setup lang="ts">
const props = defineProps<{
  event?: boolean
}>()

const emits = defineEmits<{
  (e: 'search', query: string): void
}>()

const searchQuery = defineModel({ type: String, default: '' })

function searchHandler() {
  if (props.event) {
    emits('search', searchQuery.value)
  }
  else {
    navigateTo({
      path: '/article/search',
      query: {
        q: searchQuery.value,
      },
    })
  }
}
</script>

<template>
  <div class="flex items-center space-x-4 w-full ">
    <UInput
      v-model="searchQuery"
      icon="i-lucide-search" color="primary"
      variant="subtle" placeholder="Search..."
      class="w-full  overflow-hidden"
      :ui="{
        base: 'overflow-hidden',
        trailing: 'pr-0 rounded-xl',
      }"
      size="xl"
      @keyup.enter="searchHandler"
    >
      <template v-if="searchQuery?.length" #trailing>
        <UButton
          size="xl"
          variant="soft"
          aria-label="search"
          class="cursor-pointer"
          @click="searchHandler"
        >
          搜索
        </UButton>
      </template>
    </UInput>
  </div>
</template>
