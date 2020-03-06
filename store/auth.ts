import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import Cookies from 'js-cookie'
import { auth, db, storage, realtimedb, store } from '@/plugins/firebase'
import idencicon from '@/utils/identicon'

interface Auth {
  username: string,
  status: string
}

interface User {
  displayName: string,
  email: string,
  photoURL: string,
  uid: string
}

@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true
})
class AuthModule extends VuexModule implements Auth {
  username = ''
  status = 'Log Out'
  user: User|null = null

  get isLoggedIn () {
    return this.status === 'Log In'
  }

  @Mutation
  LOGIN (user: User) {
    this.username = user.displayName
    this.user = user
    this.status = 'Log In'
  }

  @Mutation
  LOGOUT () {
    this.username = ''
    this.user = null
    this.status = 'Log Out'
  }

  @Action
  async login (payload: any) {
    const currentuser = auth.currentUser
    if (!currentuser) { return }
    const token = await currentuser.getIdToken(true)
    if (!token) { return }
    const userInfo: User = {
      displayName: payload.displayName,
      email: payload.email,
      photoURL: payload.photoURL,
      uid: payload.uid
    }
    const usersRef = db.collection('users')
    const snap = await usersRef.doc(payload.uid).get()
    if (!snap.exists) {
      const blob = idencicon(payload.uid)
      const uploadSnap = await storage.ref('icons').child(`${payload.uid}.png`).put(blob)
      usersRef.doc(payload.uid).set({
        displayName: payload.displayName,
        nickname: payload.displayName,
        photoURL: uploadSnap.ref.toString()
      })
    }
    Cookies.set('access_token', token) // saving token in cookie for server rendering
    this.LOGIN(userInfo)
  }

  @Action
  async logout () {
    await auth.signOut()
    if (!this.user) { return }
    const statusRef = realtimedb().ref(`/status/${this.user.uid}`)
    const offlineStatus = {
      status: 'offline',
      last_changed: realtimedb.ServerValue.TIMESTAMP
    }
    statusRef.set(offlineStatus)
    const statusRefFS = db.doc(`/status/${this.user.uid}`)
    const offlineStatusFS = {
      status: 'offline',
      last_changed: store.FieldValue.serverTimestamp()
    }
    statusRefFS.set(offlineStatusFS)
    this.LOGOUT()
    Cookies.remove('access_token')
  }
}

export default AuthModule
