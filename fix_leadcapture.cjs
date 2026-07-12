const fs = require('fs');
let content = fs.readFileSync('src/pages/SolarCalculator.tsx', 'utf8');

const replacement = `
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

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
          email: phone + "@placeholder.com", // Using phone as email placeholder since email is required by backend
          type: 'Solar Calculator Lead',
          message: 'Phone number: ' + phone
        })
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };
`;

let newContent = content.replace(
  "  const [submitted, setSubmitted] = useState(false);\n  const [name, setName] = useState('');\n  const [phone, setPhone] = useState('');",
  replacement
);

newContent = newContent.replace(
  '<form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-3">',
  '<form onSubmit={handleSubmit} className="space-y-3">'
);

newContent = newContent.replace(
  '<button \n          type="submit" \n          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-goldi-blue hover:bg-[#0A3B73] text-white text-sm font-medium transition-colors"\n        >\n          Request Callback <ArrowRightCircle className="w-4 h-4" />\n        </button>',
  `
        {error && <div className="text-red-500 text-xs">Failed to submit. Please try again.</div>}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-goldi-blue hover:bg-[#0A3B73] text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : <>Request Callback <ArrowRightCircle className="w-4 h-4" /></>}
        </button>
  `
);

fs.writeFileSync('src/pages/SolarCalculator.tsx', newContent);
