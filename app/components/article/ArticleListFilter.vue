<script setup lang="tsx">
import type { ArticleListTitleItem, ArticleNavItem } from '~/types/article'
import { UButton } from '#components'

withDefaults(defineProps<{
  isLarge?: boolean
}>(), {
  isLarge: true,
})

const path = defineModel<string>('path')

const navigation = await useNavigation()

const titleRoot = shallowRef<ArticleListTitleItem>({
  label: '__root__',
  contentPath: '',
  deepNum: -1,
})
const titleActive = shallowRef<ArticleListTitleItem>()
const titleActiveMaps: Record<number | string, ArticleListTitleItem> = {}
const titleItems = titleItemsInit()

function titleItemHelper(data: ArticleListTitleItem, parent: ArticleListTitleItem): ArticleListTitleItem {
  data.color = 'neutral'
  data.onSelect = (e: Event) => {
    // 清除同级状态, 并进行回溯更新
    const prefItem = titleActiveMaps[data.deepNum]
    if (prefItem === data) {
      // 当点击的是当前路径时，返回上一级
      if (e.type !== '_back_' && data.deepNum > 0) {
        titleActive.value = parent
        path.value = parent.contentPath
        data.color = 'neutral'
        parent.activeChildren = undefined
      }
      return
    }
    else if (prefItem) {
      prefItem.color = 'neutral'
    }
    titleActiveMaps[data.deepNum] = data
    data.color = 'primary'
    parent.activeChildren = data
    parent.onSelect?.(new Event('_back_'))
    if (e.type !== '_back_') {
      titleActive.value = data
      path.value = data.contentPath
    }
  }
  titleActiveMaps[data.contentPath] = data
  return data
}

function titleItemGenDfs(item: ArticleNavItem, parent: ArticleListTitleItem): ArticleListTitleItem {
  const selectItem = titleItemHelper(toReactive({
    deepNum: parent.deepNum + 1,
    contentPath: item.path,
    label: item.title,
    icon: item.icon ?? 'i-lucide-app-window',
  }), parent)

  if (item.children) {
    // selectItem.contentPath = `_${item.path}`
    const childrens = item.children?.map(child => titleItemGenDfs(child, selectItem))
    selectItem.children = [
      [
        titleItemHelper(toReactive({
          deepNum: selectItem.deepNum + 1,
          contentPath: item.path,
          label: item.title,
          icon: item.icon ?? 'i-lucide-app-window',
        }), selectItem),
      ],
      childrens,
    ]
    selectItem.childrens = childrens
  }
  return selectItem
}

function titleItemsInit() {
  const defaultItems = [
    {
      contentPath: '',
      label: '最新',
      icon: 'i-material-symbols:add-chart-outline',
      deepNum: 0,
    },
  // {
  //   contentPath: 'hot',
  //   label: '最热',
  //   icon: 'i-tabler:chart-bar-popular',
  // },
  ].map(item => titleItemHelper(item, titleRoot.value))

  const items: ArticleListTitleItem[][] = [
    defaultItems,
  ]

  titleRoot.value.childrens = [...defaultItems]

  const navItems = navigation?.map(item => titleItemGenDfs(item, titleRoot.value))
  if (navItems && navItems.length > 0) {
    items.push(navItems)
    titleRoot.value.childrens.push(...navItems)
  }
  return items
}

if (path.value && titleActiveMaps[path.value]) {
  titleActiveMaps[path.value]?.onSelect?.(new Event('_init_'))
}
else {
  titleRoot.value?.childrens?.[0]?.onSelect?.(new Event('_init_'))
}

function SecondaryTitle({ item }: { item: ArticleListTitleItem }) {
  return (
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        {item.childrens?.map(item => (
          <UButton
            class="cursor-pointer"
            icon={item.icon}
            color={item.color}
            variant="outline"
            size={item.deepNum <= 1 ? 'md' : 'sm'}
            onClick={item.onSelect}
            data-deep={item.deepNum}
          >
            {item.label}
          </UButton>
        ))}
      </div>
      {item.activeChildren && <SecondaryTitle item={item.activeChildren} />}
    </div>
  )
}

// console.log(titleRoot.value)
</script>

<template>
  <div>
    <div v-if="isLarge" class="space-x-4">
      <UButton
        v-for="item in titleRoot.childrens"
        :key="item.contentPath"
        class="cursor-pointer"
        :icon="item.icon"
        :color="item.color"
        variant="outline"
        size="lg"
        @click="item.onSelect"
      >
        {{ item.label }}
      </UButton>
      <SecondaryTitle v-if="titleRoot.activeChildren" class="mt-3" :item="titleRoot.activeChildren" />
    </div>
    <UDropdownMenu
      v-else
      class="font-bold dark:text-gray-200
        flex items-center gap-1 cursor-pointer group
        hover:text-purple-600 dark:hover:text-purple-400 transition-colors
        data-[state=open]:text-purple-600 dark:data-[state=open]:text-purple-400"
      :items="titleItems"
      arrow
    >
      <div>
        {{ titleActive?.label ?? '' }}
        <UIcon name="i-solar:alt-arrow-down-linear" class="group-data-[state=open]:rotate-180 transition-transform duration-300" />
      </div>
    </UDropdownMenu>
  </div>
</template>
