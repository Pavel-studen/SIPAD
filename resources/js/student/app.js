import {
    clearStoredToken,
    devFetchUsers,
    devGenerateToken,
    devSeedSampleData,
    downloadComplaintEvidence,
    exchangeGoogleCallback,
    fetchComplaintDetail,
    fetchComplaints,
    fetchMe,
    fetchMyTeam,
    fetchProfilingConfig,
    fetchTeams,
    fetchTeammates,
    getGoogleRedirect,
    getStoredToken,
    logoutApi,
    reviewComplaint,
    saveTeamProject,
    setStoredToken,
    setUnauthorizedHandler,
    submitComplaint,
    submitStudentProfile,
    uploadStudentAvatar,
} from './api.js';
import { resetSessionState, state, subscribe } from './state.js';
import {
    escapeHtml,
    formatApiError,
    NIM_REGEX,
    parseNimStatus,
    roleDisplayTag,
} from './utils.js';
import { renderAsprakView } from './views/asprakView.js';
import { renderAuthScreen } from './views/authView.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderHasilRoleView } from './views/hasilRoleView.js';
import { renderBottomNav, renderDecorativeFlowers, renderHeader } from './views/layout.js';
import { renderModal } from './views/modals.js';
import { renderPengaduanView } from './views/pengaduanView.js';
import { renderProfileView } from './views/profileView.js';

const rootEl = document.getElementById('sipad-app');
const isLocal = Boolean(window.__SIPAD_CONFIG__?.isLocal);

const TAB_PATH_MAP = {
    dashboard: '/dashboard',
    'pilih-peran': '/pilih-peran',
    'hasil-role': '/hasil-role',
    pengaduan: '/pengaduan',
    'asprak-dashboard': '/asisten',
    'asprak-project': '/asisten/input-proyek',
    landing: '/landing',
    'access-blocked': '/auth/access-blocked',
};

function resolveHomeTabForUser(user) {
    const role = String(user?.user_role || user?.role || 'student').toLowerCase();
    return role === 'assistant' ? 'asprak-dashboard' : 'dashboard';
}

function getTabFromPath(pathname) {
    if (pathname.includes('/auth/access-blocked')) return 'access-blocked';
    if (pathname === '/login' || pathname === '/landing') return 'landing';
    if (pathname.includes('/asisten/input-proyek') || pathname.includes('/asprak/input-proyek')) return 'asprak-project';
    if (pathname.includes('/asisten/pengaduan/')) return 'asprak-complaint';
    if (pathname.startsWith('/asisten') || pathname.startsWith('/asprak')) return 'asprak-dashboard';
    if (pathname.includes('/dashboard')) return 'dashboard';
    if (pathname.includes('/hasil-role')) return 'hasil-role';
    if (pathname.includes('/pengaduan')) return 'pengaduan';
    if (pathname.includes('/pilih-peran') || pathname.includes('/profile')) return 'pilih-peran';
    return 'home';
}

function syncUrlToTab(tab, replace = false, extraId = null) {
    let targetPath = TAB_PATH_MAP[tab];
    if (tab === 'asprak-complaint' && extraId) {
        targetPath = `/asisten/pengaduan/${extraId}`;
    }
    if (!targetPath) return;

    if (window.location.pathname !== targetPath) {
        const method = replace ? 'replaceState' : 'pushState';
        window.history[method]({ tab, complaintId: extraId }, '', targetPath);
    }
}

function renderApp() {
    if (!rootEl) return;

    if (state.booting) {
        rootEl.innerHTML = `
            <div class="min-h-dvh flex items-center justify-center bg-white">
                <div class="flex flex-col items-center gap-3 text-[#486284]">
                    <div class="w-9 h-9 rounded-full border-4 border-[#C0DDF9] border-t-[#0773DF] animate-spin"></div>
                    <span class="text-sm font-semibold tracking-wide">Menyiapkan Portal SIPAD...</span>
                </div>
            </div>
        `;
        return;
    }

    if (!state.user || state.activeTab === 'access-blocked' || state.activeTab === 'landing') {
        rootEl.innerHTML = renderAuthScreen(state);
        return;
    }

    let pageHtml = '';
    if (state.activeTab === 'asprak-dashboard' || state.activeTab === 'asprak-complaint' || state.activeTab === 'asprak-project') {
        pageHtml = renderAsprakView(state);
    } else if (state.activeTab === 'dashboard') {
        pageHtml = renderDashboardView(state);
    } else if (state.activeTab === 'hasil-role') {
        pageHtml = renderHasilRoleView(state);
    } else if (state.activeTab === 'pengaduan') {
        pageHtml = renderPengaduanView(state);
    } else {
        pageHtml = renderProfileView(state);
    }

    const bottomNavHtml = renderBottomNav(state.activeTab, state.user);
    const hasBottomDock = bottomNavHtml !== '';

    rootEl.innerHTML = `
        ${renderHeader(state)}

        <main class="flex-1 relative flex flex-col justify-between">
            ${renderDecorativeFlowers()}

            <section class="flex-1 w-full px-4 sm:px-20 md:px-24 lg:px-28 xl:px-36 pt-6 sm:pt-9 ${hasBottomDock ? 'pb-24 sm:pb-4' : 'pb-10'} flex flex-col justify-center">
                ${pageHtml}
            </section>

            ${bottomNavHtml}
        </main>

        ${renderModal(state)}
    `;
}

