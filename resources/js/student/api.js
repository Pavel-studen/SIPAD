import axios from 'axios';

export const TOKEN_STORAGE_KEY = 'sipad_auth_token';

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
    unauthorizedHandler = handler;
}

export function getStoredToken() {
    try {
        return window.localStorage.getItem(TOKEN_STORAGE_KEY) || '';
    } catch {
        return '';
    }
}

export function setStoredToken(token) {
    try {
        if (token) {
            window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
        } else {
            window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
    } catch {
        // Ignore storage errors in restricted environments
    }
}

export function clearStoredToken() {
    setStoredToken('');
}

const api = axios.create({
    baseURL: window.__SIPAD_CONFIG__?.apiBase || '/api/v1',
    headers: {
        Accept: 'application/json',
    },
    timeout: 15000,
});

api.interceptors.request.use((config) => {
    const token = getStoredToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401 && !error?.config?.skipUnauthorizedHook) {
            clearStoredToken();
            if (typeof unauthorizedHandler === 'function') {
                unauthorizedHandler();
            }
        }
        return Promise.reject(error);
    }
);

function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
}

const devClient = axios.create({
    baseURL: '',
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    timeout: 15000,
});

devClient.interceptors.request.use((config) => {
    const csrf = getCsrfToken();
    if (csrf) {
        config.headers['X-CSRF-TOKEN'] = csrf;
    }
    return config;
});

// --- Auth & SSO Endpoints ---
export async function fetchMe() {
    const res = await api.get('/auth/me');
    return res.data;
}

export async function logoutApi() {
    const res = await api.post('/auth/logout', {}, { skipUnauthorizedHook: true });
    return res.data;
}

export async function getGoogleRedirect(redirectUri) {
    const res = await api.get('/auth/google/redirect', {
        params: redirectUri ? { redirect_uri: redirectUri } : undefined,
        skipUnauthorizedHook: true,
    });
    return res.data;
}

export async function exchangeGoogleCallback(payload) {
    const res = await api.post('/auth/google/callback', payload, {
        skipUnauthorizedHook: true,
    });
    return res.data;
}

// --- Student Profiling Endpoints ---
export async function fetchProfilingConfig() {
    const res = await api.get('/student/profiling-config');
    return res.data;
}

export async function submitStudentProfile(payload) {
    const res = await api.post('/student/profile', payload);
    return res.data;
}

export async function uploadStudentAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.post('/student/avatar', formData);
    return res.data;
}

// --- Hasil Role & Tim Endpoints ---
export async function fetchMyTeam() {
    const res = await api.get('/student/my-team');
    return res.data;
}

// --- Digital Complaint Box Endpoints ---
export async function fetchTeammates() {
    const res = await api.get('/student/teammates');
    return res.data;
}

export async function submitComplaint(formData) {
    const res = await api.post('/complaints', formData);
    return res.data;
}

export async function fetchComplaints() {
    const res = await api.get('/complaints');
    return res.data;
}

export async function fetchComplaintDetail(id) {
    const res = await api.get(`/complaints/${id}`);
    return res.data;
}

export async function reviewComplaint(id) {
    const res = await api.patch(`/complaints/${id}/review`);
    return res.data;
}

// --- Asisten Praktikum & Tim Endpoints ---
export async function fetchTeams(params = {}) {
    const res = await api.get('/teams', { params });
    return res.data;
}

export async function saveTeamProject(teamId, payload) {
    const res = await api.post(`/teams/${teamId}/project`, payload);
    return res.data;
}

// --- Master Admin & User Management Endpoints ---
export async function fetchUsers(params = {}) {
    const res = await api.get('/users', { params });
    return res.data;
}

export async function initiateLecturer(payload) {
    const res = await api.post('/admin/lecturers', payload);
    return res.data;
}

export async function storeWhitelistUser(payload) {
    const res = await api.post('/users/whitelist', payload);
    return res.data;
}

export async function importWhitelistFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/users/whitelist/import', formData);
    return res.data;
}

export async function updateUserRole(userId, role) {
    const res = await api.patch(`/users/${userId}/role`, { role });
    return res.data;
}

export async function deleteUser(userId) {
    const res = await api.delete(`/users/${userId}`);
    return res.data;
}

// --- System Settings & Roles Endpoints ---
export async function fetchSettings() {
    const res = await api.get('/settings');
    return res.data;
}

export async function updateSettings(payload) {
    const res = await api.put('/settings', payload);
    return res.data;
}

export async function fetchRoles() {
    const res = await api.get('/roles');
    return res.data;
}

// --- Evaluation & Override Endpoints (Dosen & Praktisi Industri) ---
export async function fetchEvaluations(params = {}) {
    const res = await api.get('/evaluations', { params });
    return res.data;
}

export async function fetchEvaluationDetail(userId) {
    const res = await api.get(`/evaluations/${userId}`);
    return res.data;
}

export async function updateEvaluationNote(userId, note) {
    const res = await api.patch(`/evaluations/${userId}/note`, { note });
    return res.data;
}

export async function overrideStudentRole(userId, payload) {
    const res = await api.patch(`/evaluations/${userId}/override`, payload);
    return res.data;
}

export async function resetStudentRole(userId) {
    const res = await api.post(`/evaluations/${userId}/reset`);
    return res.data;
}

export async function lockAllEvaluations() {
    const res = await api.post('/evaluations/lock-all');
    return res.data;
}

export async function unlockAllEvaluations() {
    const res = await api.post('/evaluations/unlock-all');
    return res.data;
}

// --- Team Auto-Grouping, Supervisor & Bypass Endpoints (Dosen) ---
export async function autoGroupTeams() {
    const res = await api.post('/teams/auto-group');
    return res.data;
}

export async function resetTeamGrouping() {
    const res = await api.post('/teams/reset-grouping');
    return res.data;
}

export async function fetchAssistants() {
    const res = await api.get('/teams/assistants');
    return res.data;
}

export async function assignTeamSupervisor(teamId, supervisorId) {
    const res = await api.patch(`/teams/${teamId}/supervisor`, { supervisor_id: supervisorId });
    return res.data;
}

export async function storeExclusiveTeam(payload) {
    const res = await api.post('/teams/exclusive', payload);
    return res.data;
}

export async function downloadComplaintEvidence(complaintId, filename = 'bukti_pengaduan') {
    const response = await api.get(`/complaints/${complaintId}/evidence`, {
        params: { download: 1 },
        responseType: 'blob',
    });

    const contentType = response.headers?.['content-type'] || 'application/octet-stream';
    const blob = new Blob([response.data], { type: contentType });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
}

// --- Local Developer Helpers (/dev/*) ---
export async function devFetchUsers() {
    const res = await devClient.get('/dev/users');
    return res.data;
}

export async function devGenerateToken(payload) {
    const res = await devClient.post('/dev/generate-token', payload);
    return res.data;
}

export async function devSeedSampleData() {
    const res = await devClient.post('/dev/seed-sample-data');
    return res.data;
}
