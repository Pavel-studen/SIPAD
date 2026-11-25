const initialSection = window.__SIPAD_CONFIG__?.initialSection || 'home';
const initialComplaintId = window.__SIPAD_CONFIG__?.initialComplaintId || null;

export const state = {
    booting: true,
    authLoading: false,
    token: '',
    user: null,
    activeTab: initialSection, // 'home' | 'landing' | 'access-blocked' | 'dashboard' | 'pilih-peran' | 'hasil-role' | 'pengaduan' | 'asprak-dashboard' | 'asprak-complaint' | 'asprak-project'
    initialComplaintId: initialComplaintId ? Number(initialComplaintId) : null,
    profileDropdownOpen: false,
    devDrawerOpen: false,

    accessBlocked: {
        email: '',
        message: '',
    },

    profiling: {
        loading: false,
        loaded: false,
        error: '',
        config: {
            is_bypass: false,
            is_role_2_required: false,
            allow_role_2: true,
            role_2_status: 'optional',
            is_locked: false,
        },
        roles: [],
        step: 'profile', // 'profile' | 'skillset'
        activeSkillRoleSlot: 1, // 1 | 2
        openRoleDropdown: null, // null | 1 | 2
        avatarPreview: '',
        avatarUploading: false,
        submitting: false,
        form: {
            name: '',
            email: '',
            nim: '',
            role_1_id: null,
            role_2_id: null,
            portfolio_link: '',
            skill_ids: new Set(),
        },
    },

    myTeam: {
        loading: false,
        loaded: false,
        error: '',
        data: null,
        roleCardFlipped: false,
        teamCardFlipped: false,
    },

    complaint: {
        loading: false,
        loaded: false,
        teammates: [],
        teammatesError: '',
        dropdownOpen: false,
        submitting: false,
        historyLoading: false,
        historyOpen: false,
        history: [],
        downloadingId: null,
        form: {
            reported_id: null,
            reported_name: '',
            reported_nim: '',
            reason: '',
            file: null,
            description: '',
            confirmed: false,
        },
    },

    asprak: {
        loading: false,
        loaded: false,
        error: '',
        teams: [],
        complaints: [],
        selectedTeamId: null,
        detailComplaintLoading: false,
        detailComplaint: null,
        reviewingId: null,
        projectSubmitting: false,
        projectForm: {
            team_id: null,
            project_name: '',
            project_owner_name: '',
            project_associate: '',
        },
    },

    masterAdmin: {
        loading: false,
        loaded: false,
        error: '',
        lecturers: [],
        deletingId: null,
        submitting: false,
        form: {
            name: '',
            email: '',
            nip: '',
        },
    },

    practitioner: {
        loading: false,
        loaded: false,
        error: '',
        students: [],
        allStudents: [],
        roles: [],
        meta: { current_page: 1, last_page: 1, per_page: 6, total: 0 },
        search: '',
        page: 1,
        selectedUserId: null,
        detailLoading: false,
        detail: null,
        overrideEnabled: false,
        overrideRole1Id: null,
        overrideRole2Id: null,
        openRoleDropdown: null,
        noteDraft: '',
        saving: false,
        complaints: [],
        detailComplaintLoading: false,
        detailComplaint: null,
        reviewingId: null,
        teams: [],
        projectSubmitting: false,
        projectForm: {
            team_id: null,
            project_name: '',
            project_owner_name: '',
            project_associate: '',
        },
    },

    dosen: {
        loading: false,
        loaded: false,
        error: '',
        settings: null,
        roles: [],
        users: [],
        allStudents: [],
        usersMeta: { current_page: 1, last_page: 1, per_page: 6, total: 0 },
        userSearch: '',
        userRoleFilter: '',
        userPage: 1,
        evaluationsAll: [],
        teams: [],
        assistants: [],
        complaints: [],
        detailComplaintLoading: false,
        detailComplaint: null,
        reviewingId: null,
        busyAction: '',
        stakeholderForm: {
            email: '',
            role: 'practitioner',
        },
        importingCsv: false,
        projectForm: {
            team_id: null,
            project_name: '',
            project_owner_name: '',
            project_associate: '',
        },
        bypassForm: {
            team_name: '',
            category: 'GEMASTIK - Software Development',
            memberQuery: '',
            members: [],
        },
        assignModal: {
            open: false,
            assistantId: null,
            teamId: null,
            saving: false,
        },
        calendarModal: null,
    },

    modal: null,
    // modal shapes:
    // null
    // { type: 'confirm-profile' }
    // { type: 'alert', title, subtitle, details?: string[], buttonLabel?: string, onCloseTab?: string }
    // { type: 'role-congrats', roleLabel }
    // { type: 'team-detail' }
    // { type: 'confirm-complaint' }
    // { type: 'dev-switcher' }

    dev: {
        users: [],
        loading: false,
        seeding: false,
        notice: '',
        error: '',
    },
};