subscribe(renderApp);

async function loadDevUsersIfLocal() {
    if (!isLocal) return;
    try {
        const res = await devFetchUsers();
        state.dev.users = Array.isArray(res?.data) ? res.data : [];
        renderApp();
    } catch {
        // Ignore if dev routes are disabled
    }
}

async function loadProfiling(force = false) {
    if (state.profiling.loading || (state.profiling.loaded && !force)) return;
    state.profiling.loading = true;
    state.profiling.error = '';
    renderApp();

    try {
        const res = await fetchProfilingConfig();
        const data = res?.data || {};
        state.profiling.config = data.config || state.profiling.config;
        state.profiling.roles = Array.isArray(data.roles) ? data.roles : [];

        const current = data.current_profile;
        state.profiling.form.name = state.user?.name || '';
        state.profiling.form.email = state.user?.email || '';
        state.profiling.form.nim = current?.nim || state.user?.student_profile?.nim || '';
        state.profiling.form.role_1_id = current?.role_1_id ?? null;
        state.profiling.form.role_2_id = state.profiling.config.is_bypass ? null : (current?.role_2_id ?? null);
        state.profiling.form.portfolio_link = current?.portfolio_link || '';
        state.profiling.form.skill_ids = new Set((current?.selected_skill_ids || []).map(Number));
        state.profiling.loaded = true;
    } catch (error) {
        state.profiling.error = formatApiError(error, 'Gagal memuat konfigurasi profiling mahasiswa.');
    } finally {
        state.profiling.loading = false;
        renderApp();
    }
}

async function loadMyTeam(force = false) {
    if (state.myTeam.loading || (state.myTeam.loaded && !force)) return;
    state.myTeam.loading = true;
    state.myTeam.error = '';
    renderApp();

    try {
        const res = await fetchMyTeam();
        state.myTeam.data = res?.data || null;
        state.myTeam.loaded = true;
    } catch (error) {
        state.myTeam.error = formatApiError(error, 'Gagal memuat informasi Role dan Tim PAD.');
    } finally {
        state.myTeam.loading = false;
        renderApp();
    }
}

async function loadComplaintContext(force = false) {
    if (state.complaint.loading || (state.complaint.loaded && !force)) return;
    state.complaint.loading = true;
    state.complaint.teammatesError = '';
    renderApp();

    try {
        const [matesRes, historyRes] = await Promise.allSettled([
            fetchTeammates(),
            fetchComplaints(),
        ]);

        if (matesRes.status === 'fulfilled') {
            state.complaint.teammates = matesRes.value?.data?.teammates || [];
            state.complaint.teammatesError = '';
        } else {
            state.complaint.teammates = [];
            state.complaint.teammatesError = formatApiError(
                matesRes.reason,
                'Anda belum terdaftar dalam kelompok sehingga belum dapat membuat pengaduan.'
            );
        }

        if (historyRes.status === 'fulfilled') {
            state.complaint.history = Array.isArray(historyRes.value?.data) ? historyRes.value.data : [];
        }

        state.complaint.loaded = true;
    } finally {
        state.complaint.loading = false;
        renderApp();
    }
}

async function loadAsprakData(force = false) {
    if (state.asprak.loading || (state.asprak.loaded && !force)) return;
    state.asprak.loading = true;
    state.asprak.error = '';
    renderApp();

    try {
        const [teamsRes, complaintsRes] = await Promise.allSettled([
            fetchTeams(),
            fetchComplaints(),
        ]);

        if (teamsRes.status === 'fulfilled') {
            state.asprak.teams = Array.isArray(teamsRes.value?.data) ? teamsRes.value.data : [];
        } else {
            state.asprak.error = formatApiError(teamsRes.reason, 'Gagal memuat daftar tim bimbingan PAD.');
        }

        if (complaintsRes.status === 'fulfilled') {
            state.asprak.complaints = Array.isArray(complaintsRes.value?.data) ? complaintsRes.value.data : [];
        }

        if (!state.asprak.projectForm.team_id && state.asprak.teams.length > 0) {
            prefillAsprakProjectForm(state.asprak.teams[0].id);
        }

        state.asprak.loaded = true;
    } finally {
        state.asprak.loading = false;
        renderApp();
    }
}

async function loadAsprakComplaintById(complaintId) {
    state.asprak.detailComplaintLoading = true;
    state.asprak.detailComplaint = null;
    renderApp();

    try {
        const res = await fetchComplaintDetail(complaintId);
        state.asprak.detailComplaint = res?.data || null;
    } catch {
        state.asprak.detailComplaint = null;
    } finally {
        state.asprak.detailComplaintLoading = false;
        renderApp();
    }
}

function prefillAsprakProjectForm(teamId) {
    const team = state.asprak.teams.find((t) => Number(t.id) === Number(teamId));
    if (!team) {
        state.asprak.projectForm = {
            team_id: teamId ? Number(teamId) : null,
            project_name: '',
            project_owner_name: '',
            project_associate: '',
        };
        return;
    }

    state.asprak.projectForm = {
        team_id: Number(team.id),
        project_name: team.project?.project_name || '',
        project_owner_name: team.project?.owner_display_name || team.project?.owner?.name || '',
        project_associate: team.project?.project_associate || '',
    };
}

