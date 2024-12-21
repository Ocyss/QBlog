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
  <div class="overflow-hidden [&:not(:first-child)]:mt-5 [&:not(:last-child)]:mb-5">
    <!-- 标题栏 -->
    <div
      class="
      flex items-center bg-[var(--ui-bg-accented)] font-mono text-sm border-[0.5px]
      border-[var(--ui-border-muted)] border-b-0 rounded-t-[calc(var(--ui-radius)*1.5)] px-4 py-3"
    >
      <UIcon v-if="icon" :name="icon" class="mr-1.5" />
      <span>{{ filename ?? language }}</span>
      <div class="ml-auto flex items-center gap-2">
        <UTooltip text="复制代码">
          <UButton icon="heroicons:document-duplicate" variant="ghost" size="xs" @click="copyCode" />
        </UTooltip>
        <UTooltip text="复制文件名">
          <UButton icon="heroicons:document-text" variant="ghost" size="xs" @click="copyFilename" />
        </UTooltip>
      </div>
    </div>
    <!-- 代码块 -->
    <div class="not-prose relative group bg-[var(--ui-bg-code)] border-[0.5px] border-[var(--ui-border-muted)]">
      <pre
        class="
      overflow-x-auto p-3 font-mono text-sm
      px-4 py-3 whitespace-pre-wrap break-words" :class="[props.class]"
      ><slot /></pre>
      <div
        class="
      pre-absolute-wrapper absolute right-3 top-2
      opacity-0 group-hover:opacity-100 transition-opacity z-10 select-none"
      >
        <UTooltip text="复制代码">
          <UButton
            icon="heroicons:document-duplicate"
            variant="ghost"
            size="xs"
            @click="copyCode"
          />
        </UTooltip>
      </div>
    </div>
  </div>
</template>

<style>
pre code .line {
  display: block;
}

pre code {
  display: block;
  padding: 0.5rem 0;
}
</style>

<style scoped>
@import 'tailwindcss';

pre {
  position: relative;
  margin: 0;
}

pre:hover .copy-button {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
