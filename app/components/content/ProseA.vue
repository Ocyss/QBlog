<script setup lang="ts">
const props = withDefaults(defineProps<{
  href?: string
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined
  icon?: boolean
}>(), {
  href: '',
  icon: true,
  target: '_blank',
})

const iconSrc = computed(() => {
  if (!props.icon) {
    return ''
  }
  return `https://toolb.cn/favicon/${new URL(props.href).hostname}`
})
</script>

<template>
  <NuxtLink
    :href="props.href"
    :target="props.target"
    class="inline gap-1"
  >
    <img v-if="iconSrc" :src="iconSrc" class="inline size-[1.3em] not-prose user-select-none pointer-events-none">
    <slot />
  </NuxtLink>
</template>