async function loadActiveTabData(force = false) {
    if (!state.user) return;
    if (state.activeTab === 'asprak-dashboard' || state.activeTab === 'asprak-project') {
        await loadAsprakData(force);
    } else if (state.activeTab === 'asprak-complaint') {
        await loadAsprakData(force);
        const targetId = state.asprak.detailComplaint?.id || state.initialComplaintId;
        if (targetId) {
            await loadAsprakComplaintById(targetId);
        }
    } else if (state.activeTab === 'dashboard' || state.activeTab === 'hasil-role') {
        await loadMyTeam(force);
    } else if (state.activeTab === 'pengaduan') {
        await loadComplaintContext(force);
    } else if (state.activeTab === 'pilih-peran') {
        await loadProfiling(force);
    }
}

async function navigateToTab(tab, pushHistory = true, extraId = null) {
    state.activeTab = tab;
    state.profileDropdownOpen = false;
    state.profiling.openRoleDropdown = null;
    state.complaint.dropdownOpen = false;
    if (pushHistory) {
        syncUrlToTab(tab, false, extraId);
    }
    renderApp();
    await loadActiveTabData();
}

async function hydrateAuthenticatedSession(token) {
    setStoredToken(token);
    state.token = token;

    const meRes = await fetchMe();
    state.user = meRes?.data || null;
    if (!state.user) {
        throw new Error('Profil pengguna tidak ditemukan.');
    }

    const userRole = String(state.user.user_role || state.user.role || 'student').toLowerCase();

    if (state.activeTab === 'home' || state.activeTab === 'landing' || state.activeTab === 'access-blocked') {
        state.activeTab = resolveHomeTabForUser(state.user);
    }

    if (userRole === 'assistant') {
        if (!state.activeTab.startsWith('asprak-')) {
            state.activeTab = 'asprak-dashboard';
        }
        await loadAsprakData(true);
        if (state.activeTab === 'asprak-complaint' && state.initialComplaintId) {
            await loadAsprakComplaintById(state.initialComplaintId);
        }
        return;
    }

    if (state.activeTab.startsWith('asprak-')) {
        state.activeTab = 'dashboard';
    }

    await Promise.allSettled([
        loadProfiling(true),
        loadMyTeam(true),
        state.activeTab === 'pengaduan' ? loadComplaintContext(true) : Promise.resolve(),
    ]);
}

async function boot() {
    setUnauthorizedHandler(() => {
        resetSessionState();
        state.modal = null;
        state.activeTab = 'landing';
        renderApp();
        loadDevUsersIfLocal();
    });

    try {
        const params = new URLSearchParams(window.location.search);
        const oauthCode = params.get('code');
        if (oauthCode && window.location.pathname === '/auth/sso-return') {
            state.authLoading = true;
            renderApp();
            try {
                const redirectUri = `${window.location.origin}/auth/sso-return`;
                const cbRes = await exchangeGoogleCallback({ code: oauthCode, redirect_uri: redirectUri });
                if (cbRes?.token) {
                    state.activeTab = 'home';
                    await hydrateAuthenticatedSession(cbRes.token);
                    syncUrlToTab(state.activeTab, true);
                    return;
                }
            } catch (error) {
                if (error?.response?.status === 403) {
                    state.accessBlocked = {
                        email: params.get('email') || 'pengguna@gmail.com',
                        message: formatApiError(error, 'Akses ditolak, hanya email @mail.ugm.ac.id yang diizinkan.'),
                    };
                    state.activeTab = 'access-blocked';
                    syncUrlToTab('access-blocked', true);
                    return;
                }
                state.dev.error = formatApiError(error, 'Autentikasi Google SSO gagal.');
            } finally {
                state.authLoading = false;
            }
        }

        const existingToken = getStoredToken();
        if (existingToken && state.activeTab !== 'access-blocked') {
            try {
                await hydrateAuthenticatedSession(existingToken);
                return;
            } catch {
                clearStoredToken();
                resetSessionState();
            }
        }

        if (state.activeTab === 'home') {
            state.activeTab = 'landing';
        }
        await loadDevUsersIfLocal();
    } finally {
        state.booting = false;
        renderApp();
    }
}

function validateBeforeSavingProfile() {
    const { config, form } = state.profiling;
    const missing = [];

    if (!String(form.name || '').trim()) {
        missing.push('Nama lengkap wajib diisi.');
    }

    const nimTrimmed = String(form.nim || '').trim();
    if (!nimTrimmed) {
        missing.push('NIM mahasiswa wajib diisi.');
    } else if (!NIM_REGEX.test(nimTrimmed)) {
        missing.push('Format NIM harus sesuai pola UGM (contoh: 21/471001/SV/19001).');
    }

    if (!form.role_1_id) {
        missing.push('Pilihan Role 1 wajib dipilih.');
    }

    const isRole2Required = Boolean(config.is_role_2_required) && !Boolean(config.is_bypass);
    if (isRole2Required && !form.role_2_id) {
        missing.push('Pilihan Role 2 wajib diisi sesuai ketentuan sistem.');
    }

    if (form.role_1_id && form.role_2_id && Number(form.role_1_id) === Number(form.role_2_id)) {
        missing.push('Role 1 dan Role 2 tidak boleh sama.');
    }

    if (form.skill_ids.size === 0) {
        missing.push('Pilih minimal satu skillset yang kamu kuasai.');
    }

    return missing;
}

