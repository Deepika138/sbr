/* ==========================================================================
   GLOBAL FIREBASE INITIALIZATION
   Centralized config to be loaded before any other application scripts.
   ========================================================================== */

const firebaseConfig = {
    apiKey: "AIzaSyA_cflBLHqk7L46KZ8mAy7RKYm995DU3vc",
    authDomain: "sbr-scada-platform.firebaseapp.com",
    databaseURL: "https://sbr-scada-platform-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sbr-scada-platform",
    storageBucket: "sbr-scada-platform.firebasestorage.app",
    messagingSenderId: "1010717791850",
    appId: "1:1010717791850:web:9e0d872b95df14b8ad5c13"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Bind auth and database to the global window object for universal access
window.sbrAuth = firebase.auth();
window.sbrDb = firebase.database();