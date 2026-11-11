// Compose locally so project details go directly through the visitor's email app.
// No details are stored by the site or sent to an external form service.
export function buildProjectEmail(data) {
  const value = (name, fallback = 'Not specified') => String(data.get(name) || '').trim() || fallback;
  const name = value('name');
  const services = data.getAll('services').join(', ') || 'Let’s discuss';
  const subject = `Project enquiry — ${name.replace(/[\r\n]+/g, ' ')}`;
  const body = [
    'Hi Yadunand,',
    '',
    value('message', ''),
    '',
    `Name: ${name}`,
    `Email: ${value('email')}`,
    `Company: ${value('company')}`,
    `Services: ${services}`,
    `Budget: ${value('budget', 'Let’s discuss')}`,
    `Deadline: ${value('deadline', 'Flexible')}`,
  ].join('\r\n');
  return `mailto:yadunandpavithran05@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const form = typeof document !== 'undefined' && document.querySelector('[data-contact-form]');

if (form) {
  const status = form.querySelector('[data-form-status]');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const href = buildProjectEmail(new FormData(form));
    try {
      window.location.assign(href);
      status.textContent = 'Continue in your email app to send your message. If nothing opens, email me directly using the address beside the form.';
    } catch {
      status.textContent = 'Please email me directly at yadunandpavithran05@gmail.com. Your details are still here to copy.';
    }
  });
}
