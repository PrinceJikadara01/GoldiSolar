const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const csvFunction = `  const handleDownloadCSV = () => {
    const filteredInquiries = activeTab === "contact_inquiries" 
      ? inquiries.filter(i => i.type !== "Solar Calculator Lead") 
      : inquiries.filter(i => i.type === "Solar Calculator Lead");

    if (!filteredInquiries.length) {
      alert("No data to export");
      return;
    }

    let csvContent = "";
    if (activeTab === "contact_inquiries") {
      csvContent += "Date,Name,Email,Type,Message\\n";
    } else {
      csvContent += "Date,Name,Phone Number\\n";
    }

    filteredInquiries.forEach(inq => {
      const dateStr = inq.createdAt 
        ? new Date(inq.createdAt._seconds ? inq.createdAt._seconds * 1000 : inq.createdAt).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
        : 'N/A';
        
      const safeString = (str) => {
        if (!str) return '""';
        return '"' + String(str).replace(/"/g, '""') + '"';
      };

      if (activeTab === "contact_inquiries") {
        csvContent += \`\${safeString(dateStr)},\${safeString(inq.firstName + ' ' + inq.lastName)},\${safeString(inq.email)},\${safeString(inq.type)},\${safeString(inq.message)}\\n\`;
      } else {
        const phone = inq.email ? inq.email.replace("@placeholder.com", "") : "-";
        csvContent += \`\${safeString(dateStr)},\${safeString(inq.firstName + ' ' + inq.lastName)},\${safeString(phone)}\\n\`;
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', \`\${activeTab === "contact_inquiries" ? "Contact_Inquiries" : "Goldi_AI_Leads"}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

`;

content = content.replace(
  '  if (!isAuthorized) {',
  csvFunction + '  if (!isAuthorized) {'
);

const headerToReplace = '                  <div className="flex justify-between items-center mb-6">\\n                    <h3 className="font-display font-bold text-lg">{activeTab === "contact_inquiries" ? "Contact Inquiries" : "Goldi AI Leads"}</h3>\\n                    <button onClick={() => fetchInquiries(password)} className="text-slate-500 hover:text-goldi-blue">\\n                      <RefreshCw className={`w-4 h-4 ${isFetchingInquiries ? "animate-spin" : ""}`} />\\n                    </button>\\n                  </div>';

const replacementHeader = `                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-display font-bold text-lg">{activeTab === "contact_inquiries" ? "Contact Inquiries" : "Goldi AI Leads"}</h3>
                    <div className="flex items-center gap-3">
                      <button onClick={handleDownloadCSV} className={\`text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors \${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-300' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}\`}>
                        <Download className="w-4 h-4" />
                        Export CSV
                      </button>
                      <button onClick={() => fetchInquiries(password)} className={\`p-1.5 rounded-lg transition-colors \${isDarkMode ? 'text-zinc-400 hover:text-goldi-blue hover:bg-zinc-800' : 'text-slate-500 hover:text-goldi-blue hover:bg-slate-50'}\`} title="Refresh Data">
                        <RefreshCw className={\`w-4.5 h-4.5 \${isFetchingInquiries ? "animate-spin" : ""}\`} />
                      </button>
                    </div>
                  </div>`;

content = content.replace(
  /<div className="flex justify-between items-center mb-6">[\s\S]*?<\/button>\n\s*<\/div>/m,
  replacementHeader
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
