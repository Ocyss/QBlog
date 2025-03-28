// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    jsx: true,
    rules: {
      'no-console': 'off',
    },
  }),
  {
    files: ['**/*.md'],
    rules: {
      'style/no-tabs': 'off',
    },
  },
)
