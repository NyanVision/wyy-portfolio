/* script.js */

// ── SUPABASE CONFIG ──
const SUPABASE_URL = 'https://giljwcqjqjsngrppsmso.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpbGp3Y3FqcWpzbmdycHBzbXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzE1NjksImV4cCI6MjA5MzgwNzU2OX0.SYBOtppZ3fpaFQAdXx9l59wqQGNqZVe7f4x5kRrB-q4';

// ── SKILL BARS ──
const fills = document.querySelectorAll('.bar-fill');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('loaded'); obs.unobserve(e.target); }
  });
}, { threshold: 0.4 });
fills.forEach(f => obs.observe(f));

// ── CONTACT FORM → SUPABASE ──
document.getElementById('form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  const name        = this.querySelector('input[type="text"]').value.trim();
  const email       = this.querySelector('input[type="email"]').value.trim();
  const project_type = this.querySelectorAll('select')[0].value;
  const budget      = this.querySelectorAll('select')[1].value;
  const message     = this.querySelector('textarea').value.trim();

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
      method: 'POST',
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

    btn.textContent = '✓ Message Sent!';
    btn.classList.add('sent');
    this.reset();

    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.classList.remove('sent');
      btn.disabled = false;
    }, 4000);

  } catch (err) {
    console.error(err);
    btn.textContent = '✗ Failed — Try Again';
    btn.style.background = '#7a2d2d';
    btn.style.color = '#fff';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      btn.style.color = '';
    }, 3500);
  }
});