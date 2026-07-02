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
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[c])); 
}

function getInitials(name = 'User') {
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('') || 'U';
}

function currentPage() {
  const path = (window.location.pathname || '').toLowerCase();
  return path.split('/').pop() || 'index.html';
}

function setActiveNav() {
  const page = currentPage();
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    const target = href.split('/').pop() || 'index.html';
    link.classList.toggle('active', target === page);
  });
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
  const isDashboard = p.endsWith('/dashboard.html');

  if (isAuthenticated()) {
    const user = getUser();
    const userName = user ? user.name : 'User';
    const userEmail = user ? user.email : 'member@bloodconnect.org';
    authLinksEl.innerHTML = `
      <a href="register.html" class="nav-link ${isRegister ? 'active' : ''}"><i class="bi bi-heart-pulse"></i> Register Donor</a>
      <a href="search.html" class="nav-link ${isSearch ? 'active' : ''}"><i class="bi bi-search"></i> Search Donors</a>
      <a href="dashboard.html" class="nav-link ${isDashboard ? 'active' : ''}"><i class="bi bi-grid-1x2"></i> Dashboard</a>
      <button class="nav-action notification-btn" type="button" aria-label="Notifications" title="Notifications">
        <i class="bi bi-bell"></i>
      </button>
      <div class="user-menu">
        <button class="nav-action user-trigger" type="button" aria-expanded="false">
          <span class="avatar">${escapeHtml(getInitials(userName))}</span>
          <span>${escapeHtml(userName.split(' ')[0] || 'User')}</span>
          <i class="bi bi-chevron-down"></i>
        </button>
        <div class="user-dropdown">
          <div class="dropdown-user">
            <strong>${escapeHtml(userName)}</strong>
            <span>${escapeHtml(userEmail)}</span>
          </div>
          <a href="profile.html" class="dropdown-link"><i class="bi bi-person-circle"></i> User Profile</a>
          <a href="edit-profile.html" class="dropdown-link"><i class="bi bi-pencil-square"></i> Edit Profile</a>
          <a href="my-requests.html" class="dropdown-link"><i class="bi bi-file-medical"></i> My Requests</a>
          <button onclick="handleLogout()" class="dropdown-link" type="button"><i class="bi bi-box-arrow-right"></i> Logout</button>
        </div>
      </div>
    `;
  } else {
    authLinksEl.innerHTML = `
      <a href="login.html" class="nav-link ${isLogin ? 'active' : ''}"><i class="bi bi-box-arrow-in-right"></i> Login</a>
      <a href="signup.html" class="btn btn-primary btn-sm ${isSignup ? 'active' : ''}"><i class="bi bi-person-plus"></i> Register</a>
    `;
  }
  setActiveNav();
  bindUserMenu();
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

