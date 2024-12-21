// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  appConfig: {
    site: {
      url: import.meta.env.NUXT_SITE_URL,
      name: import.meta.env.NUXT_SITE_NAME,
      author: import.meta.env.NUXT_SITE_AUTHOR,
      longAuthor: import.meta.env.NUXT_SITE_LONG_AUTHOR,
      homepage: import.meta.env.NUXT_SITE_HOMEPAGE,
      description: import.meta.env.NUXT_SITE_DESCRIPTION,
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
    },
  },
})
