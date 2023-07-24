// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
apiKey: "AIzaSyCbrnx7JGLOo34Auq-r1h9bWmGYv6eZ-5w",
authDomain: "seja-veloz.firebaseapp.com",
databaseURL: "https://seja-veloz-default-rtdb.firebaseio.com",
projectId: "seja-veloz",
storageBucket: "seja-veloz.appspot.com",
messagingSenderId: "553532368659",
appId: "1:553532368659:web:8f44e3f144f3488b295ce6",

};

const app = initializeApp(firebaseConfig);

export const firebaseApp = app;
export const firebaseDatabase = getDatabase(app);

