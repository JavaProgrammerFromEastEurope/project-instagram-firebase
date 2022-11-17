// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FieldValue } from "firebase/firestore";
//import { seedDatabase } from '../seed';

const config = {
  apiKey: "AIzaSyCGeZOHmISM-2uAtdUDDI9eLhurRmk9RQY",
  authDomain: "instagram-dev-d9916.firebaseapp.com",
  projectId: "instagram-dev-d9916",
  storageBucket: "instagram-dev-d9916.appspot.com",
  messagingSenderId: "156853065938",
  appId: "1:156853065938:web:dd48198b4b3ea5a42c350b"
};

// Initialize Firebase
const firebase = initializeApp(config);

// seedDatabase(firebase)

export { firebase, FieldValue };