function bindUserMenu() {
  document.querySelectorAll('.user-trigger').forEach(trigger => {
    if (trigger.dataset.bound === 'true') return;
    trigger.dataset.bound = 'true';
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const menu = trigger.closest('.user-menu');
      const isOpen = menu.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateAuthUI();
  updateHeroActions();
  showSuccess('Logged Out', 'You have been logged out successfully.');
  setTimeout(() => { window.location.href = '/'; }, 1000);
}

function renderFooter() {
  document.querySelectorAll('.footer').forEach(footer => {
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <a href="index.html" class="footer-logo logo">
              <span class="logo-mark"><i class="bi bi-droplet-fill"></i></span>
              <span class="logo-text">BloodConnect<span>Premium donor network</span></span>
            </a>
            <p class="mt-2">A trusted healthcare platform connecting donors, patients, volunteers, and hospitals when every minute matters.</p>
            <div class="socials" aria-label="Social links">
              <a href="#" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
              <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
              <a href="#" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
              <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
            </div>
          </div>
          <div>
            <h4>Platform</h4>
            <div class="footer-links">
              <a href="register.html">Register Donor</a>
              <a href="search.html">Search Donors</a>
              <a href="blood-request.html">Blood Request</a>
              <a href="dashboard.html">Dashboard</a>
            </div>
          </div>
          <div>
            <h4>Requests</h4>
            <div class="footer-links">
              <a href="requests.html">All Requests</a>
              <a href="my-requests.html">My Requests</a>
              <a href="request-details.html">Request Details</a>
              <a href="success.html">Success Status</a>
            </div>
          </div>
          <div>
            <h4>Company</h4>
            <div class="footer-links">
              <a href="about.html">About</a>
              <a href="contact.html">Contact</a>
              <a href="profile.html">Profile</a>
              <a href="edit-profile.html">Edit Profile</a>
            </div>
          </div>
          <div>
            <h4>Trust</h4>
            <div class="footer-links">
              <a href="#">Privacy</a>
              <a href="#">Accessibility</a>
              <a href="#">Clinical Safety</a>
              <a href="#">Help Center</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 BloodConnect. Built for safer, faster blood access.</span>
          <span>Emergency support: +91 555 123 4567</span>
        </div>
      </div>
    `;
  });
}

function enhanceFloatingLabels() {
  document.querySelectorAll('.input-group .form-control').forEach(input => {
    const group = input.closest('.input-group');
    if (!group || group.querySelector('.floating-label')) return;
    const text = input.getAttribute('placeholder') || input.closest('.form-group')?.querySelector('.form-label')?.textContent?.replace('*', '').trim();
    if (!text) return;
    const label = document.createElement('span');
    label.className = 'floating-label';
    label.textContent = text;
    group.appendChild(label);
  });
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

function handleContactSubmit(event) {
  if (event) event.preventDefault();
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

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', handleContactSubmit);
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
    <div class="donor-list" aria-busy="true" aria-label="Loading donor results">
      ${Array.from({ length: 3 }).map(() => `
        <div class="skeleton-card card">
          <div class="skeleton" style="width:58px;height:58px;border-radius:18px;"></div>
          <div>
            <div class="skeleton" style="width:42%;height:16px;margin-bottom:12px;"></div>
            <div class="skeleton" style="width:76%;height:12px;"></div>
          </div>
          <div class="skeleton" style="width:84px;height:34px;border-radius:999px;"></div>
        </div>
      `).join('')}
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

    list.innerHTML = `<div class="donor-list">` + donors.map(d => {
      const detailParams = new URLSearchParams({
        name: d.name || '',
        bloodGroup: d.bloodGroup || '',
        city: d.city || '',
        contact: d.contact || '',
        age: d.age || '',
        gender: d.gender || '',
        notes: d.notes || ''
      }).toString();
      return `
      <div class="donor-card">
        <div class="donor-avatar">${escapeHtml(String(d.name || 'D').charAt(0).toUpperCase())}</div>
        <div class="donor-info">
          <h4 class="donor-name">${escapeHtml(d.name)}</h4>
          <div class="donor-meta">
            <span><i class="bi bi-geo-alt"></i> ${escapeHtml(d.city)}</span>
            <span><i class="bi bi-telephone"></i> ${escapeHtml(d.contact)}</span>
            ${d.age ? `<span><i class="bi bi-person"></i> ${d.age} yrs</span>` : ''}
            ${d.gender ? `<span><i class="bi bi-gender-ambiguous"></i> ${escapeHtml(d.gender)}</span>` : ''}
          </div>
          ${d.notes ? `<p style="font-size: 0.8125rem; color: var(--muted); margin-top: 0.5rem; margin-bottom: 0;"><i class="bi bi-chat-left-text"></i> ${escapeHtml(d.notes)}</p>` : ''}
        </div>
        <div class="blood-badge">${escapeHtml(d.bloodGroup)}</div>
        <div class="donor-actions">
          <a class="btn btn-secondary btn-sm" href="donor-details.html?${detailParams}">
            <i class="bi bi-eye"></i> View
          </a>
          <a class="btn btn-outline btn-sm call-btn" href="tel:${d.contact}">
            <i class="bi bi-telephone"></i> Call
          </a>
        </div>
      </div>
    `}).join('') + `</div>`;
    
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
  renderFooter();
  enhanceFloatingLabels();
  setActiveNav();

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

  document.addEventListener('click', () => {
    document.querySelectorAll('.user-menu.open').forEach(menu => {
      menu.classList.remove('open');
      menu.querySelector('.user-trigger')?.setAttribute('aria-expanded', 'false');
    });
  });

  // Check auth for protected pages
  checkAuthAndRedirect();

  hydrateStaticPages();
});

// Protect pages - redirect unauthenticated users
async function checkAuthAndRedirect() {
  const token = localStorage.getItem('token');
  const protectedPages = [
    'register.html',
    'search.html',
    'dashboard.html',
    'profile.html',
    'edit-profile.html',
    'blood-request.html',
    'my-requests.html'
  ];
  const page = currentPage();
  if (!token) {
    const p = window.location.pathname.toLowerCase();
    if (protectedPages.includes(page) || p === '/register' || p === '/search') {
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
      if (protectedPages.includes(page) || p === '/register' || p === '/search') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
      }
    }
  } catch (e) {
    const p = window.location.pathname.toLowerCase();
    if (protectedPages.includes(page) || p === '/register' || p === '/search') {
      window.location.href = '/login.html';
    }
  }
}

function getBloodRequests() {
  try {
    return JSON.parse(localStorage.getItem('bloodconnect_requests') || '[]');
  } catch (e) {
    return [];
  }
}

function setBloodRequests(requests) {
  localStorage.setItem('bloodconnect_requests', JSON.stringify(requests));
}

function hydrateStaticPages() {
  const user = getUser();
  document.querySelectorAll('[data-user-name]').forEach(el => { el.textContent = user?.name || 'BloodConnect Member'; });
  document.querySelectorAll('[data-user-email]').forEach(el => { el.textContent = user?.email || 'member@bloodconnect.org'; });
  document.querySelectorAll('[data-user-initials]').forEach(el => { el.textContent = getInitials(user?.name || 'User'); });

  const donorDetail = document.getElementById('donorDetail');
  if (donorDetail) renderDonorDetail(donorDetail);

  const requestForm = document.getElementById('bloodRequestForm');
  if (requestForm) bindBloodRequestForm(requestForm);

  const requestList = document.getElementById('requestList');
  if (requestList) renderRequestList(requestList);

  const requestDetail = document.getElementById('requestDetail');
  if (requestDetail) renderRequestDetail(requestDetail);

  const profileForm = document.getElementById('profileForm');
  if (profileForm) bindProfileForm(profileForm);
}

function renderDonorDetail(container) {
  const params = new URLSearchParams(window.location.search);
  const donor = {
    name: params.get('name') || 'Asha Nair',
    bloodGroup: params.get('bloodGroup') || 'O+',
    city: params.get('city') || 'Pune',
    contact: params.get('contact') || '+91 98765 43210',
    age: params.get('age') || '29',
    gender: params.get('gender') || 'Female',
    notes: params.get('notes') || 'Available for emergency donations after confirmation.'
  };

  container.innerHTML = `
    <div class="profile-panel">
      <aside class="card">
        <div class="card-body text-center">
          <div class="profile-avatar">${escapeHtml(getInitials(donor.name))}</div>
          <h2 class="card-title">${escapeHtml(donor.name)}</h2>
          <span class="blood-badge">${escapeHtml(donor.bloodGroup)}</span>
          <div class="form-actions">
            <a class="btn btn-primary" href="tel:${escapeHtml(donor.contact)}"><i class="bi bi-telephone"></i> Call Donor</a>
          </div>
        </div>
      </aside>
      <section class="card">
        <div class="card-body">
          <h3 class="card-title">Donor Details</h3>
          <div class="detail-list">
            <div class="detail-row"><span>City</span><strong>${escapeHtml(donor.city)}</strong></div>
            <div class="detail-row"><span>Contact</span><strong>${escapeHtml(donor.contact)}</strong></div>
            <div class="detail-row"><span>Age</span><strong>${escapeHtml(donor.age)} years</strong></div>
            <div class="detail-row"><span>Gender</span><strong>${escapeHtml(donor.gender)}</strong></div>
            <div class="detail-row"><span>Availability notes</span><strong>${escapeHtml(donor.notes)}</strong></div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function bindBloodRequestForm(form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateForm('bloodRequestForm')) {
      showError('Validation Error', 'Please complete the required request details.');
      return;
    }

    const submitBtn = document.getElementById('requestSubmitBtn');
    if (submitBtn) submitBtn.classList.add('btn-loading');
    const data = Object.fromEntries(new FormData(form).entries());
    const request = {
      id: 'req_' + Date.now(),
      status: 'Urgent',
      createdAt: new Date().toISOString(),
      owner: getUser()?.email || 'member@bloodconnect.org',
      ...data
    };

    setTimeout(() => {
      const requests = getBloodRequests();
      requests.unshift(request);
      setBloodRequests(requests);
      if (submitBtn) submitBtn.classList.remove('btn-loading');
      showSuccess('Request Created', 'Your blood request has been saved to this device.');
      form.reset();
      window.location.href = `request-details.html?id=${request.id}`;
    }, 600);
  });
}

function requestRows() {
  const saved = getBloodRequests();
  if (saved.length) return saved;
  return [
    { id: 'REQ-1042', patientName: 'Rahul Mehta', bloodGroup: 'O-', city: 'Mumbai', hospital: 'Apollo Hospital', units: '2', urgency: 'Critical', status: 'Open', createdAt: new Date().toISOString() },
    { id: 'REQ-1038', patientName: 'Maya Singh', bloodGroup: 'A+', city: 'Pune', hospital: 'Ruby Hall Clinic', units: '1', urgency: 'Today', status: 'Matched', createdAt: new Date().toISOString() },
    { id: 'REQ-1033', patientName: 'Farhan Ali', bloodGroup: 'B+', city: 'Bengaluru', hospital: 'Manipal Hospital', units: '3', urgency: 'Scheduled', status: 'Open', createdAt: new Date().toISOString() }
  ];
}

function renderRequestList(container) {
  const requests = requestRows();
  container.innerHTML = requests.map(req => `
    <article class="request-card donor-card">
      <div class="donor-avatar"><i class="bi bi-file-medical"></i></div>
      <div>
        <h3 class="donor-name">${escapeHtml(req.patientName || 'Patient')}</h3>
        <div class="donor-meta">
          <span><i class="bi bi-droplet"></i> ${escapeHtml(req.bloodGroup || 'O+')}</span>
          <span><i class="bi bi-building"></i> ${escapeHtml(req.hospital || 'Hospital pending')}</span>
          <span><i class="bi bi-geo-alt"></i> ${escapeHtml(req.city || 'City')}</span>
          <span><i class="bi bi-clock"></i> ${escapeHtml(req.urgency || 'Urgent')}</span>
        </div>
      </div>
      <span class="blood-badge">${escapeHtml(req.units || '1')} unit${String(req.units || '1') === '1' ? '' : 's'}</span>
      <div class="donor-actions">
        <a class="btn btn-secondary btn-sm" href="request-details.html?id=${encodeURIComponent(req.id)}"><i class="bi bi-eye"></i> Details</a>
      </div>
    </article>
  `).join('');
}

function renderRequestDetail(container) {
  const id = new URLSearchParams(window.location.search).get('id');
  const req = requestRows().find(item => item.id === id) || requestRows()[0];
  container.innerHTML = `
    <div class="grid grid-2">
      <section class="card">
        <div class="card-body">
          <span class="blood-badge">${escapeHtml(req.bloodGroup || 'O+')}</span>
          <h2 class="card-title mt-2">${escapeHtml(req.patientName || 'Patient')}</h2>
          <p>${escapeHtml(req.notes || 'Coordinator details and verification notes will appear here for the response team.')}</p>
          <div class="form-actions">
            <a class="btn btn-primary" href="tel:${escapeHtml(req.contact || '+915551234567')}"><i class="bi bi-telephone"></i> Contact Coordinator</a>
            <a class="btn btn-secondary" href="requests.html"><i class="bi bi-arrow-left"></i> All Requests</a>
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-body">
          <h3 class="card-title">Request Details</h3>
          <div class="detail-list">
            <div class="detail-row"><span>Hospital</span><strong>${escapeHtml(req.hospital || 'Hospital pending')}</strong></div>
            <div class="detail-row"><span>City</span><strong>${escapeHtml(req.city || 'City')}</strong></div>
            <div class="detail-row"><span>Units needed</span><strong>${escapeHtml(req.units || '1')}</strong></div>
            <div class="detail-row"><span>Urgency</span><strong>${escapeHtml(req.urgency || 'Urgent')}</strong></div>
            <div class="detail-row"><span>Status</span><strong>${escapeHtml(req.status || 'Open')}</strong></div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function bindProfileForm(form) {
  const user = getUser();
  if (user) {
    form.querySelector('[name="name"]').value = user.name || '';
    form.querySelector('[name="email"]').value = user.email || '';
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    if (!name || !email) {
      showError('Validation Error', 'Name and email are required.');
      return;
    }
    const updated = { ...(getUser() || {}), name, email };
    localStorage.setItem('user', JSON.stringify(updated));
    showSuccess('Profile Updated', 'Your local profile display has been updated.');
    updateAuthUI();
  });
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
