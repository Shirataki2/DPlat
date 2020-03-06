import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import cookie from 'cookie'
import { Plugin } from '@nuxt/types'

const cookiePlugin: Plugin = ({ store, req, isDev }) => {
  createPersistedState({
    key: 'aic-2020-app',
    storage: {
      getItem: key => process.client ? Cookies.getJSON(key) : cookie.parse(req.headers.cookie || '')[key],
      setItem: (key, value) => Cookies.set(key, value, { expires: 60 * 60 * 24, secure: !isDev }),
      removeItem: key => Cookies.remove(key)
    }
  })(store)
}

export default cookiePlugin
