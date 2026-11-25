import {
    flower5Petal,
    flower6Petal,
    flower8Petal,
    flowerStar6Petal,
    renderPerspectiveGridLeft,
    renderPerspectiveGridRight,
    uiIcons,
} from '../icons.js';
import { escapeHtml, roleDisplayTag } from '../utils.js';

export function isGreenPortalTab(activeTab = '') {
    return (
        activeTab === 'master-admin' ||
        activeTab.startsWith('dosen-') ||
        activeTab.startsWith('practitioner-')
    );
}

function getHeaderIdentity(state) {
    const user = state.user;
    if (!user) return { name: 'Pengguna', label: 'Akun' };

    const name = user.name || 'Nama Pengguna';
    const userRole = String(user.user_role || user.role || 'student').toLowerCase();

    if (userRole === 'admin') {
        return { name, label: 'Master Admin' };
    }
    if (userRole === 'lecturer') {
        return { name, label: 'Dosen' };
    }
    if (userRole === 'practitioner') {
        return { name, label: 'Praktisi' };
    }
    if (userRole === 'assistant') {
        return { name, label: user.role_label || 'Asisten Praktikum' };
    }

    const profile = user.student_profile;
    const nim = state.profiling.form.nim || profile?.nim || '';
    const myTeamRole = state.myTeam?.data?.final_role;
    const role1Id = state.profiling.form.role_1_id || profile?.role_1_id;
    const matchedRole = state.profiling.roles.find((r) => Number(r.id) === Number(role1Id));
    const roleTag = myTeamRole
        ? roleDisplayTag(myTeamRole.code, myTeamRole.name)
        : matchedRole
            ? roleDisplayTag(matchedRole.code, matchedRole.name)
            : user.role_label || 'Mahasiswa';

    return {
        name,
        label: nim ? `${roleTag} - ${nim}` : roleTag,
    };
}

