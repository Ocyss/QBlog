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
  <div class="my-6 overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group">
    <div class="header flex items-center rounded-t-[calc(var(--ui-radius)*1.5)] justify-between bg-(--ui-bg) px-4 py-3 text-(--ui-text) border border-(--ui-border-muted)">
      <div class="flex items-center">
        <UIcon v-if="icon" :name="icon" class="mr-2 text-gray-400" />
        <span class="font-mono text-sm/6 font-medium">{{ filename ?? language }}</span>
      </div>
      <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <UTooltip text="复制代码">
          <UButton icon="heroicons:document-duplicate" color="neutral" variant="outline" size="xs" @click="copyCode" />
        </UTooltip>
        <UTooltip v-if="filename" text="复制文件名">
          <UButton icon="heroicons:document-text" color="neutral" variant="outline" size="xs" @click="copyFilename" />
        </UTooltip>
      </div>
    </div>
    <div class="relative overflow-hidden rounded-b-[calc(var(--ui-radius)*1.5)]  border border-t-0 border-(--ui-border-muted)">
      <pre class="overflow-x-auto font-mono text-sm" :class="[props.class]">
        <slot />
      </pre>
    </div>
  </div>
</template>
