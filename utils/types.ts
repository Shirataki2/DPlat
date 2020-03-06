import firebase from 'firebase'

export interface User {
  displayName: string,
  photoURL: string,
  nickname: string
}

export interface Status {
  status: string,
  last_changed: firebase.firestore.Timestamp
}