export function renderHeader(state) {
    const isLocal = Boolean(window.__SIPAD_CONFIG__?.isLocal);
    const { name, label } = getHeaderIdentity(state);
    const userRole = String(state.user?.user_role || state.user?.role || 'student').toLowerCase();
    const isGreen = isGreenPortalTab(state.activeTab);
    const isAssistant = userRole === 'assistant';
    const avatarUrl = state.profiling.avatarPreview || state.user?.avatar_link;

    const accent = isGreen ? '#308242' : '#0773DF';
    const borderColor = isGreen ? 'border-[#8DD99D]' : 'border-[#83B9EF]';
    const rowBorder = isGreen ? 'border-[#8DD99D]/70' : 'border-[#83B9EF]/70';
    const hoverBg = isGreen ? 'hover:bg-[#EBF7EE]' : 'hover:bg-[#F0F7FF]';
    const mobileHeaderBg = isGreen ? 'bg-[#F0FAF2]' : 'bg-[#F4F8FD]';

    const avatarHtml = avatarUrl
        ? `<img src="${escapeHtml(avatarUrl)}" alt="Foto profil" class="w-full h-full object-cover" />`
        : `<div class="w-full h-full flex items-center justify-center bg-white text-[${accent}]">${uiIcons.userOutline(`w-5 h-5 text-[${accent}]`)}</div>`;

    let roleMenuRows = '';
    if (userRole === 'admin') {
        roleMenuRows = `
            <button type="button" data-action="nav-tab" data-tab="master-admin" class="w-full px-3.5 py-2.5 flex items-center justify-between text-[13px] font-medium text-[#486284] ${hoverBg} transition border-b ${rowBorder} min-h-[42px] cursor-pointer">
                ${uiIcons.userPlus(`w-4 h-4 text-[${accent}]`)}
                <span>Master Admin</span>
            </button>
            <button type="button" data-action="nav-tab" data-tab="dosen-control" class="w-full px-3.5 py-2.5 flex items-center justify-between text-[13px] font-medium text-[#486284] ${hoverBg} transition border-b ${rowBorder} min-h-[42px] cursor-pointer">
                ${uiIcons.projectTree(`w-4 h-4 text-[${accent}]`)}
                <span>Panel Dosen</span>
            </button>
            <button type="button" data-action="nav-tab" data-tab="practitioner-students" class="w-full px-3.5 py-2.5 flex items-center justify-between text-[13px] font-medium text-[#486284] ${hoverBg} transition border-b ${rowBorder} min-h-[42px] cursor-pointer">
                ${uiIcons.fileText(`w-4 h-4 text-[${accent}]`)}
                <span>Panel Praktisi</span>
            </button>
        `;
    } else if (userRole === 'lecturer') {
        roleMenuRows = `
            <button type="button" data-action="nav-tab" data-tab="dosen-control" class="w-full px-3.5 py-2.5 flex items-center justify-between text-[13px] font-medium text-[#486284] ${hoverBg} transition border-b ${rowBorder} min-h-[42px] cursor-pointer">
                ${uiIcons.projectTree(`w-4 h-4 text-[${accent}]`)}
                <span>Panel Dosen</span>
            </button>
            <button type="button" data-action="nav-tab" data-tab="practitioner-students" class="w-full px-3.5 py-2.5 flex items-center justify-between text-[13px] font-medium text-[#486284] ${hoverBg} transition border-b ${rowBorder} min-h-[42px] cursor-pointer">
                ${uiIcons.fileText(`w-4 h-4 text-[${accent}]`)}
                <span>Evaluasi Mahasiswa</span>
            </button>
        `;
    } else if (userRole === 'practitioner') {
        roleMenuRows = `
            <button type="button" data-action="nav-tab" data-tab="practitioner-students" class="w-full px-3.5 py-2.5 flex items-center justify-between text-[13px] font-medium text-[#486284] ${hoverBg} transition border-b ${rowBorder} min-h-[42px] cursor-pointer">
                ${uiIcons.userOutline(`w-4 h-4 text-[${accent}]`)}
                <span>Rincian Mahasiswa</span>
            </button>
            <button type="button" data-action="nav-tab" data-tab="practitioner-complaints" class="w-full px-3.5 py-2.5 flex items-center justify-between text-[13px] font-medium text-[#486284] ${hoverBg} transition border-b ${rowBorder} min-h-[42px] cursor-pointer">
                ${uiIcons.fileText(`w-4 h-4 text-[${accent}]`)}
                <span>Pengaduan</span>
            </button>
            <button type="button" data-action="nav-tab" data-tab="practitioner-project" class="w-full px-3.5 py-2.5 flex items-center justify-between text-[13px] font-medium text-[#486284] ${hoverBg} transition border-b ${rowBorder} min-h-[42px] cursor-pointer">
                ${uiIcons.docEdit(`w-4 h-4 text-[${accent}]`)}
                <span>Input Proyek</span>
            </button>
        `;
    } else if (isAssistant) {
        roleMenuRows = `
            <button type="button" data-action="nav-tab" data-tab="asprak-dashboard" class="w-full px-3.5 py-2.5 flex items-center justify-between text-[13px] font-medium text-[#486284] ${hoverBg} transition border-b ${rowBorder} min-h-[42px] cursor-pointer">
                ${uiIcons.userOutline('w-4 h-4 text-[#0773DF]')}
                <span>Daftar Tim</span>
            </button>
            <button type="button" data-action="asprak-go-project" class="w-full px-3.5 py-2.5 flex items-center justify-between text-[13px] font-medium text-[#486284] ${hoverBg} transition border-b ${rowBorder} min-h-[42px] cursor-pointer">
                ${uiIcons.docEdit('w-4 h-4 text-[#0773DF]')}
                <span>Input Proyek</span>
            </button>
        `;
    } else {
        roleMenuRows = `
            <button type="button" data-action="nav-tab" data-tab="dashboard" class="w-full px-3.5 py-2.5 flex items-center justify-between text-[13px] font-medium text-[#486284] ${hoverBg} transition border-b ${rowBorder} min-h-[42px] cursor-pointer">
                ${uiIcons.projectTree('w-4 h-4 text-[#0773DF]')}
                <span>Dashboard</span>
            </button>
            <button type="button" data-action="go-profile" class="w-full px-3.5 py-2.5 flex items-center justify-between text-[13px] font-medium text-[#486284] ${hoverBg} transition border-b ${rowBorder} min-h-[42px] cursor-pointer">
                ${uiIcons.userOutline('w-4 h-4 text-[#0773DF]')}
                <span>Profile</span>
            </button>
        `;
    }

    const dropdownHtml = state.profileDropdownOpen
        ? `
        <div
            data-dropdown-panel="profile"
            class="absolute right-4 sm:right-8 top-[calc(100%+6px)] z-40 w-[235px] bg-white border ${borderColor} rounded-[4px] shadow-[0_8px_22px_rgba(15,23,42,0.14)] overflow-hidden animate-modal-in"
        >
            <div class="sm:hidden px-3.5 py-2.5 ${mobileHeaderBg} border-b ${rowBorder}">
                <p class="font-semibold text-[12px] text-[#486284] truncate">${escapeHtml(name)}</p>
                <p class="font-mono text-[10.5px] text-[#5F7693] truncate">${escapeHtml(label)}</p>
            </div>
            ${roleMenuRows}
            <button
                type="button"
                data-action="logout"
                class="w-full px-3.5 py-2.5 flex items-center justify-between text-[13px] font-medium text-[#486284] ${hoverBg} transition min-h-[42px] cursor-pointer"
            >
                ${uiIcons.logoutOutline(`w-4 h-4 text-[${accent}]`)}
                <span>Log Out</span>
            </button>
            ${isLocal ? `
                <button
                    type="button"
                    data-action="open-dev-switcher"
                    class="w-full px-3.5 py-2.5 flex items-center justify-between text-[12px] font-semibold text-[${accent}] ${isGreen ? 'bg-[#F0FAF2] hover:bg-[#E0F3E5]' : 'bg-[#F5FAFF] hover:bg-[#E7F3FF]'} transition border-t ${rowBorder} min-h-[42px] cursor-pointer"
                >
                    ${uiIcons.swapUsers(`w-4 h-4 text-[${accent}]`)}
                    <span>Ganti Akun Demo</span>
                </button>
            ` : ''}
        </div>
        `
        : '';

    return `
        <header class="${isGreen ? 'bg-[#308242]' : 'bg-[#0773DF]'} text-white h-[60px] sm:h-[68px] w-full shrink-0 relative z-30 shadow-xs">
            <div class="max-w-[1280px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-3">
                <button
                    type="button"
                    data-action="nav-home"
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-[3px] border border-white/75 bg-white/15 hover:bg-white/25 transition cursor-pointer shrink-0"
                    title="Dashboard SIPAD"
                >
                    <span class="font-mono font-bold text-[14px] sm:text-[16px] tracking-[0.16em] text-white">SIPAD</span>
                </button>

                <div class="relative flex items-center">
                    <button
                        type="button"
                        data-action="toggle-profile-menu"
                        aria-expanded="${state.profileDropdownOpen ? 'true' : 'false'}"
                        class="flex items-center gap-2.5 sm:gap-3.5 py-1.5 pl-2 pr-1 rounded-full hover:bg-white/10 transition min-h-[44px] cursor-pointer"
                    >
                        <span class="hidden sm:inline font-mono text-[12px] md:text-[13px] font-medium text-white truncate max-w-[300px] md:max-w-[460px]">
                            ${escapeHtml(name)} (${escapeHtml(label)})
                        </span>
                        <span class="sm:hidden font-mono text-[11.5px] font-medium text-white truncate max-w-[135px]">
                            ${escapeHtml(name)}
                        </span>
                        <span class="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full bg-white overflow-hidden shrink-0 border border-white/70 shadow-xs">
                            ${avatarHtml}
                        </span>
                        <span class="text-white/95 transition-transform duration-150 ${state.profileDropdownOpen ? 'rotate-180' : ''}">
                            ${uiIcons.chevronDown('w-3.5 h-3.5')}
                        </span>
                    </button>
                </div>
            </div>
            ${dropdownHtml}
        </header>
    `;
}