function validateBeforeSendingComplaint() {
    const { form } = state.complaint;
    const missing = [];

    if (!form.reported_id) {
        missing.push('Pilih anggota kelompok yang ingin dilaporkan.');
    }

    const reason = String(form.reason || '').trim();
    const details = String(form.description || '').trim();
    const combinedLength = (reason + details).trim().length;

    if (!reason && !details) {
        missing.push('Alasan atau deskripsi lanjut pengaduan wajib diisi.');
    } else if (combinedLength < 5) {
        missing.push('Uraian alasan/deskripsi pengaduan minimal 5 karakter.');
    }

    if (!form.file) {
        missing.push('Lampirkan file bukti (JPG, JPEG, PNG, atau PDF, maks. 10 MB).');
    }

    if (!form.confirmed) {
        missing.push('Centang pernyataan kebenaran bukti dan alasan pengaduan.');
    }

    return missing;
}

function buildCombinedComplaintDescription() {
    const reason = String(state.complaint.form.reason || '').trim();
    const details = String(state.complaint.form.description || '').trim();
    if (reason && details) {
        return `Alasan: ${reason}\n\n${details}`;
    }
    return reason || details;
}

function updateNimHelperDom(nimValue) {
    const el = document.getElementById('nim-status-helper');
    if (!el) return;
    const status = parseNimStatus(nimValue);
    if (status.empty) {
        el.innerHTML = '<span class="text-[#5F7693]">Format NIM UGM: <span class="font-mono">21/471001/SV/19001</span></span>';
    } else if (status.valid) {
        el.innerHTML = `<span class="text-[#308242] font-medium">Format NIM valid • Angkatan ${escapeHtml(status.angkatan)}</span>`;
    } else {
        el.innerHTML = '<span class="text-amber-600 font-medium">Gunakan format NIM UGM: 21/471001/SV/19001</span>';
    }
}

// --- Input Handlers ---
document.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;

    const field = target.dataset.input;
    if (!field) return;

    if (field === 'profile-name') {
        state.profiling.form.name = target.value;
    } else if (field === 'profile-nim') {
        state.profiling.form.nim = target.value;
        updateNimHelperDom(target.value);
    } else if (field === 'profile-portfolio') {
        state.profiling.form.portfolio_link = target.value;
    } else if (field === 'complaint-reason') {
        state.complaint.form.reason = target.value;
    } else if (field === 'complaint-description') {
        state.complaint.form.description = target.value;
    } else if (field === 'asprak-project-name') {
        state.asprak.projectForm.project_name = target.value;
    } else if (field === 'asprak-project-owner') {
        state.asprak.projectForm.project_owner_name = target.value;
    } else if (field === 'asprak-project-associate') {
        state.asprak.projectForm.project_associate = target.value;
    }
});

document.addEventListener('change', async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;

    const action = target.dataset.action;

    if (action === 'asprak-select-project-team' && target instanceof HTMLSelectElement) {
        prefillAsprakProjectForm(Number(target.value));
        renderApp();
        return;
    }

    if (!(target instanceof HTMLInputElement)) return;

    if (action === 'toggle-skill') {
        const skillId = Number(target.dataset.skillId);
        if (target.checked) {
            state.profiling.form.skill_ids.add(skillId);
        } else {
            state.profiling.form.skill_ids.delete(skillId);
        }
        renderApp();
        return;
    }

    if (action === 'toggle-complaint-confirm') {
        state.complaint.form.confirmed = Boolean(target.checked);
        renderApp();
        return;
    }

    if (action === 'upload-avatar') {
        const file = target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            state.modal = {
                type: 'alert',
                title: 'Format Foto Tidak Didukung',
                subtitle: 'Gunakan gambar berformat JPG, PNG, atau WEBP maksimal 2 MB.',
                buttonLabel: 'Siyapp',
            };
            renderApp();
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            state.modal = {
                type: 'alert',
                title: 'Ukuran Foto Terlalu Besar',
                subtitle: 'Ukuran foto profil maksimal adalah 2 MB.',
                buttonLabel: 'Siyapp',
            };
            renderApp();
            return;
        }

        state.profiling.avatarPreview = URL.createObjectURL(file);
        state.profiling.avatarUploading = true;
        renderApp();

        try {
            const res = await uploadStudentAvatar(file);
            const newUrl = res?.data?.avatar_link;
            if (newUrl && state.user) {
                state.user.avatar_link = newUrl;
            }
        } catch (error) {
            state.profiling.avatarPreview = '';
            state.modal = {
                type: 'alert',
                title: 'Gagal Unggah Foto',
                subtitle: formatApiError(error, 'Tidak dapat mengunggah foto profil.'),
                buttonLabel: 'Siyapp',
            };
        } finally {
            state.profiling.avatarUploading = false;
            renderApp();
        }
        return;
    }

    if (action === 'select-complaint-file') {
        const file = target.files?.[0];
        if (!file) return;

        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const allowedExts = ['jpg', 'jpeg', 'png', 'pdf'];
        if (!allowedExts.includes(ext)) {
            state.modal = {
                type: 'alert',
                title: 'Format File Bukti Tidak Valid',
                subtitle: 'Berkas bukti wajib berformat JPG, JPEG, PNG, atau PDF.',
                buttonLabel: 'Siyapp',
            };
            target.value = '';
            renderApp();
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            state.modal = {
                type: 'alert',
                title: 'Ukuran File Terlalu Besar',
                subtitle: 'Ukuran file bukti tidak boleh melebihi 10 MB.',
                buttonLabel: 'Siyapp',
            };
            target.value = '';
            renderApp();
            return;
        }

        state.complaint.form.file = file;
        renderApp();
    }
});