const listeners = new Set();

export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function notify() {
    for (const listener of listeners) {
        listener(state);
    }
}

export function resetSessionState() {
    state.token = '';
    state.user = null;
    state.profileDropdownOpen = false;
    state.profiling.loaded = false;
    state.profiling.step = 'profile';
    state.profiling.activeSkillRoleSlot = 1;
    state.profiling.openRoleDropdown = null;
    state.profiling.avatarPreview = '';
    state.profiling.form = {
        name: '',
        email: '',
        nim: '',
        role_1_id: null,
        role_2_id: null,
        portfolio_link: '',
        skill_ids: new Set(),
    };
    state.myTeam.loaded = false;
    state.myTeam.data = null;
    state.myTeam.roleCardFlipped = false;
    state.myTeam.teamCardFlipped = false;
    state.complaint.loaded = false;
    state.complaint.teammates = [];
    state.complaint.teammatesError = '';
    state.complaint.dropdownOpen = false;
    state.complaint.history = [];
    state.complaint.historyOpen = false;
    state.complaint.form = {
        reported_id: null,
        reported_name: '',
        reported_nim: '',
        reason: '',
        file: null,
        description: '',
        confirmed: false,
    };
    state.asprak = {
        loading: false,
        loaded: false,
        error: '',
        teams: [],
        complaints: [],
        selectedTeamId: null,
        detailComplaintLoading: false,
        detailComplaint: null,
        reviewingId: null,
        projectSubmitting: false,
        projectForm: {
            team_id: null,
            project_name: '',
            project_owner_name: '',
            project_associate: '',
        },
    };
    state.masterAdmin = {
        loading: false,
        loaded: false,
        error: '',
        lecturers: [],
        deletingId: null,
        submitting: false,
        form: {
            name: '',
            email: '',
            nip: '',
        },
    };
    state.practitioner = {
        loading: false,
        loaded: false,
        error: '',
        students: [],
        allStudents: [],
        roles: [],
        meta: { current_page: 1, last_page: 1, per_page: 6, total: 0 },
        search: '',
        page: 1,
        selectedUserId: null,
        detailLoading: false,
        detail: null,
        overrideEnabled: false,
        overrideRole1Id: null,
        overrideRole2Id: null,
        openRoleDropdown: null,
        noteDraft: '',
        saving: false,
        complaints: [],
        detailComplaintLoading: false,
        detailComplaint: null,
        reviewingId: null,
        teams: [],
        projectSubmitting: false,
        projectForm: {
            team_id: null,
            project_name: '',
            project_owner_name: '',
            project_associate: '',
        },
    };
    state.dosen = {
        loading: false,
        loaded: false,
        error: '',
        settings: null,
        roles: [],
        users: [],
        allStudents: [],
        usersMeta: { current_page: 1, last_page: 1, per_page: 6, total: 0 },
        userSearch: '',
        userRoleFilter: '',
        userPage: 1,
        evaluationsAll: [],
        teams: [],
        assistants: [],
        complaints: [],
        detailComplaintLoading: false,
        detailComplaint: null,
        reviewingId: null,
        busyAction: '',
        stakeholderForm: {
            email: '',
            role: 'practitioner',
        },
        importingCsv: false,
        projectForm: {
            team_id: null,
            project_name: '',
            project_owner_name: '',
            project_associate: '',
        },
        bypassForm: {
            team_name: '',
            category: 'GEMASTIK - Software Development',
            memberQuery: '',
            members: [],
        },
        assignModal: {
            open: false,
            assistantId: null,
            teamId: null,
            saving: false,
        },
        calendarModal: null,
    };
}
