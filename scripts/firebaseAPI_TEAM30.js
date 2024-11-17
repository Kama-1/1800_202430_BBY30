
//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyB3zniMLfjSWwOEn0IH7Iy88zMGqx7TQu8",
  authDomain: "bby30-1f20e.firebaseapp.com",
  projectId: "bby30-1f20e",
  storageBucket: "bby30-1f20e.appspot.com",
  messagingSenderId: "807572213257",
  appId: "1:807572213257:web:a70b360ef26161ba82b2d8"
};
//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();