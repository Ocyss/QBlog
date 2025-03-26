import { MDCRenderer } from '../../.nuxt/content/components';
<script setup lang="ts">
import { useTyped } from '~/composables/useTyped'

definePageMeta({
  layout: false,
})

const rightContentEl = useTemplateRef('rightContentEl')
const { width: rightContentWidth } = useElementSize(rightContentEl)

const typedRef = useTemplateRef('typedRef')

const { data: singlesHomeData } = await useAsyncData('singles-home', () => {
  return queryCollection('singles').path('/singles/home').first()
})

provide('content-link', false)

useTyped(typedRef, {
  sequence: '101',
  typeSpeed: 100,
})
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <template #header>
        <AppHeader>
          <template #right>
            <AppRightSidebar ref="rightContentEl" class="lg:block hidden" />
          </template>
        </AppHeader>
      </template>
      <main>
        <div class="h-screen overflow-hidden">
          <!-- 首页 -->
          <div
            class="min-h-full snap-start px-8 py-6 flex items-center justify-center"
            :style="{ width: `calc(100% - ${rightContentWidth}px)` }"
          >
            <div class="md:p-8">
              <div class="flex items-center md:items-start gap-8 flex-col-reverse md:flex-row">
                <div class="flex-1 text-center md:text-left">
                  <span ref="typedRef">
                    <h1 class="text-3xl font-bold mb-4 bg-gradient-to-br from-gray-900 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                      👋 Hi there I'm Ocyss.
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">
                      一只普通且业余的编程爱好者。
                    </p>
                  </span>
                  <div class="flex justify-center md:justify-start flex-wrap gap-2 mb-4 *:hover:scale-110 *:transition-all *:duration-300 select-none">
                    <span class="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Go</span>
                    <span class="px-2 py-1 text-sm rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">Rust</span>
                    <span class="px-2 py-1 text-sm rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Vue</span>
                    <span class="px-2 py-1 text-sm rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Nuxt</span>
                    <span class="px-2 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">Python</span>
                  </div>
                </div>
                <div class="w-48 h-48 relative group select-none">
                  <div
                    class="w-full h-full absolute inset-0 rounded-full
                  bg-gradient-to-r from-green-400 to-blue-500 opacity-75
                  blur-xl group-hover:scale-110 group-hover:rotate-180 transition-all
                  duration-500"
                  />
                  <img
                    src="~/assets/img/avatar.jpg"
                    alt="avatar"
                    class="w-full h-full relative rounded-full border-4 border-white dark:border-white/10 object-cover"
                    draggable="false"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="py-20 flex justify-center items-center bg-(--ui-bg-muted)">
          <ContentRenderer
            v-if="singlesHomeData"
            class="prose prose-lg dark:prose-invert
            text-center container mx-auto px-4 md:px-8
            lg:px-12 w-full max-w-none"
            :value="singlesHomeData"
          />
        </div>
      </main>
    </NuxtLayout>
  </div>
</template>
