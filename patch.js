const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf8');
const newContent = content.replace(
  'dotenv.config();',
  `dotenv.config();\nimport * as admin from 'firebase-admin';\nif (!admin.apps.length) {\n  admin.initializeApp({ projectId: 'gen-lang-client-0677594192' });\n}\nconst db = admin.firestore();`
);
fs.writeFileSync('server.ts', newContent);
