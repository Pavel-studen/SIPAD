import { uiIcons } from '../icons.js';
import { escapeHtml } from '../utils.js';

export function renderAccessBlockedScreen(state) {
    const blockedEmail = state.accessBlocked?.email || 'akun@gmail.com';
    const blockedMessage = state.accessBlocked?.message ||
        'Akses ditolak, hanya email dengan domain @mail.ugm.ac.id yang diizinkan untuk login.';

    return `
        <div class="min-h-dvh bg-[#1A1A1A] text-[#E8EAED] flex flex-col items-center justify-center p-4 sm:p-8">
            <div class="w-full max-w-[820px] bg-[#0E0E0E] border border-[#2C2C2C] rounded-[16px] overflow-hidden shadow-2xl animate-modal-in">
                <!-- Google Bar -->
                <div class="px-5 sm:px-7 py-3.5 border-b border-[#2C2C2C] flex items-center gap-3">
                    ${uiIcons.googleG('w-4 h-4 shrink-0')}
                    <span class="text-[13.5px] sm:text-[14px] font-medium text-[#E8EAED]">Login dengan Google</span>
                </div>

                <!-- 2-Column Google 403 Body -->
                <div class="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10 items-start">
                    <div class="space-y-5">
                        <h1 class="text-[24px] sm:text-[31px] font-normal text-white leading-snug tracking-tight">
                            Akses diblokir: SistemPAD hanya dapat digunakan dalam organisasinya
                        </h1>

                        <div class="inline-flex items-center gap-2.5 bg-[#1A1A1A] border border-[#333639] rounded-full px-3 py-1.5 max-w-full">
                            <span class="w-5 h-5 rounded-full bg-[#8AB4F8] text-[#202124] text-[11px] font-bold flex items-center justify-center shrink-0">
                                ${escapeHtml((blockedEmail[0] || 'U').toUpperCase())}
                            </span>
                            <span class="text-[12.5px] sm:text-[13px] text-[#E8EAED] truncate">${escapeHtml(blockedEmail)}</span>
                        </div>
                    </div>

                    <div class="space-y-4 text-[13px] sm:text-[13.5px] text-[#C4C7C5] leading-relaxed">
                        <p>
                            SistemPAD dibatasi untuk pengguna dalam organisasinya (<span class="text-[#8AB4F8] font-medium">@mail.ugm.ac.id</span>).
                            Jika Anda merasa seharusnya Anda memiliki akses, Anda dapat menghubungi
                            <span class="text-[#8AB4F8]">developer</span>.
                        </p>

                        <div class="bg-[#1B1B1B] border border-[#303134] rounded-[8px] px-3.5 py-2.5 text-[12px] text-[#F28B82]">
                            ${escapeHtml(blockedMessage)}
                        </div>

                        <p class="text-[12.5px] text-[#9AA0A6]">
                            Error 403: org_internal
                        </p>

                        <div class="pt-2">
                            <button
                                type="button"
                                data-action="back-to-landing"
                                class="inline-flex items-center gap-2 bg-[#8AB4F8] hover:bg-[#AECBFA] text-[#202124] font-semibold text-[13px] px-4 py-2 min-h-[40px] rounded-[6px] transition cursor-pointer"
                            >
                                <span>&larr; Kembali ke Halaman Utama</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Google Footer Row -->
            <div class="w-full max-w-[820px] mt-4 px-2 flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-[#9AA0A6]">
                <span>Indonesia &#9662;</span>
                <div class="flex items-center gap-5">
                    <span>Bantuan</span>
                    <span>Privasi</span>
                    <span>Persyaratan</span>
                </div>
            </div>
        </div>
    `;
}

