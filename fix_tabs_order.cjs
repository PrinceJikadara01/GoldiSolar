const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// replace initial state
content = content.replace(
  'const [activeTab, setActiveTab] = useState<"knowledge" | "contact_inquiries" | "ai_inquiries">("knowledge");',
  'const [activeTab, setActiveTab] = useState<"knowledge" | "contact_inquiries" | "ai_inquiries">("contact_inquiries");'
);

const oldTabs = `          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("knowledge")}
              className={\`px-6 py-3 rounded-full font-bold text-sm transition-all \${activeTab === "knowledge" ? "bg-goldi-blue text-white" : "bg-transparent border border-slate-200 text-slate-500 hover:bg-slate-50"}\`}
            >
              Knowledge Base
            </button>
            <button
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
            </button>
          </div>`;

const newTabs = `          <div className="flex gap-4 mb-6">
            <button
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
            </button>
            <button
              onClick={() => setActiveTab("knowledge")}
              className={\`px-6 py-3 rounded-full font-bold text-sm transition-all \${activeTab === "knowledge" ? "bg-goldi-blue text-white" : "bg-transparent border border-slate-200 text-slate-500 hover:bg-slate-50"}\`}
            >
              Knowledge Base
            </button>
          </div>`;

content = content.replace(oldTabs, newTabs);
fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
