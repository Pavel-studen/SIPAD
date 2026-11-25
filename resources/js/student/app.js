import {
    assignTeamSupervisor,
    autoGroupTeams,
    clearStoredToken,
    deleteUser,
    devFetchUsers,
    devGenerateToken,
    devSeedSampleData,
    downloadComplaintEvidence,
    exchangeGoogleCallback,
    fetchAssistants,
    fetchComplaintDetail,
    fetchComplaints,
    fetchEvaluationDetail,
    fetchEvaluations,
    fetchMe,
    fetchMyTeam,
    fetchProfilingConfig,
    fetchRoles,
    fetchSettings,
    fetchTeams,
    fetchTeammates,
    fetchUsers,
    getGoogleRedirect,
    getStoredToken,
    importWhitelistFile,
    initiateLecturer,
    lockAllEvaluations,
    logoutApi,
    overrideStudentRole,
    resetStudentRole,
    resetTeamGrouping,
    reviewComplaint,
    saveTeamProject,
    setStoredToken,
    setUnauthorizedHandler,
    storeExclusiveTeam,
    storeWhitelistUser,
    submitComplaint,
    submitStudentProfile,
    unlockAllEvaluations,
    updateEvaluationNote,
    updateSettings,
    updateUserRole,
    uploadStudentAvatar,
} from './api.js';
import { resetSessionState, state, subscribe } from './state.js';
import {
    downloadCsvFile,
    escapeHtml,
    formatApiError,
    formatIndoDateRange,
    formatIsoToIndoDate,
    NIM_REGEX,
    parseNimStatus,
    roleDisplayTag,
    roleFullTitle,
} from './utils.js';
import { renderAsprakView } from './views/asprakView.js';
import { renderAuthScreen } from './views/authView.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderDosenView } from './views/dosenView.js';
import { renderHasilRoleView } from './views/hasilRoleView.js';
import {
    isGreenPortalTab,
    renderBottomNav,
    renderDecorativeFlowers,
    renderGreenSideGrids,
    renderHeader,
} from './views/layout.js';
import { renderMasterAdminView } from './views/masterAdminView.js';
import { renderModal } from './views/modals.js';
import { renderPengaduanView } from './views/pengaduanView.js';
import { renderPractitionerView } from './views/practitionerView.js';
import { renderProfileView } from './views/profileView.js';

const rootEl = document.getElementById('sipad-app');
const isLocal = Boolean(window.__SIPAD_CONFIG__?.isLocal);

const STUDENT_TABS = ['dashboard', 'pilih-peran', 'hasil-role', 'pengaduan'];

const TAB_PATH_MAP = {
    dashboard: '/dashboard',
    'pilih-peran': '/pilih-peran',
    'hasil-role': '/hasil-role',
    pengaduan: '/pengaduan',
    'asprak-dashboard': '/asisten',
    'asprak-project': '/asisten/input-proyek',
    'master-admin': '/master-admin',
    'dosen-control': '/dosen/control',
    'dosen-user': '/dosen/user',
    'dosen-bypass': '/dosen/bypass',
    'dosen-complaints': '/dosen/pengaduan',
    'practitioner-students': '/praktisi/mahasiswa',
    'practitioner-complaints': '/praktisi/pengaduan',
    'practitioner-project': '/praktisi/input-proyek',
    landing: '/landing',
    'access-blocked': '/auth/access-blocked',
};

function resolveHomeTabForUser(user) {
    const role = String(user?.user_role || user?.role || 'student').toLowerCase();
    if (role === 'admin') return 'master-admin';
    if (role === 'lecturer') return 'dosen-control';
    if (role === 'practitioner') return 'practitioner-students';
    if (role === 'assistant') return 'asprak-dashboard';
    return 'dashboard';
}

function isTabAllowedForRole(userRole, tab) {
    const role = String(userRole || 'student').toLowerCase();
    if (tab === 'landing' || tab === 'access-blocked') return true;
    if (STUDENT_TABS.includes(tab)) return role === 'student';
    if (tab === 'master-admin') return role === 'admin';
    if (tab.startsWith('dosen-')) return role === 'lecturer' || role === 'admin';
    if (tab.startsWith('practitioner-')) return role === 'practitioner' || role === 'lecturer' || role === 'admin';
    if (tab.startsWith('asprak-')) return role === 'assistant';
    return false;
}

function getTabFromPath(pathname) {
    if (pathname.includes('/auth/access-blocked')) return 'access-blocked';
    if (pathname === '/login' || pathname === '/landing') return 'landing';
    if (pathname.startsWith('/master-admin')) return 'master-admin';
    if (pathname.includes('/dosen/pengaduan/') || pathname.includes('/lecturer/pengaduan/')) return 'dosen-complaint-detail';
    if (pathname.includes('/dosen/pengaduan')) return 'dosen-complaints';
    if (pathname.includes('/dosen/bypass') || pathname.includes('/lecturer/bypass')) return 'dosen-bypass';
    if (pathname.includes('/dosen/user') || pathname.includes('/dosen/access') || pathname.includes('/lecturer/access')) return 'dosen-user';
    if (pathname.startsWith('/dosen') || pathname.startsWith('/lecturer')) return 'dosen-control';
    if (pathname.includes('/praktisi/pengaduan/')) return 'practitioner-complaint-detail';
    if (pathname.includes('/praktisi/pengaduan') || pathname.includes('/practitioner/complaint')) return 'practitioner-complaints';
    if (pathname.includes('/praktisi/input-proyek')) return 'practitioner-project';
    if (pathname.startsWith('/praktisi') || pathname.startsWith('/practitioner')) return 'practitioner-students';
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
    } else if (tab === 'dosen-complaint-detail' && extraId) {
        targetPath = `/dosen/pengaduan/${extraId}`;
    } else if (tab === 'practitioner-complaint-detail' && extraId) {
        targetPath = `/praktisi/pengaduan/${extraId}`;
    }
    if (!targetPath) return;

    if (window.location.pathname !== targetPath) {
        const method = replace ? 'replaceState' : 'pushState';
        window.history[method]({ tab, complaintId: extraId }, '', targetPath);
    }
}

