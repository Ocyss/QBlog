<script setup lang="ts">
// https://21st.dev/ibelick/glow-effect/glow-effect-button
import type { Transition, Variant } from 'motion-v'
import type { CSSProperties } from 'vue'
import { tv } from 'tailwind-variants'

export type GlowEffectMode = 'rotate' | 'pulse' | 'breathe' | 'colorShift' | 'flowHorizontal' | 'static'

export interface GlowEffectProps {
  class?: string
  style?: CSSProperties
  colors?: string[]
  mode?: GlowEffectMode
  transition?: Transition
  scale?: number
  duration?: number
}

const props = withDefaults(defineProps<GlowEffectProps>(), {
  colors: () => ['#FF5733', '#33FF57', '#3357FF', '#F1C40F'],
  mode: 'rotate',
  scale: 1,
  duration: 5,
})

const BASE_TRANSITION: Transition = {
  repeat: Infinity,
  duration: props.duration,
  ease: 'linear',
  repeatType: 'mirror',
}

function getBaseTransition() {
  return {
    ...BASE_TRANSITION,
    ...(props.transition ?? {}),
  }
}

function getAnimationByMode(mode: GlowEffectMode): [Variant, Transition] {
  switch (mode) {
    case 'rotate':
      return [
        {
          rotate: [0, 360],
          background: `conic-gradient(from 0deg at 50% 50%, ${props.colors.join(', ')})`,
        },
        getBaseTransition(),
      ]
    case 'pulse':
      return [
        {
          scale: [1 * props.scale, 1.1 * props.scale, 1 * props.scale],
          opacity: [0.5, 0.8, 0.5],
          background: `radial-gradient(circle at 50% 50%, ${props.colors[0]} 0%, transparent 100%)`,
        },
        getBaseTransition(),
      ]
    case 'breathe':
      return [
        {
          scale: [1 * props.scale, 1.05 * props.scale, 1 * props.scale],
          background: `radial-gradient(circle at 50% 50%, ${props.colors[0]} 0%, transparent 100%)`,
        },
        getBaseTransition(),
      ]
    case 'colorShift':{
      const colors = props.colors.map((color, index) => {
        const nextColor = props.colors[(index + 1) % props.colors.length]
        return `conic-gradient(from ${index * 360 / props.colors.length}deg at 50% 50%, ${color} 0%, ${nextColor} 50%, ${color} 100%)`
      })
      return [
        {
          background: [...colors, ...colors.reverse()],
        },
        { ...getBaseTransition() },
      ]
    }
    case 'flowHorizontal':
      return [
        {
          backgroundPosition: ['0% 50%', '100% 50%'],
          background: `linear-gradient(to right, ${props.colors.join(', ')})`,
          backgroundSize: '200% 100%',
        },
        getBaseTransition(),
      ]
    case 'static':
    default:
      return [
        {
          background: `linear-gradient(to right, ${props.colors.join(', ')})`,
        },
        { duration: 0 },
      ]
  }
}

const animate = computed(() => getAnimationByMode(props.mode))

const glowEffect = tv({
  base: 'pointer-events-none absolute inset-0 h-full w-full transform-gpu',
})
</script>

<template>
  <Motion
    as="div"
    :style="
      {
        ...props.style,
        '--scale': props.scale,
        'willChange': 'transform, opacity, filter, background',
        'backfaceVisibility': 'hidden',
      }"

    :animate="animate[0]"
    :transition="animate[1]"
    :class="glowEffect({
      class: props.class,
    })"
  />
</template>
