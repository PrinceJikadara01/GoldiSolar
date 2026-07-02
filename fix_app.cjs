const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace specific bg-white classes that should be dark
code = code.replace(
  'className="relative p-6 bg-white rounded-2xl shadow-sm border border-slate-100"',
  'className="relative p-6 bg-slate-50 rounded-2xl shadow-sm border border-slate-100"'
);

code = code.replace(
  'className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group"',
  'className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group"'
);

code = code.replace(
  'className="shrink-0 px-6 py-3 rounded-full bg-white border border-slate-300 text-slate-900 font-medium hover:bg-slate-50 transition-colors"',
  'className="shrink-0 px-6 py-3 rounded-full bg-slate-50 border border-slate-300 text-slate-900 font-medium hover:bg-slate-100 transition-colors"'
);

// Fix the bg-slate-900 one
code = code.replace(
  'className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden group"',
  'className="bg-goldi-dark rounded-2xl p-8 text-white relative overflow-hidden group"'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed App.tsx');
