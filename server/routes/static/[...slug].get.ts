import { createHmac } from 'node:crypto'
import { createError, defineEventHandler, sendRedirect, setHeader } from 'h3'

interface OSSConfig {
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
}

const config = useRuntimeConfig()

const ossConfig: OSSConfig = {
  region: config.oss.region,
  accessKeyId: config.oss.accessKeyId,
  accessKeySecret: config.oss.accessKeySecret,
  bucket: config.oss.bucket,
}

// 创建缓存存储实例
const storage = useStorage('oss-urls')

async function generateSignedUrl(config: OSSConfig, objectKey: string, expires = 900): Promise<string> {
  // 检查缓存中是否存在有效的签名URL
  const cacheKey = `signed-url:${objectKey}`
  const cached = await storage.getItem(cacheKey)

  if (cached) {
    const { url, expireAt } = cached as { url: string, expireAt: number }
    // 如果缓存的URL还有超过5分钟的有效期，则直接返回
    if (expireAt > Date.now() + 300000) {
      return url
    }
  }

  const host = `${config.bucket}.${config.region}.aliyuncs.com`
  const expiration = Math.floor(Date.now() / 1000) + expires

  const stringToSign = [
    'GET',
    '', // content-md5
    '', // content-type
    expiration.toString(),
    `/${config.bucket}/${objectKey}`,
  ].join('\n')

  const signature = createHmac('sha1', config.accessKeySecret)
    .update(stringToSign)
    .digest('base64')

  const params = new URLSearchParams({
    OSSAccessKeyId: config.accessKeyId,
    Expires: expiration.toString(),
    Signature: signature,

  })

  const signedUrl = `https://${host}/${objectKey}?${params.toString()}`

  // 将签名URL存入缓存
  await storage.setItem(cacheKey, {
    url: signedUrl,
    expireAt: expiration * 1000, // 转换为毫秒
  })

  return signedUrl
}

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug
  if (!slug) {
    throw createError({
      statusCode: 404,
      message: '未找到文件',
    })
  }

  try {
    const url = await generateSignedUrl(ossConfig, slug)

    setHeader(event, 'Cache-Control', 'public, max-age=600') // 10分钟的浏览器缓存
    setHeader(event, 'Expires', new Date(Date.now() + 600000).toUTCString())

    return sendRedirect(event, url, 302)
  }
  catch {
    throw createError({
      statusCode: 500,
      message: '获取文件失败',
    })
  }
})
