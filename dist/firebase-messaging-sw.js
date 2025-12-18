importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD6Gh2Kq3EQPP-pV0Zpa1sUS6fP6pATXFY",
  authDomain: "project2-d576e.firebaseapp.com",
  projectId: "project2-d576e",
  storageBucket: "project2-d576e.firebasestorage.app",
  messagingSenderId: "732095008766",
  appId: "1:732095008766:web:a94a01ce0aa34faf337aaf"
});

const messaging = firebase.messaging();
