<script setup lang="ts">
const visible = ref(false)
const id = ref('')
const images = ref<Record<string, {
  images: PreviewImageItem[]
  currentIndex: number
}>>({})

const current = computed(() => {
  return images.value[id.value]
})

// 关闭预览
function close() {
  visible.value = false
}

// 上一张
function prev() {
  const current = images.value[id.value]
  if (current && current.currentIndex > 0) {
    current.currentIndex--
  }
}

// 下一张
function next() {
  const current = images.value[id.value]
  if (current && current.currentIndex < current.images.length - 1) {
    current.currentIndex++
  }
}

function addImage(options: { id: string, image: PreviewImageItem }) {
  let current = images.value[options.id]
  if (!current) {
    current = {
      images: [],
      currentIndex: 0,
    }
    images.value[options.id] = current
  }

  current.images.push(options.image)
  return () => preview({ id: options.id, index: options.image })
}

function addImages(options: { id: string, images: PreviewImageItem[] }) {
  let current = images.value[options.id]
  if (!current) {
    current = {
      images: [],
      currentIndex: 0,
    }
    images.value[options.id] = current
  }
  return options.images.map((image) => {
    return addImage({ id: options.id, image })
  })
}
function preview(options: { id: string, index: PreviewImageItem | number }) {
  const current = images.value[options.id]
  if (!current) {
    return
  }
  id.value = options.id
  current.currentIndex = typeof options.index === 'number' ? options.index : current.images.indexOf(options.index)
  visible.value = true
}

function deleteImages(options: { id: string, images: PreviewImageItem[] }) {
  const current = images.value[options.id]
  if (!current) {
    return
  }
  current.images = current.images.filter(image => !options.images.includes(image))
}

provide(previewImageKey, {
  preview,
  close,
  next,
  prev,
  addImage,
  addImages,
  deleteImages,
})

onMounted(() => {
  useEventListener(window, 'keydown', (e) => {
    if (!visible.value)
      return
    if (e.key === 'Escape')
      close()
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      prev()
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
      next()
  })
})
</script>

<template>
  <UModal
    v-model:open="visible"
    :ui="{
      content: 'w-screen md:max-w-[80vw] !max-w-none !h-auto bg-transparent sm:shadow-none sm:ring-0 flex items-center justify-center !pointer-events-none *:pointer-events-auto',
    }"
  >
    <template v-if="current" #content>
      <div v-if="current.images.length > 1" class="absolute md:px-10  w-full -bottom-6 md:bottom-1/2 flex items-center justify-between *:text-2xl *:cursor-pointer !pointer-events-none *:pointer-events-auto">
        <!-- 导航按钮 - 上一张 -->
        <UButton
          color="neutral"
          variant="solid"
          :disabled="current.currentIndex === 0"
          @click="prev"
        >
          ‹
        </UButton>

        <!-- 导航按钮 - 下一张 -->
        <UButton
          color="neutral"
          variant="solid"
          :disabled="current.currentIndex === current.images.length - 1"
          @click="next"
        >
          ›
        </UButton>
      </div>

      <!-- 图片容器 -->

      <img
        :src="current.images[current.currentIndex]?.url"
        alt="preview"
        class="py-8 px-0 md:p-8 max-w-full max-h-[90vh] object-contain w-fit pointer-events-auto"
      >

      <!-- 计数器 -->
      <div class="absolute -bottom-4  text-white flex flex-col items-center pointer-events-auto">
        <div v-if="current.images[current.currentIndex]?.alt" class="text-sm">
          {{ current.images[current.currentIndex]?.alt }}
        </div>
        <div v-if="current.images.length > 1" class="text-sm">
          {{ current.currentIndex + 1 }}/{{ current.images.length }}
        </div>
      </div>
    </template>
  </UModal>
  <slot />
</template>
