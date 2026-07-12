const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

content = content.replace(
  '<h3 className="font-display font-bold text-lg">Recent Inquiries</h3>',
  '<h3 className="font-display font-bold text-lg">{activeTab === "contact_inquiries" ? "Contact Inquiries" : "Goldi AI Leads"}</h3>'
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
