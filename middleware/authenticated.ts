import { Middleware } from '@nuxt/types'
const authMiddleware: Middleware = ({ store, redirect }) => {
  if (!store.getters['auth/isLoggedIn']) {
    redirect('/login')
  }
}

export default authMiddleware