function renderApp() {
    if (!rootEl) return;

    const isGreen = isGreenPortalTab(state.activeTab);

    if (state.booting) {
        rootEl.innerHTML = `
            <div class="min-h-dvh flex items-center justify-center bg-white">
                <div class="flex flex-col items-center gap-3 text-[#486284]">
                    <div class="w-9 h-9 rounded-full border-4 ${isGreen ? 'border-[#C5E9CD] border-t-[#308242]' : 'border-[#C0DDF9] border-t-[#0773DF]'} animate-spin"></div>
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
    if (state.activeTab === 'master-admin') {
        pageHtml = renderMasterAdminView(state);
    } else if (state.activeTab.startsWith('dosen-')) {
        pageHtml = renderDosenView(state);
    } else if (state.activeTab.startsWith('practitioner-')) {
        pageHtml = renderPractitionerView(state);
    } else if (state.activeTab.startsWith('asprak-')) {
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
    const isPractitionerSplit = state.activeTab === 'practitioner-students' && Boolean(state.practitioner.selectedUserId);
    const paddingClasses = isPractitionerSplit
        ? `px-4 sm:px-8 lg:px-10 xl:px-14 pt-6 sm:pt-9 ${hasBottomDock ? 'pb-24 sm:pb-4' : 'pb-10'}`
        : isGreen
            ? `px-4 sm:px-14 md:px-20 lg:px-28 xl:px-40 pt-6 sm:pt-9 ${hasBottomDock ? 'pb-24 sm:pb-4' : 'pb-10'}`
            : `px-4 sm:px-20 md:px-24 lg:px-28 xl:px-36 pt-6 sm:pt-9 ${hasBottomDock ? 'pb-24 sm:pb-4' : 'pb-10'}`;

    rootEl.innerHTML = `
        ${renderHeader(state)}

        <main class="flex-1 relative flex flex-col justify-between">
            ${isGreen ? renderGreenSideGrids() : renderDecorativeFlowers()}

            <section class="flex-1 w-full ${paddingClasses} flex flex-col justify-center">
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

async function loadMasterAdminData(force = false) {
    if (state.masterAdmin.loading || (state.masterAdmin.loaded && !force)) return;
    state.masterAdmin.loading = true;
    state.masterAdmin.error = '';
    renderApp();

    try {
        const res = await fetchUsers({ all: true });
        const allUsers = Array.isArray(res?.data) ? res.data : [];
        state.masterAdmin.lecturers = allUsers.filter(
            (u) => u.user_role === 'lecturer' || u.user_role === 'admin'
        );
        state.masterAdmin.loaded = true;
    } catch (error) {
        state.masterAdmin.error = formatApiError(error, 'Gagal memuat daftar Dosen Admin.');
    } finally {
        state.masterAdmin.loading = false;
        renderApp();
    }
}

function prefillGreenProjectForm(targetFormObj, teams, teamId) {
    const team = teams.find((t) => Number(t.id) === Number(teamId));
    if (!team) {
        targetFormObj.team_id = teamId ? Number(teamId) : null;
        targetFormObj.project_name = '';
        targetFormObj.project_owner_name = '';
        targetFormObj.project_associate = '';
        return;
    }
    targetFormObj.team_id = Number(team.id);
    targetFormObj.project_name = team.project?.project_name || '';
    targetFormObj.project_owner_name = team.project?.owner_display_name || team.project?.owner?.name || '';
    targetFormObj.project_associate = team.project?.project_associate || '';
}

async function loadPractitionerData(force = false, silent = false) {
    if (state.practitioner.loading || (state.practitioner.loaded && !force)) return;
    if (!silent) {
        state.practitioner.loading = true;
        state.practitioner.error = '';
        renderApp();
    }

    try {
        const [evalRes, rolesRes, complaintsRes, teamsRes] = await Promise.allSettled([
            fetchEvaluations({
                search: state.practitioner.search || undefined,
                page: state.practitioner.page || 1,
                per_page: 6,
            }),
            fetchRoles(),
            fetchComplaints(),
            fetchTeams(),
        ]);

        if (evalRes.status === 'fulfilled') {
            state.practitioner.students = Array.isArray(evalRes.value?.data) ? evalRes.value.data : [];
            state.practitioner.meta = evalRes.value?.meta || { current_page: 1, last_page: 1, per_page: 6, total: state.practitioner.students.length };
        } else {
            state.practitioner.error = formatApiError(evalRes.reason, 'Gagal memuat data mahasiswa.');
        }

        if (rolesRes.status === 'fulfilled') {
            state.practitioner.roles = Array.isArray(rolesRes.value?.data) ? rolesRes.value.data : [];
        }
        if (complaintsRes.status === 'fulfilled') {
            state.practitioner.complaints = Array.isArray(complaintsRes.value?.data) ? complaintsRes.value.data : [];
        }
        if (teamsRes.status === 'fulfilled') {
            state.practitioner.teams = Array.isArray(teamsRes.value?.data) ? teamsRes.value.data : [];
            if (!state.practitioner.projectForm.team_id && state.practitioner.teams.length > 0) {
                prefillGreenProjectForm(state.practitioner.projectForm, state.practitioner.teams, state.practitioner.teams[0].id);
            }
        }

        state.practitioner.loaded = true;
    } finally {
        state.practitioner.loading = false;
        renderApp();
    }
}

async function loadPractitionerStudentDetail(userId) {
    state.practitioner.selectedUserId = Number(userId);
    state.practitioner.detailLoading = true;
    state.practitioner.detail = null;
    state.practitioner.openRoleDropdown = null;
    renderApp();

    try {
        const res = await fetchEvaluationDetail(userId);
        const detail = res?.data || null;
        state.practitioner.detail = detail;
        if (detail) {
            const evalData = detail.evaluation || {};
            const st = detail.student || {};
            state.practitioner.noteDraft = evalData.evaluation_note || '';
            state.practitioner.overrideEnabled = Boolean(evalData.is_overridden);
            state.practitioner.overrideRole1Id = evalData.final_role_id || st.role_1?.id || state.practitioner.roles[0]?.id || null;
            state.practitioner.overrideRole2Id = st.role_2?.id || null;
        }
    } catch (error) {
        state.practitioner.selectedUserId = null;
        state.modal = {
            type: 'green-alert',
            title: 'Gagal Memuat Detail',
            subtitle: formatApiError(error, 'Data skillset mahasiswa tidak dapat diambil.'),
            buttonLabel: 'Oke',
        };
    } finally {
        state.practitioner.detailLoading = false;
        renderApp();
    }
}

async function loadPractitionerComplaintById(complaintId) {
    state.practitioner.detailComplaintLoading = true;
    state.practitioner.detailComplaint = null;
    renderApp();
    try {
        const res = await fetchComplaintDetail(complaintId);
        state.practitioner.detailComplaint = res?.data || null;
    } catch {
        state.practitioner.detailComplaint = null;
    } finally {
        state.practitioner.detailComplaintLoading = false;
        renderApp();
    }
}

async function loadDosenUsersOnly(silent = false) {
    try {
        const usersRes = await fetchUsers({
            search: state.dosen.userSearch || undefined,
            user_role: state.dosen.userRoleFilter || undefined,
            page: state.dosen.userPage || 1,
            per_page: 6,
        });
        state.dosen.users = Array.isArray(usersRes?.data) ? usersRes.data : [];
        state.dosen.usersMeta = usersRes?.meta || { current_page: 1, last_page: 1, per_page: 6, total: state.dosen.users.length };
    } catch (error) {
        if (!silent) {
            state.dosen.error = formatApiError(error, 'Gagal memuat daftar user.');
        }
    } finally {
        renderApp();
    }
}

async function loadDosenData(force = false) {
    if (state.dosen.loading || (state.dosen.loaded && !force)) return;
    state.dosen.loading = true;
    state.dosen.error = '';
    renderApp();

    try {
        const [settingsRes, rolesRes, evalAllRes, usersRes, allStudentsRes, teamsRes, assistantsRes, complaintsRes] = await Promise.allSettled([
            fetchSettings(),
            fetchRoles(),
            fetchEvaluations({ per_page: 'all' }),
            fetchUsers({
                search: state.dosen.userSearch || undefined,
                user_role: state.dosen.userRoleFilter || undefined,
                page: state.dosen.userPage || 1,
                per_page: 6,
            }),
            fetchUsers({ user_role: 'student', all: true }),
            fetchTeams(),
            fetchAssistants(),
            fetchComplaints(),
        ]);

        if (settingsRes.status === 'fulfilled') {
            state.dosen.settings = settingsRes.value?.data || null;
        }
        if (rolesRes.status === 'fulfilled') {
            state.dosen.roles = Array.isArray(rolesRes.value?.data) ? rolesRes.value.data : [];
        }
        if (evalAllRes.status === 'fulfilled') {
            state.dosen.evaluationsAll = Array.isArray(evalAllRes.value?.data) ? evalAllRes.value.data : [];
        } else {
            state.dosen.error = formatApiError(evalAllRes.reason, 'Gagal memuat data monitoring.');
        }
        if (usersRes.status === 'fulfilled') {
            state.dosen.users = Array.isArray(usersRes.value?.data) ? usersRes.value.data : [];
            state.dosen.usersMeta = usersRes.value?.meta || { current_page: 1, last_page: 1, per_page: 6, total: state.dosen.users.length };
        }
        if (allStudentsRes.status === 'fulfilled') {
            state.dosen.allStudents = Array.isArray(allStudentsRes.value?.data) ? allStudentsRes.value.data : [];
        }
        if (teamsRes.status === 'fulfilled') {
            state.dosen.teams = Array.isArray(teamsRes.value?.data) ? teamsRes.value.data : [];
            if (!state.dosen.projectForm.team_id && state.dosen.teams.length > 0) {
                prefillGreenProjectForm(state.dosen.projectForm, state.dosen.teams, state.dosen.teams[0].id);
            }
        }
        if (assistantsRes.status === 'fulfilled') {
            state.dosen.assistants = Array.isArray(assistantsRes.value?.data) ? assistantsRes.value.data : [];
        }
        if (complaintsRes.status === 'fulfilled') {
            state.dosen.complaints = Array.isArray(complaintsRes.value?.data) ? complaintsRes.value.data : [];
        }

        state.dosen.loaded = true;
    } finally {
        state.dosen.loading = false;
        renderApp();
    }
}

async function loadDosenComplaintById(complaintId) {
    state.dosen.detailComplaintLoading = true;
    state.dosen.detailComplaint = null;
    renderApp();
    try {
        const res = await fetchComplaintDetail(complaintId);
        state.dosen.detailComplaint = res?.data || null;
    } catch {
        state.dosen.detailComplaint = null;
    } finally {
        state.dosen.detailComplaintLoading = false;
        renderApp();
    }
}

async function loadActiveTabData(force = false) {
    if (!state.user) return;
    if (state.activeTab === 'master-admin') {
        await loadMasterAdminData(force);
    } else if (state.activeTab === 'practitioner-students' || state.activeTab === 'practitioner-complaints' || state.activeTab === 'practitioner-project') {
        await loadPractitionerData(force);
    } else if (state.activeTab === 'practitioner-complaint-detail') {
        await loadPractitionerData(force);
        const targetId = state.practitioner.detailComplaint?.id || state.initialComplaintId;
        if (targetId) await loadPractitionerComplaintById(targetId);
    } else if (state.activeTab === 'dosen-control' || state.activeTab === 'dosen-user' || state.activeTab === 'dosen-bypass' || state.activeTab === 'dosen-complaints') {
        await loadDosenData(force);
    } else if (state.activeTab === 'dosen-complaint-detail') {
        await loadDosenData(force);
        const targetId = state.dosen.detailComplaint?.id || state.initialComplaintId;
        if (targetId) await loadDosenComplaintById(targetId);
    } else if (state.activeTab === 'asprak-dashboard' || state.activeTab === 'asprak-project') {
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
    if (state.user) {
        const userRole = String(state.user.user_role || state.user.role || 'student').toLowerCase();
        if (!isTabAllowedForRole(userRole, tab)) {
            tab = resolveHomeTabForUser(state.user);
            extraId = null;
        }
    }

    state.activeTab = tab;
    state.profileDropdownOpen = false;
    state.profiling.openRoleDropdown = null;
    state.complaint.dropdownOpen = false;
    state.practitioner.openRoleDropdown = null;
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
    } else if (!isTabAllowedForRole(userRole, state.activeTab)) {
        state.activeTab = resolveHomeTabForUser(state.user);
    }

    syncUrlToTab(state.activeTab, true, state.initialComplaintId);

    if (userRole === 'admin' || userRole === 'lecturer' || userRole === 'practitioner' || userRole === 'assistant') {
        await loadActiveTabData(true);
        return;
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

let searchDebounceTimer = null;

function restoreInputFocus(selector, caretStart, caretEnd) {
    const el = document.querySelector(selector);
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        el.focus();
        try {
            if (typeof caretStart === 'number') {
                el.setSelectionRange(caretStart, typeof caretEnd === 'number' ? caretEnd : caretStart);
            }
        } catch {
            // Input type search/email might ignore setSelectionRange on some browsers
        }
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
    } else if (field === 'madmin-name') {
        state.masterAdmin.form.name = target.value;
    } else if (field === 'madmin-email') {
        state.masterAdmin.form.email = target.value;
    } else if (field === 'madmin-nip') {
        state.masterAdmin.form.nip = target.value;
    } else if (field === 'practitioner-note') {
        state.practitioner.noteDraft = target.value;
    } else if (field === 'practitioner-project-name') {
        state.practitioner.projectForm.project_name = target.value;
    } else if (field === 'practitioner-project-owner') {
        state.practitioner.projectForm.project_owner_name = target.value;
    } else if (field === 'practitioner-project-associate') {
        state.practitioner.projectForm.project_associate = target.value;
    } else if (field === 'dosen-stakeholder-email') {
        state.dosen.stakeholderForm.email = target.value;
    } else if (field === 'dosen-project-name') {
        state.dosen.projectForm.project_name = target.value;
    } else if (field === 'dosen-project-owner') {
        state.dosen.projectForm.project_owner_name = target.value;
    } else if (field === 'dosen-project-associate') {
        state.dosen.projectForm.project_associate = target.value;
    } else if (field === 'dosen-bypass-team-name') {
        state.dosen.bypassForm.team_name = target.value;
    } else if (field === 'dosen-bypass-member-query') {
        const start = target.selectionStart;
        const end = target.selectionEnd;
        state.dosen.bypassForm.memberQuery = target.value;
        renderApp();
        restoreInputFocus('[data-input="dosen-bypass-member-query"]', start, end);
    } else if (field === 'practitioner-search') {
        const start = target.selectionStart;
        const end = target.selectionEnd;
        state.practitioner.search = target.value;
        state.practitioner.page = 1;
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = window.setTimeout(async () => {
            await loadPractitionerData(true, true);
            restoreInputFocus('[data-input="practitioner-search"]', start, end);
        }, 260);
    } else if (field === 'dosen-user-search') {
        const start = target.selectionStart;
        const end = target.selectionEnd;
        state.dosen.userSearch = target.value;
        state.dosen.userPage = 1;
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = window.setTimeout(async () => {
            await loadDosenUsersOnly(true);
            restoreInputFocus('[data-input="dosen-user-search"]', start, end);
        }, 260);
    }
});

document.addEventListener('change', async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;

    const action = target.dataset.action;

    if (target instanceof HTMLSelectElement) {
        if (action === 'asprak-select-project-team') {
            prefillAsprakProjectForm(Number(target.value));
            renderApp();
            return;
        }
        if (action === 'practitioner-select-project-team') {
            prefillGreenProjectForm(state.practitioner.projectForm, state.practitioner.teams, Number(target.value));
            renderApp();
            return;
        }
        if (action === 'dosen-select-project-team') {
            prefillGreenProjectForm(state.dosen.projectForm, state.dosen.teams, Number(target.value));
            renderApp();
            return;
        }
        if (action === 'dosen-stakeholder-role') {
            state.dosen.stakeholderForm.role = target.value;
            return;
        }
        if (action === 'dosen-user-role-filter') {
            state.dosen.userRoleFilter = target.value;
            state.dosen.userPage = 1;
            await loadDosenUsersOnly();
            return;
        }
        if (action === 'dosen-inline-role') {
            const userId = Number(target.dataset.userId);
            const newRole = target.value;
            try {
                await updateUserRole(userId, newRole);
                await loadDosenData(true);
                await loadDevUsersIfLocal();
            } catch (error) {
                state.modal = {
                    type: 'green-alert',
                    title: 'Gagal Mengubah Peran',
                    subtitle: formatApiError(error, 'Peran user tidak dapat diperbarui.'),
                    buttonLabel: 'Oke',
                };
                await loadDosenUsersOnly(true);
            }
            return;
        }
        if (action === 'dosen-bypass-category') {
            state.dosen.bypassForm.category = target.value;
            return;
        }
        if (action === 'dosen-calendar-month' && state.dosen.calendarModal) {
            state.dosen.calendarModal.viewMonth = Number(target.value);
            renderApp();
            return;
        }
        if (action === 'dosen-calendar-year' && state.dosen.calendarModal) {
            state.dosen.calendarModal.viewYear = Number(target.value);
            renderApp();
            return;
        }
        if (action === 'dosen-assign-pick-assistant') {
            state.dosen.assignModal.assistantId = Number(target.value) || null;
            renderApp();
            return;
        }
        if (action === 'dosen-assign-pick-team') {
            state.dosen.assignModal.teamId = Number(target.value) || null;
            renderApp();
            return;
        }
    }

    if (!(target instanceof HTMLInputElement)) return;

    if (action === 'practitioner-toggle-override') {
        state.practitioner.overrideEnabled = Boolean(target.checked);
        state.practitioner.openRoleDropdown = null;
        renderApp();
        return;
    }

    if (action === 'dosen-toggle-role2') {
        const nextVal = Boolean(target.checked);
        try {
            const res = await updateSettings({ is_role_2_required: nextVal });
            state.dosen.settings = res?.data || state.dosen.settings;
            renderApp();
        } catch (error) {
            state.modal = {
                type: 'green-alert',
                title: 'Gagal Memperbarui Pengaturan',
                subtitle: formatApiError(error, 'Tidak dapat mengubah kewajiban Role Sekunder.'),
                buttonLabel: 'Oke',
            };
            renderApp();
        }
        return;
    }

    if (action === 'dosen-import-csv') {
        const file = target.files?.[0];
        if (!file) return;
        state.dosen.importingCsv = true;
        renderApp();
        try {
            const res = await importWhitelistFile(file);
            await loadDosenData(true);
            await loadDevUsersIfLocal();
            state.modal = {
                type: 'green-alert',
                title: 'Import KRS Berhasil!',
                subtitle: res?.message || `${res?.total_imported || 0} peserta berhasil diimpor.`,
                details: Array.isArray(res?.errors) && res.errors.length > 0 ? res.errors.slice(0, 5) : undefined,
                buttonLabel: 'Oke',
            };
        } catch (error) {
            state.modal = {
                type: 'green-alert',
                title: 'Gagal Mengimpor KRS',
                subtitle: formatApiError(error, 'Pastikan file berformat CSV/XLSX dengan kolom email, nim, name.'),
                buttonLabel: 'Oke',
            };
        } finally {
            target.value = '';
            state.dosen.importingCsv = false;
            renderApp();
        }
        return;
    }

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
        rawTarget.closest('[data-action="toggle-teammate-dropdown"]') ||
        rawTarget.closest('[data-action="practitioner-toggle-role-dropdown"]');

    if (!clickedInsideDropdown && (state.profileDropdownOpen || state.profiling.openRoleDropdown || state.complaint.dropdownOpen || state.practitioner.openRoleDropdown)) {
        state.profileDropdownOpen = false;
        state.profiling.openRoleDropdown = null;
        state.complaint.dropdownOpen = false;
        state.practitioner.openRoleDropdown = null;
        renderApp();
    }

    if (rawTarget.dataset?.action === 'practitioner-backdrop-close') {
        state.practitioner.selectedUserId = null;
        state.practitioner.detail = null;
        state.practitioner.openRoleDropdown = null;
        renderApp();
        return;
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

        // --- Master Admin Actions ---
        case 'madmin-open-add':
            state.modal = { type: 'madmin-add' };
            renderApp();
            break;

        case 'madmin-submit-add':
            await executeMasterAdminAddLecturer();
            break;

        case 'madmin-confirm-revoke':
            state.modal = {
                type: 'madmin-revoke',
                userId: Number(actionEl.dataset.userId),
                userName: actionEl.dataset.userName || '',
            };
            renderApp();
            break;

        case 'madmin-confirm-delete':
            await executeMasterAdminRevoke(Number(actionEl.dataset.userId));
            break;

        // --- Praktisi Industri & Evaluator Actions ---
        case 'practitioner-page': {
            const nextPage = Number(actionEl.dataset.page || 1);
            if (nextPage >= 1 && nextPage !== state.practitioner.page) {
                state.practitioner.page = nextPage;
                await loadPractitionerData(true);
            }
            break;
        }

        case 'practitioner-open-detail':
            await loadPractitionerStudentDetail(Number(actionEl.dataset.userId));
            break;

        case 'practitioner-close-detail':
            state.practitioner.selectedUserId = null;
            state.practitioner.detail = null;
            state.practitioner.openRoleDropdown = null;
            renderApp();
            break;

        case 'practitioner-toggle-role-dropdown': {
            const slot = Number(actionEl.dataset.slot);
            state.practitioner.openRoleDropdown = state.practitioner.openRoleDropdown === slot ? null : slot;
            renderApp();
            break;
        }

        case 'practitioner-pick-override-role': {
            const slot = Number(actionEl.dataset.slot);
            const roleId = Number(actionEl.dataset.roleId);
            if (slot === 1) {
                state.practitioner.overrideRole1Id = roleId;
                if (Number(state.practitioner.overrideRole2Id) === roleId) {
                    state.practitioner.overrideRole2Id = null;
                }
            } else if (slot === 2 && Number(state.practitioner.overrideRole1Id) !== roleId) {
                state.practitioner.overrideRole2Id = roleId;
            }
            state.practitioner.openRoleDropdown = null;
            renderApp();
            break;
        }

        case 'practitioner-save-detail':
            await executePractitionerSaveDetail();
            break;

        case 'practitioner-reset-role':
            await executePractitionerResetRole();
            break;

        case 'practitioner-export':
            await executePractitionerExportCsv();
            break;

        case 'practitioner-open-complaint': {
            const cid = Number(actionEl.dataset.complaintId);
            state.initialComplaintId = cid;
            state.activeTab = 'practitioner-complaint-detail';
            syncUrlToTab('practitioner-complaint-detail', false, cid);
            renderApp();
            await loadPractitionerComplaintById(cid);
            break;
        }

        case 'practitioner-back-complaints':
            await navigateToTab('practitioner-complaints');
            break;

        case 'practitioner-review-complaint':
            await executeStaffReviewComplaint('practitioner', Number(actionEl.dataset.complaintId));
            break;

        case 'practitioner-save-project':
            await executeSaveGreenProject('practitioner');
            break;

        // --- Dosen Pengampu Actions ---
        case 'dosen-open-calendar':
            openDosenCalendarModal(actionEl.dataset.kind || 'registration');
            break;

        case 'dosen-calendar-prev':
            if (state.dosen.calendarModal) {
                let m = state.dosen.calendarModal.viewMonth - 1;
                let y = state.dosen.calendarModal.viewYear;
                if (m < 0) {
                    m = 11;
                    y -= 1;
                }
                state.dosen.calendarModal.viewMonth = m;
                state.dosen.calendarModal.viewYear = y;
                renderApp();
            }
            break;

        case 'dosen-calendar-next':
            if (state.dosen.calendarModal) {
                let m = state.dosen.calendarModal.viewMonth + 1;
                let y = state.dosen.calendarModal.viewYear;
                if (m > 11) {
                    m = 0;
                    y += 1;
                }
                state.dosen.calendarModal.viewMonth = m;
                state.dosen.calendarModal.viewYear = y;
                renderApp();
            }
            break;

        case 'dosen-calendar-pick-day':
            pickDosenCalendarDay(actionEl.dataset.iso || '');
            break;

        case 'dosen-calendar-save':
            await executeSaveDosenCalendar();
            break;

        case 'dosen-toggle-lock-all':
            await executeDosenLockAll(actionEl.dataset.mode === 'lock');
            break;

        case 'dosen-open-autogroup-confirm':
            state.modal = { type: 'dosen-confirm-autogroup' };
            renderApp();
            break;

        case 'dosen-confirm-autogroup':
            await executeDosenAutoGroup();
            break;

        case 'dosen-reset-grouping':
            await executeDosenResetGrouping();
            break;

        case 'dosen-add-stakeholder':
            await executeDosenAddStakeholder();
            break;

        case 'dosen-user-page': {
            const nextPage = Number(actionEl.dataset.page || 1);
            if (nextPage >= 1 && nextPage !== state.dosen.userPage) {
                state.dosen.userPage = nextPage;
                await loadDosenUsersOnly();
            }
            break;
        }

        case 'dosen-delete-user':
            await executeDosenDeleteUser(Number(actionEl.dataset.userId));
            break;

        case 'dosen-save-project':
            await executeSaveGreenProject('dosen');
            break;

        case 'dosen-open-assign-modal':
            state.dosen.assignModal = {
                open: true,
                assistantId: state.dosen.assistants[0]?.id || null,
                teamId: state.dosen.teams[0]?.id || null,
                saving: false,
            };
            state.modal = { type: 'dosen-assign-asprak' };
            renderApp();
            break;

        case 'dosen-assign-save':
            await executeDosenAssignSupervisor();
            break;

        case 'dosen-unassign-supervisor':
            await executeDosenUnassignSupervisor(Number(actionEl.dataset.teamId));
            break;

        case 'dosen-bypass-add-member':
            addDosenBypassMemberFromQuery();
            break;

        case 'dosen-bypass-pick-suggestion':
            addDosenBypassMemberById(Number(actionEl.dataset.userId));
            break;

        case 'dosen-bypass-remove-member': {
            const idx = Number(actionEl.dataset.index);
            state.dosen.bypassForm.members.splice(idx, 1);
            renderApp();
            break;
        }

        case 'dosen-open-bypass-confirm': {
            const bf = state.dosen.bypassForm;
            if (!String(bf.team_name || '').trim() || bf.members.length === 0) {
                state.modal = {
                    type: 'green-alert',
                    title: 'Data Tim Khusus Belum Lengkap',
                    subtitle: 'Masukkan Nama Tim dan minimal 1 Anggota Terikat terlebih dahulu.',
                    buttonLabel: 'Oke',
                };
                renderApp();
                break;
            }
            state.modal = { type: 'dosen-confirm-bypass' };
            renderApp();
            break;
        }

        case 'dosen-confirm-bypass':
            await executeDosenCreateBypassTeam();
            break;

        case 'dosen-open-complaint': {
            const cid = Number(actionEl.dataset.complaintId);
            state.initialComplaintId = cid;
            state.activeTab = 'dosen-complaint-detail';
            syncUrlToTab('dosen-complaint-detail', false, cid);
            renderApp();
            await loadDosenComplaintById(cid);
            break;
        }

        case 'dosen-back-complaints':
            await navigateToTab('dosen-complaints');
            break;

        case 'dosen-review-complaint':
            await executeStaffReviewComplaint('dosen', Number(actionEl.dataset.complaintId));
            break;

        case 'staff-download-evidence': {
            const complaintId = Number(actionEl.dataset.complaintId);
            const filename = actionEl.dataset.filename || `bukti_pengaduan_${complaintId}`;
            try {
                await downloadComplaintEvidence(complaintId, filename);
            } catch (error) {
                state.modal = {
                    type: 'green-alert',
                    title: 'Gagal Mengunduh Berkas',
                    subtitle: formatApiError(error, 'Berkas bukti tidak dapat diunduh.'),
                    buttonLabel: 'Oke',
                };
                renderApp();
            }
            break;
        }

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

async function executeMasterAdminAddLecturer() {
    const form = state.masterAdmin.form;
    const name = String(form.name || '').trim();
    const email = String(form.email || '').trim().toLowerCase();
    const nip = String(form.nip || '').trim();

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        state.modal = {
            type: 'green-alert',
            title: 'Data Dosen Tidak Ditemukan',
            subtitle: 'Cek ulang data yang anda masukan',
            details: ['Pastikan Nama Dosen dan format Email Dosen valid.'],
            buttonLabel: 'Oke',
        };
        renderApp();
        return;
    }

    state.masterAdmin.submitting = true;
    renderApp();

    try {
        await initiateLecturer({
            name,
            email,
            nip: nip || null,
            role: 'lecturer',
        });
        state.masterAdmin.form = { name: '', email: '', nip: '' };
        state.modal = {
            type: 'green-alert',
            title: 'Dosen Admin Berhasil Ditambahkan',
            subtitle: `${name} (${email}) kini terdaftar sebagai Dosen Pengampu / Admin.`,
            buttonLabel: 'Oke',
        };
        await Promise.allSettled([loadMasterAdminData(true), loadDevUsersIfLocal()]);
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Data Dosen Tidak Ditemukan',
            subtitle: 'Cek ulang data yang anda masukan',
            details: [formatApiError(error, 'Gagal menyimpan data dosen.')],
            buttonLabel: 'Oke',
        };
    } finally {
        state.masterAdmin.submitting = false;
        renderApp();
    }
}

async function executeMasterAdminRevoke(userId) {
    state.masterAdmin.deletingId = userId;
    renderApp();
    try {
        await deleteUser(userId);
        state.modal = {
            type: 'green-alert',
            title: 'Hak Akses Dicabut',
            subtitle: 'Akun dosen berhasil dihapus dari daftar akses admin.',
            buttonLabel: 'Oke',
        };
        await Promise.allSettled([loadMasterAdminData(true), loadDevUsersIfLocal()]);
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Gagal Mencabut Hak Akses',
            subtitle: formatApiError(error, 'Tidak dapat menghapus dosen admin ini.'),
            buttonLabel: 'Oke',
        };
    } finally {
        state.masterAdmin.deletingId = null;
        renderApp();
    }
}

async function executePractitionerSaveDetail() {
    const p = state.practitioner;
    const userId = p.selectedUserId;
    if (!userId || !p.detail) return;

    const isLocked = Boolean(p.detail.evaluation?.is_locked);
    p.saving = true;
    renderApp();

    try {
        if (p.overrideEnabled && !isLocked && p.overrideRole1Id) {
            await overrideStudentRole(userId, {
                final_role_id: Number(p.overrideRole1Id),
                role_2_id: p.overrideRole2Id ? Number(p.overrideRole2Id) : null,
                note: String(p.noteDraft || '').trim() || null,
            });
        } else {
            await updateEvaluationNote(userId, String(p.noteDraft || '').trim() || null);
        }

        await loadPractitionerData(true, true);
        await loadPractitionerStudentDetail(userId);

        state.modal = {
            type: 'green-alert',
            title: p.overrideEnabled && !isLocked ? 'Override & Profil Disimpan' : 'Verifikasi Profil Tersimpan',
            subtitle: 'Catatan evaluasi dan penyesuaian posisi mahasiswa berhasil diperbarui.',
            buttonLabel: 'Oke',
        };
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Gagal Menyimpan Evaluasi',
            subtitle: formatApiError(error, 'Tidak dapat menyimpan penyesuaian mahasiswa.'),
            buttonLabel: 'Oke',
        };
    } finally {
        p.saving = false;
        renderApp();
    }
}

