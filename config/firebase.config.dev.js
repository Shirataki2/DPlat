import firebase from 'firebase/app'
import 'firebase/auth'

export const firebaseAuthProviders = {
  Email: firebase.auth.EmailAuthProvider.PROVIDER_ID,
  EmailLinkSignInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
  Google: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  Phone: firebase.auth.PhoneAuthProvider.PROVIDER_ID
}

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: ''
}

export default firebaseConfig
