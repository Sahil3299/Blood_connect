/* ==========================================================================
   BloodConnect - Professional UI JavaScript
   Light Theme
   ========================================================================== */

const STORAGE_KEY = 'bloodconnect_donors_v2';

// ======= AUTH MANAGEMENT =======
function getToken() { return localStorage.getItem('token'); }
function getUser() { 
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}
function getAuthHeaders() {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}
function isAuthenticated() { return !!getToken(); }

// Utility Functions
function uid() { return 'd_' + Math.random().toString(36).slice(2, 9); }

function readStorage() { 
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } 
  catch (e) { return []; } 
}

function writeStorage(arr) { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }

function escapeHtml(s) { 
  if (!s) return ''; 
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '<', '>': '>', '"': '"', '\'': '&#39;' }[c])); 
}

/* ==========================================================================
   Auth UI Management
   ========================================================================== */
function updateAuthUI() {
  const authLinksEl = document.getElementById('authLinks');
  if (!authLinksEl) return;

  const p = (window.location.pathname || '').toLowerCase();
  const isRegister = p.endsWith('/register.html') || p === '/register';
  const isSearch = p.endsWith('/search.html') || p === '/search';
  const isLogin = p.endsWith('/login.html') || p === '/login';
  const isSignup = p.endsWith('/signup.html') || p === '/signup';

  if (isAuthenticated()) {
    const user = getUser();
    const userName = user ? user.name : 'User';
    authLinksEl.innerHTML = `
      <a href="register.html" class="nav-link ${isRegister ? 'active' : ''}">Register Donor</a>
      <a href="search.html" class="nav-link ${isSearch ? 'active' : ''}">Search Donors</a>
      <span style="display: inline-block; margin: 0 0.5rem; color: var(--gray-600);">|</span>
      <span style="display: inline-block; margin: 0 0.5rem; color: var(--gray-700);">${escapeHtml(userName)}</span>
      <button onclick="handleLogout()" class="nav-link" style="background: none; border: none; cursor: pointer; padding: 0;">
        <i class="bi bi-box-arrow-right"></i> Logout
      </button>
    `;
  } else {
    authLinksEl.innerHTML = `
      <a href="login.html" class="nav-link ${isLogin ? 'active' : ''}">Login</a>
      <a href="signup.html" class="nav-link ${isSignup ? 'active' : ''}">Signup</a>
    `;
  }
}

function updateHeroActions() {
  const heroActionsEl = document.getElementById('heroActions');
  if (!heroActionsEl) return;

  if (isAuthenticated()) {
    heroActionsEl.innerHTML = `
      <a href="register.html" class="btn btn-primary btn-lg">
        <i class="bi bi-heart-fill"></i> Register as Donor
      </a>
      <a href="search.html" class="btn btn-secondary btn-lg">
        <i class="bi bi-search"></i> Search Donors
      </a>
    `;
  } else {
    heroActionsEl.innerHTML = `
      <a href="signup.html" class="btn btn-primary btn-lg">
        <i class="bi bi-person-plus-fill"></i> Create Account
      </a>
      <a href="login.html" class="btn btn-secondary btn-lg">
        <i class="bi bi-box-arrow-in-right"></i> Login
      </a>
    `;
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateAuthUI();
  updateHeroActions();
  showSuccess('Logged Out', 'You have been logged out successfully.');
  setTimeout(() => { window.location.href = '/'; }, 1000);
}

/* ==========================================================================
   Toast Notifications
   ========================================================================== */

function showToast(title, message, type = 'info', duration = 5000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill'
  };
  
  toast.innerHTML = `
    <i class="bi ${icons[type]} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="bi bi-x"></i>
    </button>
  `;
  
  container.appendChild(toast);
  
  // Auto-remove after duration
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Convenience toast functions
function showSuccess(title, message) { showToast(title, message, 'success'); }
function showError(title, message) { showToast(title, message, 'error'); }
function showWarning(title, message) { showToast(title, message, 'warning'); }
function showInfo(title, message) { showToast(title, message, 'info'); }

/* ==========================================================================
   Authentication Helper
   ========================================================================== */

// (De-duped) Use the shared implementations defined at top of file:
// - getAuthHeaders()
// - isAuthenticated()

/* ==========================================================================
   Loading Spinner
   ========================================================================== */

function showLoading(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  
  el.classList.add('btn-loading');
  const spinner = el.querySelector('.btn-spinner');
  if (spinner) spinner.style.display = 'block';
}

function hideLoading(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  
  el.classList.remove('btn-loading');
  const spinner = el.querySelector('.btn-spinner');
  if (spinner) spinner.style.display = 'none';
}

/* ==========================================================================
   Form Validation
   ========================================================================== */

function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return true;
  
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      isValid = false;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    }
    
    // Remove validation class on input
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid', 'is-valid');
    });
  });
  
  return isValid;
}

