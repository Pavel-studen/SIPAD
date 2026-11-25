import { roleIcon, uiIcons } from '../icons.js';
import {
    escapeHtml,
    formatDateIndo,
    normalizeRoleCode,
    parseComplaintText,
    roleCompactCode,
    roleFullTitle,
} from '../utils.js';

export function renderGreenComplaintsList(complaints = [], loading = false, detailAction = 'staff-open-complaint') {
    if (loading) {
        return `
            <div class="w-full max-w-[780px] mx-auto py-14 flex flex-col items-center justify-center gap-3">
                <div class="w-9 h-9 rounded-full border-4 border-[#C5E9CD] border-t-[#308242] animate-spin"></div>
                <p class="text-[13px] font-medium text-[#486284]">Memuat Daftar Pengaduan...</p>
            </div>
        `;
    }

    const desktopRows = complaints.length > 0
        ? complaints.map((item, idx) => {
            const { reason } = parseComplaintText(item.description);
            const nim = item.reported?.nim || item.reporter?.nim || '-';
            const reportedName = item.reported?.name || item.reported?.email || 'Mahasiswa';
            const statusDot = item.is_reviewed
                ? '<span class="inline-block ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-[3px] bg-[#E6F5EA] text-[#308242]">Ditinjau</span>'
                : '<span class="inline-block ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-[3px] bg-amber-50 text-amber-700 border border-amber-200">Baru</span>';

            return `
                <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FCFA]'} border-b border-[#E2F3E7] last:border-b-0 hover:bg-[#EEF9F1] transition">
                    <td class="py-3 px-4 font-mono text-[12px] text-[#334155] whitespace-nowrap">${escapeHtml(nim)}</td>
                    <td class="py-3 px-4 text-[13px] font-medium text-[#1E293B]">
                        <div class="flex flex-wrap items-center">
                            <span>${escapeHtml(reportedName)}</span>
                            ${statusDot}
                        </div>
                    </td>
                    <td class="py-3 px-4 text-[12.5px] text-[#475569] text-center max-w-[230px]">
                        <span class="line-clamp-2">${escapeHtml(reason)}</span>
                    </td>
                    <td class="py-2.5 px-4 text-center w-[90px]">
                        <button
                            type="button"
                            data-action="${detailAction}"
                            data-complaint-id="${item.id}"
                            title="Lihat Detail Pengaduan"
                            class="inline-flex items-center justify-center w-9 h-9 rounded-[4px] border border-[#308242] bg-white hover:bg-[#EAF7ED] text-[#308242] transition cursor-pointer"
                        >
                            ${uiIcons.fileText('w-4 h-4 text-[#308242]')}
                        </button>
                    </td>
                </tr>
            `;
        }).join('')
        : `
            <tr>
                <td colspan="4" class="py-10 px-4 text-center text-[13px] text-[#64748B]">
                    Belum ada tiket pengaduan mahasiswa yang tercatat.
                </td>
            </tr>
        `;

    const mobileCards = complaints.length > 0
        ? complaints.map((item) => {
            const { reason } = parseComplaintText(item.description);
            const nim = item.reported?.nim || item.reporter?.nim || '-';
            const reportedName = item.reported?.name || item.reported?.email || 'Mahasiswa';
            return `
                <div class="border border-[#B7E1C1] bg-white rounded-[6px] p-3.5 flex items-center justify-between gap-3">
                    <div class="min-w-0 space-y-1">
                        <div class="flex flex-wrap items-center gap-1.5">
                            <span class="font-semibold text-[13px] text-[#1E293B]">${escapeHtml(reportedName)}</span>
                            <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-[3px] ${item.is_reviewed ? 'bg-[#E6F5EA] text-[#308242]' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
                                ${item.is_reviewed ? 'Ditinjau' : 'Baru'}
                            </span>
                        </div>
                        <p class="font-mono text-[11px] text-[#5F7693]">NIM: ${escapeHtml(nim)}</p>
                        <p class="text-[12px] text-[#475569] line-clamp-2">${escapeHtml(reason)}</p>
                    </div>
                    <button
                        type="button"
                        data-action="${detailAction}"
                        data-complaint-id="${item.id}"
                        class="min-w-[44px] min-h-[44px] px-3 rounded-[5px] border border-[#308242] bg-[#F1FAF3] active:bg-[#C5E9CD] text-[#308242] flex items-center justify-center shrink-0 cursor-pointer"
                    >
                        ${uiIcons.fileText('w-4 h-4 text-[#308242]')}
                    </button>
                </div>
            `;
        }).join('')
        : `
            <div class="border border-dashed border-[#8DD99D] rounded-[6px] py-8 px-4 text-center text-[13px] text-[#64748B]">
                Belum ada tiket pengaduan mahasiswa.
            </div>
        `;

    return `
        <div class="w-full max-w-[780px] mx-auto space-y-5 relative z-10">
            <div class="bg-white border-[1.5px] border-[#308242] rounded-[4px] py-4 px-5 text-center shadow-[0_2px_10px_rgba(48,130,66,0.05)]">
                <h1 class="text-[24px] sm:text-[30px] font-bold text-[#486284] tracking-tight">
                    List Aduan
                </h1>
            </div>

            <div class="bg-white border-[1.5px] border-[#308242] rounded-[4px] overflow-hidden shadow-[0_3px_14px_rgba(48,130,66,0.06)]">
                <div class="py-3 px-5 border-b border-[#8DD99D] text-center">
                    <h2 class="text-[15px] font-bold text-[#1E293B]">Daftar Mahasiswa</h2>
                </div>

                <div class="hidden sm:block overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-[#8DD99D] text-[#143D20] text-[12px] font-bold">
                            <tr>
                                <th class="py-2.5 px-4">NIM</th>
                                <th class="py-2.5 px-4">Nama Mahasiswa</th>
                                <th class="py-2.5 px-4 text-center">Alasan</th>
                                <th class="py-2.5 px-4 text-center w-[90px]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${desktopRows}
                        </tbody>
                    </table>
                </div>

                <div class="sm:hidden p-3 space-y-2.5">
                    ${mobileCards}
                </div>
            </div>
        </div>
    `;
}

