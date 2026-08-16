// ─── NEBULA HOUSE API CLIENT ──────────────────
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : 'https://the-nebula-house-backend.onrender.com/api';

// Google OAuth Client ID Config (Paste your credentials here)
window.GOOGLE_CLIENT_ID = '428710921643-c3shur9o99hbqbu7emoqvhi1gd89a6de.apps.googleusercontent.com'; 

// ─── TOKEN MANAGEMENT ────────────────────────
function getToken() { return localStorage.getItem('nebula_token'); }
function setToken(t) { localStorage.setItem('nebula_token', t); }
function clearToken() { localStorage.removeItem('nebula_token'); }

function getStoredUser() {
  const u = localStorage.getItem('nebula_user');
  return u ? JSON.parse(u) : null;
}
function setStoredUser(u) { localStorage.setItem('nebula_user', JSON.stringify(u)); }
function clearStoredUser() { localStorage.removeItem('nebula_user'); }

// ─── CORE FETCH WRAPPER ───────────────────────
async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// ─── AUTH ─────────────────────────────────────
async function nebulaRegister(name, email, password) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

async function nebulaLogin(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  setStoredUser(data.user);
  return data.user;
}

async function nebulaGoogleLogin(idToken) {
  const data = await apiRequest('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });
  setToken(data.token);
  setStoredUser(data.user);
  return data.user;
}

async function nebulaLogout() {
  clearToken();
  clearStoredUser();
}

async function nebulaResendVerification(email) {
  return apiRequest('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

async function nebulaForgotPassword(email) {
  return apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

async function nebulaResetPassword(token, password) {
  return apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

async function nebulaGetMe() {
  if (!getToken()) return null;
  try {
    const user = await apiRequest('/auth/me');
    setStoredUser(user);
    return user;
  } catch (e) {
    clearToken();
    clearStoredUser();
    return null;
  }
}

// ─── CURRENT USER ─────────────────────────────
function getCurrentUser() { return getStoredUser(); }
function isAdmin(user) {
  return user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');
}
function isEmailVerified() {
  const u = getStoredUser();
  return u ? u.emailVerified : false;
}

// ─── USER PROFILE ─────────────────────────────
async function nebulaUpdateProfile(data) {
  const updated = await apiRequest('/users/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  setStoredUser({ ...getStoredUser(), ...updated });
  return updated;
}

async function nebulaUploadPhoto(file) {
  const formData = new FormData();
  formData.append('photo', file);
  const token = getToken();
  const res = await fetch(`${API_BASE}/users/me/photo`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  const user = getStoredUser();
  if (user) { user.photo = data.photo; setStoredUser(user); }
  return data.photo;
}

async function nebulaChangePassword(currentPassword, newPassword) {
  return apiRequest('/users/me/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

async function nebulaGetUserPosts(userId) {
  const path = userId ? `/users/${userId}/posts` : '/users/me/posts';
  return apiRequest(path);
}

// ─── POSTS ────────────────────────────────────
async function nebulaGetPosts(page = 1, limit = 20, tag = '') {
  const q = new URLSearchParams({ page, limit, ...(tag ? { tag } : {}) });
  return apiRequest(`/posts?${q}`);
}

async function nebulaGetPost(id) {
  return apiRequest(`/posts/${id}`);
}

async function nebulaCreatePost(post) {
  return apiRequest('/posts', { method: 'POST', body: JSON.stringify(post) });
}

async function nebulaToggleLike(postId) {
  return apiRequest(`/posts/${postId}/like`, { method: 'POST' });
}

async function nebulaAddComment(postId, body) {
  return apiRequest(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

async function nebulaDeleteComment(postId, commentId) {
  return apiRequest(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' });
}

async function nebulaGetMyPosts() {
  return apiRequest('/posts/mine');
}

// ─── NEWSLETTER ───────────────────────────────
async function nebulaSubscribeNewsletter(email, name = '') {
  return apiRequest('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email, name }),
  });
}

// ─── NOMINATIONS ─────────────────────────────
async function nebulaSubmitNomination(bookTitle, bookAuthor, reason) {
  return apiRequest('/nominations', {
    method: 'POST',
    body: JSON.stringify({ bookTitle, bookAuthor, reason }),
  });
}

// ─── AI ASSISTANCE ───────────────────────────
async function nebulaAIAssist(text) {
  return apiRequest('/ai/ai-assist', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

// ─── MONTHLY CHALLENGES ───────────────────────
async function nebulaGetChallenges(activeOnly = false) {
  return apiRequest(`/challenges?activeOnly=${activeOnly}`);
}

async function nebulaGetChallenge(id) {
  return apiRequest(`/challenges/${id}`);
}

async function adminCreateChallenge(challenge) {
  return apiRequest('/challenges', {
    method: 'POST',
    body: JSON.stringify(challenge),
  });
}

// ─── AUTHOR MENTORSHIP ────────────────────────
async function nebulaGetMentors() {
  return apiRequest('/mentorship/mentors');
}

async function nebulaGetMentorshipRequests() {
  return apiRequest('/mentorship/requests');
}

async function nebulaRequestMentorship(mentorId, message) {
  return apiRequest('/mentorship/request', {
    method: 'POST',
    body: JSON.stringify({ mentorId, message }),
  });
}

async function nebulaRespondMentorshipRequest(requestId, status) {
  return apiRequest(`/mentorship/requests/${requestId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

// ─── ADMIN ────────────────────────────────────
async function adminGetStats() { return apiRequest('/admin/stats'); }
async function adminGetUsers(params = {}) {
  const q = new URLSearchParams(params);
  return apiRequest(`/admin/users?${q}`);
}
async function adminUpdateUserRole(userId, role) {
  return apiRequest(`/admin/users/${userId}/role`, {
    method: 'PUT', body: JSON.stringify({ role }),
  });
}
async function adminToggleMentor(userId, isMentor, mentorBio = null) {
  return apiRequest(`/admin/users/${userId}/mentor`, {
    method: 'PUT', body: JSON.stringify({ isMentor, mentorBio }),
  });
}
async function adminDeleteUser(userId) {
  return apiRequest(`/admin/users/${userId}`, { method: 'DELETE' });
}
async function adminGetPosts(params = {}) {
  const q = new URLSearchParams(params);
  return apiRequest(`/admin/posts?${q}`);
}
async function adminApprovePost(postId) {
  return apiRequest(`/admin/posts/${postId}/approve`, { method: 'PUT' });
}
async function adminRejectPost(postId, reason = '') {
  return apiRequest(`/admin/posts/${postId}/reject`, {
    method: 'PUT', body: JSON.stringify({ reason }),
  });
}
async function adminDeletePost(postId) {
  return apiRequest(`/admin/posts/${postId}`, { method: 'DELETE' });
}
async function adminGetNewsletter() { return apiRequest('/admin/newsletter'); }
async function adminGetNominations() { return apiRequest('/admin/nominations'); }

// ─── INIT ON PAGE LOAD ────────────────────────
// Refresh user from server on every page load to keep session fresh
(async () => {
  if (getToken()) {
    const user = await nebulaGetMe();
    if (user) {
      // Trigger navbar update if updateNavbarAuth exists
      if (typeof updateNavbarAuth === 'function') updateNavbarAuth(user);
    } else {
      // Token expired or invalid
      if (typeof updateNavbarAuth === 'function') updateNavbarAuth(null);
    }
  } else {
    if (typeof updateNavbarAuth === 'function') updateNavbarAuth(null);
  }
})();
