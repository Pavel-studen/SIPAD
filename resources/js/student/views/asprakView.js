import { uiIcons } from '../icons.js';
import {
    escapeHtml,
    formatDateIndo,
    parseComplaintText,
} from '../utils.js';

function renderAsprakDashboard(state) {
    const { loading, loaded, error, teams } = state.asprak;

    if (loading && !loaded) {
        return `
            <div class="w-full max-w-[600px] mx-auto relative z-10 py-16 flex flex-col items-center justify-center gap-3">
                <div class="w-9 h-9 rounded-full border-4 border-[#C0DDF9] border-t-[#0773DF] animate-spin"></div>
                <p class="text-[13px] font-medium text-[#486284]">Memuat daftar tim bimbingan PAD...</p>
            </div>
        `;
    }

    if (error && !loaded) {
        return `
            <div class="w-full max-w-[560px] mx-auto relative z-10 border border-[#83B9EF] bg-white p-6 text-center space-y-3">
                <p class="text-[14px] font-semibold text-[#486284]">${escapeHtml(error)}</p>
                <button type="button" data-action="retry-tab" class="bg-[#0773DF] hover:bg-[#0561BF] text-white text-[13px] font-semibold px-4 py-2 rounded-[5px] cursor-pointer">
                    Muat Ulang
                </button>
            </div>
        `;
    }

    return `
        <div class="w-full max-w-[640px] mx-auto relative z-10 flex flex-col items-center">
            <!-- Title Box -->
            <div class="w-full max-w-[540px] border border-[#83B9EF] bg-white px-5 py-2.5 sm:py-3 text-center mb-6 sm:mb-7">
                <h1 class="text-[26px] sm:text-[34px] font-bold text-[#486284] leading-tight">Selamat Datang</h1>
            </div>

            <!-- Striped Teams Table Card -->
            <div class="w-full max-w-[580px] shadow-2xs">
                <div class="border border-[#83B9EF] border-b-0 bg-white py-3 px-4 text-center">
                    <h2 class="text-[14px] sm:text-[15.5px] font-bold text-[#486284]">Daftar Tim Bimbingan PAD</h2>
                </div>

                <div class="border border-[#83B9EF]/60 max-h-[305px] overflow-y-auto sipad-scroll bg-[#C0DDF9]">
                    <div class="bg-[#C0DDF9] sticky top-0 z-10 grid grid-cols-[95px_1fr_72px] sm:grid-cols-[120px_1fr_84px] px-3.5 sm:px-5 py-2.5 text-[12px] sm:text-[13px] font-bold text-[#181C1F] items-center border-b border-[#83B9EF]/40">
                        <span class="text-center">Tim</span>
                        <span class="text-center">Project Owner</span>
                        <span class="text-center">Detail</span>
                    </div>

                    ${teams.length === 0 ? `
                        <div class="bg-[#A2CEF9] px-5 py-8 text-center text-[13px] font-medium text-[#486284]">
                            Belum ada kelompok PAD yang ditugaskan kepada Anda sebagai pembimbing.
                        </div>
                    ` : teams.map((team, idx) => {
                        const poName = team.project?.owner_display_name || team.project?.owner?.name || 'Belum diatur';
                        return `
                            <div class="${idx % 2 === 0 ? 'bg-[#A2CEF9]' : 'bg-[#C0DDF9]'} grid grid-cols-[95px_1fr_72px] sm:grid-cols-[120px_1fr_84px] px-3.5 sm:px-5 py-3 items-center gap-2 text-[12px] sm:text-[13px] text-[#181C1F]">
                                <span class="font-medium text-center">Kelompok ${escapeHtml(team.id)}</span>
                                <span class="text-center sm:text-left truncate px-1">${escapeHtml(poName)}</span>
                                <div class="flex justify-center">
                                    <button
                                        type="button"
                                        data-action="asprak-open-team"
                                        data-team-id="${team.id}"
                                        aria-label="Lihat Detail Kelompok ${escapeHtml(team.id)}"
                                        class="w-9 h-9 sm:w-8 sm:h-8 rounded-[6px] bg-white hover:bg-[#EDF5FF] flex items-center justify-center shadow-2xs transition cursor-pointer"
                                    >
                                        ${uiIcons.fileText('w-4 h-4 text-[#0773DF]')}
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Action Shortcut to Input Proyek -->
            <div class="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                    type="button"
                    data-action="asprak-go-project"
                    data-team-id="${teams[0]?.id || ''}"
                    ${teams.length === 0 ? 'disabled' : ''}
                    class="bg-[#0773DF] hover:bg-[#0561BF] disabled:opacity-50 text-white font-semibold text-[12.5px] sm:text-[13px] px-5 py-2.5 min-h-[42px] rounded-[6px] inline-flex items-center gap-2 transition shadow-xs cursor-pointer"
                >
                    <span>+ Input / Edit Detail Proyek</span>
                </button>
            </div>
        </div>
    `;
}

function renderAsprakComplaintDetail(state) {
    const { detailComplaintLoading, detailComplaint, reviewingId } = state.asprak;

    if (detailComplaintLoading && !detailComplaint) {
        return `
            <div class="w-full max-w-[520px] mx-auto relative z-10 py-16 flex flex-col items-center justify-center gap-3">
                <div class="w-9 h-9 rounded-full border-4 border-[#C0DDF9] border-t-[#0773DF] animate-spin"></div>
                <p class="text-[13px] font-medium text-[#486284]">Memuat detail pengaduan...</p>
            </div>
        `;
    }

    if (!detailComplaint) {
        return `
            <div class="w-full max-w-[520px] mx-auto relative z-10 border border-[#83B9EF] bg-white p-6 text-center space-y-4">
                <p class="text-[14px] font-semibold text-[#486284]">Data tiket pengaduan tidak ditemukan atau Anda tidak memiliki akses.</p>
                <button
                    type="button"
                    data-action="asprak-back-dashboard"
                    class="bg-[#0773DF] hover:bg-[#0561BF] text-white font-semibold text-[12.5px] px-4 py-2 rounded-[5px] inline-flex items-center gap-1.5 cursor-pointer"
                >
                    ${uiIcons.arrowLeft('w-3.5 h-3.5 text-white')}
                    <span>Kembali</span>
                </button>
            </div>
        `;
    }

    const c = detailComplaint;
    const parsed = parseComplaintText(c.description);
    const filename = c.evidence_file_path ? String(c.evidence_file_path).split('/').pop() : `bukti_pengaduan_${c.id}`;
    const isDownloading = state.complaint?.downloadingId === c.id;
    const isReviewing = reviewingId === c.id;

    return `
        <div class="w-full max-w-[530px] mx-auto relative z-10">
            <!-- Title Box matching UI_ASISTEN_PRAKTIKUM.png Panel 4 -->
            <div class="border border-[#83B9EF] bg-white px-5 py-2.5 sm:py-3 text-center mb-4 sm:mb-5">
                <h1 class="text-[26px] sm:text-[32px] font-bold text-[#486284] leading-tight">Detail Pengaduan</h1>
            </div>

            <!-- Main Card -->
            <div class="border border-[#83B9EF] bg-white p-5 sm:p-6 space-y-3">
                <!-- 1. Terlapor Name -->
                <div class="border border-[#83B9EF] rounded-[5px] bg-[#C0DDF9] min-h-[40px] px-3 py-2 flex items-center gap-2.5 text-[12px] sm:text-[12.5px] font-medium text-[#181C1F]">
                    ${uiIcons.userPlus('w-4 h-4 text-[#0773DF] shrink-0')}
                    <span class="truncate">${escapeHtml(c.reported?.name || c.reported?.email || '-')}</span>
                </div>

                <!-- 2. Terlapor NIM -->
                <div class="border border-[#83B9EF] rounded-[5px] bg-[#C0DDF9] min-h-[40px] px-3 py-2 flex items-center gap-2.5 text-[12px] sm:text-[12.5px] font-medium text-[#181C1F]">
                    ${uiIcons.idCard('w-4 h-4 text-[#0773DF] shrink-0')}
                    <span class="font-mono truncate">${escapeHtml(c.reported?.nim || '-')}</span>
                </div>

                <!-- 3. Alasan -->
                <div class="border border-[#83B9EF] rounded-[5px] bg-[#C0DDF9] min-h-[40px] px-3 py-2 flex items-center gap-2.5 text-[12px] sm:text-[12.5px] font-medium text-[#181C1F]">
                    ${uiIcons.clipboardQuestion('w-4 h-4 text-[#0773DF] shrink-0')}
                    <span>${escapeHtml(parsed.reason)}</span>
                </div>

                <!-- 4. File Bukti Download Pill -->
                <div class="border border-[#83B9EF] rounded-[5px] bg-[#C0DDF9] min-h-[42px] px-3 py-2 flex flex-wrap items-center gap-2.5">
                    ${uiIcons.fileDoc('w-4 h-4 text-[#0773DF] shrink-0')}
                    <button
                        type="button"
                        data-action="download-evidence"
                        data-complaint-id="${c.id}"
                        data-filename="${escapeHtml(filename)}"
                        ${isDownloading ? 'disabled' : ''}
                        class="bg-white hover:bg-[#F5FAFF] disabled:opacity-60 text-[#181C1F] rounded-full px-3 py-1 inline-flex items-center gap-1.5 text-[11.5px] font-medium shadow-2xs transition cursor-pointer"
                    >
                        ${uiIcons.downloadTray('w-3.5 h-3.5 text-[#0773DF] shrink-0')}
                        <span class="truncate max-w-[210px] sm:max-w-[290px]">${isDownloading ? 'Mengunduh...' : escapeHtml(filename)}</span>
                    </button>
                </div>

                <!-- 5. Deskripsi lanjut -->
                <div class="border border-[#83B9EF] rounded-[5px] bg-white overflow-hidden">
                    <div class="bg-[#C0DDF9] border-b border-[#83B9EF] px-3 py-2 flex items-center gap-2.5 text-[12px] font-bold text-[#181C1F]">
                        ${uiIcons.pencil('w-4 h-4 text-[#0773DF] shrink-0')}
                        <span>Deskripsi lanjut</span>
                    </div>
                    <div class="p-3.5 min-h-[145px] text-[12px] sm:text-[12.5px] text-[#30373E] leading-relaxed whitespace-pre-line">
                        ${escapeHtml(parsed.details)}
                    </div>
                </div>

                <div class="text-[11px] text-[#5F7693] flex flex-wrap items-center justify-between gap-2 pt-0.5">
                    <span>Pelapor: ${escapeHtml(c.reporter?.name || '-')}</span>
                    <span>Dikirim: ${escapeHtml(formatDateIndo(c.created_at))}</span>
                </div>

                <!-- 6. Footer Actions -->
                <div class="pt-2 flex flex-wrap items-center justify-between gap-2.5">
                    ${c.is_reviewed ? `
                        <span class="inline-flex items-center gap-1.5 bg-[#DDF3E4] text-[#308242] text-[12px] font-semibold px-3.5 py-2 rounded-[5px]">
                            ${uiIcons.check('w-3.5 h-3.5 text-[#308242]')}
                            <span>Sudah Ditinjau</span>
                        </span>
                    ` : `
                        <button
                            type="button"
                            data-action="asprak-review-complaint"
                            data-complaint-id="${c.id}"
                            ${isReviewing ? 'disabled' : ''}
                            class="bg-[#308242] hover:bg-[#256834] disabled:opacity-60 text-white font-semibold text-[12px] min-h-[40px] sm:min-h-[34px] px-4 rounded-[5px] inline-flex items-center gap-1.5 transition cursor-pointer"
                        >
                            ${uiIcons.check('w-3.5 h-3.5 text-white')}
                            <span>${isReviewing ? 'Menyimpan...' : 'Tandai Sudah Ditinjau'}</span>
                        </button>
                    `}

                    <button
                        type="button"
                        data-action="asprak-back-dashboard"
                        class="bg-[#0773DF] hover:bg-[#0561BF] text-white font-semibold text-[12px] min-h-[40px] sm:min-h-[34px] px-4 rounded-[5px] inline-flex items-center gap-1.5 transition cursor-pointer ml-auto"
                    >
                        ${uiIcons.arrowLeft('w-3.5 h-3.5 text-white')}
                        <span>Kembali</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderAsprakInputProject(state) {
    const { teams, projectForm, projectSubmitting } = state.asprak;

    return `
        <div class="w-full max-w-[600px] mx-auto relative z-10">
            <!-- Title Box matching UI_ASISTEN_PRAKTIKUM.png Panel 5 -->
            <div class="border border-[#83B9EF] bg-white px-5 py-2.5 sm:py-3 text-center mb-5 sm:mb-6">
                <h1 class="text-[26px] sm:text-[32px] font-bold text-[#486284] leading-tight">Input Proyek</h1>
            </div>

            <!-- Main Card -->
            <div class="border border-[#83B9EF] bg-white p-5 sm:p-7 space-y-4">
                <p class="text-[11.5px] sm:text-[12px] text-[#5F7693] leading-snug">
                    *Silakan ketik manual detail proyek yang dibawa oleh Mitra / Project Owner untuk kelas PAD.
                </p>

                <!-- Team Selector -->
                <div class="space-y-1.5">
                    <label for="asprak-project-team" class="block text-[12.5px] font-bold text-[#486284]">
                        Kelompok Bimbingan
                    </label>
                    <select
                        id="asprak-project-team"
                        data-action="asprak-select-project-team"
                        ${teams.length === 0 ? 'disabled' : ''}
                        class="w-full min-h-[40px] border border-[#83B9EF] focus:border-[#0773DF] rounded-[4px] px-3 text-[12.5px] text-[#181C1F] bg-white focus:outline-none"
                    >
                        ${teams.length === 0 ? `
                            <option value="">Belum ada kelompok bimbingan</option>
                        ` : teams.map((t) => `
                            <option value="${t.id}" ${Number(projectForm.team_id) === Number(t.id) ? 'selected' : ''}>
                                Kelompok ${escapeHtml(t.id)}${t.project?.project_name ? ` — ${escapeHtml(t.project.project_name)}` : ''}
                            </option>
                        `).join('')}
                    </select>
                </div>

                <!-- 1. Nama Proyek -->
                <div class="space-y-1.5">
                    <label for="asprak-project-name" class="block text-[12.5px] font-bold text-[#0773DF]">
                        1. Nama Proyek
                    </label>
                    <input
                        id="asprak-project-name"
                        type="text"
                        data-input="asprak-project-name"
                        value="${escapeHtml(projectForm.project_name)}"
                        placeholder="Type nama proyek (misal: E-Commerce Smart Village)"
                        class="w-full min-h-[40px] border border-[#83B9EF] focus:border-[#0773DF] focus:ring-1 focus:ring-[#83B9EF] rounded-[4px] px-3 text-[12.5px] text-[#181C1F] placeholder:text-[#8FA2B7] bg-white focus:outline-none"
                    />
                </div>

                <!-- 2. Project Owner (PO) -->
                <div class="space-y-1.5">
                    <label for="asprak-project-owner" class="block text-[12.5px] font-bold text-[#0773DF]">
                        2. Project Owner (PO)
                    </label>
                    <input
                        id="asprak-project-owner"
                        type="text"
                        data-input="asprak-project-owner"
                        value="${escapeHtml(projectForm.project_owner_name)}"
                        placeholder="Type nama PO (misal: Ir. Hendra S.T., M.Eng.)"
                        class="w-full min-h-[40px] border border-[#83B9EF] focus:border-[#0773DF] focus:ring-1 focus:ring-[#83B9EF] rounded-[4px] px-3 text-[12.5px] text-[#181C1F] placeholder:text-[#8FA2B7] bg-white focus:outline-none"
                    />
                </div>

                <!-- 3. Nama Mitra Proyek -->
                <div class="space-y-1.5">
                    <label for="asprak-project-associate" class="block text-[12.5px] font-bold text-[#0773DF]">
                        3. Nama Mitra Proyek
                    </label>
                    <input
                        id="asprak-project-associate"
                        type="text"
                        data-input="asprak-project-associate"
                        value="${escapeHtml(projectForm.project_associate)}"
                        placeholder="Type nama mitra/perusahaan (misal: PT. Digital Solusindo)"
                        class="w-full min-h-[40px] border border-[#83B9EF] focus:border-[#0773DF] focus:ring-1 focus:ring-[#83B9EF] rounded-[4px] px-3 text-[12.5px] text-[#181C1F] placeholder:text-[#8FA2B7] bg-white focus:outline-none"
                    />
                </div>

                <!-- Actions -->
                <div class="pt-2 flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        data-action="asprak-save-project"
                        ${projectSubmitting || teams.length === 0 ? 'disabled' : ''}
                        class="bg-[#0773DF] hover:bg-[#0561BF] disabled:opacity-55 text-white font-semibold text-[12.5px] min-h-[42px] sm:min-h-[38px] px-6 rounded-[5px] transition shadow-xs cursor-pointer"
                    >
                        ${projectSubmitting ? 'Menyimpan...' : 'Simpan Detail Proyek'}
                    </button>

                    <button
                        type="button"
                        data-action="asprak-back-dashboard"
                        class="border border-[#83B9EF] hover:border-[#0773DF] text-[#486284] font-semibold text-[12.5px] min-h-[42px] sm:min-h-[38px] px-4 rounded-[5px] inline-flex items-center gap-1.5 transition cursor-pointer"
                    >
                        ${uiIcons.arrowLeft('w-3.5 h-3.5 text-[#486284]')}
                        <span>Kembali</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

export function renderAsprakView(state) {
    if (state.activeTab === 'asprak-complaint') {
        return renderAsprakComplaintDetail(state);
    }
    if (state.activeTab === 'asprak-project') {
        return renderAsprakInputProject(state);
    }
    return renderAsprakDashboard(state);
}
