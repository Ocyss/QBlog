<script setup lang="ts">
import type { ArticleCollectionItem } from '@nuxt/content'

defineProps<{
  page: ArticleCollectionItem
}>()
const appConfig = useRuntimeConfig()
</script>

<template>
  <div class="not-prose mt-8 md:mt-12 -mx-7 md:-mx-11">
    <div class="relative overflow-hidden bg-(--ui-bg-accented) p-6">
      <!-- 主要内容 -->
      <div class="space-y-6 relative z-10">
        <!-- 文章信息 -->
        <div>
          <h4 class="font-medium text-base text-(--ui-text)">
            {{ page.title }}
          </h4>
          <ULink
            :to="appConfig.site.url + page.path"
            target="_blank"
            class="text-sm text-(--ui-text-muted) hover:text-(--ui-text)"
          >
            {{ appConfig.site.url }}{{ page.path }}
          </ULink>
        </div>

        <!-- 许可信息 -->
        <div class="flex items-center gap-3">
          <UIcon
            name="i-simple-icons:creativecommons"
            class="size-5 text-(--ui-text-muted)"
          />
          <div class="flex-1">
            <p class="text-sm text-(--ui-text) mb-1">
              本文采用
              <ULink
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
                target="_blank"
                class="font-medium hover:text-(--ui-primary)"
              >
                CC BY-NC-SA 4.0
              </ULink>
              许可协议
            </p>
            <p class="text-sm text-(--ui-text)">
              转载请注明作者
              <ULink
                class="font-medium text-(--ui-text-muted)"
                :href="appConfig.site.homepage"
                target="_blank"
              >
                {{ appConfig.site.longAuthor }}
              </ULink>
              及本文链接，禁止用于商业目的
            </p>
          </div>
        </div>
      </div>

      <!-- 背景装饰 -->
      <div class="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none">
        <UIcon
          name="i-simple-icons:creativecommons"
          class="size-50 transform rotate-12"
        />
      </div>
    </div>
  </div>
</template>