async function executePractitionerResetRole() {
    const p = state.practitioner;
    const userId = p.selectedUserId;
    if (!userId) return;
    p.saving = true;
    renderApp();
    try {
        await resetStudentRole(userId);
        await loadPractitionerData(true, true);
        await loadPractitionerStudentDetail(userId);
        state.modal = {
            type: 'green-alert',
            title: 'Role Direset ke Saran Sistem',
            subtitle: 'Posisi final mahasiswa berhasil dikembalikan ke rekomendasi awal scoring engine.',
            buttonLabel: 'Oke',
        };
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Gagal Mereset Role',
            subtitle: formatApiError(error, 'Tidak dapat mereset posisi final mahasiswa.'),
            buttonLabel: 'Oke',
        };
    } finally {
        p.saving = false;
        renderApp();
    }
}

async function executePractitionerExportCsv() {
    try {
        const res = await fetchEvaluations({ per_page: 'all', search: state.practitioner.search || undefined });
        const list = Array.isArray(res?.data) ? res.data : [];
        const headers = ['NIM', 'Nama Mahasiswa', 'Email', 'Role Utama', 'Role Sekunder', 'Score', 'Status'];
        const rows = list.map((r) => [
            r.nim || '-',
            r.name || '-',
            r.email || '-',
            r.final_role ? roleFullTitle(r.final_role.code, r.final_role.name) : '-',
            r.role_2 ? roleFullTitle(r.role_2.code, r.role_2.name) : '-',
            `${Math.round(Number(r.recommended_score ?? r.score_role_1 ?? 0))}/100`,
            r.is_locked ? 'Verified' : (r.is_overridden ? 'Override' : 'Pending'),
        ]);
        downloadCsvFile('daftar_mahasiswa_skillset_sipad.csv', headers, rows);
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Gagal Export CSV',
            subtitle: formatApiError(error, 'Tidak dapat mengekspor data mahasiswa.'),
            buttonLabel: 'Oke',
        };
        renderApp();
    }
}

