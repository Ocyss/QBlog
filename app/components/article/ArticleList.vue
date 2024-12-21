<script setup lang="ts">
import type { ArticleItem } from '~/types/article'

withDefaults(defineProps<{
  isExpand?: boolean
}>(), {
  isExpand: true,
})

const articleListRef = useTemplateRef('articleListRef')
const { width: articleListRefWidth } = useElementSize(articleListRef)
const path = defineModel<string>('path')

const navigationPathToTitle = await useNavigationPathToTitle()

const { data: articles } = await useAsyncData(
  'articles',
  () => {
    const query = queryCollection('article')
      .andWhere(
        (query) => {
          query = query
            .where('extension', '=', 'md')
            .where('published', '=', 1)
          if (path.value)
            query = query.where('path', 'LIKE', `${path.value}%`)
          return query
        },
      )
      .order('createdAt', 'DESC')
    return query.all()
  },
  {
    immediate: true,
    deep: false,
    server: true,
    watch: [path],
    transform: (articles) => {
      return articles.map((article) => {
        const paths = article.path.split('/').slice(2, -1)
        const categories = paths.map((_, index) => {
          const pathSegment = `/article/${paths.slice(0, index + 1).join('/')}`
          return navigationPathToTitle[pathSegment]?.title
        })
        const category = categories.join(' • ')
        let description = article.description

        // @ts-expect-error body.value exists
        const articleBody: Array<any> = article.body.value
        if (!description && articleBody && Array.isArray(articleBody)) {
          description = ''
          for (const child of articleBody) {
            if (Array.isArray(child) && child.length >= 3 && typeof child[2] === 'string') {
              description += child[2]
            }
            if (description.length > 100)
              break
          }
        }

        return { ...article, category, description } as ArticleItem
      })
    },
  },
)
</script>

<template>
  <div ref="articleListRef" class="p-2">
    <div class="flex items-center justify-between mb-2">
      <ArticleListFilter
        v-model:path="path"
        :is-large="articleListRefWidth > 500"
      />
      <a v-if="isExpand" :href="path ?? '/article'">
        <UIcon name="i-heroicons-arrow-right" />
      </a>
    </div>
    <div class="space-y-3 mt-5 min-h-[70vh]">
      <template v-if="articles && articles.length > 0">
        <a
          v-for="article in articles"
          :key="article.id"
          :href="article.path"
          class="block"
        >
          <article
            class="group flex items-center gap-4 p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div class="flex-shrink-0 size-20 @lg:size-32 rounded-xl overflow-hidden">
              <img
                :src="article.image"
                :alt="article.title"
                class="size-full object-cover"
              >
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                <span>
                  <UIcon name="i-mingcute:folders-fill" class="size-3" />
                  {{ article.category }}
                </span>
                <span>
                  <UIcon name="i-heroicons-calendar" class="size-3" />
                  {{ article.createdAt }}
                </span>
              </div>
              <div class="text-sm @lg:text-lg font-medium line-clamp-1 mb-1.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors dark:text-gray-200">
                {{ article.title }}
              </div>
              <div class="text-sm @lg:text-base text-gray-500 dark:text-gray-400 line-clamp-2">
                {{ article.description ?? article.body }}
              </div>
            </div>

          </article>
        </a>
      </template>

      <div v-else class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <UIcon name="i-lucide-file-x" class="size-16 mb-4 opacity-50" />
        <p class="text-lg font-medium">
          暂无文章
        </p>
        <p class="text-sm mt-2">
          这里还没有任何内容，请稍后再来看看吧
        </p>
      </div>
    </div>
  </div>
</template>
