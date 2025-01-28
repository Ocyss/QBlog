<script setup lang="ts">
const slug = useRoute().params.slug

const slugStr = ref((!slug || typeof slug === 'string' ? slug : slug.join('/')) || '')
const slugPath = computed(() => `/article/${slugStr.value}`)

const navigationPathToTitle = await useNavigationPathToTitle()
const isList = slugStr.value === '' || !!navigationPathToTitle[slugPath.value]

const { data: page } = await useAsyncData(`article-${slugStr.value}`, () => {
  return queryCollection('article').path(slugPath.value).first()
})

function handleUpdatePath(path: string) {
  if (path === slugStr.value)
    return
  const slug = path.split('/').filter(item => item && item !== 'article') || undefined

  // console.log('handleUpdatePath', { slugPath: slugPath.value, path, slug, slugStr })
  navigateTo({
    params: {
      slug,
    },
    replace: true,
  })
  slugStr.value = path
}

const titleShow = ref(true)
const layoutEl = ref()

function scrollToTop() {
  // console.log('scrollToTop', layoutEl.value, layoutEl.value?.layoutRef?.lenis?.instance)
  layoutEl.value?.layoutRef?.lenis?.instance?.scrollTo(0)
}

useSeoMeta({
  title: page?.value?.title,
})

definePageMeta({
  layout: false,
})
</script>

<template>
  <div>
    <NuxtLayout ref="layoutEl" name="default">
      <template #header>
        <AppHeader>
          <template #left>
            <div class="relative flex items-center h-full">
              <div
                class="header-nav"
                :class="{ 'header-nav-hide': !titleShow, 'pointer-events-none': !titleShow }"
              >
                <NavigationHeader />
              </div>
              <div
                class="header-title absolute whitespace-nowrap text-xl font-bold select-none z-0"
                :class="{ 'header-title-hide': titleShow, 'cursor-pointer': !titleShow }"
                @click="scrollToTop"
              >
                {{ page?.title }}
              </div>
            </div>
          </template>
        </AppHeader>
      </template>
      <div v-if="isList" class="my-8 w-auto lg:w-5/6 max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <ArticleList :path="slugPath" :is-expand="false" @update:path="handleUpdatePath" />
      </div>
      <ArticlePage v-else-if="page" v-model:title-show="titleShow" :page="page" />
      <NotFound v-else />
    </NuxtLayout>
  </div>
</template>

<style scoped>
.header-nav {
  animation: fadeIn 0.3s ease-out forwards;
}

.header-nav-hide {
  animation: fadeOut 0.3s ease-out forwards;
}

.header-title {
  animation: slideInUp 0.3s ease-out forwards;
}

.header-title-hide {
  animation: slideOutDown 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideOutDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(16px);
  }
}
</style>
