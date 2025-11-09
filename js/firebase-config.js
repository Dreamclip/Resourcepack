// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPTsWUgr8Rb7rpuncmb19wBbJkD422SPI",
  authDomain: "resourcepack-bcbc8.firebaseapp.com",
  projectId: "resourcepack-bcbc8",
  storageBucket: "resourcepack-bcbc8.firebasestorage.app",
  messagingSenderId: "568298057086",
  appId: "1:568298057086:web:198684c8ac0a868119572f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const auth = firebase.auth();
