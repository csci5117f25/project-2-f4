import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD6Gh2Kq3EQPP-pV0Zpa1sUS6fP6pATXFY",
  authDomain: "project2-d576e.firebaseapp.com",
  projectId: "project2-d576e",
  storageBucket: "project2-d576e.firebasestorage.app",
  messagingSenderId: "732095008766",
  appId: "1:732095008766:web:a94a01ce0aa34faf337aaf"
}
export const firebaseApp = initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)