export function renderGreenSideGrids() {
    return `
        <div class="hidden md:block pointer-events-none select-none z-0 fixed sm:absolute left-0 top-0 bottom-0 w-[130px] lg:w-[190px] xl:w-[235px]">
            ${renderPerspectiveGridLeft()}
        </div>
        <div class="hidden md:block pointer-events-none select-none z-0 fixed sm:absolute right-0 top-0 bottom-0 w-[130px] lg:w-[190px] xl:w-[235px]">
            ${renderPerspectiveGridRight()}
        </div>
    `;
}

export function renderDecorativeFlowers() {
    return `
        <!-- Desktop & Tablet flanking blue flowers (positioned cleanly outside center cards) -->
        <div class="hidden sm:flex flex-col justify-between py-6 pointer-events-none select-none z-0 absolute left-2 md:left-3 lg:left-5 xl:left-14 top-8 bottom-8">
            <div class="ml-2 xl:ml-5">${flower8Petal('w-12 h-12 md:w-14 md:h-14 lg:w-[68px] lg:h-[68px] xl:w-[84px] xl:h-[84px] opacity-90')}</div>
            <div>${flower6Petal('w-12 h-12 md:w-14 md:h-14 lg:w-[68px] lg:h-[68px] xl:w-[84px] xl:h-[84px] opacity-90')}</div>
            <div class="ml-3 xl:ml-6">${flower5Petal('w-12 h-12 md:w-14 md:h-14 lg:w-[68px] lg:h-[68px] xl:w-[84px] xl:h-[84px] opacity-90')}</div>
        </div>
        <div class="hidden sm:flex flex-col justify-between items-end py-6 pointer-events-none select-none z-0 absolute right-2 md:right-3 lg:right-5 xl:right-14 top-8 bottom-8">
            <div class="mr-2 xl:mr-5">${flower5Petal('w-12 h-12 md:w-14 md:h-14 lg:w-[68px] lg:h-[68px] xl:w-[84px] xl:h-[84px] opacity-90')}</div>
            <div>${flowerStar6Petal('w-12 h-12 md:w-14 md:h-14 lg:w-[68px] lg:h-[68px] xl:w-[84px] xl:h-[84px] opacity-90')}</div>
            <div class="mr-3 xl:mr-6">${flower8Petal('w-12 h-12 md:w-14 md:h-14 lg:w-[68px] lg:h-[68px] xl:w-[84px] xl:h-[84px] opacity-90')}</div>
        </div>

        <!-- Mobile subtle corner floral accents -->
        <div class="sm:hidden pointer-events-none select-none z-0 absolute top-2 left-2 opacity-40">
            ${flower8Petal('w-10 h-10')}
        </div>
        <div class="sm:hidden pointer-events-none select-none z-0 absolute top-2 right-2 opacity-40">
            ${flower5Petal('w-10 h-10')}
        </div>
        <div class="sm:hidden pointer-events-none select-none z-0 absolute bottom-20 left-2 opacity-35">
            ${flower5Petal('w-9 h-9')}
        </div>
        <div class="sm:hidden pointer-events-none select-none z-0 absolute bottom-20 right-2 opacity-35">
            ${flowerStar6Petal('w-9 h-9')}
        </div>
    `;
}