/* ==========================================================================
   Donor Registration Form
   ========================================================================== */

const donorForm = document.getElementById('donorForm');
if (donorForm) {
  donorForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm('donorForm')) {
      showError('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    showLoading('submitBtn');
    
    const formData = new FormData(donorForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/donor/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      
      if (res.ok) {
        showSuccess('Registration Successful!', 'Thank you for registering as a donor. Your information has been saved.');
        donorForm.reset();
        // Remove validation classes
        donorForm.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
          el.classList.remove('is-valid', 'is-invalid');
        });
      } else {
        showError('Registration Failed', result.message || 'Error registering donor. Please try again.');
      }
    } catch (err) {
      showError('Connection Error', 'Server error. Please try again later.');
      console.error('Registration error:', err);
    } finally {
      hideLoading('submitBtn');
    }
  });
}

/* ==========================================================================
   Contact Form Handler
   ========================================================================== */

function handleContactSubmit() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  // Check form validity
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('is-invalid');
      isValid = false;
    }
  });
  
  if (!isValid) {
    showError('Validation Error', 'Please fill in all required fields correctly.');
    return;
  }
  
  const submitBtn = document.getElementById('submitBtn');
  showLoading('submitBtn');
  
  // Simulate form submission
  setTimeout(() => {
    hideLoading('submitBtn');
    showSuccess('Message Sent!', 'Thank you for contacting us. We will get back to you soon.');
    form.reset();
    form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
      el.classList.remove('is-valid', 'is-invalid');
    });
  }, 1500);
}

/* ==========================================================================
   Search Functionality
   ========================================================================== */