// --- Click Actions ---
document.addEventListener('click', async (event) => {
    const rawTarget = event.target;
    if (!(rawTarget instanceof Element)) return;

    const clickedInsideDropdown = rawTarget.closest('[data-dropdown-panel]') ||
        rawTarget.closest('[data-action="toggle-profile-menu"]') ||
        rawTarget.closest('[data-action="toggle-role-dropdown"]') ||
        rawTarget.closest('[data-action="toggle-teammate-dropdown"]');

    if (!clickedInsideDropdown && (state.profileDropdownOpen || state.profiling.openRoleDropdown || state.complaint.dropdownOpen)) {
        state.profileDropdownOpen = false;
        state.profiling.openRoleDropdown = null;
        state.complaint.dropdownOpen = false;
        renderApp();
    }

    if (rawTarget.dataset?.modalBackdrop === 'true') {
        state.modal = null;
        renderApp();
        return;
    }

    const actionEl = rawTarget.closest('[data-action]');
    if (!actionEl) return;

    const action = actionEl.dataset.action;

    switch (action) {
        case 'toggle-profile-menu':
            state.profileDropdownOpen = !state.profileDropdownOpen;
            state.profiling.openRoleDropdown = null;
            state.complaint.dropdownOpen = false;
            renderApp();
            break;

        case 'nav-home':
            await navigateToTab(resolveHomeTabForUser(state.user));
            break;

        case 'go-profile':
            state.profiling.step = 'profile';
            await navigateToTab('pilih-peran');
            break;

        case 'nav-tab': {
            const tab = actionEl.dataset.tab || 'dashboard';
            await navigateToTab(tab);
            break;
        }

        case 'retry-tab':
            await loadActiveTabData(true);
            break;

        case 'logout':
            state.profileDropdownOpen = false;
            try {
                await logoutApi();
            } catch {
                // Always clear local token
            }
            clearStoredToken();
            resetSessionState();
            state.modal = null;
            state.activeTab = 'landing';
            syncUrlToTab('landing', true);
            renderApp();
            await loadDevUsersIfLocal();
            break;

        case 'toggle-dev-drawer':
            state.devDrawerOpen = !state.devDrawerOpen;
            renderApp();
            break;

        case 'simulate-403-blocked':
            state.accessBlocked = {
                email: 'hudajawor123@gmail.com',
                message: 'Akses ditolak, hanya email dengan domain @mail.ugm.ac.id yang diizinkan untuk login.',
            };
            state.activeTab = 'access-blocked';
            syncUrlToTab('access-blocked');
            renderApp();
            break;

        case 'back-to-landing':
            state.activeTab = 'landing';
            syncUrlToTab('landing');
            renderApp();
            break;

        case 'sso-login':
            state.authLoading = true;
            state.dev.error = '';
            renderApp();
            try {
                const redirectUri = `${window.location.origin}/auth/sso-return`;
                const res = await getGoogleRedirect(redirectUri);
                if (res?.url) {
                    window.location.href = res.url;
                    return;
                }
            } catch (error) {
                state.dev.error = formatApiError(error, 'Gagal memulai login Google SSO.');
            } finally {
                state.authLoading = false;
                renderApp();
            }
            break;

        case 'open-dev-switcher':
            state.profileDropdownOpen = false;
            state.dev.error = '';
            state.dev.notice = '';
            state.modal = { type: 'dev-switcher' };
            renderApp();
            await loadDevUsersIfLocal();
            break;

        case 'dev-seed':
            state.dev.seeding = true;
            state.dev.error = '';
            state.dev.notice = '';
            renderApp();
            try {
                const res = await devSeedSampleData();
                state.dev.notice = res?.message || 'Data simulasi berhasil dibuat.';
                await loadDevUsersIfLocal();
            } catch (error) {
                state.dev.error = formatApiError(error, 'Gagal mengisi data simulasi.');
            } finally {
                state.dev.seeding = false;
                renderApp();
            }
            break;

        case 'dev-login': {
            const email = actionEl.dataset.email;
            const role = actionEl.dataset.role || 'student';
            await loginViaDevToken(email, role);
            break;
        }

        case 'dev-login-selected': {
            const selectEl = document.getElementById('dev-user-select');
            const value = selectEl?.value || '';
            const [email, role] = value.split('|');
            if (email) {
                await loginViaDevToken(email, role || 'student');
            }
            break;
        }

        // --- Profile & Skillset Actions ---
        case 'toggle-role-dropdown': {
            const slot = Number(actionEl.dataset.slot);
            state.profiling.openRoleDropdown = state.profiling.openRoleDropdown === slot ? null : slot;
            state.profileDropdownOpen = false;
            renderApp();
            break;
        }

        case 'select-role': {
            const slot = Number(actionEl.dataset.slot);
            const roleId = Number(actionEl.dataset.roleId);
            if (slot === 1) {
                state.profiling.form.role_1_id = roleId;
                if (Number(state.profiling.form.role_2_id) === roleId) {
                    state.profiling.form.role_2_id = null;
                }
            } else if (slot === 2 && Number(state.profiling.form.role_1_id) !== roleId) {
                state.profiling.form.role_2_id = roleId;
            }
            state.profiling.openRoleDropdown = null;
            renderApp();
            break;
        }

        case 'clear-role-2':
            state.profiling.form.role_2_id = null;
            state.profiling.activeSkillRoleSlot = 1;
            renderApp();
            break;

        case 'go-skillset':
            if (!state.profiling.form.role_1_id) {
                state.modal = {
                    type: 'alert',
                    title: 'Profile kamu belum lengkap :(',
                    subtitle: 'Lengkapin dulu yuk! Sebelum lanjut ke Skillset Form',
                    details: ['Pilih Role 1 kamu terlebih dahulu.'],
                    buttonLabel: 'Siyapp',
                };
                renderApp();
                break;
            }
            state.profiling.openRoleDropdown = null;
            state.profiling.step = 'skillset';
            state.profiling.activeSkillRoleSlot = 1;
            renderApp();
            break;

        case 'back-to-profile':
            state.profiling.step = 'profile';
            renderApp();
            break;

        case 'switch-skill-role': {
            const slot = Number(actionEl.dataset.slot);
            state.profiling.activeSkillRoleSlot = slot === 2 ? 2 : 1;
            renderApp();
            break;
        }

        case 'clear-role-skills': {
            const roleId = Number(actionEl.dataset.roleId);
            const role = state.profiling.roles.find((r) => Number(r.id) === roleId);
            if (role && Array.isArray(role.skills)) {
                for (const s of role.skills) {
                    state.profiling.form.skill_ids.delete(Number(s.id));
                }
            }
            renderApp();
            break;
        }

        case 'submit-profile-check': {
            const missing = validateBeforeSavingProfile();
            if (missing.length > 0) {
                state.modal = {
                    type: 'alert',
                    title: 'Profile kamu belum lengkap :(',
                    subtitle: 'Lengkapin dulu yuk! Sebelum di simpann',
                    details: missing,
                    buttonLabel: 'Siyapp',
                };
                renderApp();
                break;
            }
            state.modal = { type: 'confirm-profile' };
            renderApp();
            break;
        }

        case 'confirm-save-profile':
            await executeSaveProfile();
            break;

        // --- Hasil Role & Tim Actions ---
        case 'click-role-card': {
            const finalRole = state.myTeam.data?.final_role;
            const roleLabel = roleDisplayTag(finalRole?.code, finalRole?.name);
            if (!state.myTeam.roleCardFlipped) {
                state.myTeam.roleCardFlipped = true;
                renderApp();
                window.setTimeout(() => {
                    if (state.activeTab === 'hasil-role' && state.myTeam.data?.has_team) {
                        state.modal = { type: 'role-congrats', roleLabel };
                        renderApp();
                    }
                }, 520);
            } else {
                state.modal = { type: 'role-congrats', roleLabel };
                renderApp();
            }
            break;
        }

        case 'click-team-card':
            if (!state.myTeam.teamCardFlipped) {
                state.myTeam.teamCardFlipped = true;
                renderApp();
                window.setTimeout(() => {
                    if (state.activeTab === 'hasil-role' && state.myTeam.data?.has_team) {
                        state.modal = { type: 'team-detail' };
                        renderApp();
                    }
                }, 520);
            } else {
                state.modal = { type: 'team-detail' };
                renderApp();
            }
            break;

        case 'reset-card-flips':
            state.myTeam.roleCardFlipped = false;
            state.myTeam.teamCardFlipped = false;
            renderApp();
            break;

        // --- Pengaduan Actions ---
        case 'toggle-teammate-dropdown':
            state.complaint.dropdownOpen = !state.complaint.dropdownOpen;
            state.profileDropdownOpen = false;
            renderApp();
            break;

        case 'select-teammate': {
            const userId = Number(actionEl.dataset.userId);
            const mate = state.complaint.teammates.find((m) => Number(m.user_id) === userId);
            if (mate) {
                state.complaint.form.reported_id = mate.user_id;
                state.complaint.form.reported_name = mate.name || mate.email || '';
                state.complaint.form.reported_nim = mate.nim || '';
            }
            state.complaint.dropdownOpen = false;
            renderApp();
            break;
        }

        case 'clear-complaint-file':
            state.complaint.form.file = null;
            renderApp();
            break;

        case 'clear-complaint':
            state.complaint.form = {
                reported_id: null,
                reported_name: '',
                reported_nim: '',
                reason: '',
                file: null,
                description: '',
                confirmed: false,
            };
            renderApp();
            break;

        case 'submit-complaint-check': {
            const missing = validateBeforeSendingComplaint();
            if (missing.length > 0) {
                state.modal = {
                    type: 'alert',
                    title: 'Pengaduan kamu belum lengkap :(',
                    subtitle: 'Lengkapin dulu yuk! Sebelum dikirim',
                    details: missing,
                    buttonLabel: 'Siyapp',
                };
                renderApp();
                break;
            }
            state.modal = { type: 'confirm-complaint' };
            renderApp();
            break;
        }

        case 'confirm-send-complaint':
            await executeSendComplaint();
            break;

        case 'toggle-complaint-history':
            state.complaint.historyOpen = !state.complaint.historyOpen;
            renderApp();
            if (state.complaint.historyOpen && state.complaint.history.length === 0) {
                state.complaint.historyLoading = true;
                renderApp();
                try {
                    const res = await fetchComplaints();
                    state.complaint.history = Array.isArray(res?.data) ? res.data : [];
                } catch {
                    // Ignore silently
                } finally {
                    state.complaint.historyLoading = false;
                    renderApp();
                }
            }
            break;

        case 'download-evidence': {
            const complaintId = Number(actionEl.dataset.complaintId);
            const filename = actionEl.dataset.filename || `bukti_pengaduan_${complaintId}`;
            state.complaint.downloadingId = complaintId;
            renderApp();
            try {
                await downloadComplaintEvidence(complaintId, filename);
            } catch (error) {
                state.modal = {
                    type: 'alert',
                    title: 'Gagal Mengunduh Berkas',
                    subtitle: formatApiError(error, 'Berkas bukti tidak dapat diunduh.'),
                    buttonLabel: 'Tutup',
                };
            } finally {
                state.complaint.downloadingId = null;
                renderApp();
            }
            break;
        }

        // --- Asisten Praktikum Actions ---
        case 'asprak-open-team': {
            const teamId = Number(actionEl.dataset.teamId);
            state.asprak.selectedTeamId = teamId;
            state.modal = { type: 'asprak-team-detail' };
            renderApp();
            break;
        }

        case 'asprak-open-complaint': {
            const complaintId = Number(actionEl.dataset.complaintId);
            state.modal = null;
            state.initialComplaintId = complaintId;
            state.activeTab = 'asprak-complaint';
            syncUrlToTab('asprak-complaint', false, complaintId);
            renderApp();
            await loadAsprakComplaintById(complaintId);
            break;
        }

        case 'asprak-review-complaint': {
            const complaintId = Number(actionEl.dataset.complaintId);
            state.asprak.reviewingId = complaintId;
            renderApp();
            try {
                const res = await reviewComplaint(complaintId);
                const updated = res?.data || null;
                if (updated) {
                    state.asprak.detailComplaint = updated;
                    state.asprak.complaints = state.asprak.complaints.map((item) =>
                        Number(item.id) === complaintId ? updated : item
                    );
                }
            } catch (error) {
                state.modal = {
                    type: 'alert',
                    title: 'Gagal Menandai Tinjauan',
                    subtitle: formatApiError(error, 'Tidak dapat memperbarui status tinjauan.'),
                    buttonLabel: 'Tutup',
                };
            } finally {
                state.asprak.reviewingId = null;
                renderApp();
            }
            break;
        }

        case 'asprak-go-project': {
            const requestedTeamId = actionEl.dataset.teamId ? Number(actionEl.dataset.teamId) : null;
            state.modal = null;
            state.profileDropdownOpen = false;
            await loadAsprakData();
            const fallbackId = requestedTeamId || state.asprak.projectForm.team_id || state.asprak.teams[0]?.id || null;
            prefillAsprakProjectForm(fallbackId);
            state.activeTab = 'asprak-project';
            syncUrlToTab('asprak-project');
            renderApp();
            break;
        }

        case 'asprak-save-project':
            await executeSaveAsprakProject();
            break;

        case 'asprak-back-dashboard':
            state.modal = null;
            await navigateToTab('asprak-dashboard');
            break;

        case 'close-modal': {
            const nextTab = actionEl.dataset.nextTab;
            state.modal = null;
            renderApp();
            if (nextTab) {
                await navigateToTab(nextTab);
            }
            break;
        }
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (state.modal) {
            state.modal = null;
            renderApp();
        } else if (state.profileDropdownOpen || state.profiling.openRoleDropdown || state.complaint.dropdownOpen) {
            state.profileDropdownOpen = false;
            state.profiling.openRoleDropdown = null;
            state.complaint.dropdownOpen = false;
            renderApp();
        }
    }
});

