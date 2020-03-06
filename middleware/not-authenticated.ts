import { Middleware } from '@nuxt/types'
const authMiddleware: Middleware = ({ store, redirect }) => {
  if (store.getters['auth/isLoggedIn']) {
    redirect('/')
  }
}

export default authMiddleware
