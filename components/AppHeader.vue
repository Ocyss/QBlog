<script setup>
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})

const navItems = ['All', 'News', 'Exclusives', 'Guides', 'Recommended']
</script>

<template>
  <header class="flex items-center px-4 py-3 h-22 justify-between z-20">
    <div class="flex items-center space-x-4">
      <UButton
        class="flex items-center space-x-2 px-3 py-1.5 rounded-full u-float-btn font-bold"
        icon="i-lucide-lightbulb"
        size="xl"
      >
        QBlog
      </UButton>

      <nav class="flex items-center space-x-4">
        <UButton
          v-for="item in navItems"
          :key="item"
          class="flex items-center space-x-1 px-3 py-1.5 rounded-full u-float-btn transition-colors"
          trailing-icon="i-lucide-plus"
          size="xl"
        >
          {{ item }}
        </UButton>
      </nav>

      <ClientOnly>
        <UButton
          :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
          variant="solid"
          size="xl"
          class="u-float-btn rounded-full"
          @click="isDark = !isDark"
        />
      </ClientOnly>
    </div>
    <div class="flex items-center ">
      <slot name="right" />
    </div>
  </header>
</template>