window.addEventListener('popstate', () => {
    const tab = getTabFromPath(window.location.pathname);
    if (!state.user) {
        if (tab === 'access-blocked' || tab === 'landing') {
            state.activeTab = tab;
            renderApp();
        }
        return;
    }
    const targetTab = tab === 'home' ? resolveHomeTabForUser(state.user) : tab;
    if (targetTab !== state.activeTab) {
        navigateToTab(targetTab, false);
    }
});

async function loginViaDevToken(email, role) {
    state.dev.loading = true;
    state.dev.error = '';
    renderApp();
    try {
        const res = await devGenerateToken({ email, role });
        if (!res?.token) {
            throw new Error('Token tidak dikembalikan oleh server.');
        }
        resetSessionState();
        state.modal = null;
        state.activeTab = 'home';
        await hydrateAuthenticatedSession(res.token);
        state.profiling.step = 'profile';
        syncUrlToTab(state.activeTab, true);
        renderApp();
    } catch (error) {
        state.dev.error = formatApiError(error, 'Gagal login dengan akun uji lokal.');
    } finally {
        state.dev.loading = false;
        renderApp();
    }
}

async function executeSaveProfile() {
    state.modal = null;
    state.profiling.submitting = true;
    renderApp();

    const { config, form } = state.profiling;
    const payload = {
        name: String(form.name || '').trim(),
        nim: String(form.nim || '').trim(),
        role_1_id: Number(form.role_1_id),
        role_2_id: !config.is_bypass && form.role_2_id ? Number(form.role_2_id) : null,
        skill_ids: Array.from(form.skill_ids),
        portfolio_link: String(form.portfolio_link || '').trim() || null,
    };

    try {
        const res = await submitStudentProfile(payload);
        if (state.user && res?.data?.profile?.name) {
            state.user.name = res.data.profile.name;
        }
        await Promise.allSettled([loadProfiling(true), loadMyTeam(true)]);
        const evalRole = res?.data?.evaluation?.recommended_role;
        state.modal = {
            type: 'alert',
            title: 'Yeay! Profile Kamu Tersimpan',
            subtitle: evalRole
                ? `Rekomendasi awal sistem: ${roleDisplayTag(evalRole.code, evalRole.name)}. Cek tab Hasil Role untuk status tim PAD kamu!`
                : 'Data profil dan skillset kamu berhasil disimpan.',
            buttonLabel: 'Lihat Hasil Role',
            onCloseTab: 'hasil-role',
        };
    } catch (error) {
        state.modal = {
            type: 'alert',
            title: 'Gagal Menyimpan Profile',
            subtitle: formatApiError(error, 'Periksa kembali isian formulir kamu.'),
            buttonLabel: 'Siyapp',
        };
    } finally {
        state.profiling.submitting = false;
        renderApp();
    }
}

