const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  '// Vite middleware for development',
  `app.get("/api/debug-env", (req, res) => {
    res.json(Object.keys(process.env).filter(k => k.includes("FIREBASE") || k.includes("GOOGLE") || k.includes("GCLOUD")));
  });
  // Vite middleware for development`
);
fs.writeFileSync('server.ts', content);
