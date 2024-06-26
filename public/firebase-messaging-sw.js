// firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyAgeA7iw_JBUklQQLNqBM-iHeDEOqUSn1Q",
  authDomain: "ibabycoach-7dbec.firebaseapp.com",
  projectId: "ibabycoach-7dbec",
  storageBucket: "ibabycoach-7dbec.appspot.com",
  messagingSenderId: "554109515453",
  appId: "1:554109515453:web:049082a39737418d4a69d4",
  measurementId: "G-8GTPMTPKV8",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png", // Replace with your app's logo
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
