<script setup lang="ts">
import type { ArticleItem } from '~/types/article'

defineProps<{ article: ArticleItem }>()
</script>

<template>
  <a :href="article.path" class="block">
    <article class="group flex items-center gap-4 p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer">
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
