import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'
import 'firebase/firestore'
import { Plugin } from '@nuxt/types'
import config from '@/config/firebase.config'
import Vue from 'vue'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

declare module '@nuxt/types' {
  interface Context {
    $auth: firebase.auth.Auth
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $auth: firebase.auth.Auth
  }
}

const firebasePlugin: Plugin = (context, inject) => {
  context.$auth = firebase.auth()
}

Vue.prototype.$auth = firebase.auth()

export default firebasePlugin

export const auth = firebase.auth()
export const db = firebase.firestore()
export const realtimedb = firebase.database
export const storage = firebase.storage()
export const store = firebase.firestore
export const providers = {
  google: new firebase.auth.GoogleAuthProvider()
}
