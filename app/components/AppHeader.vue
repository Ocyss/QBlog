<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})
</script>

<template>
  <header class="w-screen overflow-x-clip flex items-center py-3 h-18 justify-between sticky top-0 left-0 right-0 z-40 bg-[var(--ui-bg-elevated)]">
    <div class="flex items-center justify-center h-full space-x-4 pr-2 pl-4">
      <UButton
        class="flex items-center space-x-2 px-3 py-1.5 rounded-full u-float-btn font-bold h-8"
        icon="i-catppuccin:playwright"
        size="xs"
        to="/"
      >
        QBlog
      </UButton>
      <slot name="left">
        <NavigationHeader />
      </slot>
    </div>
    <div class="flex items-center justify-center h-full space-x-4 pl-2 pr-4 bg-[var(--ui-bg-elevated)] z-30">
      <ClientOnly>
        <UButton
          :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
          variant="solid"
          size="xs"
          class="u-float-btn rounded-full size-8 flex items-center justify-center"
          @click="isDark = !isDark"
        />
      </ClientOnly>
      <slot name="right" />
    </div>
  </header>
</template>
