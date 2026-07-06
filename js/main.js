/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PAYMAX INTERACTIVE SPA APPLICATION CONTROLLER
  Fintech Peer-to-Peer Marketplace & Trust Platform JS Core
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

// ═══════════════════════ APPLICATION STATE / MOCK DATABASE ═══════════════════════
const state = {
  theme: 'dark',
  currentUser: null,
  activeView: 'landing',
  verificationStep: 1,
  activeTrade: null,
  p2pFilterMode: 'buy', // buy or sell
  merchantStatus: false,
  
  // Mock Crypto Market Data
  cryptos: [
    { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', price: 67340.50, change24h: 2.45, volume24h: '31.2B', category: 'l1', history: [65000, 66200, 65800, 66900, 67100, 67250, 67340] },
    { id: 'ETH', name: 'Ethereum', symbol: 'ETH', price: 3480.20, change24h: -1.12, volume24h: '18.4B', category: 'l1', history: [3560, 3520, 3490, 3510, 3470, 3450, 3480] },
    { id: 'USDT', name: 'Tether', symbol: 'USDT', price: 1.00, change24h: 0.00, volume24h: '52.7B', category: 'stable', history: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00] },
    { id: 'USDC', name: 'USD Coin', symbol: 'USDC', price: 1.00, change24h: 0.02, volume24h: '6.8B', category: 'stable', history: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00] },
    { id: 'SOL', name: 'Solana', symbol: 'SOL', price: 142.75, change24h: 5.82, volume24h: '4.1B', category: 'l1', history: [132, 135, 137, 139, 141, 140, 142.75] }
  ],

  // Mock Traders in P2P Directory
  traders: [
    { username: 'Yohannes Assefa', avatar: 'YA', trustScore: 99, completedTrades: 142, volume: 'ETB 1.2M', responseTime: '1.5 min', memberSince: 'Jan 2025', disputes: 0, merchant: true, online: true },
    { username: 'Betelhem Tech', avatar: 'BT', trustScore: 97, completedTrades: 89, volume: 'ETB 650K', responseTime: '2.4 min', memberSince: 'Mar 2025', disputes: 1, merchant: true, online: true },
    { username: 'Abdi_Desta', avatar: 'AD', trustScore: 95, completedTrades: 42, volume: 'ETB 240K', responseTime: '4.1 min', memberSince: 'Jun 2025', disputes: 0, merchant: false, online: true },
    { username: 'Lidiya_N', avatar: 'LN', trustScore: 91, completedTrades: 19, volume: 'ETB 85K', responseTime: '6.0 min', memberSince: 'Nov 2025', disputes: 0, merchant: false, online: false },
    { username: 'scamhunter', avatar: 'SH', trustScore: 82, completedTrades: 3, volume: 'ETB 15K', responseTime: '12 min', memberSince: 'Jul 2026', disputes: 2, merchant: false, online: true }
  ],

  // Mock Offers available
  offers: [],
  
  // Active Trades
  trades: [],
  
  // Circle of Trust invite tracking
  invites: [
    { code: 'PAYMAX-8821-VIO', status: 'available', usedBy: null },
    { code: 'PAYMAX-4921-TEA', status: 'active', usedBy: 'Abdi_Desta', reputationImpact: 4.5 },
    { code: 'PAYMAX-1094-AMB', status: 'active', usedBy: 'scamhunter', reputationImpact: -8.0 }
  ],

  // Fraud Engine Audit Feed
  fraudLogs: [
    { id: 1, time: '10:14', msg: 'Multiple accounts using identical device fingerprint [Hash: #e30a]', severity: 'high' },
    { id: 2, time: '11:42', msg: 'Rapid transaction attempts detected for uninvited user @scamhunter', severity: 'medium' }
  ],

  priceAlerts: []
};

// Seed P2P Offers initially
function seedOffers() {
  state.offers = [
    { id: 101, type: 'sell', advertiser: state.traders[0], coin: 'USDT', rate: 124.50, minLimit: 1000, maxLimit: 50000, payments: ['Telebirr', 'CBE'] },
    { id: 102, type: 'sell', advertiser: state.traders[1], coin: 'USDT', rate: 124.80, minLimit: 5000, maxLimit: 100000, payments: ['CBE', 'Abyssinia'] },
    { id: 103, type: 'sell', advertiser: state.traders[2], coin: 'USDT', rate: 125.10, minLimit: 500, maxLimit: 15000, payments: ['Telebirr'] },
    { id: 104, type: 'sell', advertiser: state.traders[3], coin: 'USDT', rate: 125.50, minLimit: 1000, maxLimit: 8000, payments: ['Telebirr', 'CBE'] },
    { id: 105, type: 'sell', advertiser: state.traders[4], coin: 'USDT', rate: 123.00, minLimit: 1000, maxLimit: 20000, payments: ['CBE'] }, // Suspiciously cheap
    
    { id: 106, type: 'buy', advertiser: state.traders[0], coin: 'USDT', rate: 123.50, minLimit: 1000, maxLimit: 40000, payments: ['Telebirr', 'CBE'] },
    { id: 107, type: 'buy', advertiser: state.traders[1], coin: 'USDT', rate: 123.00, minLimit: 2000, maxLimit: 80000, payments: ['CBE'] }
  ];
}

// ═══════════════════════ INITIALIZATION ═══════════════════════
document.addEventListener('DOMContentLoaded', () => {
  seedOffers();
  initTheme();
  initRouter();
  initParticles();
  initTicker();
  initSparklines();
  lucide.createIcons();
  
  // Set up theme toggle
  document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
});

