/* script.js */

// Existing public contact-form configuration.
const SUPABASE_URL = 'https://giljwcqjqjsngrppsmso.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpbGp3Y3FqcWpzbmdycHBzbXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzE1NjksImV4cCI6MjA5MzgwNzU2OX0.SYBOtppZ3fpaFQAdXx9l59wqQGNqZVe7f4x5kRrB-q4';

document.getElementById('year').textContent = new Date().getFullYear();

// Contact form submission.
document.getElementById('form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const btn = document.getElementById('submit-btn');
  if (btn.disabled) return;
  const status = document.getElementById('form-status');
  status.className = '';
  status.textContent = 'Sending your message...';
  btn.disabled = true;
  btn.textContent = 'Sending...';

  const name        = this.querySelector('input[type="text"]').value.trim();
  const email       = this.querySelector('input[type="email"]').value.trim();
  const project_type = this.querySelectorAll('select')[0].value;
  const budget      = this.querySelectorAll('select')[1].value;
  const message     = this.querySelector('textarea').value.trim();

  if (!name || !message) {
    status.className = 'error';
    status.textContent = 'Please enter your name and a message.';
    btn.disabled = false;
    btn.textContent = 'Send message';
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ name, email, project_type, budget, message })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Something went wrong');
    }

    btn.textContent = 'Message sent';
    status.textContent = 'Thank you. Your message has been received.';
    btn.classList.add('sent');
    this.reset();

    setTimeout(() => {
      btn.textContent = 'Send message';
      btn.classList.remove('sent');
      btn.disabled = false;
    }, 4000);

  } catch (err) {
    console.error(err);
    btn.textContent = 'Try again';
    status.className = 'error';
    status.textContent = 'Your message could not be sent. Please try again or email winyellyint19@gmail.com.';
    btn.style.background = '#7a2d2d';
    btn.style.color = '#fff';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = 'Send message';
      btn.style.background = '';
      btn.style.color = '';
    }, 3500);
  } finally {
    clearTimeout(timeout);
  }
});