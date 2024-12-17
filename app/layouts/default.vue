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
</script>

<template>
  <div class="flex flex-col h-screen" :class="layoutProps.ui?.root">
    <AppHeader>
      <template #right>
        <slot name="header-right" />
      </template>
    </AppHeader>
    <div ref="mainContent" class="h-full overflow-y-auto" :class="layoutProps.ui?.main">
      <slot />
      <slot name="footer">
        <AppFooter />
      </slot>
    </div>
  </div>
</template>
