const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

content = content.replace(
  '            </div>\n          )}',
  '            </div>\n          ) : null}'
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
