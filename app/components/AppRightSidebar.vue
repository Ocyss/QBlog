<script setup lang="ts">
const lenis = inject(mainContentLenisKey)

const sidebar = templateRef('sidebar')
const sidebarIsVisible = useElementVisibility(sidebar)

const contentStyle = computed(() => ({
  minHeight: `calc(var(--spacing) * 18)`,
  height: sidebarIsVisible.value ? `calc(100vh - 2rem - ${lenis?.value?.status?.scroll ?? 0}px)` : '0px',
}))
</script>

<template>
  <div
    ref="sidebar"
    class="z-50 self-start relative -top-3 ml-4 w-[480px] h-[calc(100vh-2rem)]"
    :style="contentStyle"
  >
    <div
      class="bg-(--ui-bg-elevated) w-full h-full relative overflow-hidden rounded-[30px] origin-top-right transition-shadow
    "
    >
      <div
        class="w-full h-full transform translate-y-0 scale-100"
      >
        <div class="h-full flex flex-col">
          <div class="h-18 flex items-center">
            <SearchBar class="px-3" />
          </div>

          <div class="flex-1 overflow-y-auto scrollbar-none px-3">
            <ArticleList />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