async function executeStaffReviewComplaint(scope, complaintId) {
    const bucket = scope === 'dosen' ? state.dosen : state.practitioner;
    bucket.reviewingId = complaintId;
    renderApp();

    try {
        const res = await reviewComplaint(complaintId);
        const updated = res?.data || null;
        if (updated) {
            bucket.detailComplaint = updated;
            bucket.complaints = (bucket.complaints || []).map((c) =>
                Number(c.id) === complaintId ? updated : c
            );
        }
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Gagal Menandai Tinjauan',
            subtitle: formatApiError(error, 'Tidak dapat memperbarui status tinjauan pengaduan.'),
            buttonLabel: 'Oke',
        };
    } finally {
        bucket.reviewingId = null;
        renderApp();
    }
}

async function executeSaveGreenProject(scope) {
    const isDosen = scope === 'dosen';
    const form = isDosen ? state.dosen.projectForm : state.practitioner.projectForm;
    const { team_id, project_name, project_owner_name, project_associate } = form;

    if (!team_id || !String(project_name || '').trim()) {
        state.modal = {
            type: 'green-alert',
            title: 'Data Proyek Belum Lengkap',
            subtitle: 'Pilih kelompok dan masukkan 1. Nama Proyek terlebih dahulu.',
            buttonLabel: 'Oke',
        };
        renderApp();
        return;
    }

    if (isDosen) {
        state.dosen.busyAction = 'project';
    } else {
        state.practitioner.projectSubmitting = true;
    }
    renderApp();

    try {
        await saveTeamProject(Number(team_id), {
            project_name: String(project_name).trim(),
            project_owner_name: String(project_owner_name || '').trim() || null,
            project_associate: String(project_associate || '').trim() || null,
        });
        if (isDosen) {
            await loadDosenData(true);
        } else {
            await loadPractitionerData(true, true);
        }
        state.modal = {
            type: 'green-alert',
            title: 'Detail Proyek Tersimpan!',
            subtitle: `Metadata proyek untuk Kelompok ${team_id} berhasil diperbarui.`,
            buttonLabel: 'Oke',
        };
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Gagal Menyimpan Proyek',
            subtitle: formatApiError(error, 'Tidak dapat menyimpan detail proyek.'),
            buttonLabel: 'Oke',
        };
    } finally {
        if (isDosen) {
            state.dosen.busyAction = '';
        } else {
            state.practitioner.projectSubmitting = false;
        }
        renderApp();
    }
}