export function renderBottomNav(activeTab, user = null) {
    const userRole = String(user?.user_role || user?.role || 'student').toLowerCase();

    if (activeTab === 'master-admin' || userRole === 'assistant' || activeTab.startsWith('asprak-')) {
        return '';
    }

    if (activeTab.startsWith('dosen-')) {
        const dosenItems = [
            { id: 'dosen-control', label: 'Kontrol' },
            { id: 'dosen-user', label: 'User' },
            { id: 'dosen-bypass', label: 'Bypass' },
            { id: 'dosen-complaints', label: 'Pengaduan', matchPrefix: 'dosen-complaint' },
        ];
        return renderGreenBottomNav(dosenItems, activeTab, 'Navigasi Dosen Pengampu');
    }

    if (activeTab.startsWith('practitioner-')) {
        const practItems = [
            { id: 'practitioner-students', label: 'Rincian Mahasiswa' },
            { id: 'practitioner-complaints', label: 'Pengaduan', matchPrefix: 'practitioner-complaint' },
            { id: 'practitioner-project', label: 'Input Proyek' },
        ];
        return renderGreenBottomNav(practItems, activeTab, 'Navigasi Praktisi & Evaluator');
    }

    if (userRole !== 'student') {
        return '';
    }

    const items = [
        { id: 'pilih-peran', label: 'Pilih Peran' },
        { id: 'hasil-role', label: 'Hasil Role' },
        { id: 'pengaduan', label: 'Pengaduan' },
    ];

    const desktopButtons = items
        .map((item) => {
            const isActive = activeTab === item.id;
            const classes = isActive
                ? 'bg-[#0558B0] ring-2 ring-[#83B9EF] ring-offset-2 shadow-sm'
                : 'bg-[#0773DF] hover:bg-[#0561BF]';
            return `
                <button
                    type="button"
                    data-action="nav-tab"
                    data-tab="${item.id}"
                    aria-current="${isActive ? 'page' : 'false'}"
                    class="w-[150px] md:w-[170px] h-[38px] rounded-[6px] font-mono font-bold text-[13px] text-white transition cursor-pointer flex items-center justify-center ${classes}"
                >
                    ${escapeHtml(item.label)}
                </button>
            `;
        })
        .join('');

    const mobileButtons = items
        .map((item) => {
            const isActive = activeTab === item.id;
            const classes = isActive
                ? 'bg-[#0558B0] ring-2 ring-[#83B9EF] ring-offset-1 shadow-xs'
                : 'bg-[#0773DF] active:bg-[#0561BF]';
            return `
                <button
                    type="button"
                    data-action="nav-tab"
                    data-tab="${item.id}"
                    aria-current="${isActive ? 'page' : 'false'}"
                    class="min-h-[44px] rounded-[6px] font-mono font-bold text-[12px] text-white transition cursor-pointer flex items-center justify-center px-1 ${classes}"
                >
                    ${escapeHtml(item.label)}
                </button>
            `;
        })
        .join('');

    return `
        <!-- Desktop Bottom Navigation -->
        <nav aria-label="Navigasi Portal Mahasiswa" class="hidden sm:flex items-center justify-center gap-6 md:gap-10 lg:gap-14 pt-6 pb-8 px-4 relative z-20">
            ${desktopButtons}
        </nav>

        <!-- Mobile Ergonomic Fixed Bottom Dock -->
        <nav aria-label="Navigasi Mobile" class="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-xs border-t border-[#83B9EF]/60 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-4px_14px_rgba(7,115,223,0.08)]">
            <div class="grid grid-cols-3 gap-2 max-w-md mx-auto">
                ${mobileButtons}
            </div>
        </nav>
    `;
}

