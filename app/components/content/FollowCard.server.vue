<script setup lang="tsx">
interface Data {
  feed: {
    type: string
    id: string
    url: string
    title: string
    description: string
    siteUrl: string
    image: any
    errorMessage: any
    errorAt: any
    ownerUserId: any
  }
  entries: {
    title: string
    url: string
    content: string
    description: string
    guid: string
    author: any
    authorUrl: any
    authorAvatar: any
    publishedAt: string
    media: {
      url: string
      type: string
      width: number
      height: number
      blurhash?: string
    }[]
    categories: any
    attachments: any
    extra: any
    language: any
  }[]
  readCount: number
  subscriptionCount: number
}

const props = defineProps<{
  url: string
  desc?: string
  override?: Partial<Data>
}>()

const data = ref<Data>()

if (props.url) {
  data.value = undefined
  const id = props.url.split('/').at(-1)
  const { data: res } = await useAsyncData(`follow-${id}`, () => {
    if (import.meta.client) {
      return new Promise<undefined>((r) => {
        r(undefined)
      })
    }
    return $fetch<{
      code: number
      data: Data
    }>(`https://api.follow.is/feeds?id=${id}`)
  })
  // console.log(res.value, error.value)
  if (res.value?.code === 0) {
    data.value = res.value.data
  }
}

const icon = computed(() => {
  if (!data.value) {
    return ''
  }
  return `https://toolb.cn/favicon/${new URL(data.value.feed.siteUrl ?? data.value.feed.url).hostname}`
})
</script>

<template>
  <div
    v-if="data"
    :key="data.feed.title"
    class="not-prose rounded-lg text-left bg-[var(--ui-bg)] flex flex-col p-6 shadow-sm hover:scale-105 transition-transform duration-300 dark:bg-[var(--ui-bg)]"
  >
    <div
      class="mb-2 text-lg font-semibold
    text-gray-900 dark:text-whiteflex items-center gap-2 flex"
    >
      <img :src="icon" alt="avatar" class="size-5 rounded-full">
      <a
        :href="url" target="_blank" class="text-gray-900 dark:text-white
      hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
      >{{ data.feed.title }}
      </a>
      <span class="text-sm text-gray-700 dark:text-gray-400 flex items-center">
        <UIcon name="mdi-account-multiple" />
        {{ data.subscriptionCount }}
      </span>
    </div>
    <p class="mb-4 text-gray-600 dark:text-gray-400 text-sm line-clamp-3 flex-1">
      {{ desc ?? data.feed.description }}
    </p>
    <div class="space-y-3">
      <a
        v-for="(item) in data.entries.slice(0, 3)"
        :key="url + item.url"
        :href="item.url"
        target="_blank"
        class="flex gap-3 group/follow-card rounded-lg
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition-all duration-300 cursor-pointer"
      >

        <img
          v-if="item.media?.[0]?.url"
          :src="item.media[0].url"
          class="rounded w-12 h-8 object-cover transition-transform duration-300 group-hover/follow-card:scale-130"
          @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
        >

        <div class="flex-1 min-w-0 text-xs">
          <h4
            class="text-gray-600 dark:text-gray-400
          group-hover/follow-card:text-gray-900
          dark:group-hover/follow-card:text-white
           line-clamp-1 font-medium"
          >
            {{ item.title }}
          </h4>
          <p
            class="text-gray-500 dark:text-gray-500 line-clamp-1 mt-0.5
          group-hover/follow-card:text-gray-700 dark:group-hover/follow-card:text-gray-300"
          >
            {{ item.description ?? "无描述" }}
          </p>
        </div>
      </a>
    </div>
  </div>
</template>
