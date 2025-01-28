<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()
const link = inject('content-link', undefined)
const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => link ?? (props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h3))))
</script>

<template>
  <h3 :id="props.id">
    <a
      v-if="props.id && generate"
      :href="`#${props.id}`"
      class="heading-anchor"
    >
      <slot />
    </a>
    <slot v-else />
  </h3>
</template>
