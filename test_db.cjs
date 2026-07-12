const admin = require("firebase-admin");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

admin.initializeApp({ projectId: "gen-lang-client-0677594192" });
const db = getFirestore();

async function run() {
  try {
    const docRef = await db.collection("inquiries").add({
      firstName: "Test",
      createdAt: FieldValue.serverTimestamp()
    });
    console.log("Success", docRef.id);
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
