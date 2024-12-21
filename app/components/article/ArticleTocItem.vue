<script setup lang="ts">
import type { TocLink } from '@nuxt/content'

const props = defineProps<{
  item: TocLink
  activeId: string
  activeParentIds: Set<string>
  expandedItems: Set<string>
  depth: number
}>()

const emit = defineEmits<{
  toggleExpand: [id: string]
}>()

// 计算目录项的样式
const itemStyle = computed(() => {
  const baseSize = props.depth === 2 ? '0.95rem' : '0.875rem'
  return {
    fontSize: baseSize,
    paddingLeft: `${(props.depth - 2) * 1}rem`,
  }
})

const itemState = computed(() => {
  const { item, activeId, activeParentIds, expandedItems } = props
  const isParent = activeParentIds.has(item.id)
  const isActive = activeId === item.id

  if (isActive) {
    return 'active'
  }
  if (isParent && (!item.children?.length || !expandedItems.has(item.id))) {
    return 'active'
  }
  if (isParent) {
    return 'parent'
  }
  return 'normal'
})
</script>

<template>
  <div class="toc-item">
    <div
      class="flex items-center group relative rounded-md transition-all duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
      :style="itemStyle"
    >
      <div
        class="absolute left-0 top-0 w-0.5 h-full rounded-r transform transition-all duration-300 "
        :class="[
          {
            active: 'opacity-100 scale-100 bg-[var(--ui-primary)]',
            parent: 'opacity-60 scale-90 bg-[var(--ui-primary)]/60',
            normal: 'opacity-0 scale-75',
          }[itemState],
        ]"
      />
      <a
        :href="`#${item.id}`"
        class="flex-1 py-2 px-3 transition-all duration-200 whitespace-nowrap"
        :class="[
          {
            active: 'text-[var(--ui-primary)] font-medium translate-x-0.5',
            parent: 'text-[var(--ui-primary)]/70 font-normal',
            normal: 'text-gray-700 hover:text-[var(--ui-primary)] dark:text-gray-300',
          }[itemState],
          { 'font-medium': depth === 2 },
        ]"
      >
        {{ item.text }}
      </a>
      <button
        v-if="item.children?.length"
        class="p-1.5 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-200
               hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
        @click.prevent="emit('toggleExpand', item.id)"
      >
        <UIcon
          :name="expandedItems.has(item.id) ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
          class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
        />
      </button>
    </div>
    <div
      v-if="item.children?.length"
      v-show="expandedItems.has(item.id)"
      class="relative overflow-hidden transition-all duration-300"
    >
      <ArticleTocItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :active-id="activeId"
        :active-parent-ids="activeParentIds"
        :expanded-items="expandedItems"
        :depth="depth + 1"
        @toggle-expand="emit('toggleExpand', $event)"
      />
    </div>
  </div>
</template>
