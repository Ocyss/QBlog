<script setup lang="ts">
const slug = useRoute().params.slug

const slugStr = (!slug || typeof slug === 'string' ? slug : slug.join('/')) || ''
const slugPath = ref(`/article/${slugStr}`)

const navigationPathToTitle = await useNavigationPathToTitle()
const isList = slugStr === '' || !!navigationPathToTitle[slugPath.value]

console.log('slugPath', slugPath.value, isList)

const { data: page } = await useAsyncData(`article-${slugStr}`, () => {
  return queryCollection('article').path(slugPath.value).first()
})

function handleUpdatePath(path: string) {
  if (path === slugPath.value)
    return
  const slug = path.split('/').filter(item => item && item !== 'article') || undefined
  // console.log('handleUpdatePath', { slugPath: slugPath.value, path, slug, slugStr })
  navigateTo({
    params: {
      slug,
    },
    replace: true,
  })
  slugPath.value = path
}

useSeoMeta({
  title: page?.value?.title,
})
</script>

<template>
  <div v-if="isList" class="my-8 w-auto lg:w-5/6 max-w-7xl mx-auto px-4 py-8 lg:px-8">
    <ArticleList :path="slugPath" :is-expand="false" @update:path="handleUpdatePath" />
  </div>
  <ArticlePage v-else-if="page" :page="page" />
  <div v-else>
    404
  </div>
</template>

<style scoped>

</style>
