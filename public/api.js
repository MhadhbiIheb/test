// ══════════════════════════════════════════
//   LUMIERA — Shared API Client
//   File: public/api.js
//   Include in all HTML pages
// ══════════════════════════════════════════

const API_BASE = window.location.origin + '/api';

// ── TOKEN MANAGEMENT ───────────────────────────────────────
const Auth = {
  getToken:  () => localStorage.getItem('lumiera_token'),
  getUser:   () => JSON.parse(localStorage.getItem('lumiera_user') || 'null'),
  setSession:(token, user) => {
    localStorage.setItem('lumiera_token', token);
    localStorage.setItem('lumiera_user',  JSON.stringify(user));
  },
  clear:     () => {
    localStorage.removeItem('lumiera_token');
    localStorage.removeItem('lumiera_user');
  },
  isLoggedIn:() => !!localStorage.getItem('lumiera_token'),
  isOwner:   () => Auth.getUser()?.role === 'owner',
  isClient:  () => Auth.getUser()?.role === 'client',
};

// ── BASE FETCH ─────────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const token = Auth.getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };
  const res = await fetch(API_BASE + endpoint, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur API');
  return data;
}

// ── AUTH API ───────────────────────────────────────────────
const AuthAPI = {
  async login(email, password) {
    const data = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
    Auth.setSession(data.token, data.user);
    return data;
  },
  async register(userData) {
    const data = await apiFetch('/auth/register', { method: 'POST', body: userData });
    Auth.setSession(data.token, data.user);
    return data;
  },
  logout() {
    Auth.clear();
    window.location.href = '/';
  }
};

// ── RDV API ────────────────────────────────────────────────
const RdvAPI = {
  getAll:    (params = {}) => apiFetch('/rdv?' + new URLSearchParams(params)),
  getClient: ()            => apiFetch('/rdv/client'),
  create:    (rdv)         => apiFetch('/rdv', { method: 'POST', body: rdv }),
  updateStatut: (id, statut) => apiFetch(`/rdv/${id}/statut`, { method: 'PATCH', body: { statut } }),
  cancel:    (id)          => apiFetch(`/rdv/${id}`, { method: 'DELETE' }),
};

// ── CLIENTS API ────────────────────────────────────────────
const ClientsAPI = {
  getAll:   (search = '') => apiFetch('/clients' + (search ? `?search=${search}` : '')),
  getById:  (id)          => apiFetch(`/clients/${id}`),
};

// ── EMPLOYES API ───────────────────────────────────────────
const EmployesAPI = {
  getAll:   ()           => apiFetch('/employes'),
  create:   (emp)        => apiFetch('/employes', { method: 'POST', body: emp }),
  update:   (id, data)   => apiFetch(`/employes/${id}`, { method: 'PATCH', body: data }),
  delete:   (id)         => apiFetch(`/employes/${id}`, { method: 'DELETE' }),
};

// ── SERVICES API ───────────────────────────────────────────
const ServicesAPI = {
  getAll:   (salonId) => apiFetch('/services' + (salonId ? `?salonId=${salonId}` : '')),
  create:   (s)       => apiFetch('/services', { method: 'POST', body: s }),
  update:   (id, s)   => apiFetch(`/services/${id}`, { method: 'PATCH', body: s }),
};

// ── STOCK API ──────────────────────────────────────────────
const StockAPI = {
  getAll:    ()          => apiFetch('/stock'),
  getAlertes:()          => apiFetch('/stock/alertes'),
  create:    (item)      => apiFetch('/stock', { method: 'POST', body: item }),
  update:    (id, data)  => apiFetch(`/stock/${id}`, { method: 'PATCH', body: data }),
  delete:    (id)        => apiFetch(`/stock/${id}`, { method: 'DELETE' }),
};

// ── PAIEMENTS API ──────────────────────────────────────────
const PaiementsAPI = {
  getAll:  (params) => apiFetch('/paiements?' + new URLSearchParams(params)),
  create:  (p)      => apiFetch('/paiements', { method: 'POST', body: p }),
};

// ── RAPPORTS API ───────────────────────────────────────────
const RapportsAPI = {
  dashboard: ()        => apiFetch('/rapports/dashboard'),
  revenus:   (periode) => apiFetch(`/rapports/revenus?periode=${periode}`),
};

// ── SALON API ──────────────────────────────────────────────
const SalonAPI = {
  get:      ()      => apiFetch('/salon'),
  update:   (data)  => apiFetch('/salon', { method: 'PATCH', body: data }),
  getAll:   (params)=> apiFetch('/salons?' + new URLSearchParams(params)),
};


// ── TOAST HELPER ───────────────────────────────────────────
function showApiToast(msg, type = 'success') {
  const el = document.getElementById('toast');
  if (!el) return;
  const msgEl = document.getElementById('toast-msg');
  if (msgEl) msgEl.textContent = msg;
  el.style.borderColor = type === 'error' ? 'rgba(239,68,68,.4)' : 'rgba(201,168,76,.3)';
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3500);
}

// ── REDIRECT IF NOT LOGGED IN ──────────────────────────────
function requireAuth(role = null) {
  if (!Auth.isLoggedIn()) {
    window.location.href = '/app';
    return false;
  }
  if (role && Auth.getUser()?.role !== role) {
    showApiToast('Accès non autorisé', 'error');
    return false;
  }
  return true;
}

// ── FILL USER INFO IN UI ───────────────────────────────────
function fillUserInfo() {
  const user = Auth.getUser();
  if (!user) return;
  document.querySelectorAll('[data-user-name]').forEach(el =>
    el.textContent = `${user.prenom} ${user.nom}`);
  document.querySelectorAll('[data-user-role]').forEach(el =>
    el.textContent = user.role === 'owner' ? 'Propriétaire' : 'Client');
  document.querySelectorAll('[data-user-points]').forEach(el =>
    el.textContent = user.pointsFidelite || 0);
}

// Export global
window.API    = { Auth, AuthAPI, RdvAPI, ClientsAPI, EmployesAPI, ServicesAPI, StockAPI, PaiementsAPI, RapportsAPI, SalonAPI };
window.showApiToast = showApiToast;
window.requireAuth  = requireAuth;
window.fillUserInfo = fillUserInfo;
