import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
//firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBStzUZNfl_G8HacYUJNyI6c4398u7IAr8",
  authDomain: "calculator-90cf9.firebaseapp.com",
  databaseURL: "https://calculator-90cf9.firebaseio.com",
  projectId: "calculator-90cf9",
  storageBucket: "calculator-90cf9.appspot.com",
  messagingSenderId: "1054113476666",
  appId: "1:1054113476666:web:23717e82b11684678b4503"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
 export const auth = firebase.auth();
 export const db = firebase.firestore();
export default firebase;