import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgnhNhuqX0OeoDgpqocxyuJxQ4nG1kwD4",
  authDomain: "etpadmissions.firebaseapp.com",
  projectId: "etpadmissions",
  storageBucket: "etpadmissions.appspot.com",
  messagingSenderId: "633319541560",
  appId: "1:633319541560:web:d490788775b280588fcfcd",
  measurementId: "G-9DY0P50ZE4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
