// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJQ90w964zw7aqbuYVObJjqgZ-WoyauqA",
  authDomain: "pantry-t.firebaseapp.com",
  projectId: "pantry-t",
  storageBucket: "pantry-t.appspot.com",
  messagingSenderId: "651355887436",
  appId: "1:651355887436:web:1618668fd4ef889d3a61e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}