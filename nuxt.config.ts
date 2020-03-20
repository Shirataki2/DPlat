import { Configuration } from '@nuxt/types'
import SiteConfig from './config/site.config'
require('dotenv').config()

const config: Configuration = {
  mode: 'universal',
  buildDir: '.nuxt',
  head: {
    titleTemplate: '%s - ' + SiteConfig.sitename,
    title: SiteConfig.sitename,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: SiteConfig.desciption }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/default.min.css'
      }
    ]
  },
  loading: { color: '#67aef8' },
  css: [
    '~/assets/style.css',
    '~/assets/md.css',
    '~/assets/github.css'
  ],
  plugins: [
    '~/plugins/firebase',
    '~/plugins/cookie-storage'
  ],
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxt/typescript-build'
  ],
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/pwa',
    '@nuxtjs/markdownit',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    'nuxt-webfontloader'
  ],
  webfontloader: {
    google: {
      families: ['Oxanium:300&display=swap']
    }
  },
  axios: {
  },
  proxy: {
    '/api': {
      target: process.env.API_PROD_URL || 'https://flask-test-dot-global-snow-269714.appspot.com',
      pathRewrite: {
        '^/api': '/'
      }
    }
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true
  },
  markdownit: {
    preset: 'default',
    html: true,
    breaks: true,
    linkify: false,
    injected: true,
    xhtmlOut: true,
    langPrefix: 'md-',
    highlight (str: any, lang: any) {
      const hljs = require('highlight.js')
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' +
            hljs.highlight(lang, str, true).value +
            '</code></pre>'
        } catch (__) {}
      }
      return '<pre class="hljs"><code>' + hljs.highlight('plaintext', str, true).value + '</code></pre>'
    },
    use: [
      'markdown-it-emoji',
      'markdown-it-footnote',
      'markdown-it-mark',
      'markdown-it-deflist',
      'markdown-it-sanitizer',
      'markdown-it-katex'
    ]
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
  },
  pwa: {
    meta: {
      name: SiteConfig.sitename,
      auther: SiteConfig.auther,
      description: SiteConfig.desciption,
      lang: SiteConfig.lang,
      ogHost: SiteConfig.ogHost
    }
  }
}

export default config
