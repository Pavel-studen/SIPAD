import {
    flower8Petal,
    flowerStar6Petal,
    playingCardBackSvg,
    roleIcon,
} from '../icons.js';
import { escapeHtml, roleCardCornerCode } from '../utils.js';

export function renderHasilRoleView(state) {
    const { loading, loaded, error, data, roleCardFlipped, teamCardFlipped } = state.myTeam;

    if (loading && !loaded) {
        return `
            <div class="w-full max-w-[740px] mx-auto relative z-10 py-16 flex flex-col items-center justify-center gap-3">
                <div class="w-9 h-9 rounded-full border-4 border-[#C0DDF9] border-t-[#0773DF] animate-spin"></div>
                <p class="text-[13px] font-medium text-[#486284]">Memuat hasil role dan tim PAD...</p>
            </div>
        `;
    }

    if (error && !loaded) {
        return `
            <div class="w-full max-w-[600px] mx-auto relative z-10 border border-[#83B9EF] bg-white p-6 text-center space-y-3">
                <p class="text-[14px] font-semibold text-[#486284]">${escapeHtml(error)}</p>
                <button type="button" data-action="retry-tab" class="bg-[#0773DF] hover:bg-[#0561BF] text-white text-[13px] font-semibold px-4 py-2 rounded-[5px] cursor-pointer">
                    Muat Ulang
                </button>
            </div>
        `;
    }

    const hasTeam = Boolean(data?.has_team);

    // Branch A: Belum punya Tim PAD (hasil_3.png)
    if (!hasTeam) {
        return `
            <div class="w-full max-w-[760px] mx-auto relative z-10 flex flex-col items-center">
                <div class="w-full max-w-[680px] border border-[#83B9EF] bg-white px-5 py-4 sm:px-8 sm:py-5 text-center mb-8 sm:mb-10">
                    <h1 class="text-[20px] sm:text-[26px] font-bold text-[#486284] leading-snug">
                        Maaf ya! Tapi <span class="text-[#0773DF]">Role</span> dan <span class="text-[#0773DF]">Tim PAD</span> kamu belum ada :(
                    </h1>
                </div>

                <div class="grid grid-cols-2 gap-4 sm:gap-10 w-full max-w-[350px] sm:max-w-[490px] mx-auto">
                    ${[0, 1].map(() => `
                        <div class="aspect-[225/335] rounded-[12px] border border-[#486284] bg-white shadow-[0_6px_18px_rgba(72,98,132,0.1)] card-beaded-frame flex items-center justify-center p-3">
                            <span class="text-[48px] sm:text-[68px] font-bold text-[#0773DF] select-none leading-none">?</span>
                        </div>
                    `).join('')}
                </div>

                ${data?.final_role ? `
                    <p class="mt-6 text-center text-[12px] sm:text-[13px] text-[#5F7693] max-w-[460px]">
                        Profilmu sudah terekam. Pengumuman resmi Role &amp; Kelompok akan terbuka setelah proses pengelompokan tim dirilis oleh dosen.
                    </p>
                ` : ''}
            </div>
        `;
    }

    // Branch B: Sudah punya Role & Tim PAD (hasil_1.png -> hasil_2.png)
    const anyFlipped = roleCardFlipped || teamCardFlipped;
    const finalRole = data?.final_role;
    const team = data?.team;
    const roleCorner = roleCardCornerCode(finalRole?.code, finalRole?.name);

    const bannerHtml = anyFlipped
        ? `
            <h1 class="text-[19px] sm:text-[25px] font-bold text-[#486284] leading-snug">
                Selamat! Semoga bisa berdinamika bersama!!<br class="hidden sm:inline" />
                <span class="sm:hidden"> </span>dengan <span class="text-[#0773DF]">Role</span> dan <span class="text-[#0773DF]">Tim PAD</span> kamu!
            </h1>
        `
        : `
            <h1 class="text-[19px] sm:text-[25px] font-bold text-[#486284] leading-snug">
                Yay! <span class="text-[#0773DF]">Role</span> dan <span class="text-[#0773DF]">Tim PAD</span> kamu udah ada!!<br class="hidden sm:inline" />
                <span class="sm:hidden"> </span>bisa kamu langsung buka kartu nyaa
            </h1>
        `;

    return `
        <div class="w-full max-w-[760px] mx-auto relative z-10 flex flex-col items-center">
            <!-- Announcement Banner -->
            <div class="w-full max-w-[680px] border border-[#83B9EF] bg-white px-5 py-4 sm:px-8 sm:py-5 text-center mb-7 sm:mb-10">
                ${bannerHtml}
            </div>

            <!-- Two Flippable Playing Cards -->
            <div class="grid grid-cols-2 gap-4 sm:gap-10 w-full max-w-[350px] sm:max-w-[490px] mx-auto">
                <!-- Left Card: Role Card -->
                <button
                    type="button"
                    data-action="click-role-card"
                    aria-label="${roleCardFlipped ? 'Lihat detail Role kamu' : 'Buka kartu Role kamu'}"
                    class="block card-perspective w-full text-left cursor-pointer group focus:outline-none"
                >
                    <div class="card-inner ${roleCardFlipped ? 'is-flipped' : ''}">
                        <!-- Face Down -->
                        <div class="card-face card-face-back border border-[#486284] bg-white shadow-[0_6px_20px_rgba(7,115,223,0.16)] group-hover:-translate-y-1 transition-transform overflow-hidden">
                            ${playingCardBackSvg()}
                        </div>

                        <!-- Face Up (Role) -->
                        <div class="card-face card-face-front border border-[#486284] bg-white shadow-[0_6px_20px_rgba(72,98,132,0.14)] card-beaded-frame overflow-hidden">
                            <div class="relative w-full h-full p-4 sm:p-6 flex flex-col justify-between">
                                <!-- Top-left corner -->
                                <div class="flex flex-col items-start leading-none text-[#0773DF] pl-1 pt-1">
                                    <span class="font-bold text-[11px] sm:text-[13px] tracking-tight">${escapeHtml(roleCorner)}</span>
                                    <span class="mt-1">${roleIcon(finalRole?.code, 'w-5 h-5 sm:w-6 sm:h-6 text-[#0773DF]')}</span>
                                </div>

                                <!-- Center hero icon -->
                                <div class="flex items-center justify-center">
                                    ${roleIcon(finalRole?.code, 'w-16 h-16 sm:w-24 sm:h-24 text-[#0773DF] group-hover:scale-105 transition-transform')}
                                </div>

                                <!-- Bottom-right corner (mirrored upside down like playing card) -->
                                <div class="flex flex-col items-start leading-none text-[#0773DF] self-end rotate-180 pl-1 pt-1">
                                    <span class="font-bold text-[11px] sm:text-[13px] tracking-tight">${escapeHtml(roleCorner)}</span>
                                    <span class="mt-1">${roleIcon(finalRole?.code, 'w-5 h-5 sm:w-6 sm:h-6 text-[#0773DF]')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </button>

                <!-- Right Card: Team Card -->
                <button
                    type="button"
                    data-action="click-team-card"
                    aria-label="${teamCardFlipped ? 'Lihat detail Kelompok' : 'Buka kartu Kelompok kamu'}"
                    class="block card-perspective w-full text-left cursor-pointer group focus:outline-none"
                >
                    <div class="card-inner ${teamCardFlipped ? 'is-flipped' : ''}">
                        <!-- Face Down -->
                        <div class="card-face card-face-back border border-[#486284] bg-white shadow-[0_6px_20px_rgba(7,115,223,0.16)] group-hover:-translate-y-1 transition-transform overflow-hidden">
                            ${playingCardBackSvg()}
                        </div>

                        <!-- Face Up (Kelompok) -->
                        <div class="card-face card-face-front border border-[#486284] bg-white shadow-[0_6px_20px_rgba(72,98,132,0.14)] card-beaded-frame overflow-hidden">
                            <div class="relative w-full h-full p-4 sm:p-6 flex flex-col justify-between">
                                <div class="pl-1 pt-1">
                                    ${flower8Petal('w-6 h-6 sm:w-8 sm:h-8')}
                                </div>

                                <div class="mx-auto w-[84%] border border-[#83B9EF] bg-white py-2.5 px-2 text-center shadow-2xs group-hover:border-[#0773DF] transition">
                                    <div class="text-[14px] sm:text-[18px] font-bold text-[#0773DF] leading-tight">
                                        Kelompok
                                    </div>
                                    <div class="text-[16px] sm:text-[21px] font-bold text-[#0773DF] leading-tight mt-0.5">
                                        ${escapeHtml(team?.id ?? '-')}
                                    </div>
                                </div>

                                <div class="self-end pr-1 pb-1">
                                    ${flowerStar6Petal('w-6 h-6 sm:w-8 sm:h-8')}
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            </div>

            <!-- Interactive Caption / Replay -->
            <div class="mt-5 flex flex-wrap items-center justify-center gap-3 text-[12px] text-[#5F7693]">
                <span>${anyFlipped ? 'Ketuk kartu lagi untuk membuka pop-up detail.' : 'Ketuk kedua kartu untuk melihat Role &amp; Tim PAD kamu.'}</span>
                ${anyFlipped ? `
                    <button
                        type="button"
                        data-action="reset-card-flips"
                        class="text-[#0773DF] hover:underline font-medium cursor-pointer"
                    >
                        Tutup Kartu
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}
