const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    type: 'Solar Modules Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', type: 'Solar Modules Inquiry', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
`;

let newContent = content.replace('const ContactPage = () => {', 'const ContactPage = () => {\n' + replacement);

newContent = newContent.replace(
  '<form\n            className="glass-panel p-8 md:p-10 flex flex-col gap-6"\n            onSubmit={(e) => e.preventDefault()}\n          >',
  '<form\n            className="glass-panel p-8 md:p-10 flex flex-col gap-6"\n            onSubmit={handleSubmit}\n          >'
);

newContent = newContent.replace(
  'placeholder="John"\n                />',
  'placeholder="John"\n                  value={formData.firstName}\n                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}\n                  required\n                />'
);

newContent = newContent.replace(
  'placeholder="Doe"\n                />',
  'placeholder="Doe"\n                  value={formData.lastName}\n                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}\n                />'
);

newContent = newContent.replace(
  'placeholder="john@example.com"\n              />',
  'placeholder="john@example.com"\n                value={formData.email}\n                onChange={(e) => setFormData({ ...formData, email: e.target.value })}\n                required\n              />'
);

newContent = newContent.replace(
  '<select className="w-full appearance-none',
  '<select\n                  value={formData.type}\n                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}\n                  className="w-full appearance-none'
);

newContent = newContent.replace(
  'placeholder="How can we help you?"\n              />',
  'placeholder="How can we help you?"\n                value={formData.message}\n                onChange={(e) => setFormData({ ...formData, message: e.target.value })}\n                required\n              />'
);

newContent = newContent.replace(
  '<button\n              type="submit"\n              className="btn-primary justify-center mt-2 py-4 text-lg"\n            >\n              Submit Inquiry\n            </button>',
  `
            {submitStatus === 'success' && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-center">
                Your inquiry has been submitted successfully! We will get back to you soon.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-center">
                Failed to submit inquiry. Please try again.
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary justify-center mt-2 py-4 text-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
            </button>
  `
);

fs.writeFileSync('src/App.tsx', newContent);
