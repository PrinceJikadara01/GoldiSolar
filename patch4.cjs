const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf8');

let newContent = content.replace(
  `import * as admin from 'firebase-admin';
if (!admin.apps.length) {
  admin.initializeApp({ projectId: 'gen-lang-client-0677594192' });
}
const db = admin.firestore();`,
  `import * as admin from 'firebase-admin';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({ projectId: 'gen-lang-client-0677594192' });
}
const db = getFirestore();`
);

newContent = newContent.replace('admin.firestore.FieldValue.serverTimestamp()', 'FieldValue.serverTimestamp()');
fs.writeFileSync('server.ts', newContent);