export function renderGreenComplaintDetail(complaint, loading = false, opts = {}) {
    const backAction = opts.backAction || 'staff-back-complaints';
    const reviewAction = opts.reviewAction || 'staff-review-complaint';
    const reviewingId = opts.reviewingId || null;

    if (loading) {
        return `
            <div class="w-full max-w-[660px] mx-auto py-14 flex flex-col items-center justify-center gap-3">
                <div class="w-9 h-9 rounded-full border-4 border-[#C5E9CD] border-t-[#308242] animate-spin"></div>
                <p class="text-[13px] font-medium text-[#486284]">Memuat Detail Pengaduan...</p>
            </div>
        `;
    }

    if (!complaint) {
        return `
            <div class="w-full max-w-[660px] mx-auto bg-white border-[1.5px] border-[#308242] rounded-[4px] p-6 text-center space-y-4">
                <p class="text-[14px] text-[#486284]">Data tiket pengaduan tidak ditemukan.</p>
                <button type="button" data-action="${backAction}" class="inline-flex items-center gap-2 bg-[#308242] text-white font-semibold text-[13px] px-4 min-h-[42px] rounded-[4px] cursor-pointer">
                    ${uiIcons.arrowLeft('w-4 h-4')}
                    <span>Kembali</span>
                </button>
            </div>
        `;
    }

    const { reason, details } = parseComplaintText(complaint.description);
    const reportedName = complaint.reported?.name || complaint.reported?.email || 'Mahasiswa Terlapor';
    const reportedNim = complaint.reported?.nim || '-';
    const reporterName = complaint.reporter?.name || complaint.reporter?.email || 'Pelapor';
    const evidenceName = complaint.evidence_file_path
        ? String(complaint.evidence_file_path).split('/').pop()
        : 'bukti_pengaduan.pdf';
    const isReviewed = Boolean(complaint.is_reviewed);
    const isReviewing = Number(reviewingId) === Number(complaint.id);

    return `
        <div class="w-full max-w-[660px] mx-auto space-y-5 relative z-10">
            <div class="bg-white border-[1.5px] border-[#308242] rounded-[4px] py-4 px-5 text-center shadow-[0_2px_10px_rgba(48,130,66,0.05)]">
                <h1 class="text-[24px] sm:text-[30px] font-bold text-[#486284] tracking-tight">
                    Detail Pengaduan
                </h1>
            </div>

            <div class="bg-white border-[1.5px] border-[#308242] rounded-[4px] p-4 sm:p-6 shadow-[0_3px_14px_rgba(48,130,66,0.06)] space-y-3.5">
                <!-- Row 1: Nama Terlapor -->
                <div class="bg-[#C5E9CD] border border-[#72C384] rounded-[4px] px-3.5 py-2.5 flex items-center justify-between gap-2 text-[13px] font-medium text-[#1E293B]">
                    <div class="flex items-center gap-2.5 min-w-0">
                        ${uiIcons.userPlus('w-4 h-4 text-[#14532D] shrink-0')}
                        <span class="truncate">${escapeHtml(reportedName)}</span>
                    </div>
                    <span class="text-[11px] font-mono text-[#14532D]/85 shrink-0">
                        Kelompok ${escapeHtml(String(complaint.team_id || '-'))}
                    </span>
                </div>

                <!-- Row 2: NIM -->
                <div class="bg-[#C5E9CD] border border-[#72C384] rounded-[4px] px-3.5 py-2.5 flex items-center justify-between gap-2 text-[13px] font-mono text-[#1E293B]">
                    <div class="flex items-center gap-2.5 min-w-0">
                        ${uiIcons.idCard('w-4 h-4 text-[#14532D] shrink-0')}
                        <span class="truncate">${escapeHtml(reportedNim)}</span>
                    </div>
                    <span class="text-[11px] font-sans text-[#14532D]/85 truncate">Pelapor: ${escapeHtml(reporterName)}</span>
                </div>

                <!-- Row 3: Alasan -->
                <div class="bg-[#C5E9CD] border border-[#72C384] rounded-[4px] px-3.5 py-2.5 flex items-center gap-2.5 text-[13px] text-[#1E293B]">
                    ${uiIcons.clipboardQuestion('w-4 h-4 text-[#14532D] shrink-0')}
                    <span>${escapeHtml(reason)}</span>
                </div>

                <!-- Row 4: Lampiran Bukti -->
                <div class="bg-[#C5E9CD] border border-[#72C384] rounded-[4px] px-3.5 py-2 flex flex-wrap items-center gap-2.5">
                    ${uiIcons.fileDoc('w-4 h-4 text-[#14532D] shrink-0')}
                    <button
                        type="button"
                        data-action="staff-download-evidence"
                        data-complaint-id="${complaint.id}"
                        data-filename="${escapeHtml(evidenceName)}"
                        class="inline-flex items-center gap-1.5 bg-white hover:bg-[#F3FBF5] border border-[#8DD99D] rounded-full px-3 py-1 text-[12px] font-medium text-[#1E293B] shadow-2xs transition cursor-pointer max-w-full"
                    >
                        ${uiIcons.downloadTray('w-3.5 h-3.5 text-[#308242] shrink-0')}
                        <span class="truncate max-w-[240px]">${escapeHtml(evidenceName)}</span>
                    </button>
                </div>

                <!-- Row 5: Deskripsi Lanjut -->
                <div class="border border-[#72C384] rounded-[4px] overflow-hidden">
                    <div class="bg-[#C5E9CD] border-b border-[#72C384] px-3.5 py-2 flex items-center gap-2 text-[13px] font-semibold text-[#1E293B]">
                        ${uiIcons.pencil('w-3.5 h-3.5 text-[#14532D]')}
                        <span>Deskripsi lanjut</span>
                    </div>
                    <div class="bg-white p-3.5 min-h-[115px] text-[12.5px] sm:text-[13px] text-[#486284] leading-relaxed whitespace-pre-line">
                        ${escapeHtml(details)}
                    </div>
                </div>

                <!-- Footer: Review & Kembali -->
                <div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <div>
                        ${isReviewed
                            ? `<span class="inline-flex items-center gap-1.5 bg-[#E6F5EA] border border-[#8DD99D] text-[#308242] text-[12px] font-semibold px-3 py-1.5 rounded-[4px]">
                                ${uiIcons.check('w-3.5 h-3.5')}
                                <span>Sudah Ditinjau${complaint.reviewed_at ? ` • ${escapeHtml(formatDateIndo(complaint.reviewed_at))}` : ''}</span>
                               </span>`
                            : `<button
                                type="button"
                                data-action="${reviewAction}"
                                data-complaint-id="${complaint.id}"
                                ${isReviewing ? 'disabled' : ''}
                                class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#EAF7ED] border-[1.5px] border-[#308242] text-[#308242] font-semibold text-[12.5px] px-4 min-h-[40px] rounded-[4px] transition cursor-pointer disabled:opacity-60"
                               >
                                ${uiIcons.check('w-3.5 h-3.5')}
                                <span>${isReviewing ? 'Menyimpan...' : 'Tandai Sudah Ditinjau'}</span>
                               </button>`
                        }
                    </div>

                    <button
                        type="button"
                        data-action="${backAction}"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[12.5px] px-4 min-h-[40px] rounded-[4px] shadow-xs transition cursor-pointer"
                    >
                        ${uiIcons.arrowLeft('w-3.5 h-3.5')}
                        <span>Kembali</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

export function renderGreenProjectFormCard(teams = [], form = {}, submitting = false, prefix = 'practitioner') {
    const teamOptions = teams.length > 0
        ? teams.map((t) => `
            <option value="${t.id}" ${Number(form.team_id) === Number(t.id) ? 'selected' : ''}>
                Kelompok ${t.id}${t.project?.project_name ? ` — ${escapeHtml(t.project.project_name)}` : ''}
            </option>
        `).join('')
        : '<option value="">Belum ada kelompok tersedia</option>';

    return `
        <div class="w-full max-w-[600px] mx-auto bg-white border-[1.5px] border-[#308242] rounded-[6px] p-5 sm:p-7 shadow-[0_3px_14px_rgba(48,130,66,0.06)] space-y-4 relative z-10">
            <div>
                <h2 class="text-[17px] sm:text-[19px] font-bold text-[#486284] tracking-tight">
                    INPUT DETAIL PROYEK
                </h2>
                <p class="text-[12px] text-[#5F7693] mt-1">
                    *Silakan ketik manual detail proyek yang dibawa oleh Mitra / Project Owner untuk kelas PAD.
                </p>
            </div>

            ${teams.length > 0 ? `
                <div class="space-y-1.5">
                    <label for="${prefix}-project-team" class="block text-[12.5px] font-bold text-[#308242]">
                        Pilih Kelompok
                    </label>
                    <select
                        id="${prefix}-project-team"
                        data-action="${prefix}-select-project-team"
                        class="w-full min-h-[42px] px-3 bg-white border border-[#72C384] rounded-[5px] text-[16px] sm:text-[13px] text-[#1E293B] focus:outline-none focus:border-[#308242]"
                    >
                        ${teamOptions}
                    </select>
                </div>
            ` : `
                <div class="bg-[#F0FAF2] border border-[#8DD99D] rounded-[4px] px-3.5 py-2.5 text-[12.5px] text-[#308242]">
                    Belum ada kelompok PAD yang terbentuk untuk diisi detail proyeknya.
                </div>
            `}

            <div class="space-y-1.5">
                <label for="${prefix}-project-name" class="block text-[12.5px] font-bold text-[#308242]">
                    1. Nama Proyek
                </label>
                <input
                    id="${prefix}-project-name"
                    type="text"
                    data-input="${prefix}-project-name"
                    value="${escapeHtml(form.project_name || '')}"
                    placeholder="Type nama proyek (misal: E-Commerce Smart Village)"
                    class="w-full min-h-[42px] px-3.5 bg-white border border-[#72C384] rounded-[5px] text-[16px] sm:text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#308242]"
                />
            </div>

            <div class="space-y-1.5">
                <label for="${prefix}-project-owner" class="block text-[12.5px] font-bold text-[#308242]">
                    2. Project Owner (PO)
                </label>
                <input
                    id="${prefix}-project-owner"
                    type="text"
                    data-input="${prefix}-project-owner"
                    value="${escapeHtml(form.project_owner_name || '')}"
                    placeholder="Type nama PO (misal: Ir. Hendra S.T., M.Eng.)"
                    class="w-full min-h-[42px] px-3.5 bg-white border border-[#72C384] rounded-[5px] text-[16px] sm:text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#308242]"
                />
            </div>

            <div class="space-y-1.5">
                <label for="${prefix}-project-associate" class="block text-[12.5px] font-bold text-[#308242]">
                    3. Nama Mitra Proyek
                </label>
                <input
                    id="${prefix}-project-associate"
                    type="text"
                    data-input="${prefix}-project-associate"
                    value="${escapeHtml(form.project_associate || '')}"
                    placeholder="Type nama mitra/perusahaan (misal: PT. Digital Solusindo)"
                    class="w-full min-h-[42px] px-3.5 bg-white border border-[#72C384] rounded-[5px] text-[16px] sm:text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#308242]"
                />
            </div>

            <div class="pt-1">
                <button
                    type="button"
                    data-action="${prefix}-save-project"
                    ${submitting || !form.team_id ? 'disabled' : ''}
                    class="w-full sm:w-auto min-w-[200px] min-h-[44px] px-5 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[13.5px] rounded-[5px] shadow-xs transition cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                >
                    ${submitting ? 'Menyimpan...' : 'Simpan Detail Proyek'}
                </button>
            </div>
        </div>
    `;
}

function renderOverrideDropdown(slot, selectedRoleId, roles, openSlot) {
    const isOpen = openSlot === slot;
    const selectedRole = roles.find((r) => Number(r.id) === Number(selectedRoleId));
    const displayLabel = selectedRole ? roleCompactCode(selectedRole.code, selectedRole.name) : `Role ${slot}`;

    const menuItems = roles.map((r) => {
        const isCurrent = Number(r.id) === Number(selectedRoleId);
        const codeLabel = roleCompactCode(r.code, r.name);
        return `
            <button
                type="button"
                data-action="practitioner-pick-override-role"
                data-slot="${slot}"
                data-role-id="${r.id}"
                class="w-full px-2.5 py-2 flex items-center gap-2 text-left text-[12px] font-medium transition border-b border-[#B7E1C1]/70 last:border-b-0 cursor-pointer ${isCurrent ? 'bg-[#E6F5EA] text-[#14532D] font-bold' : 'bg-white text-[#1E293B] hover:bg-[#F3FBF5]'}"
            >
                ${roleIcon(r.code, 'w-3.5 h-3.5 text-[#308242] shrink-0')}
                <span>${escapeHtml(codeLabel)}</span>
            </button>
        `;
    }).join('');

    return `
        <div class="relative flex-1 min-w-[92px]">
            <button
                type="button"
                data-action="practitioner-toggle-role-dropdown"
                data-slot="${slot}"
                class="w-full h-[36px] px-2.5 bg-white border border-[#72C384] rounded-[4px] flex items-center justify-between gap-1.5 text-[12px] font-semibold text-[#308242] hover:bg-[#F3FBF5] transition cursor-pointer"
            >
                <span class="truncate">${escapeHtml(displayLabel)}</span>
                ${uiIcons.chevronDown('w-3 h-3 text-[#308242] shrink-0')}
            </button>
            ${isOpen ? `
                <div data-dropdown-panel="practitioner-role" class="mt-1 border border-[#72C384] rounded-[4px] overflow-hidden bg-white shadow-sm">
                    ${menuItems}
                </div>
            ` : ''}
        </div>
    `;
}

function renderStudentDetailDrawerContent(p) {
    if (p.detailLoading) {
        return `
            <div class="py-16 flex flex-col items-center justify-center gap-3">
                <div class="w-8 h-8 rounded-full border-4 border-[#C5E9CD] border-t-[#308242] animate-spin"></div>
                <p class="text-[12.5px] text-[#486284]">Memuat detail skillset mahasiswa...</p>
            </div>
        `;
    }

    const detail = p.detail;
    if (!detail) {
        return '<p class="text-[13px] text-[#64748B] py-6 text-center">Pilih mahasiswa untuk melihat rincian.</p>';
    }

    const student = detail.student || {};
    const evalData = detail.evaluation || {};
    const score = Math.round(Number(evalData.recommended_score ?? evalData.score_role_1 ?? 0));
    const role1 = evalData.final_role || student.role_1;
    const role2 = student.role_2;
    const isLocked = Boolean(evalData.is_locked);
    const isOverridden = Boolean(evalData.is_overridden);
    const skillsByRole = Array.isArray(detail.skills_by_role) ? detail.skills_by_role : [];

    const checkedRoleGroups = skillsByRole
        .map((group) => {
            const checkedSkills = (group.skills || []).filter((sk) => sk.is_checked);
            if (checkedSkills.length === 0) return '';
            const badges = checkedSkills.map((sk) => `
                <span class="inline-flex items-center gap-1 bg-[#F3F8F5] border border-[#D4E7D9] text-[#1E293B] text-[11px] font-medium px-2 py-1 rounded-[4px]">
                    <span class="text-[#308242] font-bold">✓</span>
                    <span>${escapeHtml(sk.name)}</span>
                </span>
            `).join('');
            return `
                <div class="space-y-1.5">
                    <p class="text-[11px] font-semibold text-[#5F7693]">${escapeHtml(group.role_name)}:</p>
                    <div class="flex flex-wrap gap-1.5">${badges}</div>
                </div>
            `;
        })
        .filter(Boolean)
        .join('');

    const portfolioItems = [];
    if (student.portfolio_link) {
        portfolioItems.push({ label: student.portfolio_link, url: student.portfolio_link });
    }

    const portfolioHtml = portfolioItems.length > 0
        ? portfolioItems.map((pf) => `
            <a
                href="${escapeHtml(pf.url)}"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full border border-[#B7E1C1] hover:border-[#308242] bg-white hover:bg-[#F3FBF5] rounded-[4px] px-3 py-2 flex items-center justify-between gap-2 text-[12px] font-medium text-[#486284] transition"
            >
                <span class="inline-flex items-center gap-2 min-w-0">
                    ${uiIcons.linkChain('w-3.5 h-3.5 text-[#308242] shrink-0')}
                    <span class="truncate">${escapeHtml(pf.label)}</span>
                </span>
                ${uiIcons.externalLink('w-3.5 h-3.5 text-[#5F7693] shrink-0')}
            </a>
        `).join('')
        : '<p class="text-[12px] text-[#94A3B8] italic">Mahasiswa belum melampirkan tautan portofolio.</p>';

    const rolesList = Array.isArray(p.roles) && p.roles.length > 0
        ? p.roles
        : skillsByRole.map((g) => ({ id: g.role_id, code: g.role_code, name: g.role_name }));

    return `
        <div class="space-y-4">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-[15px] font-bold text-[#1E293B]">Detail Mahasiswa</h3>
                <button
                    type="button"
                    data-action="practitioner-close-detail"
                    aria-label="Tutup Detail Mahasiswa"
                    class="w-8 h-8 rounded-full hover:bg-[#F1F5F9] text-[#64748B] flex items-center justify-center cursor-pointer"
                >
                    ${uiIcons.closeX('w-4 h-4')}
                </button>
            </div>

            <!-- Identity Box -->
            <div class="bg-[#F4F7FA] rounded-[5px] px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div class="min-w-0">
                    <p class="font-bold text-[13.5px] text-[#1E293B] truncate">${escapeHtml(student.name || student.email || '-')}</p>
                    <p class="font-mono text-[11px] text-[#64748B] truncate">NIM ${escapeHtml(student.nim || '-')}</p>
                </div>
                <span class="text-[11px] font-semibold text-[#5F7693] shrink-0">
                    ${escapeHtml(student.team_label || 'Belum Tim')}
                </span>
            </div>

            <!-- ROLE & SKOR -->
            <div class="space-y-2">
                <p class="text-[10.5px] font-bold uppercase tracking-wider text-[#64748B]">ROLE & SKOR</p>
                <div class="flex items-center justify-between gap-2">
                    <div class="flex flex-wrap items-center gap-1.5">
                        ${role1 ? `<span class="bg-[#C5E9CD] text-[#14532D] font-semibold text-[11.5px] px-2.5 py-1 rounded-[4px]">${escapeHtml(roleFullTitle(role1.code, role1.name))}</span>` : '<span class="text-[12px] text-[#94A3B8]">Belum Pilih</span>'}
                        ${role2 ? `<span class="bg-[#D9F1DF] text-[#166534] font-medium text-[11.5px] px-2.5 py-1 rounded-[4px]">${escapeHtml(roleFullTitle(role2.code, role2.name))}</span>` : ''}
                    </div>
                    <div class="bg-[#308242] text-white rounded-[6px] px-3 py-2 text-center shrink-0">
                        <span class="text-[17px] font-bold leading-none">${score}</span><span class="text-[11px] opacity-85">/100</span>
                    </div>
                </div>
                ${isOverridden ? `
                    <div class="flex items-center justify-between gap-2 text-[11px] bg-amber-50 border border-amber-200 text-amber-800 rounded-[4px] px-2.5 py-1.5">
                        <span>Peran sudah disesuaikan manual (Override)</span>
                        ${!isLocked ? `<button type="button" data-action="practitioner-reset-role" class="font-bold underline cursor-pointer shrink-0">Reset</button>` : ''}
                    </div>
                ` : ''}
            </div>

            <!-- CHECKLIST SKILLSET + Manual Override -->
            <div class="space-y-2.5">
                <div class="flex items-center justify-between gap-2">
                    <p class="text-[10.5px] font-bold uppercase tracking-wider text-[#64748B]">CHECKLIST SKILLSET</p>
                    <label class="inline-flex items-center gap-2 border border-[#308242] rounded-[4px] px-2.5 py-1 text-[11.5px] font-semibold text-[#1E293B] ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#F3FBF5]'}">
                        <input
                            type="checkbox"
                            data-action="practitioner-toggle-override"
                            ${p.overrideEnabled ? 'checked' : ''}
                            ${isLocked ? 'disabled' : ''}
                            class="accent-[#308242] w-3.5 h-3.5"
                        />
                        <span>Manual Override</span>
                    </label>
                </div>

                ${isLocked ? `
                    <p class="text-[11px] text-[#308242] bg-[#F0FAF2] border border-[#B7E1C1] rounded-[4px] px-2.5 py-1.5">
                        Status mahasiswa ini sudah terkunci (Verified). Manual override dikunci oleh Dosen.
                    </p>
                ` : ''}

                ${p.overrideEnabled && !isLocked ? `
                    <div class="flex items-start gap-2.5 pt-0.5">
                        ${renderOverrideDropdown(1, p.overrideRole1Id, rolesList, p.openRoleDropdown)}
                        ${renderOverrideDropdown(2, p.overrideRole2Id, rolesList, p.openRoleDropdown)}
                    </div>
                ` : ''}

                <div class="space-y-2.5 pt-1">
                    ${checkedRoleGroups || '<p class="text-[12px] text-[#94A3B8] italic">Belum ada skillset yang dicentang mahasiswa.</p>'}
                </div>
            </div>

            <!-- PORTOFOLIO & BUKTI -->
            <div class="space-y-2">
                <p class="text-[10.5px] font-bold uppercase tracking-wider text-[#64748B]">PORTOFOLIO & BUKTI</p>
                <div class="space-y-1.5">
                    ${portfolioHtml}
                </div>
            </div>

            <!-- Catatan Evaluasi -->
            <div class="space-y-1">
                <label for="practitioner-note-input" class="block text-[10.5px] font-bold uppercase tracking-wider text-[#64748B]">
                    CATATAN EVALUASI
                </label>
                <textarea
                    id="practitioner-note-input"
                    rows="2"
                    data-input="practitioner-note"
                    placeholder="Tambahkan catatan rekomendasi / hasil tinjauan portofolio..."
                    class="w-full px-3 py-2 text-[16px] sm:text-[12.5px] border border-[#B7E1C1] focus:border-[#308242] rounded-[4px] text-[#1E293B] focus:outline-none resize-none"
                >${escapeHtml(p.noteDraft || '')}</textarea>
            </div>

            <button
                type="button"
                data-action="practitioner-save-detail"
                ${p.saving ? 'disabled' : ''}
                class="w-full min-h-[42px] bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[13px] rounded-[4px] shadow-xs transition cursor-pointer disabled:opacity-60"
            >
                ${p.saving ? 'Menyimpan...' : (p.overrideEnabled && !isLocked ? 'Simpan Override & Verifikasi' : 'Verifikasi Profil')}
            </button>
        </div>
    `;
}

export function renderPractitionerView(state) {
    const p = state.practitioner;

    if (state.activeTab === 'practitioner-complaints') {
        return renderGreenComplaintsList(p.complaints, p.loading && !p.loaded, 'practitioner-open-complaint');
    }
    if (state.activeTab === 'practitioner-complaint-detail') {
        return renderGreenComplaintDetail(p.detailComplaint, p.detailComplaintLoading, {
            backAction: 'practitioner-back-complaints',
            reviewAction: 'practitioner-review-complaint',
            reviewingId: p.reviewingId,
        });
    }
    if (state.activeTab === 'practitioner-project') {
        return renderGreenProjectFormCard(p.teams, p.projectForm, p.projectSubmitting, 'practitioner');
    }

    if (p.loading && !p.loaded) {
        return `
            <div class="w-full max-w-[820px] mx-auto py-14 flex flex-col items-center justify-center gap-3">
                <div class="w-9 h-9 rounded-full border-4 border-[#C5E9CD] border-t-[#308242] animate-spin"></div>
                <p class="text-[13px] font-medium text-[#486284]">Memuat Daftar Mahasiswa & Skillset...</p>
            </div>
        `;
    }

    const meta = p.meta || { current_page: 1, last_page: 1, per_page: 6, total: 0 };
    const rows = Array.isArray(p.students) ? p.students : [];
    const total = Number(meta.total || rows.length);
    const perPage = Number(meta.per_page || 6);
    const currentPage = Number(meta.current_page || 1);
    const lastPage = Math.max(1, Number(meta.last_page || 1));
    const fromNum = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const toNum = total === 0 ? 0 : Math.min(total, fromNum + rows.length - 1);
    const hasDetail = Boolean(p.selectedUserId);

    const shortRoleName = (roleObj) => {
        if (!roleObj) return '-';
        const code = normalizeRoleCode(roleObj.code || roleObj.name);
        if (code === 'UIUX') return 'UI/UX Designer';
        if (code === 'FE') return 'Frontend Dev';
        if (code === 'BE') return 'Backend Dev';
        if (code === 'PM') return 'Project Manager';
        return roleFullTitle(roleObj.code, roleObj.name);
    };

    const desktopRows = rows.length > 0
        ? rows.map((row) => {
            const isSelected = Number(p.selectedUserId) === Number(row.user_id);
            const score = Math.round(Number(row.recommended_score ?? row.score_role_1 ?? 0));
            const role1Label = row.final_role ? shortRoleName(row.final_role) : (row.role_1 ? shortRoleName(row.role_1) : '-');
            const role2Label = row.role_2 ? shortRoleName(row.role_2) : '-';
            const statusHtml = row.is_locked
                ? '<span class="text-[#308242] font-semibold text-[11.5px]">Verified</span>'
                : row.is_overridden
                    ? '<span class="text-amber-700 font-semibold text-[11.5px]">Override</span>'
                    : '<span class="text-[#DC2626] font-semibold text-[11.5px]">Pending</span>';

            return `
                <tr class="${isSelected ? 'bg-[#EBF7EE]' : 'bg-white hover:bg-[#F7FCF8]'} border-b border-[#E5F2E9] last:border-b-0 transition">
                    <td class="py-2.5 px-2.5 font-mono text-[11px] text-[#334155] whitespace-nowrap">${escapeHtml(row.nim || '-')}</td>
                    <td class="py-2.5 px-2.5 text-[12px] font-semibold text-[#1E293B]">${escapeHtml(row.name || row.email || '-')}</td>
                    <td class="py-2.5 px-2 text-[11px] text-[#475569]">${escapeHtml(role1Label)}</td>
                    <td class="py-2.5 px-2 text-[11px] text-[#475569]">${escapeHtml(role2Label)}</td>
                    <td class="py-2.5 px-2 font-mono text-[11.5px] whitespace-nowrap"><span class="font-bold text-[#308242]">${score}</span><span class="text-[#64748B]">/100</span></td>
                    <td class="py-2.5 px-2">${statusHtml}</td>
                    <td class="py-2 px-2.5 whitespace-nowrap">
                        <button
                            type="button"
                            data-action="practitioner-open-detail"
                            data-user-id="${row.user_id}"
                            class="inline-flex items-center gap-1 px-2 py-1 rounded-[4px] border border-[#308242] bg-white hover:bg-[#EAF7ED] text-[#1E293B] text-[11.5px] font-medium transition cursor-pointer"
                        >
                            ${uiIcons.fileText('w-3.5 h-3.5 text-[#308242]')}
                            <span>Detail</span>
                        </button>
                    </td>
                </tr>
            `;
        }).join('')
        : `
            <tr>
                <td colspan="7" class="py-10 px-4 text-center text-[13px] text-[#64748B]">
                    Tidak ada mahasiswa yang cocok dengan pencarian Anda.
                </td>
            </tr>
        `;

    const mobileCards = rows.length > 0
        ? rows.map((row) => {
            const score = Math.round(Number(row.recommended_score ?? row.score_role_1 ?? 0));
            const role1Label = row.final_role ? roleFullTitle(row.final_role.code, row.final_role.name) : (row.role_1 ? roleFullTitle(row.role_1.code, row.role_1.name) : '-');
            return `
                <div class="border border-[#B7E1C1] bg-white rounded-[6px] p-3.5 space-y-2.5">
                    <div class="flex items-start justify-between gap-2">
                        <div class="min-w-0">
                            <p class="font-semibold text-[13.5px] text-[#1E293B]">${escapeHtml(row.name || row.email || '-')}</p>
                            <p class="font-mono text-[11px] text-[#64748B]">${escapeHtml(row.nim || '-')}</p>
                        </div>
                        <span class="font-mono text-[12px] font-bold text-[#308242] bg-[#E6F5EA] px-2 py-0.5 rounded-[4px] shrink-0">${score}/100</span>
                    </div>
                    <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E5F2E9]">
                        <div class="text-[11.5px] text-[#475569]">
                            <span>${escapeHtml(role1Label)}</span>
                            <span class="mx-1.5">•</span>
                            <span class="${row.is_locked ? 'text-[#308242] font-semibold' : 'text-[#DC2626] font-semibold'}">
                                ${row.is_locked ? 'Verified' : (row.is_overridden ? 'Override' : 'Pending')}
                            </span>
                        </div>
                        <button
                            type="button"
                            data-action="practitioner-open-detail"
                            data-user-id="${row.user_id}"
                            class="min-h-[38px] inline-flex items-center gap-1.5 px-3 rounded-[4px] border border-[#308242] bg-[#F1FAF3] text-[#1E293B] text-[12px] font-semibold cursor-pointer"
                        >
                            ${uiIcons.fileText('w-3.5 h-3.5 text-[#308242]')}
                            <span>Detail</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('')
        : '<p class="text-[13px] text-center text-[#64748B] py-6">Tidak ada data mahasiswa.</p>';

    const pageNumbers = Array.from({ length: lastPage }, (_, i) => i + 1)
        .slice(Math.max(0, currentPage - 2), Math.max(3, currentPage + 1))
        .map((pg) => `
            <button
                type="button"
                data-action="practitioner-page"
                data-page="${pg}"
                class="w-7 h-7 rounded-[4px] text-[11.5px] font-bold flex items-center justify-center transition cursor-pointer ${pg === currentPage ? 'bg-[#308242] text-white' : 'border border-[#CBD5E1] text-[#475569] hover:border-[#308242]'}"
            >
                ${pg}
            </button>
        `).join('');

    const containerMax = hasDetail ? 'max-w-[1220px]' : 'max-w-[820px]';

    return `
        <div class="w-full ${containerMax} mx-auto relative z-10 ${hasDetail ? 'grid grid-cols-1 lg:grid-cols-[1fr_325px] xl:grid-cols-[1fr_340px] gap-4 items-start' : 'space-y-5'}">
            <div class="space-y-5 min-w-0">
                <div class="bg-white border-[1.5px] border-[#308242] rounded-[4px] py-4 px-5 text-center shadow-[0_2px_10px_rgba(48,130,66,0.05)]">
                    <h1 class="text-[24px] sm:text-[30px] font-bold text-[#486284] tracking-tight">
                        Selamat Datang
                    </h1>
                </div>

                ${p.error ? `
                    <div class="bg-red-50 border border-red-200 text-red-700 rounded-[4px] px-4 py-3 text-[13px] flex items-center justify-between gap-2">
                        <span>${escapeHtml(p.error)}</span>
                        <button type="button" data-action="retry-tab" class="font-semibold underline cursor-pointer">Coba Lagi</button>
                    </div>
                ` : ''}

                <div class="bg-white border-[1.5px] border-[#308242] rounded-[4px] p-4 sm:p-5 shadow-[0_3px_14px_rgba(48,130,66,0.06)] space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <h2 class="text-[15px] sm:text-[16px] font-bold text-[#1E293B]">Daftar Mahasiswa & Skillset</h2>
                        <span class="text-[11.5px] font-semibold text-[#308242]">Total: ${total} Mahasiswa</span>
                    </div>

                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                        <div class="relative flex-1">
                            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                                ${uiIcons.search('w-4 h-4 text-[#64748B]')}
                            </span>
                            <input
                                type="search"
                                data-input="practitioner-search"
                                value="${escapeHtml(p.search || '')}"
                                placeholder="Cari NIM / Nama..."
                                class="w-full min-h-[38px] pl-9 pr-3 border border-[#8DD99D] focus:border-[#308242] rounded-[4px] text-[16px] sm:text-[13px] text-[#1E293B] focus:outline-none"
                            />
                        </div>
                        <button
                            type="button"
                            data-action="practitioner-export"
                            class="min-h-[38px] px-3.5 inline-flex items-center justify-center gap-2 border border-[#308242] bg-white hover:bg-[#F1FAF3] text-[#1E293B] text-[12.5px] font-semibold rounded-[4px] transition cursor-pointer shrink-0"
                        >
                            ${uiIcons.downloadTray('w-4 h-4 text-[#308242]')}
                            <span>Export Data</span>
                        </button>
                    </div>

                    <!-- Desktop Table -->
                    <div class="hidden md:block border border-[#8DD99D] rounded-[4px] overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-[#8DD99D] text-[#143D20] text-[11px] font-bold">
                                <tr>
                                    <th class="py-2.5 px-2.5">NIM</th>
                                    <th class="py-2.5 px-2.5">Nama Mahasiswa</th>
                                    <th class="py-2.5 px-2">Role Utama</th>
                                    <th class="py-2.5 px-2">Role Sekunder</th>
                                    <th class="py-2.5 px-2">Score</th>
                                    <th class="py-2.5 px-2">Status</th>
                                    <th class="py-2.5 px-2.5">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${desktopRows}
                            </tbody>
                        </table>
                    </div>

                    <!-- Mobile Cards -->
                    <div class="md:hidden space-y-2.5">
                        ${mobileCards}
                    </div>

                    <!-- Pagination Footer -->
                    <div class="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11.5px] text-[#64748B]">
                        <span>Showing ${fromNum}-${toNum} of ${total}</span>
                        <div class="flex items-center gap-1">
                            <button
                                type="button"
                                data-action="practitioner-page"
                                data-page="${Math.max(1, currentPage - 1)}"
                                ${currentPage <= 1 ? 'disabled' : ''}
                                class="w-7 h-7 rounded-[4px] border border-[#CBD5E1] flex items-center justify-center cursor-pointer disabled:opacity-40"
                            >
                                ${uiIcons.chevronLeft('w-3.5 h-3.5')}
                            </button>
                            ${pageNumbers}
                            <button
                                type="button"
                                data-action="practitioner-page"
                                data-page="${Math.min(lastPage, currentPage + 1)}"
                                ${currentPage >= lastPage ? 'disabled' : ''}
                                class="w-7 h-7 rounded-[4px] border border-[#CBD5E1] flex items-center justify-center cursor-pointer disabled:opacity-40"
                            >
                                ${uiIcons.chevronRight('w-3.5 h-3.5')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            ${hasDetail ? `
                <!-- Desktop Sticky Side Panel -->
                <div class="hidden lg:block bg-white border-[1.5px] border-[#308242] rounded-[4px] p-4 shadow-[0_6px_24px_rgba(48,130,66,0.1)] animate-modal-in">
                    ${renderStudentDetailDrawerContent(p)}
                </div>
            ` : ''}
        </div>

        ${hasDetail ? `
            <!-- Mobile Overlay Sheet outside z-10 parent so z-50 cleanly covers header and bottom dock -->
            <div class="lg:hidden fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4" data-action="practitioner-backdrop-close">
                <div class="w-full sm:max-w-[440px] max-h-[88dvh] overflow-y-auto bg-white border-t-[2px] sm:border-[2px] border-[#308242] rounded-t-[14px] sm:rounded-[10px] p-4 pb-6 shadow-2xl animate-modal-in" data-drawer-dialog="true">
                    ${renderStudentDetailDrawerContent(p)}
                </div>
            </div>
        ` : ''}
    `;
}
