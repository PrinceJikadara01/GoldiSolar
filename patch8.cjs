const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  'res.status(500).json({ error: "Failed to save inquiry." });',
  'res.status(500).json({ error: err.toString() });'
);
fs.writeFileSync('server.ts', content);
