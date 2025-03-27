<script setup lang="ts">
const layoutProps: {
  ui?: {
    root: string
    main: string
  }
} = useAttrs()

const mainContentEl = useTemplateRef('mainContent')
provide(mainContentKey, mainContentEl)

const { lenis } = useLenis({ wrapper: mainContentEl })
provide(mainContentLenisKey, lenis)

defineExpose({
  lenis,
  mainContentEl,
})

onMounted(() => {
  const temp = window.lenis || []
  temp.push(lenis)
  window.lenis = temp
})
</script>

<template>
  <div class="flex flex-col h-screen" :class="layoutProps.ui?.root">
    <slot name="header">
      <AppHeader />
    </slot>
    <div ref="mainContent" class="overflow-y-auto scrollbar-thin" :class="layoutProps.ui?.main">
      <slot data-lenis-prevent />
      <slot name="footer">
        <AppFooter />
      </slot>
    </div>
  </div>
</template>