// ═══════════════════════ SYSTEM CONFIGURATION & THEMING ═══════════════════════
function initTheme() {
  const savedTheme = localStorage.getItem('paymax-theme') || 'dark';
  state.theme = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeUi();
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('paymax-theme', state.theme);
  updateThemeUi();
  showToast('Theme Changed', `Switched to ${state.theme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
}

function updateThemeUi() {
  const lightIcons = document.querySelectorAll('#theme-icon-light');
  const darkIcons = document.querySelectorAll('#theme-icon-dark');
  if (state.theme === 'dark') {
    lightIcons.forEach(el => el.classList.remove('hidden'));
    darkIcons.forEach(el => el.classList.add('hidden'));
  } else {
    lightIcons.forEach(el => el.classList.add('hidden'));
    darkIcons.forEach(el => el.classList.remove('hidden'));
  }
}

// ═══════════════════════ SPA ROUTER SYSTEM ═══════════════════════
function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  let hash = window.location.hash.substring(1);
  if (!hash) hash = 'landing';
  
  // Route Guards
  const dashboardRoutes = ['dashboard', 'marketplace', 'trade', 'admin', 'settings'];
  
  if (dashboardRoutes.includes(hash) && !state.currentUser) {
    window.location.hash = '#auth';
    showToast('Access Required', 'Please sign in to view the trading dashboard', 'warning');
    return;
  }
  
  if (state.currentUser && !state.currentUser.verified && hash === 'dashboard') {
    window.location.hash = '#verify';
    showToast('Verification Required', 'Please complete onboarding verification first', 'warning');
    return;
  }

  state.activeView = hash;
  
  // Toggle Page Views
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });
  const currentViewEl = document.getElementById(`view-${hash}`);
  if (currentViewEl) {
    currentViewEl.classList.add('active');
    currentViewEl.classList.add('fade-in');
  }
  
  // Navbar Adjustments (Dashboard Layout vs Public Layout)
  const isDashboardLayout = dashboardRoutes.includes(hash) || hash === 'verify';
  const publicNavbar = document.getElementById('public-navbar');
  const appContainer = document.getElementById('app-container');
  
  if (isDashboardLayout) {
    publicNavbar.style.display = 'none';
    appContainer.style.paddingTop = '0px';
  } else {
    publicNavbar.style.display = 'block';
    appContainer.style.paddingTop = '72px';
    // Remove dashboard sidebar active status
    document.querySelectorAll('.sidebar').forEach(sb => sb.classList.remove('open'));
  }

  // Sync Sidebar active status
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-sidebar') === hash) {
      link.classList.add('active');
    }
  });

  // Sync Public Navbar Active link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-route') === hash) {
      link.classList.add('active');
    }
  });

  // Trigger page-specific logic
  if (hash === 'dashboard') {
    renderDashboardCharts();
    renderCircleOfTrust();
    renderInvitesList();
  } else if (hash === 'marketplace') {
    renderMarketplaceOffers();
  } else if (hash === 'market') {
    renderMarketCoins();
  } else if (hash === 'admin') {
    renderAdminDesk();
  }
  
  window.scrollTo(0, 0);
  lucide.createIcons();
}

// ═══════════════════════ CANVAS BACKGROUND: NETWORK NODES ═══════════════════════
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = canvas.parentElement.offsetWidth;
  let height = canvas.height = canvas.parentElement.offsetHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  const particles = [];
  const particleCount = 45;
  const maxDistance = 140;

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1.5;
      this.color = Math.random() > 0.5 ? '#8b5cf6' : '#14b8a6';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / maxDistance) * 0.15;
          ctx.strokeStyle = state.theme === 'dark' ? `rgba(139, 92, 246, ${alpha})` : `rgba(124, 58, 237, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ═══════════════════════ DYNAMIC CRYPTO MARKET RENDER ═══════════════════════
function initTicker() {
  const banner = document.getElementById('market-ticker-banner');
  if (!banner) return;
  
  function updateTicker() {
    let tickerHtml = '';
    state.cryptos.forEach(coin => {
      const up = coin.change24h >= 0;
      tickerHtml += `
        <span class="inline-flex items-center gap-2">
          <span class="font-bold text-zinc-900 dark:text-zinc-50">${coin.symbol}</span>
          <span class="text-zinc-500 font-mono">$${coin.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          <span class="${up ? 'text-emerald-500' : 'text-red-500'} font-mono flex items-center">
            ${up ? '▲' : '▼'} ${Math.abs(coin.change24h).toFixed(2)}%
          </span>
        </span>
      `;
    });
    // Double content for infinite marquee loop effect
    banner.innerHTML = tickerHtml + tickerHtml;
  }

  updateTicker();
  
  // Real-time market tick updates simulation
  setInterval(() => {
    state.cryptos.forEach(coin => {
      if (coin.symbol === 'USDT' || coin.symbol === 'USDC') return;
      const variation = (Math.random() - 0.495) * 0.15; // slightly upward bias
      coin.price += coin.price * (variation / 100);
      coin.change24h += variation;
    });
    updateTicker();
    if (state.activeView === 'market') renderMarketCoins();
    checkPriceAlerts();
  }, 4000);
}

function initSparklines() {
  // Sparkline drawing helper
  window.drawSparkline = function(canvasId, history, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 100;
    const height = canvas.height = 35;
    
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min === 0 ? 1 : max - min;
    
    history.forEach((val, index) => {
      const x = (index / (history.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };
}

function renderMarketCoins() {
  const tbody = document.getElementById('market-coins-tbody');
  if (!tbody) return;
  
  let html = '';
  state.cryptos.forEach((coin, idx) => {
    const up = coin.change24h >= 0;
    const sparkColor = up ? '#10b981' : '#ef4444';
    html += `
      <tr class="hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition">
        <td class="py-4 font-mono font-bold text-zinc-500">${idx+1}</td>
        <td class="py-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-violet-600/10 flex items-center justify-center font-bold text-xs text-violet-500">${coin.symbol}</div>
            <div>
              <div class="font-bold text-zinc-900 dark:text-zinc-50">${coin.name}</div>
              <div class="text-xs text-zinc-500">${coin.symbol}</div>
            </div>
          </div>
        </td>
        <td class="py-4 text-right font-mono font-semibold">$${coin.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
        <td class="py-4 text-right font-mono font-semibold ${up ? 'text-emerald-500' : 'text-red-500'}">
          ${up ? '+' : ''}${coin.change24h.toFixed(2)}%
        </td>
        <td class="py-4 text-right font-mono text-zinc-500 hidden sm:table-cell">$${coin.volume24h}</td>
        <td class="py-4 flex justify-center">
          <canvas id="sparkline-${coin.symbol}" class="sparkline-canvas"></canvas>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
  
  // Render sparkline graphics
  state.cryptos.forEach(coin => {
    const up = coin.change24h >= 0;
    const sparkColor = up ? '#10b981' : '#ef4444';
    drawSparkline(`sparkline-${coin.symbol}`, coin.history, sparkColor);
  });
}

function createPriceAlert() {
  const coin = document.getElementById('alert-coin-select').value;
  const target = parseFloat(document.getElementById('alert-price-input').value);
  if (!target || isNaN(target)) {
    showToast('Invalid Input', 'Please enter a numeric target price', 'danger');
    return;
  }

  state.priceAlerts.push({ coin, target, active: true });
  showToast('Alert Set', `You will be notified when ${coin} crosses $${target.toLocaleString()}`, 'success');
  document.getElementById('alert-price-input').value = '';
}

function checkPriceAlerts() {
  state.priceAlerts.forEach(alert => {
    if (!alert.active) return;
    const coinObj = state.cryptos.find(c => c.symbol === alert.coin);
    if (coinObj && coinObj.price >= alert.target) {
      showToast('Price Alert Triggered!', `${alert.coin} has crossed your target limit of $${alert.target.toLocaleString()}! Current: $${coinObj.price.toLocaleString(undefined, {maximumFractionDigits: 2})}`, 'success');
      alert.active = false; // deactivate once triggered
    }
  });
}

// ═══════════════════════ HYBRID AUTHENTICATION LOGIC ═══════════════════════
function switchAuthTab(tab) {
  const loginForm = document.getElementById('auth-form-login');
  const registerForm = document.getElementById('auth-form-register');
  const tabLogin = document.getElementById('auth-tab-login');
  const tabRegister = document.getElementById('auth-tab-register');
  
  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  
  if (email === 'admin@paymax.com') {
    state.currentUser = { email: 'admin@paymax.com', verified: true, role: 'admin', trustScore: 100 };
    document.getElementById('sidebar-admin-link').classList.remove('hidden');
    window.location.hash = '#admin';
    showToast('Access Granted', 'Signed in as Administrator', 'success');
  } else {
    state.currentUser = { email: email, verified: false, role: 'trader', trustScore: 90 };
    window.location.hash = '#verify';
    showToast('Verification Required', 'Please complete identity security setup', 'info');
  }
  
  updateAuthNavigation();
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('register-email').value;
  const invite = document.getElementById('register-invite').value.trim();
  
  state.currentUser = { 
    email: email, 
    verified: false, 
    role: 'trader', 
    trustScore: invite ? 95 : 85, // invite gives higher initial trust
    invited: !!invite,
    inviteCodeUsed: invite
  };
  
  window.location.hash = '#verify';
  showToast('Registration Successful', invite ? 'Invitation detected. Fast-track validation enabled!' : 'Enhanced verification required (Manual audit check)', 'success');
  updateAuthNavigation();
}

function updateAuthNavigation() {
  const ctaNav = document.getElementById('cta-nav-btn');
  const loginNav = document.getElementById('login-nav-btn');
  if (state.currentUser) {
    ctaNav.innerText = 'Go to Console';
    ctaNav.setAttribute('href', state.currentUser.role === 'admin' ? '#admin' : '#dashboard');
    if (loginNav) loginNav.style.display = 'none';
  } else {
    ctaNav.innerText = 'Join Marketplace';
    ctaNav.setAttribute('href', '#auth');
    if (loginNav) loginNav.style.display = 'inline-flex';
  }
}

function logoutUser() {
  state.currentUser = null;
  document.getElementById('sidebar-admin-link').classList.add('hidden');
  window.location.hash = '#landing';
  showToast('Signed Out', 'Your session was securely closed', 'info');
  updateAuthNavigation();
}

// ═══════════════════════ IDENTITY VERIFICATION WIZARD ═══════════════════════
function updateWizardUi() {
  const steps = document.querySelectorAll('.wizard-step');
  const contents = document.querySelectorAll('.verify-step-content');
  const bar = document.getElementById('verify-progress-bar');
  
  steps.forEach(step => {
    const sNum = parseInt(step.getAttribute('data-step'));
    step.classList.remove('active', 'completed');
    if (sNum === state.verificationStep) {
      step.classList.add('active');
    } else if (sNum < state.verificationStep) {
      step.classList.add('completed');
    }
  });

  contents.forEach((cont, idx) => {
    if (idx + 1 === state.verificationStep) {
      cont.classList.remove('hidden');
      cont.classList.add('fade-in');
    } else {
      cont.classList.add('hidden');
    }
  });

  const progressPercent = ((state.verificationStep - 1) / 4) * 100;
  bar.style.width = `${progressPercent}%`;
  
  if (state.verificationStep === 2) {
    document.getElementById('verify-email-display').innerText = state.currentUser ? state.currentUser.email : 'trader@paymax.com';
  }
}

function sendMockOtp() {
  document.getElementById('otp-input-area').classList.remove('hidden');
  showToast('OTP Transmitted', 'Mock OTP passcode: 482910 sent to mobile', 'info');
}

function submitOtp() {
  const val = document.getElementById('verify-otp-input').value.trim();
  if (val === '482910') {
    state.verificationStep = 2;
    updateWizardUi();
    showToast('Phone Linked', 'Mobile verification matches telemetry data', 'success');
  } else {
    showToast('Invalid Code', 'The entered code does not match', 'danger');
  }
}

function confirmEmailKyc() {
  state.verificationStep = 3;
  updateWizardUi();
  showToast('Email Confirmed', 'Email status is now active', 'success');
}

function selectIdType(type) {
  document.getElementById('id-upload-area').classList.remove('hidden');
  showToast('ID Selected', `Please upload verification files for: ${type === 'passport' ? 'Passport' : 'National ID'}`, 'info');
}

function simulateKycUpload() {
  showToast('Processing Image', 'Uploading document to fraud scanner engine...', 'info');
  setTimeout(() => {
    state.verificationStep = 4;
    updateWizardUi();
    showToast('ID Uploaded', 'Document processed. Proceeding to liveness scan', 'success');
  }, 2000);
}

function runSelfieLivenessScan() {
  const status = document.getElementById('selfie-hud-status');
  status.innerText = 'Scanning...';
  status.classList.remove('bg-violet-600');
  status.classList.add('bg-amber-500');
  
  showToast('Liveness Active', 'Please look directly at the sensor and blink', 'info');
  
  setTimeout(() => {
    status.innerText = 'Analyzing...';
  }, 2000);

  setTimeout(() => {
    status.innerText = 'Approved';
    status.classList.remove('bg-amber-500');
    status.classList.add('bg-emerald-500');
    state.verificationStep = 5;
    updateWizardUi();
    showToast('Biometrics Matched', 'Face telemetry verification succeeded', 'success');
  }, 4500);
}

function completeKycWorkflow() {
  if (state.currentUser) {
    state.currentUser.verified = true;
  }
  document.getElementById('verified-badge-modal').classList.add('open');
  lucide.createIcons();
}

function closeBadgeModal() {
  document.getElementById('verified-badge-modal').classList.remove('open');
  window.location.hash = '#dashboard';
}

// ═══════════════════════ USER DASHBOARD ANALYTICS & REPUTATION GRAPH ═══════════════════════
let dashboardChartInstance = null;

function renderDashboardCharts() {
  const ctx = document.getElementById('dashboard-volume-chart');
  if (!ctx) return;

  if (dashboardChartInstance) {
    dashboardChartInstance.destroy();
  }

  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#a1a1aa' : '#475569';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  dashboardChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Completed Trades',
          data: [12, 19, 15, 25, 32, 42],
          backgroundColor: '#8b5cf6',
          borderRadius: 6
        },
        {
          label: 'Disputes Opened',
          data: [0, 0, 1, 0, 0, 0],
          backgroundColor: '#ef4444',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: textColor, font: { family: 'Inter' } }
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor }
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor }
        }
      }
    }
  });

  // Render stats
  document.getElementById('dash-user-email').innerText = state.currentUser ? state.currentUser.email : 'trader@paymax.com';
  document.getElementById('dash-trust-score-num').innerText = state.currentUser ? state.currentUser.trustScore : '98';
}

function renderCircleOfTrust() {
  const svg = document.getElementById('circle-of-trust-svg');
  if (!svg) return;
  svg.innerHTML = ''; // clear

  const w = svg.clientWidth || 500;
  const h = svg.clientHeight || 400;
  
  // Center Node (Me)
  const centerNode = { x: w / 2, y: h / 2, name: 'You (Trader)', score: 98, role: 'me' };
  
  // Outer Nodes (Inviters and Invitees)
  const nodes = [
    { x: w / 2, y: h / 2 - 110, name: 'Yohannes A. (Inviter)', score: 99, role: 'inviter' },
    { x: w / 2 - 130, y: h / 2 + 80, name: 'Abdi Desta', score: 95, role: 'invitee' },
    { x: w / 2 + 130, y: h / 2 + 80, name: 'scamhunter (Banned)', score: 32, role: 'banned' }
  ];

  // Draw connections
  nodes.forEach(node => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', centerNode.x);
    line.setAttribute('y1', centerNode.y);
    line.setAttribute('x2', node.x);
    line.setAttribute('y2', node.y);
    
    // Line colors based on link health
    if (node.role === 'banned') {
      line.setAttribute('stroke', '#ef4444');
      line.setAttribute('stroke-width', '2.5');
    } else {
      line.setAttribute('stroke', '#10b981');
      line.setAttribute('stroke-width', '2');
    }
    line.classList.add('connection-line');
    svg.appendChild(line);
  });

  // Draw nodes
  const allNodes = [centerNode, ...nodes];
  allNodes.forEach(node => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', node.role === 'me' ? '22' : '18');
    
    // Styling nodes
    if (node.role === 'me') {
      circle.setAttribute('fill', 'url(#grad-center)');
      circle.setAttribute('stroke', '#8b5cf6');
      circle.classList.add('node-circle', 'trust-glow');
    } else if (node.role === 'banned') {
      circle.setAttribute('fill', '#ef4444');
      circle.setAttribute('stroke', 'rgba(239, 68, 68, 0.4)');
      circle.classList.add('node-circle');
    } else {
      circle.setAttribute('fill', '#10b981');
      circle.setAttribute('stroke', 'rgba(16, 185, 129, 0.4)');
      circle.classList.add('node-circle', 'trust-glow-green');
    }
    
    // Text labels
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', node.x);
    text.setAttribute('y', node.y + 35);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', state.theme === 'dark' ? '#fafafa' : '#111827');
    text.setAttribute('font-size', '10px');
    text.setAttribute('font-weight', '600');
    text.textContent = `${node.name} (${node.score} PTS)`;
    
    g.appendChild(circle);
    g.appendChild(text);
    svg.appendChild(g);
  });

  // Define gradients inside SVG
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <linearGradient id="grad-center" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#14b8a6" />
    </linearGradient>
  `;
  svg.appendChild(defs);
}

function renderInvitesList() {
  const container = document.getElementById('dash-invites-list');
  if (!container) return;
  
  let html = '';
  state.invites.forEach(inv => {
    if (inv.status === 'available') {
      html += `
        <div class="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-950/20 flex justify-between items-center">
          <div class="space-y-0.5">
            <span class="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-50">${inv.code}</span>
            <p class="text-[10px] text-zinc-500 uppercase font-semibold">Available Invite Code</p>
          </div>
          <button class="btn btn-secondary btn-sm px-2.5 py-1" onclick="copyInviteText('${inv.code}')">Copy</button>
        </div>
      `;
    } else {
      const positive = inv.reputationImpact >= 0;
      html += `
        <div class="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-950/20 flex justify-between items-center">
          <div class="space-y-0.5">
            <span class="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-50">${inv.code}</span>
            <p class="text-[10px] text-zinc-500 uppercase font-semibold">Claimed by @${inv.usedBy}</p>
          </div>
          <span class="text-xs font-bold ${positive ? 'text-emerald-500' : 'text-red-500'}">
            ${positive ? '+' : ''}${inv.reputationImpact} Trust
          </span>
        </div>
      `;
    }
  });
  container.innerHTML = html;
}

function copyInviteText(code) {
  navigator.clipboard.writeText(code);
  showToast('Copied to Clipboard', `Invitation code ${code} is ready to share`, 'success');
}

function claimInviteCode() {
  showToast('Limit Exceeded', 'You can generate another invite after settling 5 more trades', 'warning');
}

// ═══════════════════════ P2P MARKETPLACE CONTROLLER ═══════════════════════
function toggleP2pOfferMode(mode) {
  state.p2pFilterMode = mode;
  document.getElementById('p2p-toggle-buy').classList.toggle('active', mode === 'buy');
  document.getElementById('p2p-toggle-sell').classList.toggle('active', mode === 'sell');
  applyP2pFilters();
}

function updateTrustLabel(val) {
  document.getElementById('p2p-trust-val-lbl').innerText = `${val}+`;
}

function applyP2pFilters() {
  const coin = document.getElementById('p2p-filter-coin').value;
  const payment = document.getElementById('p2p-filter-payment').value;
  const amount = parseFloat(document.getElementById('p2p-filter-amount').value) || 0;
  const trust = parseInt(document.getElementById('p2p-filter-trust').value) || 0;

  // Filter listings
  const filtered = state.offers.filter(off => {
    if (off.type !== state.p2pFilterMode) return false;
    if (off.coin !== coin) return false;
    if (payment !== 'ALL' && !off.payments.includes(payment)) return false;
    if (amount > 0 && (amount < off.minLimit || amount > off.maxLimit)) return false;
    if (off.advertiser.trustScore < trust) return false;
    return true;
  });

  const tbody = document.getElementById('p2p-offers-tbody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="py-8 text-center text-zinc-500">No matching offers found inside the Trust Network.</td>
      </tr>
    `;
    return;
  }

  let html = '';
  filtered.forEach(off => {
    const partner = off.advertiser;
    let paymentBadges = '';
    off.payments.forEach(pay => {
      let colorClass = 'bg-zinc-800 text-zinc-300';
      if (pay === 'Telebirr') colorClass = 'bg-red-500/10 text-red-500 border border-red-500/30';
      if (pay === 'CBE') colorClass = 'bg-violet-500/10 text-violet-500 border border-violet-500/30';
      if (pay === 'Abyssinia') colorClass = 'bg-amber-500/10 text-amber-500 border border-amber-500/30';
      paymentBadges += `<span class="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${colorClass}">${pay}</span> `;
    });

    html += `
      <tr class="hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition">
        <td class="py-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-violet-600/10 flex items-center justify-center font-bold text-xs text-violet-500 font-mono">${partner.avatar}</div>
            <div>
              <div class="font-bold flex items-center gap-1.5 text-zinc-900 dark:text-zinc-50">
                ${partner.username}
                ${partner.merchant ? '<span class="badge-merchant"><i data-lucide="award" class="w-3 h-3"></i> Merchant</span>' : ''}
              </div>
              <div class="text-xs text-zinc-500 flex items-center gap-2">
                <span>Trust Score: <strong class="text-emerald-500">${partner.trustScore}%</strong></span>
                <span>•</span>
                <span>${partner.completedTrades} Trades</span>
              </div>
            </div>
          </div>
        </td>
        <td class="py-4 text-right font-mono font-bold text-teal-500">${off.rate.toFixed(2)} ETB</td>
        <td class="py-4 text-right">
          <div class="font-semibold font-mono text-zinc-900 dark:text-zinc-50">${off.maxLimit.toLocaleString()} ETB</div>
          <div class="text-xs text-zinc-500 font-mono">${off.minLimit.toLocaleString()} - ${off.maxLimit.toLocaleString()} limits</div>
        </td>
        <td class="py-4 text-right">
          <div class="flex justify-end gap-1.5">${paymentBadges}</div>
        </td>
        <td class="py-4 text-center">
          <button class="btn btn-primary btn-sm px-4" onclick="initiateTrade(${off.id})">
            ${state.p2pFilterMode === 'buy' ? 'Buy' : 'Sell'} ${off.coin}
          </button>
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
  lucide.createIcons();
}

// ═══════════════════════ SECURE ESCROW & SMART SMS PARSER ENGINE ═══════════════════════
function initiateTrade(offerId) {
  const offer = state.offers.find(o => o.id === offerId);
  if (!offer) return;

  const trade = {
    id: `PM-${Math.floor(100000 + Math.random() * 900000)}`,
    offer: offer,
    amountCrypto: 100, // mock amounts
    amountFiat: 100 * offer.rate,
    status: 'escrow_locked',
    messages: [
      { sender: 'system', text: 'Secure Escrow Ledger locked. Cryptographic pre-deposit was verified. Seller cannot cancel trade.' },
      { sender: 'partner', text: `Hello, please make transaction of ETB ${(100 * offer.rate).toLocaleString()} to my account. Here is my detail: CBE Account: 100019283726 (John Doe). Send me the confirmation SMS once done.` }
    ]
  };

  state.trades.push(trade);
  state.activeTrade = trade;
  
  // Set Dashboard notifications indicators
  document.getElementById('sidebar-trade-badge-dot').classList.remove('hidden');
  
  // Open active trade screen
  window.location.hash = `#trade`;
  loadTradeData();
  
  showToast('Trade Created', `Escrow locked successfully. Reference ${trade.id}`, 'success');
}

function loadTradeData() {
  const trade = state.activeTrade;
  if (!trade) return;

  document.getElementById('active-trade-ref-label').innerText = trade.id;
  document.getElementById('trade-partner-avatar').innerText = trade.offer.advertiser.avatar;
  document.getElementById('trade-partner-name').innerText = trade.offer.advertiser.username;
  
  // Clear SMS matches
  document.getElementById('sms-match-results').classList.add('hidden');
  document.getElementById('trade-sms-paste-area').value = '';
  document.getElementById('escrow-release-btn').setAttribute('disabled', 'true');
  
  // Render steps status
  updateTradeStepProgress();
  renderTradeChat();
}

function updateTradeStepProgress() {
  const t = state.activeTrade;
  const n2 = document.getElementById('trade-step-node-2');
  const n3 = document.getElementById('trade-step-node-3');
  const n4 = document.getElementById('trade-step-node-4');
  const num2 = document.getElementById('trade-step-num-2');
  const num3 = document.getElementById('trade-step-num-3');
  const num4 = document.getElementById('trade-step-num-4');
  const t2 = document.getElementById('trade-step-title-2');
  const t3 = document.getElementById('trade-step-title-3');
  const t4 = document.getElementById('trade-step-title-4');

  if (t.status === 'escrow_locked') {
    // Stage: Pay fiat
    num2.className = 'w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold mt-0.5';
    t2.className = 'text-sm font-bold text-zinc-900 dark:text-zinc-50';
    
    num3.className = 'w-6 h-6 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center text-xs font-bold mt-0.5';
    t3.className = 'text-sm font-bold text-zinc-500';
    
    num4.className = 'w-6 h-6 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center text-xs font-bold mt-0.5';
    t4.className = 'text-sm font-bold text-zinc-500';
  } else if (t.status === 'payment_submitted') {
    // Stage: Release crypto
    num2.className = 'w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mt-0.5';
    t2.className = 'text-sm font-bold text-emerald-500';
    
    num3.className = 'w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mt-0.5';
    t3.className = 'text-sm font-bold text-emerald-500';
    
    num4.className = 'w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold mt-0.5';
    t4.className = 'text-sm font-bold text-zinc-900 dark:text-zinc-50';
  } else if (t.status === 'settled') {
    num2.className = 'w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mt-0.5';
    num3.className = 'w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mt-0.5';
    num4.className = 'w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mt-0.5';
    t2.className = 'text-sm font-bold text-emerald-500';
    t3.className = 'text-sm font-bold text-emerald-500';
    t4.className = 'text-sm font-bold text-emerald-500';
    
    document.getElementById('active-trade-status-label').innerText = 'TRADE SETTLED';
    document.getElementById('sidebar-trade-badge-dot').classList.add('hidden');
  } else if (t.status === 'disputed') {
    document.getElementById('active-trade-status-label').innerText = 'TRADE UNDER ARBITRATION';
    document.getElementById('active-trade-status-label').className = 'text-sm font-bold text-red-500';
  }
}

function renderTradeChat() {
  const container = document.getElementById('trade-chat-messages');
  if (!container) return;

  let html = '';
  state.activeTrade.messages.forEach(msg => {
    if (msg.sender === 'system') {
      html += `
        <div class="p-2.5 bg-violet-500/5 border border-violet-500/10 rounded-xl text-center text-xs text-violet-400">
          <i data-lucide="info" class="inline w-3 h-3 mr-1"></i> ${msg.text}
        </div>
      `;
    } else if (msg.sender === 'partner') {
      html += `
        <div class="flex gap-2 items-start max-w-[85%]">
          <div class="w-6 h-6 rounded-full bg-zinc-700 text-[10px] font-bold text-white flex items-center justify-center shrink-0 font-mono">${state.activeTrade.offer.advertiser.avatar}</div>
          <div class="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl text-xs">
            ${msg.text}
          </div>
        </div>
      `;
    } else {
      // Me
      html += `
        <div class="flex gap-2 items-start justify-end max-w-[85%] ml-auto">
          <div class="bg-violet-600 text-white p-3 rounded-xl text-xs">
            ${msg.text}
          </div>
        </div>
      `;
    }
  });

  container.innerHTML = html;
  container.scrollTop = container.scrollHeight;
  lucide.createIcons();
}

function sendTradeChatMessage() {
  const input = document.getElementById('trade-chat-input');
  const txt = input.value.trim();
  if (!txt) return;

  state.activeTrade.messages.push({ sender: 'me', text: txt });
  input.value = '';
  renderTradeChat();

  // Simulate Partner Auto Response for interactive feel
  if (txt.toLowerCase().includes('paid') || txt.toLowerCase().includes('verify')) {
    setTimeout(() => {
      state.activeTrade.messages.push({ sender: 'partner', text: 'I will verify the transaction. Please make sure to submit the SMS parsing check.' });
      renderTradeChat();
    }, 3000);
  }
}

function copySampleSms(provider) {
  const txt = provider === 'cbe' 
    ? document.getElementById('sms-sample-cbe').innerText 
    : document.getElementById('sms-sample-telebirr').innerText;
  
  document.getElementById('trade-sms-paste-area').value = txt;
  showToast('Template Copied', 'Sample SMS pasted into entry window', 'info');
}

// ═══════════════════════ SMART SMS PARSER ENGINE ═══════════════════════
function parseSmsEvidence() {
  const smsText = document.getElementById('trade-sms-paste-area').value.trim();
  if (!smsText) {
    showToast('Empty Entry', 'Please paste a bank confirmation SMS message first', 'danger');
    return;
  }

  // Regex patterns matching popular banking SMS structures
  const telebirrRegex = /Telebirr.*transfer of (ETB|USD) ([\d,.]+).*to.*(John Doe|Yohannes Assefa|Betelhem Tech).*Ref:\s*(\w+)/i;
  const cbeRegex = /Dear customer,.*(ETB|USD) ([\d,.]+).*transferred.*to.*(John Doe|Yohannes Assefa|Betelhem Tech).*Reference:\s*(\w+)/i;

  let amount = 0;
  let currency = 'ETB';
  let reference = '';
  let recipient = '';
  let provider = 'Unknown';
  let isMatch = false;
  let confidenceScore = 30; // base

  if (telebirrRegex.test(smsText)) {
    provider = 'Telebirr';
    const matches = smsText.match(telebirrRegex);
    currency = matches[1];
    amount = parseFloat(matches[2].replace(/,/g, ''));
    recipient = matches[3];
    reference = matches[4];
  } else if (cbeRegex.test(smsText)) {
    provider = 'Commercial Bank of Ethiopia (CBE)';
    const matches = smsText.match(cbeRegex);
    currency = matches[1];
    amount = parseFloat(matches[2].replace(/,/g, ''));
    recipient = matches[3];
    reference = matches[4];
  } else {
    // Generic fallback heuristics for other formats
    const moneyMatch = smsText.match(/(ETB|USD|Birr)\s*([\d,.]+)/i);
    const refMatch = smsText.match(/(Ref|Reference|Txn|ID)[:\s]*(\w+)/i);
    if (moneyMatch) {
      currency = moneyMatch[1];
      amount = parseFloat(moneyMatch[2].replace(/,/g, ''));
    }
    if (refMatch) {
      reference = refMatch[2];
    }
  }

  // Verification Match calculations
  const expectedAmount = state.activeTrade.amountFiat;
  
  if (amount === expectedAmount) {
    isMatch = true;
    confidenceScore = 98; // matches amount, ref checks out
  } else if (amount > 0) {
    confidenceScore = 45; // amount mismatch discrepancy
  }

  // Display matches UI
  const widget = document.getElementById('sms-match-results');
  widget.classList.remove('hidden');
  
  document.getElementById('parsed-val-amount').innerText = `${currency} ${amount.toLocaleString(undefined, {minimumFractionDigits:2})}`;
  document.getElementById('parsed-val-ref').innerText = reference || 'Not detected';
  
  const matchLabel = document.getElementById('parsed-val-match');
  const badge = document.getElementById('match-score-badge');
  
  if (isMatch) {
    matchLabel.innerText = `Matches Escrow Value (${currency} ${expectedAmount.toLocaleString()})`;
    matchLabel.className = 'font-semibold font-mono text-emerald-500';
    badge.innerText = `${confidenceScore}% Match (Verified)`;
    badge.className = 'text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500';
    
    // Unlock release button
    document.getElementById('escrow-release-btn').removeAttribute('disabled');
    showToast('Signature Authenticated', 'Smart SMS validates with escrow database settings. Ready to release asset.', 'success');
    
    // Progress trade status
    state.activeTrade.status = 'payment_submitted';
    state.activeTrade.messages.push({ sender: 'system', text: `SMART VERIFICATION PASSED: Match score ${confidenceScore}%. Transaction ID ${reference} verified by SMS Parser. Safe for seller to release escrow.` });
    updateTradeStepProgress();
    renderTradeChat();
  } else {
    matchLabel.innerText = `DISCREPANCY ALERT: Expected ${currency} ${expectedAmount.toLocaleString()}`;
    matchLabel.className = 'font-semibold font-mono text-red-500';
    badge.innerText = `${confidenceScore}% Match (Low Score)`;
    badge.className = 'text-xs font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-500';
    
    showToast('Verification Failed', 'Transaction amount or parameters do not match trade escrow specs.', 'danger');
  }
}

function releaseEscrowPayment() {
  state.activeTrade.status = 'settled';
  state.activeTrade.messages.push({ sender: 'system', text: 'TRADE COMPLETED: Cryptographic escrow unlocked. Funds transferred to buyer wallet.' });
  
  // Add payout to user mock wallet balance
  state.currentUser.trustScore = Math.min(100, state.currentUser.trustScore + 1);
  
  updateTradeStepProgress();
  renderTradeChat();
  showToast('Settlement Complete', 'Assets released successfully from escrow custody.', 'success');
}

function initiateDispute() {
  state.activeTrade.status = 'disputed';
  state.activeTrade.messages.push({ sender: 'system', text: 'ARBITRATION ENGAGED: Paymax admin is reviewing chat transcripts, device logs, and banking signatures.' });
  
  updateTradeStepProgress();
  renderTradeChat();
  
  // Seed dispute in Admin dashboard database
  state.trades.push(state.activeTrade);
  
  showToast('Dispute Opened', 'Arbitrators have been requested. Escrow locked permanently until resolution.', 'warning');
}

// ═══════════════════════ ADMINISTRATIVE SYSTEM CONTROLS ═══════════════════════
function renderAdminDesk() {
  // Disputes Table
  const disputeTbody = document.getElementById('admin-disputes-tbody');
  const disputes = state.trades.filter(t => t.status === 'disputed');
  
  if (disputes.length === 0) {
    disputeTbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-zinc-500">No active escrow dispute tickets open.</td></tr>`;
  } else {
    let html = '';
    disputes.forEach(disp => {
      html += `
        <tr>
          <td class="py-4 font-mono font-bold">${disp.id}</td>
          <td class="py-4">${disp.offer.advertiser.username} vs You</td>
          <td class="py-4 font-mono text-teal-500">${disp.amountFiat.toLocaleString()} ETB</td>
          <td class="py-4 text-xs max-w-[200px] truncate">${disp.messages[disp.messages.length - 1].text}</td>
          <td class="py-4 text-center flex gap-2 justify-center">
            <button class="btn btn-primary btn-sm px-2.5 py-1" onclick="resolveAdminDispute('${disp.id}', 'release')">Release to Buyer</button>
            <button class="btn btn-secondary btn-sm px-2.5 py-1 border-red-500/20 text-red-500 hover:bg-red-500/5" onclick="resolveAdminDispute('${disp.id}', 'refund')">Refund Seller</button>
          </td>
        </tr>
      `;
    });
    disputeTbody.innerHTML = html;
  }

  // KYC Queue
  const kycTbody = document.getElementById('admin-kyc-tbody');
  let kycHtml = `
    <tr class="hover:bg-zinc-900/40">
      <td class="py-4 font-semibold">Yohannes Assefa</td>
      <td class="py-4 text-xs font-mono">National ID Card</td>
      <td class="py-4 text-emerald-500 font-bold">98% Match</td>
      <td class="py-4 text-emerald-500 font-bold">100% Liveness</td>
      <td class="py-4 text-center">
        <button class="btn btn-primary btn-sm px-3 py-1 bg-emerald-600 hover:bg-emerald-700" onclick="approveKycSim(this)">Approve</button>
      </td>
    </tr>
  `;
  kycTbody.innerHTML = kycHtml;

  // Fraud alerts
  const logsDiv = document.getElementById('admin-fraud-logs');
  let logsHtml = '';
  state.fraudLogs.forEach(log => {
    logsHtml += `
      <div class="p-3 rounded-lg border border-red-500/15 bg-red-500/[0.02] flex items-center justify-between text-xs">
        <div class="flex items-center gap-3">
          <i data-lucide="shield-alert" class="text-red-500 w-4 h-4 shrink-0"></i>
          <div>
            <span class="font-bold text-red-500">[ALERT]</span>
            <span class="text-zinc-600 dark:text-zinc-400">${log.msg}</span>
          </div>
        </div>
        <span class="font-mono text-zinc-500">${log.time}</span>
      </div>
    `;
  });
  logsDiv.innerHTML = logsHtml;
  lucide.createIcons();
}

function resolveAdminDispute(tradeId, decision) {
  const trade = state.trades.find(t => t.id === tradeId);
  if (!trade) return;
  
  trade.status = decision === 'release' ? 'settled' : 'refunded';
  trade.messages.push({ sender: 'system', text: `ADMIN INTERVENTION: Escrow resolved. Decision: ${decision === 'release' ? 'Released to Buyer' : 'Refunded to Seller'}.` });
  
  showToast('Resolution Dispatched', `Escrow ticket ${tradeId} resolved.`, 'success');
  renderAdminDesk();
}

function approveKycSim(btn) {
  btn.parentElement.innerHTML = '<span class="text-emerald-500 font-bold">APPROVED</span>';
  showToast('KYC Cleared', 'Verified Badge dispatched to Yohannes Assefa', 'success');
}

function clearFraudAlerts() {
  state.fraudLogs = [];
  renderAdminDesk();
  showToast('Logs Flushed', 'Threat detection logs cleared successfully.', 'info');
}

function switchAdminTab(tab) {
  const tabs = ['disputes', 'kyc', 'fraud'];
  tabs.forEach(t => {
    document.getElementById(`admin-tab-${t}`).classList.toggle('active', t === tab);
    document.getElementById(`admin-section-${t}`).classList.toggle('hidden', t !== tab);
  });
}

// ═══════════════════════ SETTINGS CONTROLLERS ═══════════════════════
function toggle2faSimulation(checkbox) {
  showToast('Security Update', `2-Factor Authentication requirement ${checkbox.checked ? 'activated' : 'deactivated'}`, 'info');
}

function toggleMerchantDepositSimulation() {
  showToast('Security Deposit Lock', 'Processing collateral deposit of 500 USDT into Pool...', 'info');
  setTimeout(() => {
    state.merchantStatus = true;
    showToast('Merchant Upgrade Approved', 'Premium Merchant Badge added to your profile.', 'success');
  }, 2000);
}

function toggleLanguageTranslation(lang) {
  if (lang === 'am') {
    document.title = "ፔይማክስ — አስተማማኝ የዲጂታል መገበያያ Escrow እና የክፍያ ማረጋገጫ";
    showToast('ቋንቋ ተቀይሯል', 'መተግበሪያው ወደ አማርኛ ተቀይሯል', 'info');
  } else if (lang === 'ar') {
    document.title = "بايمكس — منصة حماية الأصول الرقمية والضمان";
    showToast('تغيير اللغة', 'تم تغيير لغة التطبيق إلى العربية', 'info');
  } else {
    document.title = "Paymax — Secure Digital Asset Escrow & Trust Platform";
    showToast('Language Changed', 'Interface localization switched to English', 'info');
  }
}

// ═══════════════════════ FAQ SECTION TOGGLES ═══════════════════════
window.toggleFaq = function(button) {
  const desc = button.nextElementSibling;
  const icon = button.querySelector('i');
  
  if (desc.classList.contains('hidden')) {
    desc.classList.remove('hidden');
    desc.classList.add('fade-in');
    icon.style.transform = 'rotate(180deg)';
  } else {
    desc.classList.add('hidden');
    icon.style.transform = 'rotate(0deg)';
  }
};

// ═══════════════════════ TOAST NOTIFICATION ═══════════════════════
function showToast(title, body, type = 'info') {
  const toast = document.getElementById('toast-message');
  const tTitle = document.getElementById('toast-title');
  const tBody = document.getElementById('toast-body');
  const tIconBg = document.getElementById('toast-icon-bg');
  const tIconSvg = document.getElementById('toast-icon-svg');

  tTitle.innerText = title;
  tBody.innerText = body;

  // Set colors based on type
  tIconBg.className = 'w-8 h-8 rounded-lg flex items-center justify-center ';
  if (type === 'success') {
    tIconBg.classList.add('bg-emerald-500/10', 'text-emerald-500');
    tIconSvg.setAttribute('data-lucide', 'check');
  } else if (type === 'warning') {
    tIconBg.classList.add('bg-amber-500/10', 'text-amber-500');
    tIconSvg.setAttribute('data-lucide', 'alert-triangle');
  } else if (type === 'danger') {
    tIconBg.classList.add('bg-red-500/10', 'text-red-500');
    tIconSvg.setAttribute('data-lucide', 'x');
  } else {
    tIconBg.classList.add('bg-violet-600/10', 'text-violet-500');
    tIconSvg.setAttribute('data-lucide', 'info');
  }

  lucide.createIcons();

  // Animate slide up
  toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
  toast.classList.add('opacity-1', 'translate-y-0');

  // Auto dismiss
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    toast.classList.remove('opacity-1', 'translate-y-0');
  }, 4000);
}