async function executeSendComplaint() {
    state.modal = null;
    state.complaint.submitting = true;
    renderApp();

    const formData = new FormData();
    formData.append('reported_id', String(state.complaint.form.reported_id));
    formData.append('description', buildCombinedComplaintDescription());
    formData.append('evidence_file', state.complaint.form.file);

    try {
        await submitComplaint(formData);
        state.complaint.form = {
            reported_id: null,
            reported_name: '',
            reported_nim: '',
            reason: '',
            file: null,
            description: '',
            confirmed: false,
        };
        const historyRes = await fetchComplaints();
        state.complaint.history = Array.isArray(historyRes?.data) ? historyRes.data : [];
        state.complaint.historyOpen = true;
        state.modal = {
            type: 'alert',
            title: 'Pengaduan Terkirim!',
            subtitle: 'Tiket pengaduan beserta bukti lampiran berhasil dikirim secara rahasia.',
            buttonLabel: 'Selesai',
        };
    } catch (error) {
        state.modal = {
            type: 'alert',
            title: 'Gagal Mengirim Pengaduan',
            subtitle: formatApiError(error, 'Terjadi kendala saat mengirim tiket pengaduan.'),
            buttonLabel: 'Siyapp',
        };
    } finally {
        state.complaint.submitting = false;
        renderApp();
    }
}

