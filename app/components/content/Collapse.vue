<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  unmount?: boolean
  class?: string
}>(), {
  unmount: true,
})

provide('content-link', false)
</script>

<template>
  <UCollapsible :unmount-on-hide="unmount" class="flex flex-col gap-2 group/collapse my-2">
    <div class="flex items-center gap-2 cursor-pointer user-select-none">
      <UIcon name="i-lucide-chevron-down" class="group-data-[state=open]/collapse:rotate-180 transition-transform duration-300" />
      {{ title }}
    </div>
    <template #content>
      <div class="ml-4" :class="props.class">
        <slot />
      </div>
    </template>
  </UCollapsible>
</template>
