import { Store } from 'vuex'
import Cookie from 'cookie'
import { initialiseStores } from '~/utils/store-accessor'
const initializer = (store: Store<any>) => initialiseStores(store)
export const plugins = [initializer]
export * from '~/utils/store-accessor'

export const actions = {
  nuxtServerInit: ({ dispatch, $auth }:any, { req }: any) => {
    if (req.headers.cookie) {
      const cookie = Cookie.parse(req.headers.cookie)
      const data = cookie['aic-2020-app'] && JSON.parse(cookie['aic-2020-app'])
      if (data && data.auth.status === 'Log In') {
        dispatch('auth/login', data.auth.user)
      }
    }
  }
}
