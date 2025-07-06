
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDi0SSHkvPw_M1GZgCCcHK6mXuxzKLOdHs",
  authDomain: "cyhome-b363b.firebaseapp.com",
  projectId: "cyhome-b363b",
  storageBucket: "cyhome-b363b.firebasestorage.app",
  messagingSenderId: "197469415376",
  appId: "1:197469415376:web:37e8dc9636e5751fe83bd5",
  measurementId: "G-XC3K4JJTHP"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

