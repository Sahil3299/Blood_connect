/* Shared JS for BloodConnect Advanced Frontend */
const STORAGE_KEY = 'bloodconnect_donors_v2';

function uid() { return 'd_' + Math.random().toString(36).slice(2, 9); }
function readStorage() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; } }
function writeStorage(arr) { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }

const donorForm = document.getElementById('donorForm');
if (donorForm) {
  donorForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(donorForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok) {
        document.getElementById('msg').textContent = 'Registration successful!';
        donorForm.reset();
      } else {
        document.getElementById('msg').textContent = result.message || 'Error registering donor.';
      }
    } catch (err) {
      document.getElementById('msg').textContent = 'Server error. Please try again.';
    }
  });
}

async function renderSearchResults() {
  const city = (document.getElementById('searchCity').value || '').trim();
  const bloodGroup = (document.getElementById('searchGroup').value || '').trim();
  const list = document.getElementById('donorList');
  list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--muted);"><div style="font-size: 24px; margin-bottom: 16px;">⏳</div><div>Searching for donors...</div></div>';

  try {
    const params = new URLSearchParams();
    if (bloodGroup) params.append('bloodGroup', bloodGroup);
    if (city) params.append('city', city);

    const res = await fetch(`/api/search?${params.toString()}`);
    const donors = await res.json();

    document.getElementById('count').textContent = donors.length;

    if (!donors.length) {
      list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--muted);"><div style="font-size: 48px; margin-bottom: 16px;">🔍</div><div>No donors found matching your criteria.</div><div style="font-size: 14px; margin-top: 8px;">Try adjusting your search filters.</div></div>';
      return;
    }

    list.innerHTML = donors.map(d =>
      `<div class="donor-card">
        <div class="donor-info">
          <div class="donor-name">${escapeHtml(d.name)}</div>
          <div class="donor-details">
            <div>📍 ${escapeHtml(d.city)}</div>
            <div>📞 ${escapeHtml(d.contact)}</div>
            ${d.age ? `<div>👤 Age: ${d.age} years</div>` : ''}
            ${d.gender ? `<div>⚧ ${escapeHtml(d.gender)}</div>` : ''}
            ${d.notes ? `<div>📝 ${escapeHtml(d.notes)}</div>` : ''}
          </div>
        </div>
        <div class="blood-badge">${escapeHtml(d.bloodGroup)}</div>
      </div>`
    ).join('');
  } catch (err) {
    list.innerHTML = '<div style="text-align: center; padding: 40px; color: #ff6b6b;"><div style="font-size: 24px; margin-bottom: 16px;">⚠️</div><div>Error fetching donors.</div><div style="font-size: 14px; margin-top: 8px;">Please try again later.</div></div>';
  }
}

function showMsg(m, type = 'ok') {
  const el = document.getElementById('formMsg');
  if (!el) return;
  el.textContent = m;
  el.style.color = type === 'error' ? '#ffb4b4' : '#b6ffd9';
  el.classList.add('fadeUp', 'show');
  setTimeout(() => { el.classList.remove('show'); }, 2200);
}

const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
  searchBtn.addEventListener('click', () => renderSearchResults());
  document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('searchCity').value = '';
    document.getElementById('searchGroup').value = '';
    renderSearchResults();
  });
  renderSearchResults();
}

function escapeHtml(s) { if (!s) return ''; return String(s).replace(/[&<>\"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', '\'': '&#39;' }[c])); }

const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('show'); io.unobserve(en.target); }
  });
}, { threshold: 0.15 });
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fadeUp').forEach(el => io.observe(el));
  /* Counters */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const fn = () => {
      cur += step;
      if (cur >= target) { el.textContent = String(target); }
      else { el.textContent = String(cur); requestAnimationFrame(fn); }
    };
    const cObserver = new IntersectionObserver((ents) => { if (ents[0].isIntersecting) { fn(); cObserver.disconnect(); } }, { threshold: 0.3 });
    cObserver.observe(el);
  });
});

function seedSample() {
  const arr = readStorage();
  if (arr.length > 0) return;
  const sample = [
    { id: uid(), name: 'Asha Nair', age: 29, gender: 'Female', bloodGroup: 'O+', city: 'Pune', contact: '+919876543210', notes: 'Available weekdays' },
    { id: uid(), name: 'Ravi Gupta', age: 34, gender: 'Male', bloodGroup: 'B+', city: 'Mumbai', contact: '+919812345678', notes: 'Last donated: 2024-10-01' },
    { id: uid(), name: 'Meera Shah', age: 41, gender: 'Female', bloodGroup: 'A-', city: 'Bengaluru', contact: '+919998887776', notes: 'Can donate mornings' }
  ];
  writeStorage(sample);
}
seedSample();
