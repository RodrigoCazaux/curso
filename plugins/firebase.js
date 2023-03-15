import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/firebase-auth'

if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: "AIzaSyCyc8j5BJoOyHZ58dSquiJzxAKJW7vi3P0",
    authDomain: "curso-aa826.firebaseapp.com",
    projectId: "curso-aa826",
    storageBucket: "curso-aa826.appspot.com",
    messagingSenderId: "358450706507",
    appId: "1:358450706507:web:3b4f86eea9ed6c4ca4b5ce"
  }
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)
}
const db = firebase.firestore()
export { db, firebase }