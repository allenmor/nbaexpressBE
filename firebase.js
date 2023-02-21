// import { initializeApp } from "firebase/app";
// import { getFirestore } from "@firebase/firestore"
// const firebase = require("firebase/app");
// const { firestore } = require("firebase");
// const getFirestore = firestore;
const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");






// Your web app's Firebase configuration
const firebaseConfig = {
    // apiKey: "AIzaSyBvr9PD1Nu-XjkQKB-woQVZfsIt1J5Hk8g",
    // authDomain: "fir-crud-4c822.firebaseapp.com",
    // projectId: "fir-crud-4c822",
    // storageBucket: "fir-crud-4c822.appspot.com",
    // messagingSenderId: "461587777015",
    // appId: "1:461587777015:web:cdaae92a88e360713b9af2"

      apiKey: "AIzaSyBQngWj0pVQCBOn4CxdTb03ivT8C0ipsNw",
      authDomain: "cases-eb319.firebaseapp.com",
      projectId: "cases-eb319",
      storageBucket: "cases-eb319.appspot.com",
      messagingSenderId: "126950570001",
      appId: "1:126950570001:web:29c012068d0c2a9dd999b0",
      measurementId: "G-62L98NHCWC"

  };
  


  firebase.initializeApp(firebaseConfig);
  module.exports = { db: firebase.firestore() }

