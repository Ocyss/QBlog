<script setup lang="ts">
const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: null,
  },
})
const toast = useToast()

const parsedMeta = computed(() => {
  const split = props.meta?.split(' ') ?? []
  const params = new Map<string, string>()

  for (const param of split) {
    const [key, val] = param.split('=')
    if (key && val) {
      params.set(key, val)
    }
  }

  return params
})

const config = useAppConfig()

const icon = computed(() => {
  const iconMap = config.content.codeIcon
  const filenameLow = props.filename?.toLowerCase()
  return parsedMeta.value.get('icon') || (filenameLow && iconMap[filenameLow]) || (props.language && iconMap[props.language])
})

function copyCode() {
  navigator.clipboard.writeText(props.code)
  toast.add({
    title: '代码已复制',
    color: 'success',
  })
}

function copyFilename() {
  if (props.filename) {
    navigator.clipboard.writeText(props.filename)
    toast.add({
      title: '文件名已复制',
      color: 'success',
    })
  }
}
</script>

<template>
  <div class="my-6 overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
    <div class="header flex items-center justify-between bg-gray-800 px-4 py-3 text-gray-200">
      <div class="flex items-center">
        <UIcon v-if="icon" :name="icon" class="mr-2 text-gray-400" />
        <span class="font-mono text-sm font-medium">{{ filename ?? language }}</span>
      </div>
      <div class="flex items-center gap-2">
        <UTooltip text="复制代码">
          <UButton icon="heroicons:document-duplicate" variant="ghost" size="xs" @click="copyCode" />
        </UTooltip>
        <UTooltip v-if="filename" text="复制文件名">
          <UButton icon="heroicons:document-text" variant="ghost" size="xs" @click="copyFilename" />
        </UTooltip>
      </div>
    </div>
    <div class="relative group">
      <pre class="overflow-x-auto font-mono text-sm" :class="[props.class]">
        <slot />
      </pre>
      <div class="absolute right-4 top-3 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <UTooltip text="复制代码">
          <UButton
            icon="heroicons:document-duplicate" variant="ghost" size="xs"
            class="bg-gray-800/70 text-gray-300 hover:bg-gray-700 hover:text-white backdrop-blur-sm transition-all"
            @click="copyCode"
          />
        </UTooltip>
      </div>
    </div>
  </div>
</template>
