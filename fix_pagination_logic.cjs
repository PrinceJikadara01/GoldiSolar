const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const tableSectionRegex = /<table className="w-full text-sm text-left">[\s\S]*?<\/table>/m;
const match = content.match(tableSectionRegex);

if (match) {
  const tableContent = match[0];
  
  const replacementHTML = `
                    {(() => {
                      const filteredInquiries = activeTab === "contact_inquiries" 
                        ? inquiries.filter(i => i.type !== "Solar Calculator Lead") 
                        : inquiries.filter(i => i.type === "Solar Calculator Lead");
                      
                      const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
                      const startIndex = (currentPage - 1) * itemsPerPage;
                      const paginatedInquiries = filteredInquiries.slice(startIndex, startIndex + itemsPerPage);

                      return (
                        <>
                          <table className="w-full text-sm text-left">
                            <thead className={\`text-xs uppercase \${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-50 text-slate-500'}\`}>
                              <tr>
                                <th className="px-6 py-3 rounded-tl-xl">Date</th>
                                <th className="px-6 py-3">Name</th>
                                {activeTab === "contact_inquiries" ? (
                                  <>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3 rounded-tr-xl">Message</th>
                                  </>
                                ) : (
                                  <th className="px-6 py-3 rounded-tr-xl">Phone Number</th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {filteredInquiries.length === 0 ? (
                                <tr>
                                  <td colSpan={activeTab === "contact_inquiries" ? 5 : 3} className="px-6 py-8 text-center text-slate-500">
                                    {isFetchingInquiries ? "Loading inquiries..." : "No inquiries found."}
                                  </td>
                                </tr>
                              ) : (
                                paginatedInquiries.map((inq, idx) => (
                                  <tr key={inq.id || idx} className={\`border-b \${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}\`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      {inq.createdAt ? new Date(inq.createdAt._seconds ? inq.createdAt._seconds * 1000 : inq.createdAt).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 font-medium">{inq.firstName} {inq.lastName}</td>
                                    {activeTab === "contact_inquiries" ? (
                                      <>
                                        <td className="px-6 py-4">{inq.email}</td>
                                        <td className="px-6 py-4">
                                          <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
                                            {inq.type}
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={inq.message}>
                                          {inq.message || "-"}
                                        </td>
                                      </>
                                    ) : (
                                      <td className="px-6 py-4">{inq.email ? inq.email.replace("@placeholder.com", "") : "-"}</td>
                                    )}
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                          {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-zinc-800">
                              <span className="text-sm text-slate-500 dark:text-zinc-400">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInquiries.length)} of {filteredInquiries.length} Entries
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                  disabled={currentPage === 1}
                                  className="px-3 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Previous
                                </button>
                                <button
                                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                  disabled={currentPage === totalPages}
                                  className="px-3 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
`;
  content = content.replace(tableContent, replacementHTML.trim());
  fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
} else {
  console.log("Could not find table match");
}