function openDosenCalendarModal(kind) {
    const s = state.dosen.settings || {};
    const all = s.all_settings || {};
    let startIso = '';
    let endIso = '';
    let initialHadValue = false;

    if (kind === 'registration') {
        startIso = all.registration_start_date || '';
        endIso = all.registration_end_date || '';
        initialHadValue = Boolean(s.registration_timeline || startIso);
        if (!startIso && !endIso && String(s.registration_timeline || '').includes('Agustus 2026')) {
            startIso = '2026-08-01';
            endIso = '2026-08-28';
        }
    } else {
        startIso = all.team_release_date_iso || '';
        initialHadValue = Boolean(all.team_release_date || startIso);
        if (!startIso && String(all.team_release_date || '').includes('September 2026')) {
            startIso = '2026-09-06';
        }
    }

    const refDate = startIso ? new Date(startIso) : new Date();
    const viewYear = Number.isNaN(refDate.getTime()) ? new Date().getFullYear() : refDate.getFullYear();
    const viewMonth = Number.isNaN(refDate.getTime()) ? new Date().getMonth() : refDate.getMonth();

    state.dosen.calendarModal = {
        kind,
        initialHadValue,
        viewYear,
        viewMonth,
        startIso,
        endIso,
        saving: false,
    };
    state.modal = { type: 'dosen-calendar' };
    renderApp();
}

