import { createContext } from "react";
import { initializeApp } from 'firebase/app';
import { 
    getAuth, signInWithEmailAndPassword,
    signInWithPopup, createUserWithEmailAndPassword,
    GoogleAuthProvider, GithubAuthProvider
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from "firebase/database";


export const FirebaseContext = createContext(null)

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAPJfwRYSI75NSbLDvcvcy6DYRgKuYNDyU",
    authDomain: "chat-home-d3da0.firebaseapp.com",
    projectId: "chat-home-d3da0",
    storageBucket: "chat-home-d3da0.firebasestorage.app",
    messagingSenderId: "71572172033",
    appId: "1:71572172033:web:0e55a12c1be209c0c53f00",
    measurementId: "G-3RTVD9XDMM"
};

export const FirebaseProvider = ({children}) => {
    // Inicializa Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    //const analytics = getAnalytics(app);
    const db = getDatabase(app);

    return (
        <FirebaseContext.Provider
            value={{auth, db, 
                createUserWithEmailAndPassword, signInWithEmailAndPassword,
                createUserWithEmailAndPassword, signInWithPopup, 
                GoogleAuthProvider, GithubAuthProvider
            }}
        >
            {children}
        </FirebaseContext.Provider>
    )
}
