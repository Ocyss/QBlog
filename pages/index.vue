<script setup>
// 示例文章数据
// 添加必要的 VueUse 函数
import { useElementByPoint, useScroll } from '@vueuse/core'

const recommendedArticles = [
  {
    id: 1,
    category: 'Blockchain News',
    timeAgo: '4 hours ago',
    title: 'US-Approved Spot Bitcoin ETFs Could Surpass Entire $50 Billion Crypto ETP Market: BitMEX',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=rec1',
  },
  {
    id: 2,
    category: 'Blockchain News',
    timeAgo: '4 hours ago',
    title: 'Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were Positive in 2023',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=rec2',
  },
  {
    id: 3,
    category: 'Blockchain News',
    timeAgo: '4 hours ago',
    title: 'STX Price Prediction: After 126% Price Jump in December, What\'s in Store for 2024?',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=rec3',
  },
]

const rightContentEl = ref(null)
const { width: rightContentWidth } = useElementSize(rightContentEl)

const pages = [
  {
    id: 1,
    title: '👋 Hi there',
    subtitle: 'I\'m Ocyss.',
    description: '生于04，一只普通且业余的编程爱好者。愿为理想执着行，前路漫漫自铸金。',
    tags: ['Go', 'Rust', 'Vue', 'Nuxt', 'TypeScript'],
    showAvatar: true,
  },
  {
    id: 2,
    title: '🎯 About Me',
    description: '热爱编程，专注于全栈开发。喜欢探索新技术，追求代码的优雅与效率。',
  },
  {
    id: 3,
    title: '🛠️ Skills',
    description: '技术栈介绍...',
  },
  {
    id: 4,
    title: '🏆 Projects',
    description: '项目展示...',
  },
  {
    id: 5,
    title: '📚 Experience',
    description: '经历分享...',
  },
  {
    id: 6,
    title: '📫 Contact',
    description: '联系方式...',
  },
]

const currentPage = ref(0)
const isExpanded = computed(() => currentPage.value === 0)
const isTransitioning = ref(false)

const pagesContainer = ref(null)
const pageRefs = ref([])

const { y: scrollY } = useScroll(pagesContainer)

function toggleExpand() {
  if (!isExpanded.value) {
    isTransitioning.value = true
    scrollToPage(0)
    setTimeout(() => {
      isTransitioning.value = false
    }, 500)
  }
}

function scrollToPage(index) {
  pageRefs.value[index]?.scrollIntoView({ behavior: 'smooth' })
}

watchEffect(() => {
  if (!pagesContainer.value)
    return

  const containerHeight = pagesContainer.value.clientHeight
  const currentIndex = Math.round(scrollY.value / containerHeight)

  if (currentIndex >= 0 && currentIndex < pages.length) {
    currentPage.value = currentIndex
  }
})

onUnmounted(() => {
  pageRefs.value = []
})
</script>

<template>
  <div class="h-screen overflow-hidden">
    <!-- 左侧内容区域 -->
    <div class="w-full h-full">
      <AppHeader class="sticky top-0 z-50">
        <template #right>
          <div
            ref="rightContentEl"
            class="right-content fixed right-4 top-0"
            :class="[
              isExpanded
                ? 'py-4 w-[480px] h-screen'
                : 'size-10 mt-4',
            ]"
          >
            <div
              class="bg-white/90 w-full h-full relative overflow-hidden rounded-[30px]"
              :class="[
                !isExpanded ? 'u-float-btn cursor-pointer' : '',
                isTransitioning ? 'pointer-events-none' : '',
              ]"
              @click="!isExpanded && toggleExpand()"
            >
              <div
                class="w-full h-full transform"
                :class="[
                  !isExpanded
                    ? 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                    : 'opacity-100 translate-y-0 scale-100',
                ]"
              >
                <div class="h-full flex flex-col">
                  <SearchBar class="px-3 py-4" />
                  <div class="flex-1 overflow-y-auto px-3">
                    <ArticleList
                      title="最新"
                      :articles="recommendedArticles"
                    />
                  </div>
                </div>
              </div>
              <div
                class="absolute inset-0 flex items-center justify-center transform"
                :class="[
                  !isExpanded
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-90 pointer-events-none',
                ]"
              >
                <UIcon name="i-line-md:arrow-align-top" class="text-2xl" />
              </div>
            </div>
          </div>
        </template>
      </AppHeader>

      <div
        ref="pagesContainer"
        class="scrollbar-hidden h-[calc(100vh-4rem)] overflow-y-auto snap-y snap-mandatory"
      >
        <!-- 首页 -->
        <div
          :ref="(el) => { pageRefs[0] = el }"
          class="snap-page min-h-full snap-start px-8 py-6 flex items-center justify-center"
          :style="{ width: `calc(100% - ${isExpanded ? rightContentWidth : 0}px)` }"
        >
          <div class="p-8">
            <div class="flex items-start gap-8">
              <div class="flex-1">
                <h1 class="text-3xl font-bold mb-4 bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {{ pages[0].title }} {{ pages[0].subtitle }}
                </h1>
                <p class="text-gray-600 mb-4">
                  {{ pages[0].description }}
                </p>
                <div class="flex flex-wrap gap-2 mb-4">
                  <span
                    v-for="tag in pages[0].tags"
                    :key="tag"
                    class="px-2 py-1 text-sm rounded-full"
                    :class="{
                      'bg-blue-100 text-blue-700': tag === 'Go',
                      'bg-orange-100 text-orange-700': tag === 'Rust',
                      'bg-green-100 text-green-700': tag === 'Vue',
                      'bg-purple-100 text-purple-700': tag === 'Nuxt',
                      'bg-cyan-100 text-cyan-700': tag === 'TypeScript',
                    }"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="w-48 h-48 rounded-full relative">
                <div class="relative">
                  <img
                    src="~/assets/img/avatar.jpg"
                    alt="avatar glow"
                    class="absolute w-full h-full object-cover rounded-full blur-xl scale-120 opacity-50"
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

        <!-- 其他页面 -->
        <div
          v-for="(page, index) in pages.slice(1)"
          :key="page.id"
          :ref="(el) => { pageRefs[index + 1] = el }"
          class="snap-page min-h-full snap-start px-8 py-6 flex items-center w-full"
        >
          <div class="p-8 w-full">
            <div class="max-w-3xl mx-auto">
              <h2 class="text-4xl font-bold mb-6 bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {{ page.title }}
              </h2>
              <p class="text-xl text-gray-600">
                {{ page.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航点 -->
    <div class="fixed left-4 top-1/2 -translate-y-1/2 space-y-2 z-40">
      <div
        v-for="(_, index) in pages"
        :key="index"
        class="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer"
        :class="[
          currentPage === index
            ? 'bg-gray-800 scale-150'
            : 'bg-gray-300 hover:bg-gray-400',
        ]"
        @click="scrollToPage(index)"
      />
    </div>
  </div>
</template>

<style scoped>
.right-content {
  transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
}

.right-content > div {
  transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.right-content > div > div {
  transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.scrollbar-hidden {
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

.snap-page {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
