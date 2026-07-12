const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Add Inquiries state
const inquiriesState = `
  const [activeTab, setActiveTab] = useState<"knowledge" | "inquiries">("knowledge");
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isFetchingInquiries, setIsFetchingInquiries] = useState(false);

  const fetchInquiries = async (pass: string) => {
    setIsFetchingInquiries(true);
    try {
      const res = await fetch("/api/admin/inquiries", {
        headers: { Authorization: \`Bearer \${pass}\` },
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingInquiries(false);
    }
  };
`;

content = content.replace(
  '// Scraper & PDF State',
  inquiriesState + '\n  // Scraper & PDF State'
);

content = content.replace(
  'fetchKnowledgeBase(pass);',
  'fetchKnowledgeBase(pass);\n        fetchInquiries(pass);'
);

// Add Tab UI
const tabUI = `
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("knowledge")}
              className={\`px-6 py-3 rounded-full font-bold text-sm transition-all \${activeTab === "knowledge" ? "bg-goldi-blue text-white" : "bg-transparent border border-slate-200 text-slate-500 hover:bg-slate-50"}\`}
            >
              Knowledge Base
            </button>
            <button
              onClick={() => setActiveTab("inquiries")}
              className={\`px-6 py-3 rounded-full font-bold text-sm transition-all \${activeTab === "inquiries" ? "bg-goldi-blue text-white" : "bg-transparent border border-slate-200 text-slate-500 hover:bg-slate-50"}\`}
            >
              Inquiries
            </button>
          </div>
`;

content = content.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-[600px]">',
  tabUI + '\n          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-[600px]">'
);

// Wrap existing knowledge base UI in condition
content = content.replace(
  '            {/* Data Ingestion Control Panel */}',
  '          {activeTab === "knowledge" ? (\n            <>\n            {/* Data Ingestion Control Panel */}'
);

const inquiriesUI = `
            </>
          ) : (
            <div className="lg:col-span-12">
              <div className={\`p-6 rounded-3xl border shadow-sm flex flex-col \${isDarkMode ? "bg-zinc-900/30 border-zinc-800" : "bg-white border-slate-200"}\`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display font-bold text-lg">Recent Inquiries</h3>
                  <button onClick={() => fetchInquiries(password)} className="text-slate-500 hover:text-goldi-blue">
                    <RefreshCw className={\`w-4 h-4 \${isFetchingInquiries ? "animate-spin" : ""}\`} />
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className={\`text-xs uppercase \${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-50 text-slate-500'}\`}>
                      <tr>
                        <th className="px-6 py-3 rounded-tl-xl">Date</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3 rounded-tr-xl">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                            {isFetchingInquiries ? "Loading inquiries..." : "No inquiries found."}
                          </td>
                        </tr>
                      ) : (
                        inquiries.map((inq, idx) => (
                          <tr key={inq.id || idx} className={\`border-b \${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}\`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {inq.createdAt ? new Date(inq.createdAt._seconds ? inq.createdAt._seconds * 1000 : inq.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 font-medium">{inq.firstName} {inq.lastName}</td>
                            <td className="px-6 py-4">{inq.email}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
                                {inq.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate" title={inq.message}>
                              {inq.message || "-"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
`;

content = content.replace(
  '              </div>\n            </div>\n          </div>',
  '              </div>\n            </div>\n' + inquiriesUI + '\n          </div>'
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
