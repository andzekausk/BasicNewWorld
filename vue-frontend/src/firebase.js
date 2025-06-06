import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITEFIREBASE_APP_ID
};

const venta = "@venta.lv";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // if(!user.email.endsWith(venta)){
    //     await signOut(auth);
    //     alert("Tikai @venta.lv epasti!!!");
    //     return null;
    // }
    const isAdmin = user.email.endsWith(venta);
    
    // return user;
    return {...user, isAdmin};
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

const logout = async () => {
  await signOut(auth);
};

export { auth, loginWithGoogle, logout };
