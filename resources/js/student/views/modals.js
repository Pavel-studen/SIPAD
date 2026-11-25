import { roleIcon, uiIcons } from '../icons.js';
import {
    escapeHtml,
    formatIsoToIndoDate,
    formatShortRangeHeader,
    INDONESIAN_MONTHS,
    normalizeRoleCode,
    parseComplaintText,
    roleDisplayTag,
    roleModalSectionTitle,
} from '../utils.js';

function renderConfirmProfileModal() {
    return `
        <div
            data-modal-dialog="true"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-confirm-profile-title"
            class="w-full max-w-[490px] bg-white border-[2.5px] border-[#0773DF] rounded-[12px] shadow-[0_14px_38px_rgba(7,115,223,0.22)] p-6 sm:px-9 sm:py-8 text-center space-y-5 animate-modal-in"
        >
            <div class="space-y-2">
                <h2 id="modal-confirm-profile-title" class="text-[20px] sm:text-[23px] font-bold text-[#181C1F]">
                    Simpan Profile?
                </h2>
                <p class="text-[13.5px] sm:text-[15px] text-[#486284]">
                    Kamu yakin nih mau simpan profile PAD kamu?
                </p>
            </div>

            <div class="flex items-center justify-center gap-4 sm:gap-8 pt-1">
                <button
                    type="button"
                    data-action="close-modal"
                    class="flex-1 sm:flex-none sm:min-w-[140px] min-h-[42px] px-4 border-[1.5px] border-[#83B9EF] hover:border-[#0773DF] hover:bg-[#F5FAFF] text-[#486284] font-medium text-[13.5px] sm:text-[14px] rounded-[4px] transition cursor-pointer"
                >
                    Ga, Besok aja
                </button>
                <button
                    type="button"
                    data-action="confirm-save-profile"
                    class="flex-1 sm:flex-none sm:min-w-[140px] min-h-[42px] px-4 bg-[#0773DF] hover:bg-[#0561BF] text-white font-semibold text-[13.5px] sm:text-[14px] rounded-[4px] transition shadow-xs cursor-pointer"
                >
                    Yes, Simpan
                </button>
            </div>
        </div>
    `;
}

function renderAlertModal(modal) {
    const details = Array.isArray(modal.details) && modal.details.length > 0
        ? `
            <ul class="text-left bg-[#F4F9FF] border border-[#83B9EF] rounded-[6px] px-3.5 py-2.5 text-[12px] text-[#486284] space-y-1">
                ${modal.details.map((d) => `<li>• ${escapeHtml(d)}</li>`).join('')}
            </ul>
        `
        : '';

    return `
        <div
            data-modal-dialog="true"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-alert-title"
            class="w-full max-w-[490px] bg-white border-[2.5px] border-[#0773DF] rounded-[12px] shadow-[0_14px_38px_rgba(7,115,223,0.22)] p-6 sm:px-9 sm:py-8 text-center space-y-4 animate-modal-in"
        >
            <div class="flex justify-center">
                ${uiIcons.exclamationCircle('w-12 h-12 sm:w-14 sm:h-14 text-[#0773DF]')}
            </div>

            <div class="space-y-1.5">
                <h2 id="modal-alert-title" class="text-[19px] sm:text-[22px] font-bold text-[#486284]">
                    ${escapeHtml(modal.title || 'Perhatian')}
                </h2>
                <p class="text-[13.5px] sm:text-[15px] text-[#5F7693]">
                    ${escapeHtml(modal.subtitle || '')}
                </p>
            </div>

            ${details}

            <div class="pt-1">
                <button
                    type="button"
                    data-action="close-modal"
                    ${modal.onCloseTab ? `data-next-tab="${escapeHtml(modal.onCloseTab)}"` : ''}
                    class="min-w-[130px] min-h-[42px] px-6 bg-[#0773DF] hover:bg-[#0561BF] text-white font-semibold text-[13.5px] sm:text-[14px] rounded-[4px] transition shadow-xs cursor-pointer"
                >
                    ${escapeHtml(modal.buttonLabel || 'Siyapp')}
                </button>
            </div>
        </div>
    `;
}

function renderRoleCongratsModal(modal) {
    return `
        <div
            data-modal-dialog="true"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-role-congrats-title"
            class="w-full max-w-[490px] bg-white border-[2.5px] border-[#0773DF] rounded-[12px] shadow-[0_14px_38px_rgba(7,115,223,0.22)] p-6 sm:px-9 sm:py-8 text-center space-y-4 animate-modal-in"
        >
            <div class="flex justify-center">
                ${uiIcons.exclamationCircle('w-12 h-12 sm:w-14 sm:h-14 text-[#0773DF]')}
            </div>

            <div class="space-y-1.5">
                <h2 id="modal-role-congrats-title" class="text-[18px] sm:text-[21px] font-bold text-[#486284]">
                    Selamat! Role kamu adalah <span class="text-[#0773DF]">${escapeHtml(modal.roleLabel || 'UI/UX')}</span>
                </h2>
                <p class="text-[13.5px] sm:text-[15px] text-[#5F7693]">
                    Semoga role kamu sesuai ya!
                </p>
            </div>

            <div class="pt-1">
                <button
                    type="button"
                    data-action="close-modal"
                    class="min-w-[125px] min-h-[42px] px-6 bg-[#0773DF] hover:bg-[#0561BF] text-white font-semibold text-[13.5px] rounded-[4px] transition shadow-xs cursor-pointer"
                >
                    Yay
                </button>
            </div>
        </div>
    `;
}

