import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDMsSMtanXh089GsR71XdrwV3_pq-xrn3I",
  authDomain: "consultancy-a28b8.firebaseapp.com",
  projectId: "consultancy-a28b8",
  storageBucket: "consultancy-a28b8.firebasestorage.app",
  messagingSenderId: "733129660579",
  appId: "1:733129660579:web:e07cdff77a2a06a93a8716",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const storage = getStorage(app)

export { auth, storage }
export default app
