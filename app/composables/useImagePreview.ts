export type PreviewImageItem<T extends object = object> = {
  url: string
  alt?: string
} & T

export interface PreviewImageApi {
  preview: (options: { id: string, index: PreviewImageItem | number }) => void
  addImage: (options: { id: string, image: | PreviewImageItem }) => () => void
  addImages: (options: { id: string, images: PreviewImageItem[] }) => (() => void)[]
  deleteImages: (options: { id: string, images: PreviewImageItem[] }) => void
  close: () => void
  next: () => void
  prev: () => void
}

export const previewImageKey = Symbol('previewImage') as InjectionKey<PreviewImageApi>
export const previewImageIdKey = Symbol('previewImageId') as InjectionKey<string>

export function useImagePreview(id?: string) {
  if (!id) {
    id = inject(previewImageIdKey, '')
    if (!id) {
      id = useId()
      provide(previewImageIdKey, id)
    }
  }
  const previewApi = inject(previewImageKey)
  if (!previewApi) {
    throw new Error('previewApi is not provided')
  }
  const { close, next, prev, deleteImages } = previewApi

  const images: PreviewImageItem[] = []

  const preview = (options: Omit<Parameters<typeof previewApi.preview>[0], 'id'>) => {
    previewApi.preview({ id, ...options })
  }
  const addImage = (options: Omit<Parameters<typeof previewApi.addImage>[0], 'id'>) => {
    images.push(options.image)
    return previewApi.addImage({ id, ...options })
  }
  const addImages = (options: Omit<Parameters<typeof previewApi.addImages>[0], 'id'>) => {
    images.push(...options.images)
    return previewApi.addImages({ id, ...options })
  }

  onBeforeUnmount(() => {
    deleteImages({ id, images })
  })

  return {
    id,
    preview,
    close,
    next,
    prev,
    addImage,
    addImages,
  }
}
