// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpywPFafP9KnogWNEPMAoJrfJmLkVlNK8",
  authDomain: "fileuploader-22120.firebaseapp.com",
  projectId: "fileuploader-22120",
  storageBucket: "fileuploader-22120.appspot.com",
  messagingSenderId: "1073647548495",
  appId: "1:1073647548495:web:00803fa9fce91fceca923a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);