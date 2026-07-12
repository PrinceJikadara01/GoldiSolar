const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

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

content = content.replace(
  'const Contact = () => (\\n  <PageTransition>',
  'const Contact = () => {\\n' + replacement + '\\n  return (\\n  <PageTransition>'
);
content = content.replace(
  'const Contact = () => (\n  <PageTransition>',
  'const Contact = () => {\n' + replacement + '\n  return (\n  <PageTransition>'
);

// also we need to add the closing brace at the end of Contact component
// Let's find where it ends
// It ends right before `const ScrollToTop = () => {`
content = content.replace(
  '  </PageTransition>\n);\n\nconst ScrollToTop = () => {',
  '  </PageTransition>\n  );\n};\n\nconst ScrollToTop = () => {'
);
fs.writeFileSync('src/App.tsx', content);