function renderGreenBottomNav(items, activeTab, ariaLabel) {
    const isMatch = (item) =>
        activeTab === item.id ||
        (item.matchPrefix && activeTab.startsWith(item.matchPrefix));

    const desktopButtons = items
        .map((item) => {
            const isActive = isMatch(item);
            const classes = isActive
                ? 'bg-white text-[#308242] border-[1.5px] border-[#308242] shadow-xs'
                : 'bg-[#308242] hover:bg-[#256834] text-white border-[1.5px] border-[#308242]';
            return `
                <button
                    type="button"
                    data-action="nav-tab"
                    data-tab="${item.id}"
                    aria-current="${isActive ? 'page' : 'false'}"
                    class="min-w-[130px] md:min-w-[155px] px-4 h-[38px] rounded-[6px] font-sans font-semibold text-[13px] transition cursor-pointer flex items-center justify-center ${classes}"
                >
                    ${escapeHtml(item.label)}
                </button>
            `;
        })
        .join('');

    const gridCols = items.length === 4 ? 'grid-cols-4' : 'grid-cols-3';
    const mobileText = items.length === 4 ? 'text-[11px]' : 'text-[11.5px]';

    const mobileButtons = items
        .map((item) => {
            const isActive = isMatch(item);
            const classes = isActive
                ? 'bg-white text-[#308242] border-[1.5px] border-[#308242] shadow-xs'
                : 'bg-[#308242] active:bg-[#256834] text-white border-[1.5px] border-[#308242]';
            return `
                <button
                    type="button"
                    data-action="nav-tab"
                    data-tab="${item.id}"
                    aria-current="${isActive ? 'page' : 'false'}"
                    class="min-h-[44px] rounded-[6px] font-sans font-semibold ${mobileText} leading-tight transition cursor-pointer flex items-center justify-center px-1.5 text-center ${classes}"
                >
                    ${escapeHtml(item.label)}
                </button>
            `;
        })
        .join('');

    return `
        <nav aria-label="${escapeHtml(ariaLabel)}" class="hidden sm:flex items-center justify-center flex-wrap gap-5 md:gap-9 lg:gap-12 pt-5 pb-7 px-4 relative z-20">
            ${desktopButtons}
        </nav>

        <nav aria-label="${escapeHtml(ariaLabel)} Mobile" class="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-xs border-t border-[#8DD99D]/70 px-2.5 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_14px_rgba(48,130,66,0.08)]">
            <div class="grid ${gridCols} gap-1.5 max-w-md mx-auto">
                ${mobileButtons}
            </div>
        </nav>
    `;
}
