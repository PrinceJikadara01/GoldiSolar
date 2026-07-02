const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
const index = css.indexOf('body.global-dark {');
if (index !== -1) {
  css = css.substring(0, index) + `body.global-dark {
  background-color: #050505 !important;
  color: #f4f4f5 !important;
  
  --color-slate-50: #050505;
  --color-slate-100: #0a0a0a;
  --color-slate-200: #171717;
  --color-slate-300: #262626;
  --color-slate-400: #52525b;
  --color-slate-500: #71717a;
  --color-slate-600: #a1a1aa;
  --color-slate-700: #d4d4d8;
  --color-slate-800: #e4e4e7;
  --color-slate-900: #f4f4f5;
}

/* Specific component fixes for dark mode */
body.global-dark .hover\\:bg-slate-50:hover {
  background-color: rgba(140, 198, 63, 0.1) !important;
}
body.global-dark .text-goldi-blue {
  color: #8CC63F !important;
}
body.global-dark .bg-goldi-blue {
  background-color: #8CC63F !important;
  color: #050505 !important;
}
body.global-dark .border-goldi-blue {
  border-color: #8CC63F !important;
}
body.global-dark .bg-goldi-blue\\/10 {
  background-color: rgba(140, 198, 63, 0.1) !important;
}
body.global-dark .border-goldi-blue\\/30 {
  border-color: rgba(140, 198, 63, 0.3) !important;
}
`;
  fs.writeFileSync('src/index.css', css);
  console.log('Fixed index.css');
}
