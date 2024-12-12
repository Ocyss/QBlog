<script setup>
defineProps({
  title: {
    type: String,
    default: 'Articles',
  },
  articles: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="p-2">
    <div class="flex items-center justify-between mb-2">
      <h2 class="font-bold">
        {{ title }}
      </h2>
    </div>

    <div class="space-y-3">
      <article
        v-for="article in articles"
        :key="article.id"
        class="group flex items-center gap-4 p-2 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
            <span>{{ article.category }}</span>
            <span>•</span>
            <span>{{ article.timeAgo }}</span>
          </div>
          <h3 class="text-sm font-medium line-clamp-2 group-hover:text-purple-600 transition-colors">
            {{ article.title }}
          </h3>
        </div>
        <div class="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden">
          <img
            :src="article.image"
            :alt="article.title"
            class="w-full h-full object-cover"
          >
        </div>
      </article>
    </div>
  </div>
</template>
