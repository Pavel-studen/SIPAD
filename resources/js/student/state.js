const initialSection = window.__SIPAD_CONFIG__?.initialSection || 'pilih-peran';

export const state = {
    booting: true,
    authLoading: false,
    token: '',
    user: null,
    activeTab: initialSection, // 'pilih-peran' | 'hasil-role' | 'pengaduan'
    profileDropdownOpen: false,

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
}
