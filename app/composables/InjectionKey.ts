import type { ShallowRef } from 'vue'
import type { LenisRef } from '~/composables/useLenis'

export const mainContentKey = Symbol('mainContent') as InjectionKey<Readonly<ShallowRef<HTMLDivElement | null>>>
export const mainContentLenisKey = Symbol('mainContentLenis') as InjectionKey<Ref<LenisRef>>
