import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD2ZZpwEJAApknl8BSPsZ_yfb8Opcn9baw",
    authDomain: "taps-and-pay.firebaseapp.com",
    projectId: "taps-and-pay",
    storageBucket: "taps-and-pay.appspot.com",
    messagingSenderId: "554637977969",
    appId: "1:554637977969:web:7d84a650505fb6c805aed0"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);