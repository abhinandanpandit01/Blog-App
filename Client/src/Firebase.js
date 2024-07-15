import { initializeApp } from "firebase/app";

// console.log(import.meta.env.VITE_FIREBASE_API)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "blogx-e160d.firebaseapp.com",
  projectId: "blogx-e160d",
  storageBucket: "gs://blogx-e160d.appspot.com",
  messagingSenderId: "963698625072",
  appId: "1:963698625072:web:124bde9d406d7f12b7bbf5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);