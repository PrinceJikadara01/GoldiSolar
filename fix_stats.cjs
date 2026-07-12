const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

if (!content.includes('Calendar')) {
  content = content.replace('Upload\n}', 'Upload,\n  Calendar,\n  TrendingUp,\n  Users\n}');
}

const functionStr = `                    {(() => {
                      const filteredInquiries = activeTab === "contact_inquiries" 
                        ? inquiries.filter(i => i.type !== "Solar Calculator Lead") 
                        : inquiries.filter(i => i.type === "Solar Calculator Lead");
                      
                      const now = new Date();
                      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                      const weekStart = new Date(now);
                      weekStart.setDate(now.getDate() - now.getDay()); // Start of this week
                      weekStart.setHours(0,0,0,0);
                      
                      const stats = filteredInquiries.reduce((acc, inq) => {
                        acc.total++;
                        const date = inq.createdAt ? new Date(inq.createdAt._seconds ? inq.createdAt._seconds * 1000 : inq.createdAt) : null;
                        if (date) {
                          if (date >= todayStart) {
                            acc.today++;
                          }
                          if (date >= weekStart) {
                            acc.week++;
                          }
                        }
                        return acc;
                      }, { total: 0, today: 0, week: 0 });

                      const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage) || 1;
                      const startIndex = (currentPage - 1) * itemsPerPage;
                      const paginatedInquiries = filteredInquiries.slice(startIndex, startIndex + itemsPerPage);

                      return (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className={\`p-4 rounded-2xl border flex items-center gap-4 \${isDarkMode ? 'bg-zinc-800/50 border-zinc-700/50' : 'bg-slate-50 border-slate-100'}\`}>
                              <div className="w-10 h-10 rounded-full bg-goldi-blue/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-goldi-blue" />
                              </div>
                              <div>
                                <p className={\`text-xs font-medium \${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}\`}>Total Inquiries</p>
                                <p className="text-xl font-bold">{stats.total}</p>
                              </div>
                            </div>
                            <div className={\`p-4 rounded-2xl border flex items-center gap-4 \${isDarkMode ? 'bg-zinc-800/50 border-zinc-700/50' : 'bg-slate-50 border-slate-100'}\`}>
                              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-emerald-500" />
                              </div>
                              <div>
                                <p className={\`text-xs font-medium \${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}\`}>Today</p>
                                <p className="text-xl font-bold">{stats.today}</p>
                              </div>
                            </div>
                            <div className={\`p-4 rounded-2xl border flex items-center gap-4 \${isDarkMode ? 'bg-zinc-800/50 border-zinc-700/50' : 'bg-slate-50 border-slate-100'}\`}>
                              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-amber-500" />
                              </div>
                              <div>
                                <p className={\`text-xs font-medium \${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}\`}>This Week</p>
                                <p className="text-xl font-bold">{stats.week}</p>
                              </div>
                            </div>
                          </div>
                          <table className="w-full text-sm text-left">`;

const targetStr = '{(() => {\\n                      const filteredInquiries = activeTab === "contact_inquiries" \\n                        ? inquiries.filter(i => i.type !== "Solar Calculator Lead") \\n                        : inquiries.filter(i => i.type === "Solar Calculator Lead");\\n                      \\n                      const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);\\n                      const startIndex = (currentPage - 1) * itemsPerPage;\\n                      const paginatedInquiries = filteredInquiries.slice(startIndex, startIndex + itemsPerPage);\\n\\n                      return (\\n                        <>\\n                          <table className="w-full text-sm text-left">';

content = content.replace(
  /\{\(\(\) => \{\n\s*const filteredInquiries[\s\S]*?<table className="w-full text-sm text-left">/,
  functionStr
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
