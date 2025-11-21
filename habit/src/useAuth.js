import { auth } from './firebase_config.js'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth'

const provider = new GoogleAuthProvider()

export function signIn() {
  return signInWithPopup(auth, provider).catch(err => console.log(err))
}
export function logOut() {
  return signOut(auth).catch(error => console.log(error))
}

