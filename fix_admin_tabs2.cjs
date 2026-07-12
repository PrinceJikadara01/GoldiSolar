const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// replace rendering logic
content = content.replace(
  '          </div>\n          ) : (',
  '          </div>\n          ) : activeTab === "contact_inquiries" || activeTab === "ai_inquiries" ? ('
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
