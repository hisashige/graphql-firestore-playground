import * as admin from "firebase-admin";

let firebaseApp: admin.app.App | null = null;
export function getFirebaseApp() {
  return firebaseApp;
}

const serviceAccount = require("../../serviceAccountKey-dev.json");

export async function initFirebase() {
  if (!firebaseApp) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    const firestore = admin.firestore();
    firestore.settings({ timestampsInSnapshots: true });
  }
}

export function getFirestore() {
  return firebaseApp ? firebaseApp.firestore() : null;
}
