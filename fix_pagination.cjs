const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Add pagination states
content = content.replace(
  'const [inquiries, setInquiries] = useState<any[]>([]);',
  `const [inquiries, setInquiries] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;`
);

// Reset page on tab change
content = content.replace(
  'onClick={() => setActiveTab("contact_inquiries")}',
  'onClick={() => { setActiveTab("contact_inquiries"); setCurrentPage(1); }}'
);
content = content.replace(
  'onClick={() => setActiveTab("ai_inquiries")}',
  'onClick={() => { setActiveTab("ai_inquiries"); setCurrentPage(1); }}'
);
content = content.replace(
  'onClick={() => setActiveTab("knowledge")}',
  'onClick={() => { setActiveTab("knowledge"); setCurrentPage(1); }}'
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
