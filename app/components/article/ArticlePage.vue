<script setup lang="ts">
import type { ArticleCollectionItem } from '@nuxt/content'
import type Lenis from 'lenis'

defineProps<{
  page: ArticleCollectionItem
}>()

const contentRendererEl = useTemplateRef('contentRendererEl')

const lenis = inject(mainContentLenisKey)

const readingProgress = computed(() => {
  return (lenis?.value.status?.progress ?? 0) * 100
})

const showComments = ref(true)
</script>

<template>
  <main class="min-h-screen bg-[var(--ui-bg)]">
    <UProgress
      class="fixed top-0 left-0 right-0 z-50"
      :model-value="readingProgress"
      color="primary"
      size="xs"
    />
    <div class="px-4 py-8 lg:px-8 ">
      <div class="mx-auto max-w-7xl">
        <div class="lg:flex lg:gap-8">
          <!-- 左侧目录 -->
          <div
            v-if="page.body.toc?.links"
            class="sticky top-4 hidden lg:block w-64 max-h-[calc(100vh-2rem)] h-fit overflow-y-auto bg-[var(--ui-bg-muted)] p-4"
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

          <div class="flex-1 bg-[var(--ui-bg-elevated)] py-8 rounded-lg">
            <article class="prose prose-lg dark:prose-invert max-w-3xl mx-auto">
              <!-- 文章头部信息 -->
              <header class="mb-8">
                <h1 class="text-4xl font-bold mb-4">
                  {{ page.title }}
                </h1>

                <div class="flex flex-wrap items-center *:flex *:items-center *:justify-center gap-4 text-sm text-[var(--ui-text-muted)]">
                  <div v-if="page.createdAt">
                    <UIcon name="i-heroicons-calendar" class="mr-1" />
                    发布于
                    {{ page.createdAt }}
                  </div>
                  <div v-if="page.updatedAt">
                    <UIcon name="i-heroicons:calendar-date-range" class="mr-1" />
                    更新于
                    {{ page.updatedAt }}
                  </div>
                  <div v-if="page.tags">
                    <UIcon name="i-ant-design:tags-filled" class="mr-1" />
                    <span
                      v-for="tag in page.tags"
                      :key="tag"
                    >
                      <a
                        :href="`/article/tags/${tag}`"
                        class="no-underline hover:underline not-prose"
                      >
                        {{ tag }}
                      </a>,&nbsp;
                    </span>
                  </div>
                </div>
              </header>

              <!-- 文章内容 -->
              <ContentRenderer
                v-if="page && page.body"
                ref="contentRendererEl"
                :value="page"
              />
            </article>

            <!-- 文章底部区域 -->
            <div class="max-w-3xl mx-auto mt-16 border-t border-[var(--ui-border)] pt-8">
              <!-- 文章导航 -->
              <nav class="flex justify-between mb-16">
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-arrow-left"
                >
                  上一篇
                </UButton>
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-arrow-right"
                  icon-right
                >
                  下一篇
                </UButton>
              </nav>

              <!-- 评论区预留位置 -->
              <div class="comments-section">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-semibold">
                    评论
                  </h3>
                  <UButton
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
        </div>
      </div>
    </div>
  </main>
</template>
