import type { ContentNavigationItem } from '@nuxt/content'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { ArticleNavItem } from '~/types/article'

// 使用 useState 替代 ref，确保状态在服务端和客户端之间同步
const useNavigationStore = () => useState<ArticleNavItem[] | null>('navigation', () => null)
const usePathTitleMapStore = () => useState<Record<string, ArticleNavItem>>('pathTitleMap', () => ({}))

function getChildren(child: ContentNavigationItem): DropdownMenuItem {
  return {
    label: child.title,
    icon: child.icon as never ?? 'i-lucide-app-window',
    to: child.path,
    children: child.children?.map(getChildren),
  }
}

/**
 * 初始化导航数据和路径映射
 */
async function initNavigationData() {
  const navigationStore = useNavigationStore()
  const pathTitleMapStore = usePathTitleMapStore()

  // 如果已经有数据，直接返回
  if (navigationStore.value) {
    return navigationStore.value
  }

  const { data } = await useAsyncData(
    'navigation',
    () => queryCollectionNavigation('article'),
    {
      deep: false,
      // 移除 server: true，允许在需要时在客户端获取
      lazy: true, // 添加 lazy 选项，避免不必要的重新获取
      transform: (navigationItems: ContentNavigationItem[]) => {
        const articleNavigation = navigationItems.find(
          item => item.path === '/article',
        )?.children || []

        // 重置并构建新的路径-标题映射
        pathTitleMapStore.value = {}

        // 处理导航项目并更新缓存
        function processItems(items: ContentNavigationItem[]): ContentNavigationItem[] {
          return items.map((item) => {
            if (!item.children) {
              return undefined
            }

            const filtered = { ...item }
            item.children = item.children.filter(v => !v.page)
            if (item.children.some(child => child.children)) {
              filtered.children = processItems(item.children)
            }
            else {
              // filtered._children = item.children
              delete filtered.children
            }
            const children = filtered.children?.map(getChildren)
            if (children && children.length > 0) {
              filtered.nav = children
            }
            pathTitleMapStore.value[item.path] = item
            return filtered
          }).filter(v => v !== undefined)
        }

        navigationStore.value = processItems(articleNavigation)
        // console.log(JSON.stringify({ articleNavigation, navigationStore: navigationStore.value }, null, 2))
        return navigationStore.value
      },
    },
  )
  return data.value
}

export async function useNavigation() {
  const navigationStore = useNavigationStore()
  if (!navigationStore.value) {
    await initNavigationData()
  }
  return navigationStore.value
}

export async function useNavigationPathToTitle() {
  const navigationStore = useNavigationStore()
  const pathTitleMapStore = usePathTitleMapStore()
  if (!navigationStore.value) {
    await initNavigationData()
  }
  return pathTitleMapStore.value
}
