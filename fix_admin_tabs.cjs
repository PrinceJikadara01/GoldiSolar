const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// replace activeTab type
content = content.replace(
  'const [activeTab, setActiveTab] = useState<"knowledge" | "inquiries">("knowledge");',
  'const [activeTab, setActiveTab] = useState<"knowledge" | "contact_inquiries" | "ai_inquiries">("knowledge");'
);

// replace buttons
content = content.replace(
  '<button\n              onClick={() => setActiveTab("inquiries")}\n              className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${activeTab === "inquiries" ? "bg-goldi-blue text-white" : "bg-transparent border border-slate-200 text-slate-500 hover:bg-slate-50"}`}\n            >\n              Inquiries\n            </button>',
  `<button
              onClick={() => setActiveTab("contact_inquiries")}
              className={\`px-6 py-3 rounded-full font-bold text-sm transition-all \${activeTab === "contact_inquiries" ? "bg-goldi-blue text-white" : "bg-transparent border border-slate-200 text-slate-500 hover:bg-slate-50"}\`}
            >
              Contact Inquiries
            </button>
            <button
              onClick={() => setActiveTab("ai_inquiries")}
              className={\`px-6 py-3 rounded-full font-bold text-sm transition-all \${activeTab === "ai_inquiries" ? "bg-goldi-blue text-white" : "bg-transparent border border-slate-200 text-slate-500 hover:bg-slate-50"}\`}
            >
              Goldi AI Leads
            </button>`
);

// replace rendering logic
// Currently: `) : activeTab === "inquiries" ? (`
content = content.replace(
  ') : activeTab === "inquiries" ? (',
  ') : activeTab === "contact_inquiries" || activeTab === "ai_inquiries" ? ('
);

content = content.replace(
  /inquiries\.map\(\(inq,\s*idx\)\s*=>\s*\(/g,
  `(activeTab === "contact_inquiries" ? inquiries.filter(i => i.type !== "Solar Calculator Lead") : inquiries.filter(i => i.type === "Solar Calculator Lead")).map((inq, idx) => (`
);

content = content.replace(
  'inquiries.length === 0',
  '(activeTab === "contact_inquiries" ? inquiries.filter(i => i.type !== "Solar Calculator Lead") : inquiries.filter(i => i.type === "Solar Calculator Lead")).length === 0'
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
