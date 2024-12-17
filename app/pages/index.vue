import { MDCRenderer } from '../../.nuxt/content/components';
<script setup lang="ts">
definePageMeta({
  layout: false,
})

const rightContentEl = useTemplateRef('rightContentEl')
const { width: rightContentWidth } = useElementSize(rightContentEl)

const { data: tempAboutData } = await useAsyncData('tempAboutData', () => {
  return queryCollection('other').path('/other/tempabout').first()
})
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <template #header-right>
        <AppRightSidebar ref="rightContentEl" />
      </template>
      <main>
        <div class="h-screen overflow-hidden">
          <!-- 首页 -->
          <div
            class="min-h-full snap-start px-8 py-6 flex items-center justify-center"
            :style="{ width: `calc(100% - ${rightContentWidth}px)` }"
          >
            <div class="p-8">
              <div class="flex items-start gap-8">
                <div class="flex-1">
                  <h1 class="text-3xl font-bold mb-4 bg-gradient-to-br from-gray-900 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                    👋 Hi there I'm Ocyss.
                  </h1>
                  <p class="text-gray-600 dark:text-gray-400 mb-4">
                    一只普通且业余的编程爱好者。
                  </p>
                  <div class="flex flex-wrap gap-2 mb-4">
                    <span class="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Go</span>
                    <span class="px-2 py-1 text-sm rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">Rust</span>
                    <span class="px-2 py-1 text-sm rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Vue</span>
                    <span class="px-2 py-1 text-sm rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">Nuxt</span>
                    <span class="px-2 py-1 text-sm rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">TypeScript</span>
                  </div>
                </div>
                <div class="w-48 h-48 rounded-full relative">
                  <div class="relative">
                    <img
                      src="~/assets/img/avatar.jpg"
                      alt="avatar glow"
                      class="absolute w-full h-full object-cover rounded-full blur-xl scale-120 opacity-50 dark:opacity-30"
                    >
                    <img
                      src="~/assets/img/avatar.jpg"
                      alt="avatar"
                      class="relative w-full h-full object-cover rounded-full"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class=" flex justify-center items-center">
          <ContentRenderer v-if="tempAboutData" class="prose prose-lg dark:prose-invert w-[80vw] max-w-[75ch]" :value="tempAboutData" />
        </div>
      </main>
    </NuxtLayout>
  </div>
</template>
