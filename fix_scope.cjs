const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const regex = /\{\(\(\) => \{\n\s*const monthStart = new Date\(now\.getFullYear\(\), now\.getMonth\(\), 1\);\n\s*let filteredInquiries[\s\S]*?const now = new Date\(\);\n\s*const todayStart = new Date\(now\.getFullYear\(\), now\.getMonth\(\), now\.getDate\(\)\);\n\s*const weekStart = new Date\(now\);\n\s*weekStart\.setDate\(now\.getDate\(\) - now\.getDay\(\)\); \/\/ Start of this week\n\s*weekStart\.setHours\(0,0,0,0\);/;

const replacement = `{(() => {
                      const now = new Date();
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
                      }`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
