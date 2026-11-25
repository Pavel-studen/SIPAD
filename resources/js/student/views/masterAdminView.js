import { uiIcons } from '../icons.js';
import { escapeHtml } from '../utils.js';

export function renderMasterAdminView(state) {
    const madmin = state.masterAdmin;
    const rows = Array.isArray(madmin.lecturers) ? madmin.lecturers : [];
    const currentUserId = Number(state.user?.id || 0);

    if (madmin.loading && !madmin.loaded) {
        return `
            <div class="w-full max-w-[780px] mx-auto py-14 flex flex-col items-center justify-center gap-3">
                <div class="w-9 h-9 rounded-full border-4 border-[#C5E9CD] border-t-[#308242] animate-spin"></div>
                <p class="text-[13px] font-medium text-[#486284]">Memuat Daftar Dosen Admin...</p>
            </div>
        `;
    }

    const tableRows = rows.length > 0
        ? rows.map((u, idx) => {
            const isSelf = Number(u.id) === currentUserId;
            const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-[#F3FBF5]';
            const nipText = u.nip || '-';
            const nameText = u.name || u.email || 'Dosen Pengampu';
            const roleTag = u.user_role === 'admin'
                ? '<span class="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-[3px] bg-[#E6F5EA] text-[#308242]">Master Admin</span>'
                : '';

            return `
                <tr class="${rowBg} border-b border-[#D7EFE0] last:border-b-0 hover:bg-[#EAF7ED]/65 transition">
                    <td class="py-3 px-4 font-mono text-[12px] sm:text-[13px] text-[#334155] whitespace-nowrap">
                        ${escapeHtml(nipText)}
                    </td>
                    <td class="py-3 px-4 text-[13px] font-medium text-[#1E293B]">
                        <div class="flex flex-wrap items-center gap-1">
                            <span>${escapeHtml(nameText)}</span>
                            ${roleTag}
                        </div>
                        <p class="text-[11px] font-mono text-[#64748B] mt-0.5">${escapeHtml(u.email || '')}</p>
                    </td>
                    <td class="py-2.5 px-4 text-center w-[88px]">
                        ${isSelf
                            ? `<span class="text-[11px] font-medium text-[#94A3B8]">Anda</span>`
                            : `
                                <button
                                    type="button"
                                    data-action="madmin-confirm-revoke"
                                    data-user-id="${u.id}"
                                    data-user-name="${escapeHtml(nameText)}"
                                    title="Cabut Hak Akses"
                                    aria-label="Cabut Hak Akses ${escapeHtml(nameText)}"
                                    class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#F1FAF3] hover:bg-[#C5E9CD] border border-[#8DD99D] text-[#308242] transition cursor-pointer"
                                >
                                    ${uiIcons.trash('w-4 h-4 text-[#308242]')}
                                </button>
                            `
                        }
                    </td>
                </tr>
            `;
        }).join('')
        : `
            <tr>
                <td colspan="3" class="py-8 px-4 text-center text-[13px] text-[#64748B]">
                    Belum ada data Dosen Pengampu terdaftar. Klik <strong>+ Tambah Admin</strong> untuk menginisiasi.
                </td>
            </tr>
        `;

    const mobileCards = rows.length > 0
        ? rows.map((u, idx) => {
            const isSelf = Number(u.id) === currentUserId;
            const nipText = u.nip || '-';
            const nameText = u.name || u.email || 'Dosen Pengampu';
            return `
                <div class="${idx % 2 === 0 ? 'bg-white' : 'bg-[#F3FBF5]'} border border-[#B7E1C1] rounded-[6px] p-3.5 flex items-center justify-between gap-3">
                    <div class="min-w-0 space-y-1">
                        <p class="text-[13.5px] font-semibold text-[#1E293B] break-words">${escapeHtml(nameText)}</p>
                        <p class="font-mono text-[11.5px] text-[#308242]">NIP: ${escapeHtml(nipText)}</p>
                        <p class="font-mono text-[11px] text-[#64748B] truncate">${escapeHtml(u.email || '')}</p>
                    </div>
                    ${isSelf
                        ? `<span class="text-[11px] font-medium text-[#94A3B8] shrink-0 px-2">Akun Anda</span>`
                        : `
                            <button
                                type="button"
                                data-action="madmin-confirm-revoke"
                                data-user-id="${u.id}"
                                data-user-name="${escapeHtml(nameText)}"
                                aria-label="Cabut Hak Akses ${escapeHtml(nameText)}"
                                class="w-11 h-11 rounded-[6px] bg-[#E8F6EC] active:bg-[#C5E9CD] border border-[#8DD99D] text-[#308242] flex items-center justify-center shrink-0 cursor-pointer"
                            >
                                ${uiIcons.trash('w-4 h-4 text-[#308242]')}
                            </button>
                        `
                    }
                </div>
            `;
        }).join('')
        : `
            <div class="border border-dashed border-[#8DD99D] rounded-[6px] py-7 px-4 text-center text-[13px] text-[#64748B]">
                Belum ada data Dosen Pengampu terdaftar.
            </div>
        `;

    return `
        <div class="w-full max-w-[780px] mx-auto space-y-5 relative z-10">
            <!-- Selamat Datang Card (UI_MASTER_ADMIN) -->
            <div class="bg-white border-[1.5px] border-[#308242] rounded-[4px] py-4 px-5 text-center shadow-[0_2px_10px_rgba(48,130,66,0.05)]">
                <h1 class="text-[24px] sm:text-[30px] font-bold text-[#486284] tracking-tight">
                    Selamat Datang
                </h1>
            </div>

            ${madmin.error ? `
                <div class="bg-red-50 border border-red-200 text-red-700 rounded-[4px] px-4 py-3 text-[13px] flex items-center justify-between gap-3">
                    <span>${escapeHtml(madmin.error)}</span>
                    <button type="button" data-action="retry-tab" class="font-semibold underline cursor-pointer shrink-0">Coba Lagi</button>
                </div>
            ` : ''}

            <!-- Daftar Dosen Admin Table Card -->
            <div class="bg-white border-[1.5px] border-[#308242] rounded-[4px] p-4 sm:p-6 shadow-[0_3px_14px_rgba(48,130,66,0.06)] space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <h2 class="text-[15px] sm:text-[16px] font-bold text-[#1E293B]">
                        Daftar Dosen Admin
                    </h2>
                    <span class="text-[12px] font-semibold text-[#308242]">
                        Total: ${rows.length} Dosen
                    </span>
                </div>

                <!-- Desktop Table -->
                <div class="hidden sm:block border border-[#8DD99D] rounded-[4px] overflow-hidden">
                    <div class="max-h-[340px] overflow-y-auto sipad-scroll">
                        <table class="w-full text-left border-collapse">
                            <thead class="sticky top-0 z-10 bg-[#8DD99D] text-[#143D20] text-[12px] font-bold">
                                <tr>
                                    <th class="py-2.5 px-4 w-[190px]">NIP</th>
                                    <th class="py-2.5 px-4">Nama</th>
                                    <th class="py-2.5 px-4 text-center w-[88px]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Mobile Card List -->
                <div class="sm:hidden space-y-2.5">
                    ${mobileCards}
                </div>
            </div>

            <!-- + Tambah Admin Button -->
            <div class="flex items-center justify-start">
                <button
                    type="button"
                    data-action="madmin-open-add"
                    class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[13.5px] px-5 min-h-[44px] rounded-[5px] shadow-xs transition cursor-pointer"
                >
                    ${uiIcons.userPlus('w-4 h-4 text-white')}
                    <span>+ Tambah Admin</span>
                </button>
            </div>
        </div>
    `;
}
