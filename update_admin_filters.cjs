const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Add Search, Filter icons
if (!content.includes('Search,')) {
  content = content.replace('Users\n}', 'Users,\n  Search,\n  Filter\n}');
}

// Add state variables
if (!content.includes('const [searchQuery, setSearchQuery]')) {
  content = content.replace(
    'const [itemsPerPage] = useState(10);', // fallback just in case
    ''
  );
  content = content.replace(
    '  const itemsPerPage = 10;',
    `  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");`
  );
}

// Add reset filters when changing tabs
content = content.replace(
  'onClick={() => { setActiveTab("contact_inquiries"); setCurrentPage(1); }}',
  'onClick={() => { setActiveTab("contact_inquiries"); setCurrentPage(1); setSearchQuery(""); setDateFilter("all"); setTypeFilter("all"); }}'
);
content = content.replace(
  'onClick={() => { setActiveTab("ai_inquiries"); setCurrentPage(1); }}',
  'onClick={() => { setActiveTab("ai_inquiries"); setCurrentPage(1); setSearchQuery(""); setDateFilter("all"); setTypeFilter("all"); }}'
);
content = content.replace(
  'onClick={() => { setActiveTab("knowledge"); setCurrentPage(1); }}',
  'onClick={() => { setActiveTab("knowledge"); setCurrentPage(1); }}' // knowledge doesn't have these filters
);

// Add the search UI before the table
const originalTableAndStatsMatch = content.match(/<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">[\s\S]*?<table className="w-full text-sm text-left">/);

if (originalTableAndStatsMatch) {
  const replacement = `
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

                          <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                              <Search className={\`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 \${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}\`} />
                              <input 
                                type="text"
                                placeholder="Search by name, email, or message..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={\`w-full pl-9 pr-4 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-goldi-blue/50 \${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-slate-200 text-slate-900'}\`}
                              />
                            </div>
                            <div className="flex gap-2">
                              <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className={\`px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-goldi-blue/50 \${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-slate-200 text-slate-900'}\`}
                              >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                              </select>
                              {activeTab === "contact_inquiries" && (
                                <select
                                  value={typeFilter}
                                  onChange={(e) => setTypeFilter(e.target.value)}
                                  className={\`px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-goldi-blue/50 \${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-slate-200 text-slate-900'}\`}
                                >
                                  <option value="all">All Types</option>
                                  <option value="General Inquiry">General Inquiry</option>
                                  <option value="Solar Consultation">Solar Consultation</option>
                                  <option value="Support">Support</option>
                                  <option value="Partnership">Partnership</option>
                                </select>
                              )}
                            </div>
                          </div>
                          
                          <table className="w-full text-sm text-left">
`;

  content = content.replace(originalTableAndStatsMatch[0], replacement);
}

// Update filteredInquiries logic inside IIFE
const logicToReplace = `                      const filteredInquiries = activeTab === "contact_inquiries" 
                        ? inquiries.filter(i => i.type !== "Solar Calculator Lead") 
                        : inquiries.filter(i => i.type === "Solar Calculator Lead");`;

const logicReplacement = `                      const now = new Date();
                      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                      const weekStart = new Date(now);
                      weekStart.setDate(now.getDate() - now.getDay()); // Start of this week
                      weekStart.setHours(0,0,0,0);
                      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

                      let filteredInquiries = activeTab === "contact_inquiries" 
                        ? inquiries.filter(i => i.type !== "Solar Calculator Lead") 
                        : inquiries.filter(i => i.type === "Solar Calculator Lead");

                      if (searchQuery) {
                        const lowerQuery = searchQuery.toLowerCase();
                        filteredInquiries = filteredInquiries.filter(i => 
                          (i.firstName && i.firstName.toLowerCase().includes(lowerQuery)) ||
                          (i.lastName && i.lastName.toLowerCase().includes(lowerQuery)) ||
                          (i.email && i.email.toLowerCase().includes(lowerQuery)) ||
                          (i.message && i.message.toLowerCase().includes(lowerQuery))
                        );
                      }

                      if (dateFilter !== "all") {
                        filteredInquiries = filteredInquiries.filter(i => {
                          const date = i.createdAt ? new Date(i.createdAt._seconds ? i.createdAt._seconds * 1000 : i.createdAt) : null;
                          if (!date) return false;
                          if (dateFilter === "today") return date >= todayStart;
                          if (dateFilter === "week") return date >= weekStart;
                          if (dateFilter === "month") return date >= monthStart;
                          return true;
                        });
                      }

                      if (activeTab === "contact_inquiries" && typeFilter !== "all") {
                        filteredInquiries = filteredInquiries.filter(i => i.type === typeFilter);
                      }
`;

content = content.replace(logicToReplace, logicReplacement);

// Make sure to remove duplicate "const now = new Date();" etc that were used for stats before
const statsLogicToReplace = `                      const now = new Date();
                      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                      const weekStart = new Date(now);
                      weekStart.setDate(now.getDate() - now.getDay()); // Start of this week
                      weekStart.setHours(0,0,0,0);`;

// this appears twice now, let's remove the second one.
// We can use a regex to replace it
const parts = content.split('const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());');
if(parts.length > 2) {
   // it was added twice, so let's clean it up by replacing the second one
   content = content.replace(
      `                      const now = new Date();
                      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                      const weekStart = new Date(now);
                      weekStart.setDate(now.getDate() - now.getDay()); // Start of this week
                      weekStart.setHours(0,0,0,0);`,
      ''
   );
}


fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
