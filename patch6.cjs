const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  'const db = getFirestore();',
  'const db = getFirestore("ai-studio-goldisolar-87f10c8c-361d-4db6-9935-dc43f25a3083");'
);
fs.writeFileSync('server.ts', content);
