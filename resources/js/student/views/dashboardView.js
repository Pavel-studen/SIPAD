import { escapeHtml, roleTableLabel } from '../utils.js';

export function renderDashboardView(state) {
    const { loading, loaded, error, data } = state.myTeam;

    if (loading && !loaded) {
        return `
            <div class="w-full max-w-[660px] mx-auto relative z-10 py-16 flex flex-col items-center justify-center gap-3">
                <div class="w-9 h-9 rounded-full border-4 border-[#C0DDF9] border-t-[#0773DF] animate-spin"></div>
                <p class="text-[13px] font-medium text-[#486284]">Memuat dashboard mahasiswa...</p>
            </div>
        `;
    }

    if (error && !loaded) {
        return `
            <div class="w-full max-w-[580px] mx-auto relative z-10 border border-[#83B9EF] bg-white p-6 text-center space-y-3">
                <p class="text-[14px] font-semibold text-[#486284]">${escapeHtml(error)}</p>
                <button type="button" data-action="retry-tab" class="bg-[#0773DF] hover:bg-[#0561BF] text-white text-[13px] font-semibold px-4 py-2 rounded-[5px] cursor-pointer">
                    Muat Ulang
                </button>
            </div>
        `;
    }

    const hasTeam = Boolean(data?.has_team);
    const members = Array.isArray(data?.team?.members) ? data.team.members : [];
    const studentName = state.user?.name || 'Mahasiswa';

    // Branch B: Belum punya Tim PAD (UI_DASHBOARD_MAHASISWA.png Panel 2)
    if (!hasTeam) {
        return `
            <div class="w-full max-w-[660px] mx-auto relative z-10 flex flex-col items-center">
                <div class="w-full max-w-[560px] border border-[#83B9EF] bg-white px-4 py-2.5 sm:px-6 sm:py-3 text-center mb-6 sm:mb-7">
                    <h1 class="text-[21px] sm:text-[28px] font-bold text-[#486284] leading-tight">
                        Hai! Hari ini mau lakuin apa?
                    </h1>
                </div>

                <div class="w-full max-w-[560px] shadow-2xs">
                    <div class="border border-[#83B9EF] border-b-0 bg-white py-3 px-4 text-center">
                        <h2 class="text-[13.5px] sm:text-[15px] font-bold text-[#486284]">
                            Tim PAD kamu belum ada nih, Tunggu ya! :)
                        </h2>
                    </div>

                    <div class="border border-[#83B9EF]/60 overflow-hidden">
                        <div class="bg-[#C0DDF9] grid grid-cols-3 px-3 sm:px-5 py-2.5 text-[12px] sm:text-[13px] font-bold text-[#181C1F] text-center">
                            <span>NIM</span>
                            <span>Nama</span>
                            <span>Role</span>
                        </div>

                        ${[0, 1, 2, 3].map((idx) => `
                            <div class="${idx % 2 === 0 ? 'bg-[#A2CEF9]' : 'bg-[#C0DDF9]'} grid grid-cols-3 px-3 sm:px-5 py-3 items-center text-[13px] text-[#486284] text-center">
                                <span>-</span>
                                <span class="inline-flex items-center justify-center gap-2.5">
                                    <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#BDBDBD] inline-block shrink-0"></span>
                                    <span>-</span>
                                </span>
                                <span>-</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Branch A: Sudah punya Tim PAD (UI_DASHBOARD_MAHASISWA.png Panels 1 & 3)
    return `
        <div class="w-full max-w-[680px] mx-auto relative z-10 flex flex-col items-center">
            <div class="w-full max-w-[660px] border border-[#83B9EF] bg-white px-4 py-2.5 sm:px-6 sm:py-3 text-center mb-6 sm:mb-7">
                <h1 class="text-[20px] sm:text-[26px] font-bold text-[#486284] leading-tight">
                    Hai! ${escapeHtml(studentName)}, Hari ini mau ngapain?
                </h1>
            </div>

            <div class="w-full max-w-[580px] shadow-2xs">
                <div class="border border-[#83B9EF] border-b-0 bg-white py-3 px-4 text-center">
                    <h2 class="text-[13.5px] sm:text-[15px] font-bold text-[#486284]">
                        Selamat! Teman Kelompok PAD kamu udah ada nih!
                    </h2>
                </div>

                <div class="border border-[#83B9EF]/60 max-h-[295px] overflow-y-auto sipad-scroll bg-[#C0DDF9]">
                    <div class="bg-[#C0DDF9] sticky top-0 z-10 grid grid-cols-[1.05fr_1.45fr_0.9fr] sm:grid-cols-[145px_1fr_130px] px-3 sm:px-5 py-2.5 text-[12px] sm:text-[13px] font-bold text-[#181C1F] items-center border-b border-[#83B9EF]/40">
                        <span class="sm:text-center">NIM</span>
                        <span class="sm:pl-8">Nama</span>
                        <span>Role</span>
                    </div>

                    ${members.length === 0 ? `
                        <div class="bg-[#A2CEF9] px-4 py-6 text-center text-[13px] text-[#486284]">
                            Belum ada anggota tercatat pada tim ini.
                        </div>
                    ` : members.map((member, idx) => {
                        const avatarUrl = member.avatar_link;
                        const roleText = roleTableLabel(member.final_role?.code, member.final_role?.name);
                        const isSelf = Number(member.user_id) === Number(state.user?.id);
                        return `
                            <div class="${idx % 2 === 0 ? 'bg-[#A2CEF9]' : 'bg-[#C0DDF9]'} grid grid-cols-[1.05fr_1.45fr_0.9fr] sm:grid-cols-[145px_1fr_130px] px-3 sm:px-5 py-3 items-center gap-2 text-[11.5px] sm:text-[13px] text-[#181C1F]">
                                <span class="font-mono text-[10.5px] sm:text-[12px] break-all sm:text-center">${escapeHtml(member.nim || '-')}</span>
                                <span class="flex items-center gap-2 sm:gap-2.5 min-w-0">
                                    <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E1E1E1] shrink-0 overflow-hidden flex items-center justify-center">
                                        ${avatarUrl
                                            ? `<img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(member.name || 'Avatar')}" class="w-full h-full object-cover" />`
                                            : ''
                                        }
                                    </span>
                                    <span class="truncate font-medium">
                                        ${escapeHtml(member.name || member.email || '-')}${isSelf ? ' <span class="text-[10px] font-semibold text-[#045DDA]">(Kamu)</span>' : ''}
                                    </span>
                                </span>
                                <span class="font-medium leading-snug">${escapeHtml(roleText)}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}
