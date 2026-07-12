const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Replace the Firebase endpoint implementations with local file implementations
const newEndpoints = `
  const INQUIRIES_FILE = path.join(process.cwd(), "inquiries.json");
  
  app.post("/api/inquiries", async (req, res) => {
    try {
      const { firstName, lastName, email, type, message } = req.body;
      if (!firstName || !email) {
        return res.status(400).json({ error: "Name and email are required." });
      }
      
      const inquiry = {
        id: Date.now().toString(),
        firstName,
        lastName: lastName || "",
        email,
        type: type || "Other",
        message: message || "",
        createdAt: Date.now(),
        status: "new"
      };
      
      let inquiries = [];
      if (fs.existsSync(INQUIRIES_FILE)) {
        inquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, "utf8"));
      }
      inquiries.push(inquiry);
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf8");
      
      res.status(201).json({ id: inquiry.id, message: "Inquiry saved successfully." });
    } catch (err) {
      console.error("Error saving inquiry:", err);
      res.status(500).json({ error: "Failed to save inquiry." });
    }
  });

  app.get("/api/admin/inquiries", verifyAdmin, async (req, res) => {
    try {
      let inquiries = [];
      if (fs.existsSync(INQUIRIES_FILE)) {
        inquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, "utf8"));
      }
      inquiries.sort((a, b) => b.createdAt - a.createdAt);
      res.json({ inquiries });
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      res.status(500).json({ error: "Failed to fetch inquiries." });
    }
  });
`;

// we need to replace the old endpoints.
// We can use regex to find them.
content = content.replace(
  /app\.post\("\/api\/inquiries"[\s\S]*?app\.get\("\/api\/admin\/inquiries"[\s\S]*?res\.status\(500\)\.json\(\{ error: "Failed to fetch inquiries\." \}\);\s*\}\s*\}\);/m,
  newEndpoints
);

fs.writeFileSync('server.ts', content);
