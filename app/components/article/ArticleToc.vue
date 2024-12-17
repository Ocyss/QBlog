<script setup lang="ts">
import type { TocLink } from '@nuxt/content'
import { useEventListener, useWindowScroll } from '@vueuse/core'

const props = defineProps<{
  tocLink?: TocLink[]
}>()

const activeId = ref('')
const expandedItems = ref<Set<string>>(new Set())
const { y: scrollY } = useWindowScroll()

// 父子关系映射
const parentChildMap = ref(new Map<string, Set<string>>())
const childParentMap = ref(new Map<string, Set<string>>())

// 计算活跃的父级ID
const activeParentIds = computed(() => {
  const parentIds = new Set<string>()
  if (activeId.value && childParentMap.value.has(activeId.value)) {
    childParentMap.value.get(activeId.value)?.forEach(id => parentIds.add(id))
  }
  return parentIds
})

// 缓存所有标题元素
const headingsCache = ref<Array<{ id: string, top: number, bottom: number }>>([])

// 添加一个新的 ref 用于视口高度
const viewportHeight = ref(0)

// 更新活跃标题
const updateActiveHeading = useThrottleFn(() => {
  // 每次都重新获取标题元素，以处理动态内容
  const headings = Array.from(document.querySelectorAll('h2, h3, h4'))
  headingsCache.value = headings.map((heading) => {
    const rect = heading.getBoundingClientRect()
    return {
      id: heading.id,
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
    }
  }).filter(heading => heading.id)

  if (headingsCache.value.length === 0)
    return

  const scrollPosition = scrollY.value
  const viewportMiddle = scrollPosition + (viewportHeight.value / 2)
  let currentHeading = null

  // 查找当前视口中的标题
  for (const heading of headingsCache.value) {
    // 标题在视口顶部上方 100px 到视口中间位置之间
    if (heading.top <= viewportMiddle && heading.bottom >= scrollPosition) {
      currentHeading = heading
      break
    }
  }

  // 如果没有找到在视窗内的标题，找最近的一个
  if (!currentHeading) {
    currentHeading = headingsCache.value.reduce<{ id: string, top: number, bottom: number } | null>((nearest, heading) => {
      if (!nearest)
        return heading
      const currentDistance = Math.abs(viewportMiddle - heading.top)
      const nearestDistance = Math.abs(viewportMiddle - nearest.top)
      return currentDistance < nearestDistance ? heading : nearest
    }, null)
  }

  if (currentHeading && currentHeading.id !== activeId.value) {
    activeId.value = currentHeading.id
  }
}, 100) // 降低节流时间以提高响应性

function toggleExpand(itemId: string) {
  const items = new Set(expandedItems.value)
  items.has(itemId) ? items.delete(itemId) : items.add(itemId)
  expandedItems.value = items
}

// 初始化父子关系映射
function initializeParentChildMaps(tocLinks: TocLink[]) {
  const parentToChildren = new Map<string, Set<string>>()
  const childToParents = new Map<string, Set<string>>()

  function processItem(item: TocLink, parentIds: string[] = []) {
    childToParents.set(item.id, new Set(parentIds))

    if (parentIds.length > 0) {
      const parent = parentIds[parentIds.length - 1]!
      if (!parentToChildren.has(parent)) {
        parentToChildren.set(parent, new Set())
      }
      parentToChildren.get(parent)?.add(item.id)
    }

    if (item.children?.length) {
      item.children.forEach(child => processItem(child, [...parentIds, item.id]))
    }
  }

  tocLinks.forEach(item => processItem(item))
  parentChildMap.value = parentToChildren
  childParentMap.value = childToParents
}

const lenis = inject(mainContentLenisKey)

onMounted(() => {
  // 获取视口高度
  viewportHeight.value = window.innerHeight

  // 默认展开所有一级标题
  document.querySelectorAll('h2').forEach((heading) => {
    if (heading.id)
      expandedItems.value.add(heading.id)
  })

  // 初始化父子关系映射
  if (props.tocLink)
    initializeParentChildMaps(props.tocLink)

  lenis?.value.instance?.on('scroll', () => {
    requestAnimationFrame(updateActiveHeading)
  })

  useEventListener(window, 'resize', () => {
    viewportHeight.value = window.innerHeight
    updateActiveHeading()
  }, { passive: true })

  // 初始执行一次更新
  nextTick(() => {
    updateActiveHeading()
  })
})

// 监听路由变化，重新初始化
onBeforeRouteUpdate(() => {
  nextTick(() => {
    headingsCache.value = []
    updateActiveHeading()
  })
})
</script>

<template>
  <ul class="space-y-1 text-sm">
    <li v-for="item in tocLink" :key="item.id">
      <ArticleTocItem
        :item="item"
        :active-id="activeId"
        :active-parent-ids="activeParentIds"
        :expanded-items="expandedItems"
        :depth="item.depth"
        @toggle-expand="toggleExpand"
      />
    </li>
  </ul>
</template>
