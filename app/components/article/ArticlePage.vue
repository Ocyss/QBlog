<script setup lang="ts">
import type { ArticleCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: ArticleCollectionItem
}>()

const titleEl = useTemplateRef('titleEl')
const titleShow = defineModel('titleShow', {
  type: Boolean,
  default: false,
})

useIntersectionObserver(
  titleEl,
  ([entry]) => {
    titleShow.value = entry?.isIntersecting || false
  },
)

const { addImage } = useImagePreview()

const preview = props.page.image && addImage({ image: { url: props.page.image, alt: props.page.title } })

const contentRendererEl = useTemplateRef('contentRendererEl')

const navigationPathToTitle = await useNavigationPathToTitle()

const lenis = inject(mainContentLenisKey)

const readingProgress = computed(() => {
  return (lenis?.value.status?.progress ?? 0) * 100
})

const showComments = ref(false)

const items = computed(() => {
  const paths = props.page.path.split('/').slice(2, -1)
  return paths.map((_, index) => {
    const pathSegment = `/article/${paths.slice(0, index + 1).join('/')}`
    const nav = navigationPathToTitle[pathSegment]
    return {
      label: nav?.title,
      to: nav?.path,
      // icon: nav?.icon,
    }
  })
})

const { data: surroundData } = await useAsyncData('article-surround', () => {
  return queryCollectionItemSurroundings('article', props.page.path, {
    before: 1,
    after: 1,
    fields: ['title', 'description'],
  })
    .where('published', '=', 1)
    .order('createdAt', 'DESC')
})
</script>

<template>
  <main class="min-h-screen bg-[var(--ui-bg)]" data-lenis-prevent>
    <UProgress
      class="fixed top-0 left-0 right-0 z-50"
      :model-value="readingProgress"
      color="primary"
      size="xs"
    />
    <div
      class="mx-auto w-full lg:max-w-[74rem] md:my-1 flex justify-between pt-10  py-8 rounded-lg relative"
    >
      <div class="p-3 min-w-0 flex-1 mx-2 w-full md:w-[calc(100%_-_17rem)] bg-[var(--ui-bg-elevated)]">
        <article
          class="prose max-w-none border-highlight p-4 md:p-8 !pb-0 dark:prose-invert"
        >
          <!-- 文章头部信息 -->
          <header class="mb-8 flex flex-row gap-4">
            <div class="flex-1">
              <UBreadcrumb
                class="bg-[var(--ui-bg-elevated)] not-prose mb-2" :items="items" :ui="{
                  list: 'm-0 p-0 h-fit',
                }"
              >
                <template #separator>
                  <span class="mx-0.5 text-[var(--ui-text-muted)]">/</span>
                </template>
              </UBreadcrumb>
              <h1 ref="titleEl" class="text-3xl font-bold mb-4">
                {{ page.title }}
              </h1>

              <div
                class="flex flex-wrap items-center *:flex
            *:items-center *:justify-center gap-4 text-sm text-[var(--ui-text-muted)]
             *:bg-white *:dark:bg-gray-700 *:px-1.5 *:py-1 *:rounded-md"
              >
                <UPopover mode="hover">
                  <div class="cursor-help">
                    <UIcon name="i-heroicons:calendar-date-range" size="xl" class="mr-1" />
                    {{ page.updatedAt || page.createdAt }}
                  </div>

                  <template #content>
                    <div class="p-2 flex flex-col gap-2 bg-white dark:bg-gray-700 rounded-md  ">
                      <div v-if="page.createdAt">
                        <span class="font-medium">发布于：</span>{{ page.createdAt }}
                      </div>
                      <div v-if="page.updatedAt">
                        <span class="font-medium">更新于：</span>{{ page.updatedAt }}
                      </div>
                    </div>
                  </template>
                </UPopover>

                <div v-if="page.tags">
                  <UIcon name="i-ant-design:tags-filled" size="md" class="mr-1" />
                  <span
                    v-for="(tag, index) in page.tags"
                    :key="tag"
                  >
                    <a
                      :href="true ? 'javascript:void(0)' : `/article/tags/${tag}`"
                      class="no-underline hover:underline not-prose"
                    >
                      {{ tag }}
                    </a>
                    <span v-if="index < page.tags.length - 1">
                      ,&nbsp;
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div v-if="page.image && preview" class="w-1/4 not-prose">
              <img
                :src="page.image"
                alt="avatar"
                class="w-full h-full object-cover cursor-zoom-in"
                @click="preview"
              >
            </div>
          </header>

          <!-- 文章内容 -->
          <ContentRenderer
            v-if="page && page.body"
            ref="contentRendererEl"
            :value="page"
          />
          <!-- 版权声明 -->
          <ArticleCopyright :page="page" />
        </article>
        <!-- 文章底部区域 -->
        <div class="w-full mt-16 border-t border-[var(--ui-border)] pt-8">
          <!-- 文章导航 -->
          <nav class="flex justify-between mb-16">
            <UButton
              v-if="surroundData?.[0]"
              :to="surroundData[0].path"
              icon="i-lucide-arrow-left"
              variant="link"
              color="neutral"
              class="max-w-[45%]"
            >
              <span class="truncate">
                {{ surroundData[0].title }}
              </span>
            </UButton>
            <span v-else />
            <UButton
              v-if="surroundData?.[1]"
              :to="surroundData[1].path"
              trailing-icon="i-lucide-arrow-right"
              variant="link"
              color="neutral"
              class="max-w-[45%]"
            >
              <span class="truncate">
                {{ surroundData[1].title }}
              </span>
            </UButton>
            <span v-else />
          </nav>

          <!-- 评论区预留位置 -->
          <div class="comments-section">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold">
                评论
              </h3>
              <UButton
                class="cursor-pointer"
                color="neutral"
                variant="ghost"
                icon="i-heroicons-chat-bubble-left-right"
                @click="showComments = !showComments"
              />
            </div>

            <div v-show="showComments" class="min-h-[200px]">
              <!-- 这里将来放置评论组件 -->
              <p class="text-center text-[var(--ui-text-muted)]">
                评论功能开发中...
              </p>
            </div>
          </div>
        </div>
      </div>

      <aside class="relative hidden md:block mt-3 w-48 lg:w-64">
        <!-- 左侧目录 -->
        <div
          v-if="page.body.toc?.links"
          class="sticky top-4 w-full max-h-[calc(100vh-2rem)] h-fit overflow-y-auto bg-[var(--ui-bg-muted)] p-4"
        >
          <div class="flex items-center mb-4">
            <UIcon name="i-material-symbols:two-pager" class="mr-2 size-5" />
            <span class="text-lg font-medium">
              目录
            </span>
          </div>

          <nav>
            <ArticleToc :toc-link="page.body.toc?.links" />
          </nav>
        </div>
      </aside>
    </div>
  </main>
</template>
