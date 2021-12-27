import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaMoaykOHWm-30Fa1x-neo_B-4GarQsrA",
  authDomain: "icmmogi-8fe54.firebaseapp.com",
  databaseURL: "https://icmmogi-8fe54-default-rtdb.firebaseio.com",
  projectId: "icmmogi-8fe54",
  storageBucket: "icmmogi-8fe54.appspot.com",
  messagingSenderId: "120409024574",
  appId: "1:120409024574:web:4adecdd450a5527839496f"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore();

export default {
  db, 
  firebaseApp
};