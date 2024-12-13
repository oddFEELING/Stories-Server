import { cert, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

// const serviceAccount = require();
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDC3ZQ06TRU4ALthkrV9zXPPomLGCeitGI",
  authDomain: "odd-space-stories.firebaseapp.com",
  projectId: "odd-space-stories",
  storageBucket: "odd-space-stories.firebasestorage.app",
  messagingSenderId: "188593441660",
  appId: "1:188593441660:web:39817c6828914b1b68f2f9",
  measurementId: "G-QB4CTTBMTF",
};

const serviceAccount = cert(
  JSON.parse(
    Buffer.from(Bun.env.FIREBASE_SERVICE_ACCOUNT as string, "base64").toString(
      "utf-8",
    ),
  ),
);

const app = initializeApp({
  credential: serviceAccount,
  storageBucket: "odd-space-stories.firebasestorage.app",
});

const bucket = getStorage(app).bucket();

export { app, bucket };
