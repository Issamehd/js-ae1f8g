// Import stylesheets
import './style.css';
import './database.js';
// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
} from 'firebase/firestore';

// Add the Firebase products and methods that you want to use
import {
  getAuth,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');

let auth;

async function main() {
  // Add Firebase project configuration object here

  const firebaseConfig = {
    apiKey: 'AIzaSyD8UmmKwmbLz9rxbNcYawBBhtOoJ10phRY',
    authDomain: 'playlist-app-ed242.firebaseapp.com',
    databaseURL:
      'https://playlist-app-ed242-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'playlist-app-ed242',
    storageBucket: 'playlist-app-ed242.appspot.com',
    messagingSenderId: '989717410541',
    appId: '1:989717410541:web:d6a8a6e32d68915ae852e4',
    measurementId: 'G-VRXBP0BFKN',
  };

  // initializeApp(firebaseConfig);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  auth = getAuth();
  //const dbRef = ref(getDatabase());

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      },
    },
  };

  // const ui = new firebaseui.auth.AuthUI(auth);

  // Initialize the FirebaseUI widget using Firebase
  const ui = new firebaseui.auth.AuthUI(auth);

  // Listen to RSVP button clicks
  startRsvpButton.addEventListener('click', () => {
    ui.start('#firebaseui-auth-container', uiConfig);
  });

  // Listen to the current Auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      startRsvpButton.textContent = 'Log out';
    } else {
      startRsvpButton.textContent = 'Log in';
    }
  });

  // Called when the user clicks the RSVP button
  startRsvpButton.addEventListener('click', () => {
    if (auth.currentUser) {
      // User is signed in; allows user to sign out
      signOut(auth);
    } else {
      // No user is signed in; allows user to sign in
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  });

  const user = doc(db, '/playlistapp/R7BtY3Hl1rXVxqpVVTrR');

  function writeUserInfo() {
    const docData = {
      album: '',
      artist: '',
      releasedDate: null,
      title: '',
    };

    setDoc(user, docData, { merge: true });
  }

  const playlist = collection(db, 'playlistapp');

  async function addNewDocument() {
    const newDoc = await addDoc(playlist, {
      album: '',
      artist: '',
      releasedDate: null,
      title: '',
    });
    console.log(` ${newDoc.path} has been created`);
  }

  writeUserInfo();
  addNewDocument();
}

main();