function pickDosenCalendarDay(iso) {
    const cm = state.dosen.calendarModal;
    if (!cm || !iso) return;

    if (cm.kind === 'release') {
        cm.startIso = iso;
        cm.endIso = '';
        renderApp();
        return;
    }

    if (!cm.startIso || (cm.startIso && cm.endIso)) {
        cm.startIso = iso;
        cm.endIso = '';
    } else if (iso < cm.startIso) {
        cm.endIso = cm.startIso;
        cm.startIso = iso;
    } else {
        cm.endIso = iso;
    }
    renderApp();
}

async function executeSaveDosenCalendar() {
    const cm = state.dosen.calendarModal;
    if (!cm || !cm.startIso) return;
    cm.saving = true;
    renderApp();

    try {
        let res;
        if (cm.kind === 'registration') {
            const end = cm.endIso || cm.startIso;
            const formatted = formatIndoDateRange(cm.startIso, end);
            res = await updateSettings({
                registration_timeline: formatted,
                settings: {
                    registration_start_date: cm.startIso,
                    registration_end_date: end,
                },
            });
        } else {
            const formatted = formatIsoToIndoDate(cm.startIso);
            res = await updateSettings({
                settings: {
                    team_release_date: formatted,
                    team_release_date_iso: cm.startIso,
                },
            });
        }
        state.dosen.settings = res?.data || state.dosen.settings;
        state.dosen.calendarModal = null;
        state.modal = null;
        renderApp();
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Gagal Menyimpan Jadwal',
            subtitle: formatApiError(error, 'Tidak dapat memperbarui jadwal.'),
            buttonLabel: 'Oke',
        };
        renderApp();
    }
}

