import Lenis, { type LenisOptions } from 'lenis'

export type LenisStatus = Pick<Lenis, 'className' | 'isHorizontal' | 'isLocked' | 'isScrolling' | 'isSmooth' | 'isStopped' | 'limit' | 'progress' | 'rootElement' | 'scroll' | 'direction' | 'time' | 'animatedScroll' | 'velocity' | 'lastVelocity' | 'targetScroll' >

export interface LenisRef {
  instance: Lenis | null
  status: LenisStatus | null
}

export function useLenis(opt: Omit<LenisOptions, 'wrapper'> & {
  wrapper: MaybeRefOrGetter<LenisOptions['wrapper'] | null>
}) {
  const lenis: Ref<LenisRef> = ref({
    instance: null,
    status: null,
  })

  onMounted(() => {
    const ele = toValue(opt.wrapper)
    if (!ele || import.meta.server)
      return

    lenis.value.instance = new Lenis({
      ...opt,
      autoRaf: false,
      wrapper: ele,
    })

    const raf = (time: DOMHighResTimeStamp) => {
      lenis.value.instance?.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    lenis.value.instance?.on('scroll', (newScrollState) => {
      if (!lenis.value.instance)
        return

      lenis.value.status = toReactive({
        className: newScrollState.className,
        isHorizontal: newScrollState.isHorizontal,
        isLocked: newScrollState.isLocked,
        isScrolling: newScrollState.isScrolling,
        isSmooth: newScrollState.isSmooth,
        isStopped: newScrollState.isStopped,
        limit: newScrollState.limit,
        progress: newScrollState.progress,
        rootElement: newScrollState.rootElement,
        scroll: newScrollState.scroll,
        direction: newScrollState.direction,
        time: newScrollState.time,
        animatedScroll: newScrollState.animatedScroll,
        velocity: newScrollState.velocity,
        lastVelocity: newScrollState.lastVelocity,
        targetScroll: newScrollState.targetScroll,
      })
    })
  })

  onBeforeUnmount(() => {
    lenis.value.instance?.destroy()
    lenis.value.instance = null
    lenis.value.status = null
  })

  return { lenis }
}
