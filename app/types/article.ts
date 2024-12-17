import type { ArticleCollectionItem, ContentNavigationItem } from '@nuxt/content'
import type { DropdownMenuItem } from '@nuxt/ui'

export type ArticleItem = ArticleCollectionItem & Partial<{
  category: string
  searchScoreTotal: number
}>

export type ArticleListTitleItem = DropdownMenuItem & {
  label: string
  contentPath: string
  deepNum: number
  childrens?: ArticleListTitleItem[]
  activeChildren?: ArticleListTitleItem
}

export type ArticleNavItem = (ContentNavigationItem & { nav?: DropdownMenuItem[], icon?: string })
