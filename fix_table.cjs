const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const theadHTML = `
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
`;

const tbodyHTML = `
                      <tbody>
                        {(activeTab === "contact_inquiries" ? inquiries.filter(i => i.type !== "Solar Calculator Lead") : inquiries.filter(i => i.type === "Solar Calculator Lead")).length === 0 ? (
                          <tr>
                            <td colSpan={activeTab === "contact_inquiries" ? 5 : 3} className="px-6 py-8 text-center text-slate-500">
                              {isFetchingInquiries ? "Loading inquiries..." : "No inquiries found."}
                            </td>
                          </tr>
                        ) : (
                          (activeTab === "contact_inquiries" ? inquiries.filter(i => i.type !== "Solar Calculator Lead") : inquiries.filter(i => i.type === "Solar Calculator Lead")).map((inq, idx) => (
                            <tr key={inq.id || idx} className={\`border-b \${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}\`}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {inq.createdAt ? new Date(inq.createdAt._seconds ? inq.createdAt._seconds * 1000 : inq.createdAt).toLocaleDateString() : 'N/A'}
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
`;

const originalTheadRegex = /<thead[\s\S]*?<\/thead>/m;
const originalTbodyRegex = /<tbody[\s\S]*?<\/tbody>/m;

content = content.replace(originalTheadRegex, theadHTML.trim());
content = content.replace(originalTbodyRegex, tbodyHTML.trim());

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