async function executeDosenLockAll(shouldLock) {
    state.dosen.busyAction = 'lock';
    renderApp();
    try {
        const res = shouldLock ? await lockAllEvaluations() : await unlockAllEvaluations();
        await loadDosenData(true);
        state.modal = {
            type: 'green-alert',
            title: shouldLock ? 'Semua Data Mahasiswa Dikunci' : 'Kunci Data Mahasiswa Dibuka',
            subtitle: res?.message || 'Status kunci evaluasi mahasiswa diperbarui.',
            buttonLabel: 'Oke',
        };
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Gagal Memperbarui Status Kunci',
            subtitle: formatApiError(error, 'Tidak dapat mengubah status kunci mahasiswa.'),
            buttonLabel: 'Oke',
        };
    } finally {
        state.dosen.busyAction = '';
        renderApp();
    }
}

async function executeDosenAutoGroup() {
    state.dosen.busyAction = 'autogroup';
    renderApp();
    try {
        const res = await autoGroupTeams();
        await loadDosenData(true);
        state.modal = {
            type: 'green-alert',
            title: 'Pengacakan Tim Berhasil!',
            subtitle: res?.message || 'Tim PAD otomatis telah dibentuk.',
            buttonLabel: 'Oke',
        };
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Pengacakan Tim Belum Dapat Dijalankan',
            subtitle: formatApiError(error, 'Pastikan seluruh mahasiswa reguler sudah memiliki role final yang terkunci dan seimbang across 4 role.'),
            buttonLabel: 'Oke',
        };
    } finally {
        state.dosen.busyAction = '';
        renderApp();
    }
}

