<script setup lang="ts">
import type { ArticleItem } from '~/types/article'
import { search } from 'text-search-engine'

const searchResults = ref<ArticleItem[]>([])

const searchQuery = useRouteQuery<string>('q', '')

const { data: searchData } = await useAsyncData('search-article-data', () => queryCollectionSearchSections('article', {
  ignoredTags: ['code', 'pre', 'style'],
}))

async function handleSearch(query: string) {
  if (query) {
    searchQuery.value = query
  }
  if (!searchData.value)
    return
  searchResults.value = []

  const groupedResults = new Map<string, ArticleItem & { temp: { score: number, content: string }[] }>()

  await Promise.all(
    searchData.value.map(async (item) => {
      const score = search(item.content, query) ?? []

      const scoretitle1 = search(item.titles.join(''), query) ?? []
      const scoreTitle2 = search(item.title, query) ?? []

      const path = item.id.split('#')[0]
      if (
        !path
        || (score.length + scoretitle1.length + scoreTitle2.length) === 0
      ) {
        return
      }
      let r = groupedResults.get(path)
      if (!r) {
        const doc = await queryCollection('article').path(path).first()
        if (!doc)
          return
        r = {
          ...doc,
          searchScoreTotal: 0,
          temp: [],
        }
        groupedResults.set(path, r)
      }
      /* 计算搜索得分
    1. score.length 越多越模糊，得分就低
    2. score[i][1] - score[i][0] 越大就关联性越强，得分就高
    TODO: 时间越近，得分越高
    */
      const addScore = score.reduce((acc, [start, end]) => {
        const length = end - start
        return acc + length * 3
      }, 0) + (
        score.length === 0
          ? 0
          : (20 - score.length)
      ) + (scoretitle1.length * 30 + scoreTitle2.length * 20)

      r.searchScoreTotal = (r.searchScoreTotal ?? 0) + addScore
      r.temp.push({
        score: addScore,
        content: item.content,
      })
    }),
  )

  searchResults.value = Array.from(groupedResults.values())
    .sort((a, b) => (b.searchScoreTotal ?? -1) - (a.searchScoreTotal ?? -1))
    .map(item => ({
      ...item,
      temp: undefined,
      description: item.temp.sort((a, b) => b.score - a.score).map(i => i.content).join('\n'),
    } as ArticleItem))

  // console.log(searchResults.value, searchData)
}

if (searchQuery.value) {
  handleSearch(searchQuery.value)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto mb-8">
      <SearchBar v-model="searchQuery" :event="true" @search="handleSearch" />
    </div>

    <div class="space-y-4">
      <h2 class="text-xl font-bold mb-4">
        搜索结果
      </h2>
      <div class="space-y-4">
        <template v-if="searchResults.length">
          <ArticleItem
            v-for="article in searchResults"
            :key="article.id"
            :article="article"
          />
        </template>

        <div v-else class="text-center text-gray-500 dark:text-gray-400">
          没有找到相关内容
        </div>
      </div>
    </div>
  </div>
</template>
