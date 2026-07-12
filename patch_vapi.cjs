const fs = require('fs');
let code = fs.readFileSync('src/pages/SolarCalculator.tsx', 'utf8');

const importVapi = `import Vapi from "@vapi-ai/web";\n`;
code = code.replace(`import ReactMarkdown from 'react-markdown';`, `import ReactMarkdown from 'react-markdown';\n${importVapi}`);

// Find LeadCapture
const leadCaptureStart = `const LeadCapture = ({ isDarkMode }: { isDarkMode: boolean }) => {`;

const vapiState = `
  const [vapiCallStatus, setVapiCallStatus] = useState<'idle' | 'calling' | 'active' | 'ended'>('idle');
  const [vapiError, setVapiError] = useState('');
  const vapiInstance = useRef<any>(null);
`;

code = code.replace(leadCaptureStart, `${leadCaptureStart}\n${vapiState}`);

const handleSubmitReplacement = `
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: name,
          email: phone + "@placeholder.com",
          phone: phone,
          type: 'Solar Calculator Lead',
          message: 'Phone number: ' + phone
        })
      });
      if (res.ok) {
        setSubmitted(true);
        startVapiCall();
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      vapi.on('error', (e) => {
        console.error('Vapi Error:', e);
        setVapiError(e.message || 'Call failed');
        setVapiCallStatus('ended');
      });
      
      // Override first message dynamically if possible, otherwise use standard assistant
      await vapi.start(config.assistantId);
    } catch (err) {
      console.error(err);
      setVapiError('Failed to start call');
      setVapiCallStatus('ended');
    }
  };
`;

code = code.replace(/const handleSubmit = async.*?};/s, handleSubmitReplacement.trim());

// Now replace the submitted render block
const submittedRender = `
  if (submitted) {
    return (
      <div className={\`mt-4 p-5 rounded-xl border flex flex-col items-center justify-center gap-4 text-center \${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}\`}>
        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        <div>
          <h4 className={\`font-semibold \${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}\`}>Request Received!</h4>
          <p className={\`text-sm mt-1 \${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}\`}>Our Solar AI Assistant is connecting with you now...</p>
        </div>
        
        {vapiCallStatus === 'calling' && (
          <div className="flex items-center gap-2 text-goldi-blue">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium animate-pulse">Dialing...</span>
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
              <span className="text-emerald-500 font-medium text-sm">Call in progress...</span>
              <button 
                onClick={() => {
                  vapiInstance.current?.stop();
                  setVapiCallStatus('ended');
                }}
                className="mt-4 px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-medium transition-colors"
              >
                End Call
              </button>
          </div>
        )}
        
        {vapiCallStatus === 'ended' && (
          <div className="text-sm font-medium text-slate-500">Call Ended.</div>
        )}
        
        {vapiError && (
          <div className="text-xs text-red-500 mt-2">{vapiError}</div>
        )}
      </div>
    );
  }
`;

code = code.replace(/if \(submitted\) \{[\s\S]*?return \([\s\S]*?\);[\s\S]*?\}/, submittedRender.trim());

fs.writeFileSync('src/pages/SolarCalculator.tsx', code);
console.log('Patched SolarCalculator.tsx');