function renderTeamDetailModal(state) {
    const team = state.myTeam?.data?.team;
    const members = Array.isArray(team?.members) ? team.members : [];
    const roleOrder = ['PM', 'UIUX', 'FE', 'BE'];

    const groupedRows = roleOrder.map((code) => {
        const matched = members.filter((m) => normalizeRoleCode(m.final_role?.code || m.final_role?.name) === code);
        return {
            code,
            title: roleModalSectionTitle(code),
            members: matched,
        };
    });

    const otherMembers = members.filter(
        (m) => !roleOrder.includes(normalizeRoleCode(m.final_role?.code || m.final_role?.name))
    );
    if (otherMembers.length > 0) {
        groupedRows.push({
            code: 'OTHER',
            title: 'Anggota Lainnya',
            members: otherMembers,
        });
    }

    const project = team?.project;
    const supervisor = team?.supervisor;

    return `
        <div
            data-modal-dialog="true"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-team-detail-title"
            class="w-full max-w-[460px] max-h-[90dvh] bg-white border-[2.5px] border-[#0773DF] rounded-[12px] shadow-[0_14px_40px_rgba(7,115,223,0.25)] flex flex-col overflow-hidden animate-modal-in"
        >
            <!-- Modal Header -->
            <div class="px-5 py-3 border-b border-[#83B9EF] shrink-0 flex items-center justify-between">
                <h2 id="modal-team-detail-title" class="text-[18px] sm:text-[19px] font-bold text-[#486284]">
                    Detail Kelompok ${escapeHtml(team?.id ?? '')}
                </h2>
                <button
                    type="button"
                    data-action="close-modal"
                    aria-label="Tutup modal"
                    class="sm:hidden text-[#486284] hover:text-[#0773DF] text-[20px] leading-none px-1 cursor-pointer"
                >&times;</button>
            </div>

            <!-- Scrollable Content -->
            <div class="p-4 sm:p-5 overflow-y-auto sipad-scroll space-y-2.5 flex-1">
                ${groupedRows.map((section) => `
                    <div class="space-y-1">
                        <h3 class="text-[12.5px] font-bold text-[#486284]">${escapeHtml(section.title)}</h3>
                        ${section.members.length === 0 ? `
                            <div class="border border-[#83B9EF] bg-[#F4F8FD] rounded-[4px] px-3 py-1.5 flex items-center gap-2.5 text-[12px] italic text-[#5F7693]">
                                ${roleIcon(section.code, 'w-4 h-4 text-[#83B9EF] shrink-0')}
                                <span>Belum ada anggota</span>
                            </div>
                        ` : section.members.map((member) => {
                            const isSelf = Number(member.user_id) === Number(state.user?.id);
                            return `
                                <div class="border border-[#83B9EF] bg-[#C0DDF9] rounded-[4px] px-3 py-1.5 flex items-center justify-between gap-2">
                                    <span class="flex items-center gap-2.5 min-w-0">
                                        ${roleIcon(section.code, 'w-4 h-4 text-[#0773DF] shrink-0')}
                                        <span class="text-[12px] font-medium text-[#181C1F] truncate">
                                            ${escapeHtml(member.name || member.email || 'Mahasiswa')}
                                        </span>
                                    </span>
                                    ${isSelf ? '<span class="text-[10px] font-semibold text-[#045DDA] bg-white/80 px-1.5 py-0.5 rounded shrink-0">Kamu</span>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                `).join('')}

                <hr class="border-t-2 border-[#0773DF] my-1.5" />

                <!-- Project Section -->
                <div class="space-y-1.5">
                    <h3 class="text-[12.5px] font-bold text-[#486284]">Project</h3>
                    <div class="border border-[#83B9EF] rounded-[5px] overflow-hidden bg-white">
                        <div class="bg-[#C0DDF9] border-b border-[#83B9EF] px-3 py-2.5 flex items-center gap-2.5">
                            ${uiIcons.projectTree('w-4 h-4 text-[#0773DF] shrink-0')}
                            <span class="text-[12px] font-semibold text-[#181C1F] leading-snug">
                                ${escapeHtml(project?.name || 'Proyek PAD Belum Ditentukan')}
                            </span>
                        </div>

                        <div class="p-3 space-y-2">
                            <div class="grid grid-cols-[112px_1fr] gap-2 items-stretch">
                                <div class="bg-[#C0DDF9] border border-[#83B9EF]/60 rounded-[3px] px-2.5 py-1.5 flex items-center justify-center text-center text-[11.5px] font-semibold text-[#486284]">
                                    Mitra
                                </div>
                                <div class="border border-[#83B9EF] rounded-[3px] px-2.5 py-1.5 flex items-center text-[11.5px] text-[#30373E]">
                                    ${escapeHtml(project?.associate || 'Internal / Program Studi')}
                                </div>
                            </div>

                            <div class="grid grid-cols-[112px_1fr] gap-2 items-stretch">
                                <div class="bg-[#C0DDF9] border border-[#83B9EF]/60 rounded-[3px] px-2.5 py-1.5 flex items-center justify-center text-center text-[11.5px] font-semibold text-[#486284]">
                                    Project Owner
                                </div>
                                <div class="border border-[#83B9EF] rounded-[3px] px-2.5 py-1.5 flex items-center text-[11px] leading-snug text-[#30373E]">
                                    ${escapeHtml(project?.owner_display_name || project?.owner?.name || '-')}
                                </div>
                            </div>

                            ${supervisor ? `
                                <div class="grid grid-cols-[112px_1fr] gap-2 items-stretch">
                                    <div class="bg-[#C0DDF9] border border-[#83B9EF]/60 rounded-[3px] px-2.5 py-1.5 flex items-center justify-center text-center text-[11.5px] font-semibold text-[#486284]">
                                        Pembimbing
                                    </div>
                                    <div class="border border-[#83B9EF] rounded-[3px] px-2.5 py-1.5 flex items-center text-[11px] leading-snug text-[#30373E]">
                                        ${escapeHtml(supervisor.name)}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="px-5 py-3 border-t border-[#83B9EF]/50 flex justify-end shrink-0 bg-white">
                <button
                    type="button"
                    data-action="close-modal"
                    class="bg-[#0773DF] hover:bg-[#0561BF] text-white font-semibold text-[12px] min-h-[38px] sm:min-h-[32px] px-4 rounded-[4px] inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                    ${uiIcons.check('w-3.5 h-3.5 text-white')}
                    <span>Selesai</span>
                </button>
            </div>
        </div>
    `;
}

function renderConfirmComplaintModal(state) {
    const { form } = state.complaint;
    return `
        <div
            data-modal-dialog="true"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-confirm-complaint-title"
            class="w-full max-w-[490px] bg-white border-[2.5px] border-[#0773DF] rounded-[12px] shadow-[0_14px_38px_rgba(7,115,223,0.22)] p-6 sm:px-9 sm:py-8 text-center space-y-5 animate-modal-in"
        >
            <div class="space-y-2">
                <h2 id="modal-confirm-complaint-title" class="text-[20px] sm:text-[22px] font-bold text-[#181C1F]">
                    Kirim Pengaduan?
                </h2>
                <p class="text-[13.5px] sm:text-[14.5px] text-[#486284]">
                    Pengaduan terhadap <span class="font-semibold text-[#0773DF]">${escapeHtml(form.reported_name || 'anggota tim')}</span> akan dikirim secara rahasia kepada dosen/pembimbing.
                </p>
            </div>

            <div class="flex items-center justify-center gap-4 sm:gap-8 pt-1">
                <button
                    type="button"
                    data-action="close-modal"
                    class="flex-1 sm:flex-none sm:min-w-[130px] min-h-[42px] px-4 border-[1.5px] border-[#83B9EF] hover:border-[#0773DF] text-[#486284] font-medium text-[13.5px] rounded-[4px] transition cursor-pointer"
                >
                    Batal
                </button>
                <button
                    type="button"
                    data-action="confirm-send-complaint"
                    class="flex-1 sm:flex-none sm:min-w-[130px] min-h-[42px] px-4 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[13.5px] rounded-[4px] transition shadow-xs cursor-pointer"
                >
                    Ya, Kirim
                </button>
            </div>
        </div>
    `;
}

function renderAsprakTeamDetailModal(state) {
    const team = state.asprak.teams.find((t) => Number(t.id) === Number(state.asprak.selectedTeamId));
    if (!team) return '';

    const members = Array.isArray(team.members) ? team.members : [];
    const roleOrder = ['PM', 'UIUX', 'FE', 'BE'];

    const groupedRows = roleOrder.map((code) => ({
        code,
        title: roleModalSectionTitle(code),
        members: members.filter((m) => normalizeRoleCode(m.role?.code || m.role?.name) === code),
    }));

    const teamComplaints = (state.asprak.complaints || []).filter(
        (c) => Number(c.team_id) === Number(team.id)
    );

    const resolveMemberRoleLabel = (userId) => {
        const matched = members.find((m) => Number(m.user_id) === Number(userId));
        return matched?.role ? roleDisplayTag(matched.role.code, matched.role.name) : 'Anggota';
    };

    return `
        <div
            data-modal-dialog="true"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-asprak-team-title"
            class="w-full max-w-[470px] max-h-[90dvh] bg-white border-[2.5px] border-[#0773DF] rounded-[12px] shadow-[0_14px_40px_rgba(7,115,223,0.25)] flex flex-col overflow-hidden animate-modal-in"
        >
            <!-- Header -->
            <div class="px-5 py-3 border-b border-[#83B9EF] shrink-0 flex items-center justify-between">
                <h2 id="modal-asprak-team-title" class="text-[18px] sm:text-[19px] font-bold text-[#486284]">
                    Detail Kelompok ${escapeHtml(team.id)}
                </h2>
                <button
                    type="button"
                    data-action="close-modal"
                    aria-label="Tutup modal"
                    class="sm:hidden text-[#486284] hover:text-[#0773DF] text-[20px] leading-none px-1 cursor-pointer"
                >&times;</button>
            </div>

            <!-- Scrollable Body -->
            <div class="p-4 sm:p-5 overflow-y-auto sipad-scroll space-y-2.5 flex-1">
                ${groupedRows.map((section) => `
                    <div class="space-y-1">
                        <h3 class="text-[12.5px] font-bold text-[#486284]">${escapeHtml(section.title)}</h3>
                        ${section.members.length === 0 ? `
                            <div class="border border-[#83B9EF] bg-[#F4F8FD] rounded-[4px] px-3 py-1.5 flex items-center gap-2.5 text-[12px] italic text-[#5F7693]">
                                ${roleIcon(section.code, 'w-4 h-4 text-[#83B9EF] shrink-0')}
                                <span>Belum ada anggota</span>
                            </div>
                        ` : section.members.map((member) => `
                            <div class="border border-[#83B9EF] bg-[#C0DDF9] rounded-[4px] px-3 py-1.5 flex items-center gap-2.5">
                                ${roleIcon(section.code, 'w-4 h-4 text-[#0773DF] shrink-0')}
                                <span class="text-[12px] font-medium text-[#181C1F] truncate">
                                    ${escapeHtml(member.name || member.email || 'Mahasiswa')}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}

                <hr class="border-t-2 border-[#0773DF] my-1.5" />

                <!-- Pengaduan Section matching asprak_panel_2 & asprak_panel_3 -->
                <div class="space-y-1.5">
                    <h3 class="text-[13px] font-bold text-[#486284]">Pengaduan</h3>
                    ${teamComplaints.length === 0 ? `
                        <div class="border border-[#83B9EF] bg-[#C0DDF9] rounded-[5px] min-h-[82px] p-3">
                            <p class="text-[12px] font-bold text-[#181C1F]">Tidak ada pengaduan</p>
                        </div>
                    ` : `
                        <div class="space-y-2">
                            ${teamComplaints.map((c) => {
                                const parsed = parseComplaintText(c.description);
                                const roleTag = resolveMemberRoleLabel(c.reported?.id);
                                return `
                                    <div class="border border-[#83B9EF] bg-[#C0DDF9] rounded-[5px] p-3 space-y-1.5">
                                        <div class="flex items-start justify-between gap-2">
                                            <p class="text-[11.5px] font-bold text-[#181C1F] leading-snug">
                                                ${escapeHtml(roleTag)} - ${escapeHtml(c.reported?.name || '-')} (${escapeHtml(c.reported?.nim || '-')})
                                            </p>
                                            ${c.is_reviewed ? '<span class="shrink-0 text-[10px] font-semibold bg-[#DDF3E4] text-[#308242] px-1.5 py-0.5 rounded">Ditinjau</span>' : ''}
                                        </div>
                                        <p class="text-[11.5px] text-[#181C1F] leading-snug line-clamp-2">
                                            ${escapeHtml(parsed.details)}
                                        </p>
                                        <div class="flex items-end justify-between gap-2 pt-0.5">
                                            <span class="text-[11.5px] font-bold text-[#181C1F] truncate">
                                                ${escapeHtml(parsed.reason)}
                                            </span>
                                            <button
                                                type="button"
                                                data-action="asprak-open-complaint"
                                                data-complaint-id="${c.id}"
                                                aria-label="Lihat Detail Pengaduan"
                                                class="w-8 h-8 rounded-[5px] bg-white hover:bg-[#EDF5FF] flex items-center justify-center shrink-0 shadow-2xs transition cursor-pointer"
                                            >
                                                ${uiIcons.fileText('w-4 h-4 text-[#0773DF]')}
                                            </button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `}
                </div>
            </div>

            <!-- Footer -->
            <div class="px-5 py-3 border-t border-[#83B9EF]/50 flex items-center justify-between gap-2 shrink-0 bg-white">
                <button
                    type="button"
                    data-action="asprak-go-project"
                    data-team-id="${team.id}"
                    class="border border-[#0773DF] text-[#0773DF] hover:bg-[#F0F7FF] font-semibold text-[12px] min-h-[38px] sm:min-h-[32px] px-3.5 rounded-[4px] transition cursor-pointer"
                >
                    Input Proyek
                </button>

                <button
                    type="button"
                    data-action="close-modal"
                    class="bg-[#0773DF] hover:bg-[#0561BF] text-white font-semibold text-[12px] min-h-[38px] sm:min-h-[32px] px-4 rounded-[4px] inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                    ${uiIcons.check('w-3.5 h-3.5 text-white')}
                    <span>Selesai</span>
                </button>
            </div>
        </div>
    `;
}

function renderDevSwitcherModal(state) {
    const { users, loading, seeding, notice, error } = state.dev;
    const demoUsers = (users || []).filter((u) => ['student', 'assistant', 'practitioner', 'lecturer', 'admin'].includes(u.user_role));

    const presets = [
        { email: 'master.admin@mail.ugm.ac.id', role: 'admin', label: 'Master Admin (UI_MASTER_ADMIN)', tag: 'Master Admin' },
        { email: 'dosen.pengampu@mail.ugm.ac.id', role: 'lecturer', label: 'Admin Dosen (UI_DOSEN)', tag: 'Dosen' },
        { email: 'praktisi.industri@mail.ugm.ac.id', role: 'practitioner', label: 'Praktisi Industri (UI_ASISTEN_PRAKTIKUM_MANAGE)', tag: 'Praktisi' },
        { email: 'asisten.lab@mail.ugm.ac.id', role: 'assistant', label: 'Asisten Praktikum (Asprak)', tag: 'Asprak' },
        { email: 'mhs.uiux1@mail.ugm.ac.id', role: 'student', label: 'Dashboard Mahasiswa (Tim UI/UX)', tag: 'Tim PAD' },
        { email: 'mhs.baru@mail.ugm.ac.id', role: 'student', label: 'Mahasiswa Baru (Belum Ada Tim)', tag: 'Fresh' },
        { email: 'mhs.bypass@mail.ugm.ac.id', role: 'student', label: 'Mahasiswa Bypass (GEMASTIK)', tag: 'Bypass' },
    ];

    return `
        <div
            data-modal-dialog="true"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-dev-switcher-title"
            class="w-full max-w-[480px] max-h-[90dvh] bg-white border-[2.5px] border-[#0773DF] rounded-[12px] shadow-[0_14px_38px_rgba(7,115,223,0.22)] flex flex-col overflow-hidden animate-modal-in"
        >
            <div class="px-5 py-3.5 border-b border-[#83B9EF] flex items-center justify-between">
                <h2 id="modal-dev-switcher-title" class="text-[17px] font-bold text-[#486284]">
                    Ganti Akun Uji Lokal
                </h2>
                <button type="button" data-action="close-modal" class="text-[#486284] hover:text-[#0773DF] text-[22px] leading-none px-1 cursor-pointer">&times;</button>
            </div>

            <div class="p-5 overflow-y-auto sipad-scroll space-y-4">
                ${error ? `<div class="border border-red-300 bg-red-50 text-red-700 text-[12px] rounded px-3 py-2">${escapeHtml(error)}</div>` : ''}
                ${notice ? `<div class="border border-[#83B9EF] bg-[#F0F7FF] text-[#045DDA] text-[12px] rounded px-3 py-2">${escapeHtml(notice)}</div>` : ''}

                <div class="flex items-center justify-between gap-2">
                    <span class="text-[12px] text-[#5F7693]">Reset / isi dataset simulasi lokal:</span>
                    <button
                        type="button"
                        data-action="dev-seed"
                        ${seeding ? 'disabled' : ''}
                        class="px-3 py-1.5 rounded-[5px] bg-[#308242] hover:bg-[#256834] text-white text-[12px] font-semibold cursor-pointer"
                    >
                        ${seeding ? 'Memproses...' : 'Seed Data Simulasi'}
                    </button>
                </div>

                <div class="space-y-2">
                    ${presets.map((p) => `
                        <button
                            type="button"
                            data-action="dev-login"
                            data-email="${escapeHtml(p.email)}"
                            data-role="${escapeHtml(p.role)}"
                            ${loading ? 'disabled' : ''}
                            class="w-full text-left border border-[#83B9EF] hover:border-[#0773DF] hover:bg-[#F4F9FF] rounded-[6px] px-3.5 py-2.5 flex items-center justify-between gap-2 transition cursor-pointer"
                        >
                            <span class="text-[12.5px] font-semibold text-[#486284] truncate">${escapeHtml(p.label)}</span>
                            <span class="text-[11px] font-mono font-semibold bg-[#C0DDF9] text-[#045DDA] px-2 py-0.5 rounded">${escapeHtml(p.tag)}</span>
                        </button>
                    `).join('')}
                </div>

                ${demoUsers.length > 0 ? `
                    <div class="pt-2 border-t border-[#83B9EF]/60 space-y-1.5">
                        <label class="block text-[11.5px] font-semibold text-[#486284]">Semua Akun Lokal:</label>
                        <div class="flex gap-2">
                            <select
                                id="dev-user-select"
                                class="flex-1 min-h-[40px] border border-[#83B9EF] rounded-[5px] px-3 text-[12px] text-[#181C1F] bg-white focus:outline-none focus:border-[#0773DF]"
                            >
                                ${demoUsers.map((u) => `
                                    <option value="${escapeHtml(u.email)}|${escapeHtml(u.user_role)}" ${u.email === state.user?.email ? 'selected' : ''}>
                                        ${escapeHtml(u.name || u.email)} (${escapeHtml(u.user_role)})
                                    </option>
                                `).join('')}
                            </select>
                            <button
                                type="button"
                                data-action="dev-login-selected"
                                ${loading ? 'disabled' : ''}
                                class="min-h-[40px] px-4 rounded-[5px] bg-[#0773DF] hover:bg-[#0561BF] text-white text-[12px] font-semibold cursor-pointer"
                            >
                                Pakai
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function renderMasterAdminAddModal(state) {
    const m = state.masterAdmin;
    return `
        <div
            data-modal-dialog="true"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-madmin-add-title"
            class="w-full max-w-[460px] bg-white border-[2.5px] border-[#308242] rounded-[12px] shadow-[0_14px_38px_rgba(48,130,66,0.22)] p-6 sm:px-8 sm:py-7 space-y-5 animate-modal-in"
        >
            <div class="flex items-center justify-between gap-2">
                <h2 id="modal-madmin-add-title" class="text-[20px] sm:text-[22px] font-bold text-[#1E293B]">
                    Input Data
                </h2>
                <button type="button" data-action="close-modal" class="text-[#64748B] hover:text-[#308242] text-[22px] leading-none px-1 cursor-pointer">&times;</button>
            </div>

            <div class="space-y-3">
                <div>
                    <label for="madmin-name-input" class="sr-only">Nama Dosen</label>
                    <input
                        id="madmin-name-input"
                        type="text"
                        data-input="madmin-name"
                        value="${escapeHtml(m.form.name || '')}"
                        placeholder="Nama Dosen"
                        class="w-full min-h-[42px] px-3.5 border-[1.5px] border-[#8DD99D] focus:border-[#308242] rounded-[5px] text-[16px] sm:text-[13.5px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none"
                    />
                </div>
                <div>
                    <label for="madmin-email-input" class="sr-only">Email Dosen</label>
                    <input
                        id="madmin-email-input"
                        type="email"
                        data-input="madmin-email"
                        value="${escapeHtml(m.form.email || '')}"
                        placeholder="Email Dosen (contoh: dosen@mail.ugm.ac.id)"
                        class="w-full min-h-[42px] px-3.5 border-[1.5px] border-[#8DD99D] focus:border-[#308242] rounded-[5px] text-[16px] sm:text-[13.5px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none"
                    />
                </div>
                <div>
                    <label for="madmin-nip-input" class="sr-only">NIP Dosen</label>
                    <input
                        id="madmin-nip-input"
                        type="text"
                        data-input="madmin-nip"
                        value="${escapeHtml(m.form.nip || '')}"
                        placeholder="NIP Dosen"
                        class="w-full min-h-[42px] px-3.5 border-[1.5px] border-[#8DD99D] focus:border-[#308242] rounded-[5px] text-[16px] sm:text-[13.5px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none"
                    />
                </div>
            </div>

            <div class="flex justify-end pt-1">
                <button
                    type="button"
                    data-action="madmin-submit-add"
                    ${m.submitting ? 'disabled' : ''}
                    class="inline-flex items-center justify-center gap-2 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[13.5px] px-5 min-h-[40px] rounded-[5px] shadow-xs transition cursor-pointer disabled:opacity-60"
                >
                    ${uiIcons.check('w-4 h-4 text-white')}
                    <span>${m.submitting ? 'Menyimpan...' : 'Terima'}</span>
                </button>
            </div>
        </div>
    `;
}

function renderMasterAdminRevokeModal(modal, state) {
    const busy = Boolean(state.masterAdmin.deletingId);
    return `
        <div
            data-modal-dialog="true"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-madmin-revoke-title"
            class="w-full max-w-[490px] bg-white border-[2.5px] border-[#308242] rounded-[12px] shadow-[0_14px_38px_rgba(48,130,66,0.22)] p-6 sm:px-9 sm:py-8 text-center space-y-5 animate-modal-in"
        >
            <div class="space-y-2">
                <h2 id="modal-madmin-revoke-title" class="text-[20px] sm:text-[23px] font-bold text-[#181C1F]">
                    Cabut Hak Akses?
                </h2>
                <p class="text-[13.5px] sm:text-[15px] text-[#486284]">
                    Apakah anda yakin untuk menghilangkan hak akses admin${modal.userName ? ` (${escapeHtml(modal.userName)})` : ''}?
                </p>
            </div>

            <div class="flex items-center justify-center gap-4 sm:gap-8 pt-1">
                <button
                    type="button"
                    data-action="close-modal"
                    class="flex-1 sm:flex-none sm:min-w-[140px] min-h-[42px] px-4 border-[1.5px] border-[#8DD99D] hover:border-[#308242] hover:bg-[#F3FBF5] text-[#486284] font-medium text-[13.5px] rounded-[5px] transition cursor-pointer"
                >
                    Tidak
                </button>
                <button
                    type="button"
                    data-action="madmin-confirm-delete"
                    data-user-id="${modal.userId}"
                    ${busy ? 'disabled' : ''}
                    class="flex-1 sm:flex-none sm:min-w-[140px] min-h-[42px] px-4 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[13.5px] rounded-[5px] transition shadow-xs cursor-pointer disabled:opacity-60"
                >
                    ${busy ? 'Memproses...' : 'Iya'}
                </button>
            </div>
        </div>
    `;
}

function renderGreenAlertModal(modal) {
    const details = Array.isArray(modal.details) && modal.details.length > 0
        ? `
            <ul class="text-left bg-[#F0FAF2] border border-[#8DD99D] rounded-[6px] px-3.5 py-2.5 text-[12px] text-[#486284] space-y-1">
                ${modal.details.map((d) => `<li>• ${escapeHtml(d)}</li>`).join('')}
            </ul>
        `
        : '';

    return `
        <div
            data-modal-dialog="true"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-green-alert-title"
            class="w-full max-w-[490px] bg-white border-[2.5px] border-[#308242] rounded-[12px] shadow-[0_14px_38px_rgba(48,130,66,0.22)] p-6 sm:px-9 sm:py-8 text-center space-y-4 animate-modal-in"
        >
            <div class="flex justify-center">
                ${uiIcons.exclamationCircle('w-12 h-12 sm:w-14 sm:h-14 text-[#308242]')}
            </div>

            <div class="space-y-1.5">
                <h2 id="modal-green-alert-title" class="text-[19px] sm:text-[22px] font-bold text-[#486284]">
                    ${escapeHtml(modal.title || 'Perhatian')}
                </h2>
                <p class="text-[13.5px] sm:text-[15px] text-[#5F7693]">
                    ${escapeHtml(modal.subtitle || '')}
                </p>
            </div>

            ${details}

            <div class="pt-1">
                <button
                    type="button"
                    data-action="close-modal"
                    ${modal.reopenModal ? `data-reopen-modal="${escapeHtml(modal.reopenModal)}"` : ''}
                    class="min-w-[130px] min-h-[42px] px-6 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[13.5px] sm:text-[14px] rounded-[5px] transition shadow-xs cursor-pointer"
                >
                    ${escapeHtml(modal.buttonLabel || 'Oke')}
                </button>
            </div>
        </div>
    `;
}

function renderDosenConfirmModal(kind, busy) {
    const isAutoGroup = kind === 'autogroup';
    const title = isAutoGroup ? 'Konfirmasi Pengacakan Tim' : 'Konfirmasi Kunci Tim';
    const subtitle = isAutoGroup
        ? 'Apakah Anda yakin ingin melakukan pengacakan tim?'
        : 'Apakah Anda yakin ingin mengunci tim di atas?';
    const confirmAction = isAutoGroup ? 'dosen-confirm-autogroup' : 'dosen-confirm-bypass';
    const iconHtml = isAutoGroup
        ? uiIcons.dice('w-7 h-7 text-[#308242]')
        : uiIcons.lockClosed('w-7 h-7 text-[#308242]');

    return `
        <div
            data-modal-dialog="true"
            role="dialog"
            aria-modal="true"
            class="w-full max-w-[460px] bg-white border-[2.5px] border-[#308242] rounded-[12px] shadow-[0_14px_38px_rgba(48,130,66,0.22)] p-6 sm:px-8 sm:py-7 text-center space-y-4 animate-modal-in"
        >
            <div class="mx-auto w-14 h-14 rounded-full bg-[#C5E9CD] flex items-center justify-center">
                ${iconHtml}
            </div>
            <div class="space-y-1.5">
                <h2 class="text-[19px] sm:text-[21px] font-bold text-[#486284]">${title}</h2>
                <p class="text-[13.5px] text-[#5F7693]">${subtitle}</p>
            </div>
            <div class="flex items-center justify-center gap-4 pt-1">
                <button
                    type="button"
                    data-action="close-modal"
                    class="min-w-[100px] min-h-[40px] px-4 border border-[#8DD99D] hover:border-[#308242] text-[#486284] font-semibold text-[13px] rounded-[5px] transition cursor-pointer"
                >
                    Tidak
                </button>
                <button
                    type="button"
                    data-action="${confirmAction}"
                    ${busy ? 'disabled' : ''}
                    class="min-w-[100px] min-h-[40px] px-5 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[13px] rounded-[5px] transition cursor-pointer disabled:opacity-60"
                >
                    ${busy ? 'Proses...' : 'Iya'}
                </button>
            </div>
        </div>
    `;
}

function renderDosenCalendarModal(state) {
    const cm = state.dosen.calendarModal;
    if (!cm) return '';

    const year = Number(cm.viewYear);
    const month = Number(cm.viewMonth); // 0-indexed
    const isRange = cm.kind === 'registration';
    const hasExisting = Boolean(cm.initialHadValue);
    const title = hasExisting ? 'Ubah Jadwal' : 'Tambah Jadwal';
    const subtitle = isRange
        ? (cm.startIso
            ? `Rentang jadwal: ${formatShortRangeHeader(cm.startIso, cm.endIso)}`
            : 'Pilih tanggal mulai dan tanggal selesai pada kalender.')
        : (cm.startIso
            ? `Tanggal rilis: ${formatIsoToIndoDate(cm.startIso)}`
            : 'Pilih tanggal rilis tim PAD pada kalender.');

    const firstDayOfMonth = new Date(year, month, 1);
    const jsDay = firstDayOfMonth.getDay(); // 0=Sun..6=Sat
    const mondayOffset = jsDay === 0 ? 6 : jsDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const toIso = (y, mZero, d) =>
        `${y}-${String(mZero + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    const cells = [];
    for (let i = 0; i < mondayOffset; i++) {
        cells.push('<div></div>');
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const iso = toIso(year, month, day);
        const isStart = cm.startIso === iso;
        const isEnd = isRange && cm.endIso === iso;
        const inBetween = isRange && cm.startIso && cm.endIso && iso > cm.startIso && iso < cm.endIso;

        let cls = 'border border-[#72C384] bg-white text-[#1E293B] hover:bg-[#E6F5EA]';
        if (isStart || isEnd) {
            cls = 'border border-[#308242] bg-[#308242] text-white font-bold';
        } else if (inBetween) {
            cls = 'border border-[#8DD99D] bg-[#C5E9CD] text-[#14532D] font-semibold';
        }

        cells.push(`
            <button
                type="button"
                data-action="dosen-calendar-pick-day"
                data-iso="${iso}"
                class="h-9 w-full rounded-[4px] text-[12px] transition cursor-pointer flex items-center justify-center ${cls}"
            >
                ${day}
            </button>
        `);
    }

    const trailingCount = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= trailingCount; i++) {
        cells.push(`<div class="h-9 w-full flex items-center justify-center text-[11.5px] text-[#CBD5E1]">${i}</div>`);
    }

    const monthOptions = INDONESIAN_MONTHS.map((label, idx) => `
        <option value="${idx}" ${idx === month ? 'selected' : ''}>${label}</option>
    `).join('');

    const yearOptions = Array.from({ length: 10 }, (_, idx) => year - 3 + idx).map((y) => `
        <option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>
    `).join('');

    return `
        <div
            data-modal-dialog="true"
            role="dialog"
            aria-modal="true"
            class="w-full max-w-[460px] bg-white border-[2.5px] border-[#308242] rounded-[12px] shadow-[0_14px_38px_rgba(48,130,66,0.22)] p-5 sm:p-7 space-y-4 animate-modal-in"
        >
            <div class="flex items-start justify-between gap-2">
                <div>
                    <h2 class="text-[20px] font-bold text-[#486284]">${title}</h2>
                    <p class="text-[12px] text-[#5F7693] mt-0.5">${escapeHtml(subtitle)}</p>
                </div>
                <button
                    type="button"
                    data-action="close-modal"
                    class="w-7 h-7 rounded-[4px] border border-[#8DD99D] text-[#308242] hover:bg-[#E6F5EA] flex items-center justify-center cursor-pointer shrink-0"
                >
                    ${uiIcons.closeX('w-3.5 h-3.5')}
                </button>
            </div>

            <div class="border border-[#72C384] rounded-[8px] p-3.5 space-y-3">
                <div class="flex items-center justify-between gap-2">
                    <button
                        type="button"
                        data-action="dosen-calendar-prev"
                        aria-label="Bulan Sebelumnya"
                        class="w-8 h-8 rounded-[4px] border border-[#72C384] text-[#308242] hover:bg-[#E6F5EA] flex items-center justify-center cursor-pointer"
                    >
                        ${uiIcons.chevronLeft('w-4 h-4')}
                    </button>

                    <div class="flex items-center gap-1.5">
                        <select
                            data-action="dosen-calendar-month"
                            class="h-8 px-2 border border-[#72C384] rounded-[4px] text-[13px] font-bold text-[#486284] bg-white focus:outline-none"
                        >
                            ${monthOptions}
                        </select>
                        <select
                            data-action="dosen-calendar-year"
                            class="h-8 px-2 border border-[#72C384] rounded-[4px] text-[13px] font-bold text-[#486284] bg-white focus:outline-none"
                        >
                            ${yearOptions}
                        </select>
                    </div>

                    <button
                        type="button"
                        data-action="dosen-calendar-next"
                        aria-label="Bulan Berikutnya"
                        class="w-8 h-8 rounded-[4px] border border-[#72C384] text-[#308242] hover:bg-[#E6F5EA] flex items-center justify-center cursor-pointer"
                    >
                        ${uiIcons.chevronRight('w-4 h-4')}
                    </button>
                </div>

                <div class="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-[#5F7693]">
                    <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
                </div>

                <div class="grid grid-cols-7 gap-1.5">
                    ${cells.join('')}
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-1">
                <button
                    type="button"
                    data-action="close-modal"
                    class="min-w-[92px] min-h-[38px] px-4 border border-[#72C384] hover:bg-[#F3FBF5] text-[#486284] font-semibold text-[12.5px] rounded-[5px] cursor-pointer"
                >
                    Batal
                </button>
                <button
                    type="button"
                    data-action="dosen-calendar-save"
                    ${!cm.startIso || cm.saving ? 'disabled' : ''}
                    class="min-w-[140px] min-h-[38px] px-4 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[12.5px] rounded-[5px] shadow-xs cursor-pointer disabled:opacity-55"
                >
                    ${cm.saving ? 'Menyimpan...' : (hasExisting ? 'Simpan Perubahan' : 'Simpan Jadwal')}
                </button>
            </div>
        </div>
    `;
}

function renderDosenAssignAsprakModal(state) {
    const d = state.dosen;
    const am = d.assignModal;
    const assistants = Array.isArray(d.assistants) ? d.assistants : [];
    const teams = Array.isArray(d.teams) ? d.teams : [];
    const selectedTeam = teams.find((t) => Number(t.id) === Number(am.teamId)) || teams[0] || null;
    const activeTeamId = selectedTeam?.id || am.teamId;

    const assistantOptions = assistants.length > 0
        ? assistants.map((a) => `
            <option value="${a.id}" ${Number(am.assistantId) === Number(a.id) ? 'selected' : ''}>
                ${escapeHtml(a.name || a.email)} (${a.supervised_teams_count || 0} Tim)
            </option>
        `).join('')
        : '<option value="">Belum ada Asisten Praktikum</option>';

    const teamOptions = teams.length > 0
        ? teams.map((t) => `
            <option value="${t.id}" ${Number(activeTeamId) === Number(t.id) ? 'selected' : ''}>
                Kelompok ${t.id}${t.project?.project_name ? ` — ${escapeHtml(t.project.project_name)}` : ''}
            </option>
        `).join('')
        : '<option value="">Belum ada kelompok PAD</option>';

    const members = Array.isArray(selectedTeam?.members) ? selectedTeam.members : [];
    const memberRows = members.length > 0
        ? members.map((m) => `
            <div class="flex items-center gap-2 border border-[#72C384] rounded-[4px] px-3 py-1.5 text-[12px] text-[#486284] bg-white">
                ${roleIcon(m.role?.code, 'w-4 h-4 text-[#308242] shrink-0')}
                <span class="truncate font-medium">${escapeHtml(m.name || m.email || '-')}</span>
                <span class="ml-auto text-[10.5px] font-semibold text-[#308242] shrink-0">${escapeHtml(m.role?.code || '')}</span>
            </div>
        `).join('')
        : '<p class="text-[12px] text-[#94A3B8] italic">Belum ada anggota terdaftar di kelompok ini.</p>';

    return `
        <div
            data-modal-dialog="true"
            role="dialog"
            aria-modal="true"
            class="w-full max-w-[460px] bg-white border-[2.5px] border-[#308242] rounded-[12px] shadow-[0_14px_38px_rgba(48,130,66,0.22)] p-5 sm:p-7 space-y-4 animate-modal-in"
        >
            <div class="flex items-start justify-between gap-2">
                <div>
                    <h2 class="text-[18px] sm:text-[20px] font-bold text-[#486284]">Assign Asprak – Kelompok</h2>
                    <p class="text-[11.5px] text-[#5F7693] mt-0.5">Pilih asisten praktikum dan kelompok yang akan didampingi.</p>
                </div>
                <button type="button" data-action="close-modal" class="text-[#64748B] hover:text-[#308242] text-[22px] leading-none px-1 cursor-pointer">&times;</button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                    <label for="assign-asprak-select" class="block text-[11px] font-bold text-[#308242]">Asisten Praktikum</label>
                    <select
                        id="assign-asprak-select"
                        data-action="dosen-assign-pick-assistant"
                        class="w-full min-h-[38px] px-2.5 border border-[#72C384] rounded-[4px] bg-white text-[13px] sm:text-[12px] text-[#1E293B]"
                    >
                        ${assistantOptions}
                    </select>
                </div>

                <div class="space-y-1">
                    <label for="assign-team-select" class="block text-[11px] font-bold text-[#308242]">Nama kelompok</label>
                    <select
                        id="assign-team-select"
                        data-action="dosen-assign-pick-team"
                        class="w-full min-h-[38px] px-2.5 border border-[#72C384] rounded-[4px] bg-white text-[13px] sm:text-[12px] text-[#1E293B]"
                    >
                        ${teamOptions}
                    </select>
                </div>
            </div>

            ${selectedTeam ? `
                <div class="border border-[#72C384] rounded-[6px] p-3.5 space-y-3 bg-[#FAFCFA]">
                    <p class="text-[12.5px] font-bold text-[#1E293B]">Detail Kelompok ${selectedTeam.id}</p>
                    <div class="space-y-1.5">
                        ${memberRows}
                    </div>
                    <div class="pt-1 border-t border-[#E2F3E7]">
                        <p class="text-[11px] font-bold text-[#308242]">Nama Project</p>
                        <p class="text-[12.5px] font-bold text-[#486284] mt-0.5">
                            ${escapeHtml(selectedTeam.project?.project_name || 'Belum diisi')}
                        </p>
                        ${selectedTeam.project?.project_description ? `
                            <p class="text-[11px] text-[#5F7693] mt-0.5 line-clamp-2">
                                ${escapeHtml(selectedTeam.project.project_description)}
                            </p>
                        ` : ''}
                    </div>
                </div>
            ` : ''}

            <div class="flex justify-end pt-1">
                <button
                    type="button"
                    data-action="dosen-assign-save"
                    ${!am.assistantId || !activeTeamId || am.saving ? 'disabled' : ''}
                    class="inline-flex items-center justify-center gap-2 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[12.5px] px-5 min-h-[38px] rounded-[5px] shadow-xs cursor-pointer disabled:opacity-55"
                >
                    ${uiIcons.check('w-3.5 h-3.5 text-white')}
                    <span>${am.saving ? 'Menyimpan...' : 'Terima'}</span>
                </button>
            </div>
        </div>
    `;
}

export function renderModal(state) {
    if (!state.modal) return '';

    let dialogHtml = '';
    switch (state.modal.type) {
        case 'confirm-profile':
            dialogHtml = renderConfirmProfileModal();
            break;
        case 'alert':
            dialogHtml = renderAlertModal(state.modal);
            break;
        case 'green-alert':
            dialogHtml = renderGreenAlertModal(state.modal);
            break;
        case 'madmin-add':
            dialogHtml = renderMasterAdminAddModal(state);
            break;
        case 'madmin-revoke':
            dialogHtml = renderMasterAdminRevokeModal(state.modal, state);
            break;
        case 'dosen-confirm-autogroup':
            dialogHtml = renderDosenConfirmModal('autogroup', state.dosen.busyAction === 'autogroup');
            break;
        case 'dosen-confirm-bypass':
            dialogHtml = renderDosenConfirmModal('bypass', state.dosen.busyAction === 'bypass');
            break;
        case 'dosen-calendar':
            dialogHtml = renderDosenCalendarModal(state);
            break;
        case 'dosen-assign-asprak':
            dialogHtml = renderDosenAssignAsprakModal(state);
            break;
        case 'role-congrats':
            dialogHtml = renderRoleCongratsModal(state.modal);
            break;
        case 'team-detail':
            dialogHtml = renderTeamDetailModal(state);
            break;
        case 'asprak-team-detail':
            dialogHtml = renderAsprakTeamDetailModal(state);
            break;
        case 'confirm-complaint':
            dialogHtml = renderConfirmComplaintModal(state);
            break;
        case 'dev-switcher':
            dialogHtml = renderDevSwitcherModal(state);
            break;
        default:
            return '';
    }

    return `
        <div
            data-modal-backdrop="true"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-[1px] p-4"
        >
            ${dialogHtml}
        </div>
    `;
}
