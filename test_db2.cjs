const admin = require("firebase-admin");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

admin.initializeApp();
const db = getFirestore("ai-studio-goldisolar-87f10c8c-361d-4db6-9935-dc43f25a3083");

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