export function renderAuthScreen(state) {
    if (state.activeTab === 'access-blocked') {
        return renderAccessBlockedScreen(state);
    }

    const isLocal = Boolean(window.__SIPAD_CONFIG__?.isLocal);
    const { users, loading, seeding, notice, error } = state.dev;
    const demoUsers = (users || []).filter((u) => ['student', 'assistant', 'practitioner', 'lecturer', 'admin'].includes(u.user_role));

    const presets = [
        {
            email: 'master.admin@mail.ugm.ac.id',
            role: 'admin',
            label: 'Master Admin (UI_MASTER_ADMIN)',
            hint: 'Inisiasi email dosen pengampu & kelola hak akses admin',
            badge: 'Master Admin',
        },
        {
            email: 'dosen.pengampu@mail.ugm.ac.id',
            role: 'lecturer',
            label: 'Admin Dosen (UI_DOSEN)',
            hint: 'Monitoring, User & Assign Asprak, Bypass GEMASTIK/LIDM, Aduan',
            badge: 'Dosen',
        },
        {
            email: 'praktisi.industri@mail.ugm.ac.id',
            role: 'practitioner',
            label: 'Praktisi Industri (UI_ASISTEN_PRAKTIKUM_MANAGE)',
            hint: 'Periksa portofolio & skillset, Manual Override, Aduan, Proyek',
            badge: 'Praktisi',
        },
        {
            email: 'asisten.lab@mail.ugm.ac.id',
            role: 'assistant',
            label: 'Asisten Praktikum (UI_ASISTEN_PRAKTIKUM)',
            hint: 'Daftar tim bimbingan, tinjau aduan tim, & input proyek',
            badge: 'Asprak',
        },
        {
            email: 'mhs.uiux1@mail.ugm.ac.id',
            role: 'student',
            label: 'Dashboard Mahasiswa (Sudah Ada Tim)',
            hint: 'UI_DASHBOARD_MAHASISWA, Kartu Role, & Pengaduan',
            badge: 'Tim PAD',
        },
        {
            email: 'mhs.baru@mail.ugm.ac.id',
            role: 'student',
            label: 'Mahasiswa Baru (Belum Ada Tim)',
            hint: 'Dashboard Belum Ada Tim, Profile, & Skillset Form',
            badge: 'Fresh',
        },
        {
            email: 'mhs.bypass@mail.ugm.ac.id',
            role: 'student',
            label: 'Mahasiswa Bypass (GEMASTIK)',
            hint: 'Cabang "Gabisa ambil role kedua :("',
            badge: 'Bypass',
        },
    ];

    return `
        <div class="min-h-dvh flex flex-col bg-white">
            <!-- Header matching UI_LANDING_PAGE.png -->
            <header class="bg-[#0773DF] text-white h-[60px] sm:h-[68px] w-full shrink-0 shadow-xs">
                <div class="max-w-[1280px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        data-action="back-to-landing"
                        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-[3px] border border-white/75 bg-white/15 hover:bg-white/25 transition cursor-pointer shrink-0"
                    >
                        <span class="font-mono font-bold text-[14px] sm:text-[16px] tracking-[0.16em] text-white">SIPAD</span>
                    </button>

                    <button
                        type="button"
                        data-action="sso-login"
                        ${state.authLoading ? 'disabled' : ''}
                        class="bg-white hover:bg-[#F0F7FF] text-[#181C1F] font-mono font-bold text-[12px] sm:text-[13px] px-5 sm:px-7 py-1.5 min-h-[38px] rounded-[5px] transition shadow-2xs cursor-pointer"
                    >
                        LOGIN
                    </button>
                </div>
            </header>

            <!-- Hero Section matching UI_LANDING_PAGE.png -->
            <main class="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 py-10 sm:py-14">
                <div class="w-full max-w-[920px] grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-14">
                    <!-- Left Copy + Continue with Google -->
                    <div class="space-y-4">
                        <p class="text-[12.5px] sm:text-[13px] font-semibold text-[#486284]">
                            SIPAD — Proyek Aplikasi Dasar SV UGM
                        </p>

                        <h1 class="text-[32px] sm:text-[42px] font-bold text-[#486284] leading-tight tracking-tight">
                            Selamat Datang!
                        </h1>

                        <p class="text-[13px] sm:text-[14px] text-[#7D92AE] leading-relaxed">
                            Sistem informasi pemetaan peran, pembentukan tim, bimbingan asisten praktikum, dan kotak pengaduan PAD.
                        </p>

                        ${error ? `
                            <div class="border border-red-300 bg-red-50 text-red-700 text-[12.5px] rounded-[6px] px-3.5 py-2.5">
                                ${escapeHtml(error)}
                            </div>
                        ` : ''}

                        ${notice ? `
                            <div class="border border-[#83B9EF] bg-[#F0F7FF] text-[#045DDA] text-[12.5px] rounded-[6px] px-3.5 py-2.5 font-medium">
                                ${escapeHtml(notice)}
                            </div>
                        ` : ''}

                        <div class="pt-1">
                            <button
                                type="button"
                                data-action="sso-login"
                                ${state.authLoading ? 'disabled' : ''}
                                class="w-full border border-[#94A3B8] hover:border-[#0773DF] hover:bg-[#F7FAFF] disabled:opacity-60 text-[#181C1F] font-medium text-[13px] sm:text-[13.5px] rounded-[8px] min-h-[44px] px-4 py-2.5 bg-white flex items-center justify-center gap-2.5 transition shadow-2xs cursor-pointer"
                            >
                                ${uiIcons.googleG('w-4 h-4 shrink-0')}
                                <span>${state.authLoading ? 'Menghubungkan ke Google SSO...' : 'Continue with Google'}</span>
                            </button>
                        </div>

                        ${isLocal ? `
                            <div class="pt-2">
                                <button
                                    type="button"
                                    data-action="toggle-dev-drawer"
                                    aria-expanded="${state.devDrawerOpen ? 'true' : 'false'}"
                                    class="text-[12px] font-semibold text-[#0773DF] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span>Mode Uji Lokal (Dev Sandbox)</span>
                                    <span>${state.devDrawerOpen ? '&#9652;' : '&#9662;'}</span>
                                </button>

                                ${state.devDrawerOpen ? `
                                    <div class="mt-3 border border-[#83B9EF] bg-[#F8FBFF] rounded-[8px] p-4 space-y-3 animate-modal-in">
                                        <div class="flex flex-wrap items-center justify-between gap-2">
                                            <span class="text-[12px] font-bold text-[#486284]">Simulasi Akun &amp; Dataset</span>
                                            <div class="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    data-action="simulate-403-blocked"
                                                    class="min-h-[34px] px-2.5 py-1 rounded-[5px] border border-[#94A3B8] hover:border-red-400 hover:text-red-600 bg-white text-[#486284] text-[11.5px] font-semibold transition cursor-pointer"
                                                >
                                                    Simulasi 403 Non-UGM
                                                </button>
                                                <button
                                                    type="button"
                                                    data-action="dev-seed"
                                                    ${seeding ? 'disabled' : ''}
                                                    class="min-h-[34px] px-3 py-1 rounded-[5px] bg-[#308242] hover:bg-[#256834] disabled:opacity-60 text-white text-[11.5px] font-semibold transition cursor-pointer"
                                                >
                                                    ${seeding ? 'Menyiapkan...' : 'Seed Data Simulasi'}
                                                </button>
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-1 gap-2">
                                            ${presets.map((p) => `
                                                <button
                                                    type="button"
                                                    data-action="dev-login"
                                                    data-email="${escapeHtml(p.email)}"
                                                    data-role="${escapeHtml(p.role)}"
                                                    ${loading ? 'disabled' : ''}
                                                    class="w-full text-left border border-[#83B9EF] hover:border-[#0773DF] bg-white hover:bg-[#F0F7FF] rounded-[6px] px-3 py-2 transition flex items-center justify-between gap-2.5 cursor-pointer"
                                                >
                                                    <div class="min-w-0">
                                                        <div class="text-[12.5px] font-semibold text-[#486284] truncate">${escapeHtml(p.label)}</div>
                                                        <div class="text-[11px] text-[#5F7693] truncate">${escapeHtml(p.hint)}</div>
                                                    </div>
                                                    <span class="shrink-0 text-[10.5px] font-mono font-semibold bg-[#C0DDF9] text-[#045DDA] px-2 py-0.5 rounded-[4px]">
                                                        ${escapeHtml(p.badge)}
                                                    </span>
                                                </button>
                                            `).join('')}
                                        </div>

                                        ${demoUsers.length > 0 ? `
                                            <div class="pt-1">
                                                <label class="block text-[11px] font-semibold text-[#486284] mb-1">Akun terdaftar di database lokal:</label>
                                                <div class="flex gap-2">
                                                    <select
                                                        id="dev-user-select"
                                                        class="flex-1 min-h-[38px] border border-[#83B9EF] rounded-[5px] px-2.5 text-[12px] text-[#181C1F] bg-white focus:outline-none focus:border-[#0773DF]"
                                                    >
                                                        ${demoUsers.map((u) => `
                                                            <option value="${escapeHtml(u.email)}|${escapeHtml(u.user_role)}">
                                                                ${escapeHtml(u.name || u.email)} (${escapeHtml(u.user_role)})
                                                            </option>
                                                        `).join('')}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        data-action="dev-login-selected"
                                                        ${loading ? 'disabled' : ''}
                                                        class="min-h-[38px] px-3.5 rounded-[5px] bg-[#0773DF] hover:bg-[#0561BF] text-white text-[12px] font-semibold cursor-pointer"
                                                    >
                                                        Masuk
                                                    </button>
                                                </div>
                                            </div>
                                        ` : ''}
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Right Illustration Box matching UI_LANDING_PAGE.png -->
                    <div class="flex justify-center">
                        <div class="w-full max-w-[350px] aspect-square rounded-[18px] overflow-hidden border border-[#E2E8F0] shadow-xs bg-[#ECF1F6]">
                            ${uiIcons.landingHeroArt()}
                        </div>
                    </div>
                </div>
            </main>

            <!-- Footer matching UI_LANDING_PAGE.png -->
            <footer class="py-5 px-4 text-center text-[13px] sm:text-[14px] font-medium text-[#486284] shrink-0">
                Made with <span class="text-red-500" aria-label="love">&#10084;&#65039;</span> by Tim PAD 5
            </footer>
        </div>
    `;
}
