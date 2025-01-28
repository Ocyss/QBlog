// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    site: {
      url: '',
      name: '',
      author: '',
      longAuthor: '',
      homepage: '',
      description: '',
    },
    githubToken: '',
    oss: {
      region: '',
      accessKeyId: '',
      accessKeySecret: '',
      bucket: '',
    },
  },
  future: {
    // https://github.com/nuxt/nuxt/pull/27029
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@nuxtjs/mdc',
    '@pinia/nuxt',
    '@nuxt/content',
    'nuxt-echarts',
    // '@nuxtjs/sitemap',
    'nuxt-og-image',
    // '@nuxtjs/robots',
    'nuxt-schema-org',
    // 'nuxt-link-checker',
    'nuxt-seo-utils',
    'nuxt-umami',
  ],
  schemaOrg: {
    identity: 'Organization',
  },
  seo: {
    meta: {
      description: 'This is a demo of Nuxt SEO showcasing all of the modules.',
      themeColor: [
        { content: '#18181b', media: '(prefers-color-scheme: dark)' },
        { content: 'white', media: '(prefers-color-scheme: light)' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],
  eslint: {
    config: {
      standalone: false,
    },
    checker: {
      exclude: ['**/*.md', 'app/**/*.vue'],
    },
  },

  content: {
    build: {
      pathMeta: {},
      markdown: {

        highlight: {
          langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml', 'go', 'rust', 'tsx', 'jsx'],
          theme: {
            // Default theme (same as single string)
            default: 'github-light',
            // Theme used if `html.dark`
            dark: 'one-dark-pro',
            // Theme used if `html.sepia`
            sepia: 'monokai',
          },
        },
      },
    },
    watch: {
      enabled: true,
      // ws: true,
    },
    studio: {
      enabled: true,
      gitInfo: {
        name: 'QBlog',
        owner: 'Ocyss',
        url: 'https://github.com/Ocyss/QBlog',
      },
    },
  },
  umami: {
    autoTrack: true,
    ignoreLocalhost: true,
    // proxy: 'cloak',
    // useDirective: true,
    // excludeQueryParams: false,
    // domains: ['cool-site.app', 'my-space.site'],
    // customEndpoint: '/my-custom-endpoint',
    // enabled: false,
    // logErrors: true,
    // tag: 'website-variation-123',
  },
})
