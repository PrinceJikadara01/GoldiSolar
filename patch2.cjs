const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf8');

const endpoints = `
  app.post("/api/inquiries", async (req, res) => {
    try {
      const { firstName, lastName, email, type, message } = req.body;
      if (!firstName || !email) {
        return res.status(400).json({ error: "Name and email are required." });
      }
      
      const inquiry = {
        firstName,
        lastName: lastName || "",
        email,
        type: type || "Other",
        message: message || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "new"
      };
      
      const docRef = await db.collection("inquiries").add(inquiry);
      res.status(201).json({ id: docRef.id, message: "Inquiry saved successfully." });
    } catch (err) {
      console.error("Error saving inquiry:", err);
      res.status(500).json({ error: "Failed to save inquiry." });
    }
  });

  app.get("/api/admin/inquiries", verifyAdmin, async (req, res) => {
    try {
      const snapshot = await db.collection("inquiries").orderBy("createdAt", "desc").limit(100).get();
      const inquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ inquiries });
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      res.status(500).json({ error: "Failed to fetch inquiries." });
    }
  });
  
  // Vite middleware for development
`;

const newContent = content.replace(
  '// Vite middleware for development',
  endpoints
);
fs.writeFileSync('server.ts', newContent);
