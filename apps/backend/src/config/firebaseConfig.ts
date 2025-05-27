import admin from "firebase-admin";

const useEmulator = process.env.USE_FIREBASE_EMULATOR === 'true';

if (!admin.apps.length) {
  if (useEmulator) {
    console.log('[Firebase] using Emulator');

    admin.initializeApp({
      projectId: 'demo-firebase',
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  } else {
    console.log('[Firebase] using Firebase Cloud');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }
}

const db = admin.firestore();
const rtdb = admin.database();

if (useEmulator) {
  console.log('[Firebase] setting firestore Emulator on PORT: ', process.env.FIREBASE_STORE_HOST);

  db.settings({
    host: process.env.FIREBASE_STORE_HOST,
    ssl: false,
  });
}

export { admin, db, rtdb };
