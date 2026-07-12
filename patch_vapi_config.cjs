const fs = require('fs');

// Update server.ts
let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(
  /apiKey: process\.env\.VAPI_API_KEY \|\| "",/,
  'publicKey: process.env.VAPI_PUBLIC_KEY || process.env.VAPI_API_KEY || "",'
);
fs.writeFileSync('server.ts', serverCode);

// Update App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/config\.apiKey/g, 'config.publicKey');
fs.writeFileSync('src/App.tsx', appCode);

// Update SolarCalculator.tsx
let calcCode = fs.readFileSync('src/pages/SolarCalculator.tsx', 'utf8');
calcCode = calcCode.replace(/config\.apiKey/g, 'config.publicKey');
fs.writeFileSync('src/pages/SolarCalculator.tsx', calcCode);

console.log('Updated Vapi config to use publicKey');
