import { roleIcon, uiIcons } from '../icons.js';
import {
    escapeHtml,
    formatDateIndo,
    formatFileSize,
    roleDisplayTag,
} from '../utils.js';

export function renderPengaduanView(state) {
    const {
        loading,
        teammates,
        teammatesError,
        dropdownOpen,
        form,
        submitting,
        history,
        historyOpen,
        historyLoading,
        downloadingId,
    } = state.complaint;

    const noTeam = Boolean(teammatesError);

    return `
        <div class="w-full max-w-[530px] mx-auto relative z-10">
            <!-- Title Box -->
            <div class="border border-[#83B9EF] bg-white px-5 py-2.5 sm:py-3 text-center mb-4 sm:mb-5">
                <h1 class="text-[26px] sm:text-[32px] font-bold text-[#486284] leading-tight">Pengaduan</h1>
            </div>

            <!-- Main Form Card -->
            <div class="border border-[#83B9EF] bg-white p-5 sm:p-6 space-y-3.5">
                ${noTeam ? `
                    <div class="border border-[#83B9EF] bg-[#F2F8FF] rounded-[6px] p-3.5 text-center space-y-2">
                        <p class="text-[12.5px] font-medium text-[#486284]">
                            ${escapeHtml(teammatesError)}
                        </p>
                        <button
                            type="button"
                            data-action="nav-tab"
                            data-tab="hasil-role"
                            class="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0773DF] hover:underline cursor-pointer"
                        >
                            <span>Cek status Tim di Hasil Role</span>
                            ${uiIcons.arrowRight('w-3.5 h-3.5 text-[#0773DF]')}
                        </button>
                    </div>
                ` : ''}

                <!-- 1. Nama Anggota Dropdown -->
                <div class="relative">
                    <button
                        type="button"
                        data-action="toggle-teammate-dropdown"
                        ${noTeam || loading ? 'disabled' : ''}
                        aria-expanded="${dropdownOpen ? 'true' : 'false'}"
                        class="w-full flex items-center justify-between border border-[#83B9EF] hover:border-[#0773DF] rounded-[5px] bg-white h-[42px] sm:h-[38px] px-3 gap-2.5 text-left transition ${noTeam ? 'bg-slate-50 cursor-not-allowed opacity-70' : 'cursor-pointer'}"
                    >
                        <span class="flex items-center gap-2.5 min-w-0">
                            ${uiIcons.userPlus('w-4 h-4 text-[#0773DF] shrink-0')}
                            <span class="text-[12.5px] italic truncate ${form.reported_id ? 'text-[#181C1F] font-medium' : 'text-[#5F7693]'}">
                                ${loading
                                    ? 'Memuat daftar anggota tim...'
                                    : form.reported_name
                                        ? escapeHtml(form.reported_name)
                                        : 'Nama Anggota'
                                }
                            </span>
                        </span>
                        <span class="text-[#0773DF] shrink-0 transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}">
                            ${uiIcons.chevronDown('w-3.5 h-3.5')}
                        </span>
                    </button>

                    ${dropdownOpen && !noTeam ? `
                        <div
                            data-dropdown-panel="teammate"
                            class="absolute left-0 top-[calc(100%+5px)] w-full z-30 bg-white border border-[#83B9EF] rounded-[5px] shadow-[0_8px_22px_rgba(7,115,223,0.14)] overflow-hidden animate-modal-in max-h-[220px] overflow-y-auto sipad-scroll"
                        >
                            ${teammates.length === 0 ? `
                                <div class="px-3.5 py-3 text-[12.5px] text-[#5F7693] text-center">
                                    Tidak ada rekan anggota lain di kelompok Anda.
                                </div>
                            ` : teammates.map((mate) => {
                                const selected = Number(form.reported_id) === Number(mate.user_id);
                                return `
                                    <button
                                        type="button"
                                        data-action="select-teammate"
                                        data-user-id="${mate.user_id}"
                                        class="w-full px-3.5 py-2.5 min-h-[42px] flex items-center justify-between gap-2.5 text-left hover:bg-[#EDF5FF] transition border-b last:border-b-0 border-[#83B9EF]/65 cursor-pointer ${selected ? 'bg-[#E6F2FF]' : ''}"
                                    >
                                        <span class="flex items-center gap-2.5 min-w-0">
                                            ${mate.role
                                                ? roleIcon(mate.role.code, 'w-4 h-4 text-[#0773DF] shrink-0')
                                                : uiIcons.userPlus('w-4 h-4 text-[#0773DF] shrink-0')
                                            }
                                            <span class="min-w-0">
                                                <span class="block text-[12.5px] font-medium text-[#181C1F] truncate">${escapeHtml(mate.name || mate.email)}</span>
                                                <span class="block text-[10.5px] text-[#5F7693] font-mono truncate">
                                                    ${escapeHtml(mate.nim || '-')} ${mate.role ? `• ${escapeHtml(roleDisplayTag(mate.role.code, mate.role.name))}` : ''}
                                                </span>
                                            </span>
                                        </span>
                                        ${selected ? `<span class="text-[#0773DF] shrink-0">${uiIcons.check('w-3.5 h-3.5')}</span>` : ''}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}
                </div>

                <!-- 2. NIM Anggota (auto-filled) -->
                <div class="flex items-center border border-[#83B9EF] rounded-[5px] bg-[#FAFBFD] h-[42px] sm:h-[38px] px-3 gap-2.5">
                    ${uiIcons.idCard('w-4 h-4 text-[#0773DF] shrink-0')}
                    <input
                        type="text"
                        readonly
                        value="${escapeHtml(form.reported_nim)}"
                        placeholder="NIM Anggota"
                        class="w-full bg-transparent text-[12.5px] sm:text-[13px] ${form.reported_nim ? 'not-italic font-mono text-[#181C1F]' : 'italic'} placeholder:italic placeholder:text-[#5F7693] focus:outline-none cursor-default"
                    />
                </div>

                <!-- 3. Alasan pengaduan -->
                <div class="flex items-center border border-[#83B9EF] focus-within:border-[#0773DF] focus-within:ring-1 focus-within:ring-[#83B9EF] rounded-[5px] bg-white h-[42px] sm:h-[38px] px-3 gap-2.5 transition">
                    ${uiIcons.clipboardQuestion('w-4 h-4 text-[#0773DF] shrink-0')}
                    <input
                        type="text"
                        data-input="complaint-reason"
                        value="${escapeHtml(form.reason)}"
                        placeholder="Alasan pengaduan"
                        ${noTeam ? 'disabled' : ''}
                        class="w-full bg-transparent text-[12.5px] sm:text-[13px] ${form.reason ? 'not-italic text-[#181C1F]' : 'italic'} placeholder:italic placeholder:text-[#5F7693] focus:outline-none"
                    />
                </div>

                <!-- 4. File Bukti -->
                <div class="flex items-center justify-between border border-[#83B9EF] rounded-[5px] bg-white h-[42px] sm:h-[38px] pl-3 pr-2 gap-2">
                    <div class="flex items-center gap-2.5 min-w-0 flex-1">
                        ${uiIcons.fileDoc('w-4 h-4 text-[#0773DF] shrink-0')}
                        ${form.file ? `
                            <span class="text-[12px] text-[#181C1F] font-medium truncate">
                                ${escapeHtml(form.file.name)}
                                <span class="text-[#5F7693] font-normal">(${escapeHtml(formatFileSize(form.file.size))})</span>
                            </span>
                        ` : `
                            <span class="text-[12.5px] italic text-[#5F7693] truncate">File Bukti</span>
                        `}
                    </div>

                    <div class="flex items-center gap-1.5 shrink-0">
                        ${form.file ? `
                            <button
                                type="button"
                                data-action="clear-complaint-file"
                                title="Hapus file bukti"
                                class="text-[#5F7693] hover:text-red-500 text-[15px] font-bold px-1.5 leading-none cursor-pointer"
                            >&times;</button>
                        ` : ''}
                        <input
                            type="file"
                            id="complaint-evidence-input"
                            data-action="select-complaint-file"
                            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                            class="hidden"
                            ${noTeam ? 'disabled' : ''}
                        />
                        <label
                            for="complaint-evidence-input"
                            class="bg-[#0773DF] hover:bg-[#0561BF] text-white rounded-[5px] px-3 py-1.5 inline-flex items-center justify-center transition shadow-2xs ${noTeam ? 'opacity-55 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}"
                            title="Pilih file JPG, JPEG, PNG, atau PDF (Maks 10 MB)"
                        >
                            ${uiIcons.uploadTray('w-3.5 h-3.5 text-white')}
                        </label>
                    </div>
                </div>

                <!-- 5. Deskripsi lanjut unified textarea box -->
                <div class="border border-[#83B9EF] focus-within:border-[#0773DF] focus-within:ring-1 focus-within:ring-[#83B9EF] rounded-[5px] bg-white overflow-hidden transition">
                    <div class="flex items-center gap-2.5 px-3 py-2 border-b border-[#83B9EF]">
                        ${uiIcons.pencil('w-4 h-4 text-[#0773DF] shrink-0')}
                        <span class="text-[12.5px] italic text-[#5F7693]">Deskripsi lanjut</span>
                    </div>
                    <textarea
                        data-input="complaint-description"
                        rows="5"
                        placeholder="Tuliskan kronologi lengkap pengaduan..."
                        ${noTeam ? 'disabled' : ''}
                        class="w-full px-3 py-2.5 bg-transparent text-[12.5px] sm:text-[13px] text-[#181C1F] placeholder:italic placeholder:text-[#5F7693]/70 focus:outline-none resize-y min-h-[120px]"
                    >${escapeHtml(form.description)}</textarea>
                </div>

                <!-- 6. Action Buttons -->
                <div class="pt-1 flex items-center gap-3">
                    <button
                        type="button"
                        data-action="submit-complaint-check"
                        ${noTeam || submitting ? 'disabled' : ''}
                        class="bg-[#308242] hover:bg-[#256834] disabled:opacity-55 text-white font-semibold text-[12.5px] flex-1 sm:flex-none sm:min-w-[110px] min-h-[42px] sm:min-h-[34px] px-5 rounded-[5px] transition shadow-xs cursor-pointer"
                    >
                        ${submitting ? 'Mengirim...' : 'Simpan'}
                    </button>

                    <button
                        type="button"
                        data-action="clear-complaint"
                        ${submitting ? 'disabled' : ''}
                        class="bg-[#9EA2AE] hover:bg-[#858A98] disabled:opacity-55 text-white font-semibold text-[12.5px] flex-1 sm:flex-none sm:min-w-[110px] min-h-[42px] sm:min-h-[34px] px-5 rounded-[5px] transition shadow-xs cursor-pointer"
                    >
                        Clear
                    </button>
                </div>

                <!-- 7. Truth Checkbox -->
                <label class="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        data-action="toggle-complaint-confirm"
                        ${form.confirmed ? 'checked' : ''}
                        class="sr-only"
                    />
                    <span class="mt-0.5 w-[20px] h-[20px] sm:w-[18px] sm:h-[18px] rounded-[4px] border shrink-0 flex items-center justify-center transition ${form.confirmed
                        ? 'bg-[#0773DF] border-[#0773DF] text-white'
                        : 'bg-white border-[#83B9EF]'
                    }">
                        ${form.confirmed ? uiIcons.check('w-3.5 h-3.5 text-white') : ''}
                    </span>
                    <span class="text-[11.5px] italic text-[#5F7693] leading-snug">
                        Semua bukti dan alasan yang saya kirimkan merupakan benar apa adanya
                    </span>
                </label>
            </div>

            <!-- Collapsible My Submitted Complaints Drawer -->
            <div class="mt-3.5">
                <button
                    type="button"
                    data-action="toggle-complaint-history"
                    class="w-full border border-[#83B9EF] bg-white hover:bg-[#F5FAFF] rounded-[5px] px-4 py-2.5 flex items-center justify-between text-[12.5px] font-semibold text-[#486284] transition cursor-pointer"
                >
                    <span>Riwayat Pengaduan Saya (${history.length})</span>
                    <span class="text-[#0773DF] transition-transform duration-150 ${historyOpen ? 'rotate-180' : ''}">
                        ${uiIcons.chevronDown('w-4 h-4')}
                    </span>
                </button>

                ${historyOpen ? `
                    <div class="mt-2 border border-[#83B9EF] bg-white rounded-[5px] p-4 space-y-3 animate-modal-in">
                        ${historyLoading ? `
                            <p class="text-[12px] text-[#5F7693] text-center py-2">Memuat riwayat pengaduan...</p>
                        ` : history.length === 0 ? `
                            <p class="text-[12px] text-[#5F7693] text-center py-2">Belum ada pengaduan yang Anda kirim.</p>
                        ` : history.map((item) => `
                            <div class="border border-[#83B9EF]/70 rounded-[5px] p-3 space-y-1.5 bg-[#FAFBFD]">
                                <div class="flex flex-wrap items-center justify-between gap-2">
                                    <span class="text-[12.5px] font-bold text-[#486284]">
                                        Terlapor: ${escapeHtml(item.reported?.name || '-')}
                                    </span>
                                    <span class="text-[10.5px] font-semibold px-2 py-0.5 rounded ${item.is_reviewed
                                        ? 'bg-[#DDF3E4] text-[#308242]'
                                        : 'bg-[#E6F2FF] text-[#0773DF]'
                                    }">
                                        ${item.is_reviewed ? 'Sudah Ditinjau' : 'Menunggu Tinjauan'}
                                    </span>
                                </div>
                                <p class="text-[11px] font-mono text-[#5F7693]">
                                    ${escapeHtml(item.reported?.nim || '')} • ${escapeHtml(formatDateIndo(item.created_at))}
                                </p>
                                <p class="text-[12px] text-[#181C1F] whitespace-pre-line leading-relaxed">
                                    ${escapeHtml(item.description)}
                                </p>
                                <div class="pt-1">
                                    <button
                                        type="button"
                                        data-action="download-evidence"
                                        data-complaint-id="${item.id}"
                                        data-filename="${escapeHtml(item.evidence_file_path?.split('/').pop() || `bukti_pengaduan_${item.id}`)}"
                                        ${downloadingId === item.id ? 'disabled' : ''}
                                        class="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#0773DF] hover:underline disabled:opacity-50 cursor-pointer"
                                    >
                                        ${uiIcons.fileDoc('w-3.5 h-3.5 text-[#0773DF]')}
                                        <span>${downloadingId === item.id ? 'Mengunduh berkas...' : 'Unduh Berkas Bukti'}</span>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}