async function executeSaveAsprakProject() {
    const { team_id, project_name, project_owner_name, project_associate } = state.asprak.projectForm;
    const missing = [];
    if (!team_id) missing.push('Pilih kelompok bimbingan terlebih dahulu.');
    if (!String(project_name || '').trim()) missing.push('1. Nama Proyek wajib diisi.');

    if (missing.length > 0) {
        state.modal = {
            type: 'alert',
            title: 'Data Proyek Belum Lengkap',
            subtitle: 'Mohon lengkapi informasi proyek terlebih dahulu.',
            details: missing,
            buttonLabel: 'Siyapp',
        };
        renderApp();
        return;
    }

    state.asprak.projectSubmitting = true;
    renderApp();

    try {
        await saveTeamProject(Number(team_id), {
            project_name: String(project_name).trim(),
            project_owner_name: String(project_owner_name || '').trim() || null,
            project_associate: String(project_associate || '').trim() || null,
        });

        await loadAsprakData(true);

        state.modal = {
            type: 'alert',
            title: 'Detail Proyek Tersimpan!',
            subtitle: `Metadata proyek untuk Kelompok ${team_id} berhasil disimpan.`,
            buttonLabel: 'Kembali ke Daftar Tim',
            onCloseTab: 'asprak-dashboard',
        };
    } catch (error) {
        state.modal = {
            type: 'alert',
            title: 'Gagal Menyimpan Proyek',
            subtitle: formatApiError(error, 'Terjadi kendala saat menyimpan detail proyek.'),
            buttonLabel: 'Siyapp',
        };
    } finally {
        state.asprak.projectSubmitting = false;
        renderApp();
    }
}

boot();
