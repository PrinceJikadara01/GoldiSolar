const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importVapi = `import Vapi from "@vapi-ai/web";\n`;
code = code.replace(`import React, { Suspense } from 'react';`, `import React, { Suspense, useRef, useState } from 'react';\n${importVapi}`);

const contactStart = `const Contact = () => {`;
const vapiState = `
  const [vapiCallStatus, setVapiCallStatus] = React.useState<'idle' | 'calling' | 'active' | 'ended'>('idle');
  const [vapiError, setVapiError] = React.useState('');
  const vapiInstance = React.useRef<any>(null);

  const startVapiCall = async () => {
    try {
      setVapiCallStatus('calling');
      const configRes = await fetch('/api/vapi/config');
      const config = await configRes.json();
      
      if (!config.apiKey || !config.assistantId) {
        setVapiError('Vapi configuration missing on server.');
        setVapiCallStatus('idle');
        return;
      }
      
      const vapi = new Vapi(config.apiKey);
      vapiInstance.current = vapi;
      
      vapi.on('call-start', () => setVapiCallStatus('active'));
      vapi.on('call-end', () => setVapiCallStatus('ended'));
      vapi.on('error', (e: any) => {
        console.error('Vapi Error:', e);
        setVapiError(e.message || 'Call failed');
        setVapiCallStatus('ended');
      });
      
      await vapi.start(config.assistantId);
    } catch (err) {
      console.error(err);
      setVapiError('Failed to start call');
      setVapiCallStatus('ended');
    }
  };
`;

code = code.replace(contactStart, `${contactStart}\n${vapiState}`);

const oldHandleSubmit = `
      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', type: 'Solar Modules Inquiry', message: '' });
      } else {
`;
const newHandleSubmit = `
      if (res.ok) {
        setSubmitStatus('success');
        startVapiCall();
      } else {
`;

code = code.replace(oldHandleSubmit, newHandleSubmit);

const successMessageOld = `
              {submitStatus === 'success' && (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-200">
                  Thank you for your inquiry! Our team will contact you shortly.
                </div>
              )}
`;

const successMessageNew = `
              {submitStatus === 'success' && (
                <div className="bg-emerald-50 text-emerald-700 p-6 rounded-xl border border-emerald-200 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-3" />
                  <div className="font-semibold text-emerald-800">Thank you for your inquiry!</div>
                  <div className="text-sm mt-1 mb-4">Our AI assistant is calling you right now...</div>
                  
                  {vapiCallStatus === 'calling' && (
                    <div className="flex items-center gap-2 text-goldi-blue">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm font-medium animate-pulse">Dialing via Web...</span>
                    </div>
                  )}
                  
                  {vapiCallStatus === 'active' && (
                    <div className="flex flex-col items-center">
                       <div className="relative flex h-12 w-12 items-center justify-center mb-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-10 w-10 bg-emerald-500 items-center justify-center">
                            <Phone className="w-4 h-4 text-white" />
                          </span>
                        </div>
                        <span className="text-emerald-500 font-medium text-sm">Call in progress... (Speak into microphone)</span>
                        <button 
                          onClick={() => {
                            vapiInstance.current?.stop();
                            setVapiCallStatus('ended');
                          }}
                          type="button"
                          className="mt-4 px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-medium transition-colors"
                        >
                          End Call
                        </button>
                    </div>
                  )}
                  
                  {vapiCallStatus === 'ended' && (
                    <div className="text-sm font-medium text-slate-500">Call Ended. <button type="button" onClick={() => setSubmitStatus('idle')} className="text-goldi-blue underline">Send another inquiry</button></div>
                  )}
                  
                  {vapiError && (
                    <div className="text-xs text-red-500 mt-2">{vapiError}</div>
                  )}
                </div>
              )}
`;

code = code.replace(successMessageOld.trim(), successMessageNew.trim());

fs.writeFileSync('src/App.tsx', code);
console.log('Patched App.tsx');
