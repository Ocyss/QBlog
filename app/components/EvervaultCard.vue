<script setup lang="tsx">
// https://21st.dev/aceternity/evervault-card
import { motion } from 'motion-v'
import { tv } from 'tailwind-variants'

const props = defineProps<{
  text?: string
  class?: string
  ui?: Partial<Record<keyof typeof ui, string>>
}>()

const mouseX = ref(0)
const mouseY = ref(0)

const randomString = ref(generateRandomString(1500))

function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
  if (!currentTarget || !(currentTarget instanceof HTMLElement))
    return
  const { left, top, width, height } = currentTarget.getBoundingClientRect()
  requestAnimationFrame(() => {
    mouseX.value = clientX - left
    mouseY.value = clientY - top
    randomString.value = generateRandomString(width * height / 100)
  })
}

const ui = tv({
  slots: {
    base: 'p-0.5 bg-transparent aspect-square flex items-center justify-center w-full h-full relative',
    card: 'group/card rounded-3xl w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full',
    content: 'relative z-10 flex items-center justify-center',
  },
})()

const style = computed(() => {
  const maskImage = `radial-gradient(250px at ${mouseX.value}px ${mouseY.value}px, white, transparent)`
  return { maskImage, WebkitMaskImage: maskImage }
})

const characters
  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function generateRandomString(length: number) {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
</script>

<template>
  <div
    :class="ui.base({ class: [props.class, props.ui?.base] })"
  >
    <div
      :class="ui.card({ class: props.ui?.card })"
      @mousemove="onMouseMove"
    >
      <div class="pointer-events-none">
        <div class="absolute inset-0 rounded-2xl [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-50" />
        <motion.div
          class="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-blue-700 opacity-0  group-hover/card:opacity-100 backdrop-blur-xl transition duration-500"
          :style="style"
        />
        <motion.div
          class="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay group-hover/card:opacity-100"
          :style="style"
        >
          <p class="absolute inset-x-0 text-xs h-full break-words whitespace-pre-wrap text-white font-mono font-bold transition duration-500">
            {{ randomString }}
          </p>
        </motion.div>
      </div>
      <div :class="ui.content({ class: props.ui?.content })">
        <slot>
          <div class="relative h-44 w-44  rounded-full flex items-center justify-center text-white font-bold text-4xl">
            <div class="absolute w-full h-full bg-white/[0.8] dark:bg-black/[0.8] blur-sm rounded-full" />
            <span class="dark:text-white text-black z-20">
              {{ props.text }}
            </span>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