async function executeDosenResetGrouping() {
    state.dosen.busyAction = 'autogroup';
    renderApp();
    try {
        const res = await resetTeamGrouping();
        await loadDosenData(true);
        state.modal = {
            type: 'green-alert',
            title: 'Pembagian Tim Direset',
            subtitle: res?.message || 'Tim reguler yang belum dikunci berhasil direset.',
            buttonLabel: 'Oke',
        };
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Gagal Mereset Pembagian Tim',
            subtitle: formatApiError(error, 'Tim reguler yang sudah dikunci tidak dapat direset.'),
            buttonLabel: 'Oke',
        };
    } finally {
        state.dosen.busyAction = '';
        renderApp();
    }
}

async function executeDosenAddStakeholder() {
    const { email, role } = state.dosen.stakeholderForm;
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        state.modal = {
            type: 'green-alert',
            title: 'Email Tidak Valid',
            subtitle: 'Ketik alamat email stakeholder yang valid terlebih dahulu.',
            buttonLabel: 'Oke',
        };
        renderApp();
        return;
    }

    state.dosen.busyAction = 'add-stakeholder';
    renderApp();
    try {
        await storeWhitelistUser({ email: cleanEmail, role });
        state.dosen.stakeholderForm.email = '';
        await Promise.allSettled([loadDosenData(true), loadDevUsersIfLocal()]);
        state.modal = {
            type: 'green-alert',
            title: 'Stakeholder Ditambahkan',
            subtitle: `Email ${cleanEmail} berhasil didaftarkan ke sistem.`,
            buttonLabel: 'Oke',
        };
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Gagal Menambah Stakeholder',
            subtitle: formatApiError(error, 'Tidak dapat mendaftarkan email ini.'),
            buttonLabel: 'Oke',
        };
    } finally {
        state.dosen.busyAction = '';
        renderApp();
    }
}

async function executeDosenDeleteUser(userId) {
    try {
        await deleteUser(userId);
        await Promise.allSettled([loadDosenData(true), loadDevUsersIfLocal()]);
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Gagal Menghapus Pengguna',
            subtitle: formatApiError(error, 'Pengguna yang perannya sudah dikunci tidak dapat dihapus.'),
            buttonLabel: 'Oke',
        };
        renderApp();
    }
}

async function executeDosenAssignSupervisor() {
    const am = state.dosen.assignModal;
    const teamId = am.teamId || state.dosen.teams[0]?.id;
    if (!am.assistantId || !teamId) return;

    am.saving = true;
    renderApp();
    try {
        await assignTeamSupervisor(Number(teamId), Number(am.assistantId));
        await loadDosenData(true);
        state.modal = {
            type: 'green-alert',
            title: 'Asisten Praktikum Ditetapkan',
            subtitle: `Asprak berhasil ditugaskan untuk mendampingi Kelompok ${teamId}.`,
            buttonLabel: 'Oke',
        };
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Gagal Menetapkan Asprak',
            subtitle: formatApiError(error, 'Tidak dapat menetapkan asisten praktikum ke kelompok ini.'),
            buttonLabel: 'Oke',
        };
    } finally {
        am.saving = false;
        renderApp();
    }
}

async function executeDosenUnassignSupervisor(teamId) {
    try {
        await assignTeamSupervisor(teamId, null);
        await loadDosenData(true);
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Gagal Melepas Asprak',
            subtitle: formatApiError(error, 'Tidak dapat melepas asisten dari kelompok ini.'),
            buttonLabel: 'Oke',
        };
        renderApp();
    }
}

function addDosenBypassMemberById(userId) {
    const u = state.dosen.allStudents.find((s) => Number(s.id) === Number(userId));
    if (!u) return;
    if (state.dosen.bypassForm.members.some((m) => Number(m.user_id) === Number(u.id))) {
        state.dosen.bypassForm.memberQuery = '';
        renderApp();
        return;
    }
    state.dosen.bypassForm.members.push({
        user_id: u.id,
        name: u.name || u.email,
        email: u.email,
        nim: u.student_profile?.nim || '',
        roleLabel: '',
    });
    state.dosen.bypassForm.memberQuery = '';
    renderApp();
}

function addDosenBypassMemberFromQuery() {
    const raw = String(state.dosen.bypassForm.memberQuery || '').trim();
    if (!raw) return;

    const q = raw.toLowerCase();
    const matched = state.dosen.allStudents.find(
        (u) =>
            String(u.email || '').toLowerCase() === q ||
            String(u.student_profile?.nim || '').toLowerCase() === q ||
            String(u.name || '').toLowerCase() === q ||
            String(u.name || '').toLowerCase().includes(q)
    );

    if (matched) {
        addDosenBypassMemberById(matched.id);
        return;
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
        if (!state.dosen.bypassForm.members.some((m) => String(m.email || '').toLowerCase() === q)) {
            state.dosen.bypassForm.members.push({
                user_id: null,
                name: raw,
                email: q,
                nim: '',
                roleLabel: 'Jalur Khusus',
            });
        }
        state.dosen.bypassForm.memberQuery = '';
        renderApp();
        return;
    }

    state.modal = {
        type: 'green-alert',
        title: 'Mahasiswa Tidak Ditemukan',
        subtitle: 'Pilih mahasiswa dari saran pencarian atau masukkan email UGM yang valid.',
        buttonLabel: 'Oke',
    };
    renderApp();
}

async function executeDosenCreateBypassTeam() {
    const bf = state.dosen.bypassForm;
    const membersPayload = bf.members.map((m) =>
        m.user_id ? { user_id: Number(m.user_id) } : { email: m.email }
    );

    state.dosen.busyAction = 'bypass';
    renderApp();
    try {
        await storeExclusiveTeam({
            team_name: String(bf.team_name).trim(),
            team_type: 'external',
            project_associate: bf.category || 'GEMASTIK - Software Development',
            members: membersPayload,
        });
        state.dosen.bypassForm.team_name = '';
        state.dosen.bypassForm.memberQuery = '';
        state.dosen.bypassForm.members = [];
        await loadDosenData(true);
        state.modal = {
            type: 'green-alert',
            title: 'Tim Khusus Berhasil Dikunci!',
            subtitle: 'Tim jalur GEMASTIK/LIDM telah didaftarkan dan dikecualikan dari Auto-Grouping.',
            buttonLabel: 'Oke',
        };
    } catch (error) {
        state.modal = {
            type: 'green-alert',
            title: 'Gagal Menyimpan Tim Khusus',
            subtitle: formatApiError(error, 'Periksa kembali data tim dan anggota yang dipilih.'),
            buttonLabel: 'Oke',
        };
    } finally {
        state.dosen.busyAction = '';
        renderApp();
    }
}

boot();
