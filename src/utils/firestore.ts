import { getFirestore } from "./firebase";

export function getQuestCollection() {
  const firestore = getFirestore();
  return firestore ? firestore.collection("quest") : null;
}
