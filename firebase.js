  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAnYddimX8RzFfu6BCj8y4U3SnicZtVXxI",
    authDomain: "todo-with-firebase-31bf7.firebaseapp.com",
    projectId: "todo-with-firebase-31bf7",
    storageBucket: "todo-with-firebase-31bf7.firebasestorage.app",
    messagingSenderId: "538733009938",
    appId: "1:538733009938:web:cf2cb1a6eece5ac263cccb"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  const auth = getAuth(app);

  export {
    app, db, auth, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot,
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, query, where
};