async function renderSearchResults() {
  const city = (document.getElementById('searchCity')?.value || '').trim();
  const bloodGroup = (document.getElementById('searchGroup')?.value || '').trim();
  const list = document.getElementById('donorList');
  const countEl = document.getElementById('count');
  
  if (!list) return;
  
  // Show loading state
  list.innerHTML = `
    <div class="empty-state">
      <div style="width: 40px; height: 40px; border: 3px solid var(--gray-200); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem;"></div>
      <p style="color: var(--gray-500);">Searching for donors...</p>
    </div>
  `;

  try {
    const params = new URLSearchParams();
    if (bloodGroup) params.append('bloodGroup', bloodGroup);
    if (city) params.append('city', city);

    const res = await fetch(`/api/donor/search?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    const donors = await res.json();

    if (countEl) countEl.textContent = donors.length;

    if (!donors.length) {
      list.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="empty-state-title">No Donors Found</h3>
          <p class="empty-state-description">No donors match your search criteria. Try adjusting your filters or register as a donor to help others.</p>
          <a href="register.html" class="btn btn-primary">
            <i class="bi bi-heart-fill"></i> Register as Donor
          </a>
        </div>
      `;
      return;
    }

    list.innerHTML = donors.map(d => `
      <div class="donor-card">
        <div class="donor-avatar">${escapeHtml(d.name.charAt(0).toUpperCase())}</div>
        <div class="donor-info">
          <h4 class="donor-name">${escapeHtml(d.name)}</h4>
          <div class="donor-meta">
            <span><i class="bi bi-geo-alt"></i> ${escapeHtml(d.city)}</span>
            <span><i class="bi bi-telephone"></i> ${escapeHtml(d.contact)}</span>
            ${d.age ? `<span><i class="bi bi-person"></i> ${d.age} yrs</span>` : ''}
            ${d.gender ? `<span><i class="bi bi-gender-ambiguous"></i> ${escapeHtml(d.gender)}</span>` : ''}
          </div>
          ${d.notes ? `<p style="font-size: 0.8125rem; color: var(--gray-500); margin-top: 0.5rem; margin-bottom: 0;"><i class="bi bi-chat-left-text"></i> ${escapeHtml(d.notes)}</p>` : ''}
        </div>
        <div class="blood-badge">${escapeHtml(d.bloodGroup)}</div>
        <div class="donor-actions">
          <a class="btn btn-outline btn-sm call-btn" href="tel:${d.contact}">
            <i class="bi bi-telephone"></i> Call
          </a>
        </div>
      </div>
    `).join('');
    
    showInfo('Search Complete', `Found ${donors.length} donor${donors.length !== 1 ? 's' : ''} matching your criteria.`);
    
  } catch (err) {
    console.error('Search error:', err);
    list.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="var(--error)">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="empty-state-title">Error Fetching Donors</h3>
        <p class="empty-state-description">Something went wrong. Please try again later.</p>
        <button class="btn btn-primary" onclick="renderSearchResults()">
          <i class="bi bi-arrow-clockwise"></i> Try Again
        </button>
      </div>
    `;
    showError('Search Error', 'Failed to fetch donors. Please try again.');
  }
}

// Search button event listeners
const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
  searchBtn.addEventListener('click', () => renderSearchResults());
  
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const searchCity = document.getElementById('searchCity');
      const searchGroup = document.getElementById('searchGroup');
      if (searchCity) searchCity.value = '';
      if (searchGroup) searchGroup.value = '';
      renderSearchResults();
    });
  }
  
  // Initial search on page load
  renderSearchResults();
}

/* ==========================================================================
   Animations
   ========================================================================== */

// Intersection Observer for fade-up animations
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) { 
      en.target.classList.add('show'); 
      io.unobserve(en.target); 
    }
  });
}, { threshold: 0.1 });

// Counter animation
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10) || 0;
  let cur = 0;
  const duration = 2000;
  const step = Math.max(1, Math.floor(target / (duration / 16)));
  
  const fn = () => {
    cur += step;
    if (cur >= target) { 
      el.textContent = target.toLocaleString(); 
    } else { 
      el.textContent = cur.toLocaleString(); 
      requestAnimationFrame(fn); 
    }
  };
  
  fn();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Update auth UI
  updateAuthUI();
  updateHeroActions();
  
  // Observe fade-up elements
  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
  
  // Animate counters
  document.querySelectorAll('[data-count]').forEach(el => {
    const cObserver = new IntersectionObserver((ents) => { 
      if (ents[0].isIntersecting) { 
        animateCounter(el); 
        cObserver.disconnect(); 
      } 
    }, { threshold: 0.3 });
    cObserver.observe(el);
  });

  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const header = document.querySelector('.header');
  if (navToggle && header) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      header.classList.toggle('nav-open');
    });

    // Close nav when a link is clicked
    document.querySelectorAll('.nav .nav-link').forEach(link => {
      link.addEventListener('click', () => header.classList.remove('nav-open'));
    });

    // Ensure nav is closed when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) header.classList.remove('nav-open');
    });
  }

  // Check auth for protected pages
  checkAuthAndRedirect();
});

// Protect pages - redirect unauthenticated users
async function checkAuthAndRedirect() {
  const token = localStorage.getItem('token');
  if (!token) {
    const p = window.location.pathname.toLowerCase();
    if (p.endsWith('/register.html') || p.endsWith('/search.html') || p === '/register' || p === '/search') {
      window.location.href = '/login.html';
    }
    return;
  }
  
  try {
    const res = await fetch('/api/me', {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const p = window.location.pathname.toLowerCase();
      if (p.endsWith('/register.html') || p.endsWith('/search.html') || p === '/register' || p === '/search') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
      }
    }
  } catch (e) {
    const p = window.location.pathname.toLowerCase();
    if (p.endsWith('/register.html') || p.endsWith('/search.html') || p === '/register' || p === '/search') {
      window.location.href = '/login.html';
    }
  }
}

/* ==========================================================================
   Sample Data Seeding
   ========================================================================== */

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

// Initialize sample data
seedSample();
