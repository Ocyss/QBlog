<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

import { joinURL, withLeadingSlash, withTrailingSlash } from 'ufo'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: undefined,
  },
  preview: {
    type: Boolean,
    default: true,
  },
})

let preview: (() => void) | undefined
if (props.preview) {
  const { addImage } = useImagePreview()
  preview = addImage({ image: { url: props.src, alt: props.alt } })
}

const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
    if (_base !== '/' && !props.src.startsWith(_base)) {
      return joinURL(_base, props.src)
    }
  }
  return props.src
})
</script>

<template>
  <img
    :src="refinedSrc"
    :alt="props.alt"
    :width="props.width"
    :height="props.height"
    :class="{ 'cursor-zoom-in': props.preview }"
    @click="preview"
  >
</template>
