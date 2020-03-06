import { Middleware } from '@nuxt/types'
const authMiddleware: Middleware = ({ store, error }) => {
  if (!(store.state.auth.user.email && store.state.auth.user.email === 'isitmy0530@keio.jp')) {
    error({
      statusCode: 404,
      message: 'Page not Found'
    })
  }
}

export default authMiddleware
