// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    useMockData: 'false',
    yearCodingTimeApi: '',
    sevenDaysLanguagesApi: '',
    monthLanguagesApi: '',
    yearLanguagesApi: '',
    yearEditorsApi: '',
    yearSystemsApi: '',
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
    '@nuxthq/studio',
    '@nuxt/content',
    'nuxt-echarts',
  ],

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
  },
})
