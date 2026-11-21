import {
    flower5Petal,
    flower6Petal,
    flower8Petal,
    flowerStar6Petal,
    uiIcons,
} from '../icons.js';
import { escapeHtml } from '../utils.js';

export function renderAuthScreen(state) {
    const isLocal = Boolean(window.__SIPAD_CONFIG__?.isLocal);
    const { users, loading, seeding, notice, error } = state.dev;
    const studentUsers = (users || []).filter((u) => u.user_role === 'student' || u.user_role === 'admin');

    const presets = [
        {
            email: 'mhs.baru@mail.ugm.ac.id',
            label: 'Mahasiswa Baru (Form Kosong)',
            hint: 'Untuk uji Profile, Role 1 & 2, Skillset, & Kartu "?"',
            badge: 'Fresh',
        },
        {
            email: 'mhs.bypass@mail.ugm.ac.id',
            label: 'Mahasiswa Bypass (GEMASTIK)',
            hint: 'Untuk uji cabang "Gabisa ambil role kedua :("',
            badge: 'Bypass',
        },
        {
            email: 'mhs.uiux1@mail.ugm.ac.id',
            label: 'Mahasiswa Tim UI/UX (Kelompok)',
            hint: 'Untuk uji Kartu Role, Detail Kelompok, & Pengaduan',
            badge: 'Tim PAD',
        },
    ];

    return `
        <div class="min-h-dvh flex flex-col bg-white relative overflow-hidden">
            <header class="bg-[#0773DF] text-white h-[60px] sm:h-[68px] w-full shrink-0 shadow-xs">
                <div class="max-w-[1280px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
                    <div class="inline-flex items-center px-3 py-1.5 rounded-[3px] border border-white/75 bg-white/15">
                        <span class="font-mono font-bold text-[14px] sm:text-[16px] tracking-[0.16em] text-white">SIPAD</span>
                    </div>
                    <span class="font-mono text-[11px] sm:text-[12.5px] text-white/95">Portal Mahasiswa PAD SV UGM</span>
                </div>
            </header>

            <main class="flex-1 relative flex items-center justify-center px-4 py-8 sm:py-12">
                <div class="hidden sm:block pointer-events-none select-none absolute left-8 top-12 opacity-85">${flower8Petal('w-20 h-20')}</div>
                <div class="hidden sm:block pointer-events-none select-none absolute left-14 bottom-12 opacity-85">${flower5Petal('w-20 h-20')}</div>
                <div class="hidden sm:block pointer-events-none select-none absolute right-10 top-14 opacity-85">${flower6Petal('w-20 h-20')}</div>
                <div class="hidden sm:block pointer-events-none select-none absolute right-8 bottom-14 opacity-85">${flowerStar6Petal('w-20 h-20')}</div>

                <div class="w-full max-w-[560px] relative z-10 space-y-5">
                    <div class="border border-[#83B9EF] bg-white px-5 py-3 text-center">
                        <h1 class="text-[24px] sm:text-[30px] font-bold text-[#486284]">Masuk ke SIPAD</h1>
                    </div>

                    <div class="border border-[#83B9EF] bg-white p-5 sm:p-7 space-y-5">
                        <p class="text-[13px] sm:text-[14px] text-[#5F7693] text-center leading-relaxed">
                            Gunakan akun email SSO <span class="font-semibold text-[#0773DF]">@mail.ugm.ac.id</span> yang terdaftar di KRS aktif untuk mengisi Profiling Role &amp; Skillset, melihat Hasil Tim PAD, atau mengirim Pengaduan.
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

                        <button
                            type="button"
                            data-action="sso-login"
                            ${state.authLoading ? 'disabled' : ''}
                            class="w-full min-h-[46px] bg-[#0773DF] hover:bg-[#0561BF] disabled:opacity-60 text-white font-semibold text-[14px] rounded-[6px] px-4 py-2.5 flex items-center justify-center gap-2.5 transition shadow-xs cursor-pointer"
                        >
                            <span>${state.authLoading ? 'Menghubungkan ke Google SSO...' : 'Login dengan SSO UGM (@mail.ugm.ac.id)'}</span>
                            ${uiIcons.arrowRight('w-4 h-4 text-white')}
                        </button>

                        ${isLocal ? `
                            <div class="pt-4 border-t border-[#83B9EF]/60 space-y-3.5">
                                <div class="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                        <h2 class="text-[13.5px] font-bold text-[#486284]">Mode Uji Lokal (Dev Sandbox)</h2>
                                        <p class="text-[11.5px] text-[#5F7693]">Login instan via endpoint lokal <code class="font-mono text-[#0773DF]">/dev/generate-token</code></p>
                                    </div>
                                    <button
                                        type="button"
                                        data-action="dev-seed"
                                        ${seeding ? 'disabled' : ''}
                                        class="min-h-[36px] px-3 py-1.5 rounded-[5px] bg-[#308242] hover:bg-[#256834] disabled:opacity-60 text-white text-[12px] font-semibold transition cursor-pointer"
                                    >
                                        ${seeding ? 'Menyiapkan Data...' : 'Seed Data Simulasi'}
                                    </button>
                                </div>

                                <div class="grid grid-cols-1 gap-2">
                                    ${presets.map((p) => `
                                        <button
                                            type="button"
                                            data-action="dev-login"
                                            data-email="${escapeHtml(p.email)}"
                                            data-role="student"
                                            ${loading ? 'disabled' : ''}
                                            class="w-full text-left border border-[#83B9EF] hover:border-[#0773DF] hover:bg-[#F4F9FF] rounded-[6px] px-3.5 py-2.5 transition flex items-center justify-between gap-3 cursor-pointer"
                                        >
                                            <div class="min-w-0">
                                                <div class="text-[13px] font-semibold text-[#486284] truncate">${escapeHtml(p.label)}</div>
                                                <div class="text-[11px] text-[#5F7693] truncate">${escapeHtml(p.hint)}</div>
                                            </div>
                                            <span class="shrink-0 text-[11px] font-mono font-semibold bg-[#C0DDF9] text-[#045DDA] px-2.5 py-1 rounded-[4px]">
                                                ${escapeHtml(p.badge)}
                                            </span>
                                        </button>
                                    `).join('')}
                                </div>

                                ${studentUsers.length > 0 ? `
                                    <div class="pt-1">
                                        <label class="block text-[11.5px] font-semibold text-[#486284] mb-1.5">Atau pilih akun terdaftar di database lokal:</label>
                                        <div class="flex gap-2">
                                            <select
                                                id="dev-user-select"
                                                class="flex-1 min-h-[40px] border border-[#83B9EF] rounded-[5px] px-3 text-[12.5px] text-[#181C1F] bg-white focus:outline-none focus:border-[#0773DF]"
                                            >
                                                ${studentUsers.map((u) => `
                                                    <option value="${escapeHtml(u.email)}|${escapeHtml(u.user_role)}">
                                                        ${escapeHtml(u.name || u.email)} (${escapeHtml(u.email)})
                                                    </option>
                                                `).join('')}
                                            </select>
                                            <button
                                                type="button"
                                                data-action="dev-login-selected"
                                                ${loading ? 'disabled' : ''}
                                                class="min-h-[40px] px-4 rounded-[5px] bg-[#0773DF] hover:bg-[#0561BF] text-white text-[12.5px] font-semibold cursor-pointer"
                                            >
                                                Masuk
                                            </button>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </main>
        </div>
    `;
}
