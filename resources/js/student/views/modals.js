import { roleIcon, uiIcons } from '../icons.js';
import {
    escapeHtml,
    normalizeRoleCode,
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
                                    ${escapeHtml(project?.owner?.name || '-')}
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

function renderDevSwitcherModal(state) {
    const { users, loading, seeding, notice, error } = state.dev;
    const studentUsers = (users || []).filter((u) => u.user_role === 'student' || u.user_role === 'admin');

    const presets = [
        { email: 'mhs.baru@mail.ugm.ac.id', label: 'Mahasiswa Baru (Form Kosong)', tag: 'Fresh' },
        { email: 'mhs.bypass@mail.ugm.ac.id', label: 'Mahasiswa Bypass (GEMASTIK)', tag: 'Bypass' },
        { email: 'mhs.uiux1@mail.ugm.ac.id', label: 'Mahasiswa Tim UI/UX (Kelompok)', tag: 'Tim PAD' },
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
                            data-role="student"
                            ${loading ? 'disabled' : ''}
                            class="w-full text-left border border-[#83B9EF] hover:border-[#0773DF] hover:bg-[#F4F9FF] rounded-[6px] px-3.5 py-2.5 flex items-center justify-between gap-2 transition cursor-pointer"
                        >
                            <span class="text-[12.5px] font-semibold text-[#486284] truncate">${escapeHtml(p.label)}</span>
                            <span class="text-[11px] font-mono font-semibold bg-[#C0DDF9] text-[#045DDA] px-2 py-0.5 rounded">${escapeHtml(p.tag)}</span>
                        </button>
                    `).join('')}
                </div>

                ${studentUsers.length > 0 ? `
                    <div class="pt-2 border-t border-[#83B9EF]/60 space-y-1.5">
                        <label class="block text-[11.5px] font-semibold text-[#486284]">Semua Akun Mahasiswa Lokal:</label>
                        <div class="flex gap-2">
                            <select
                                id="dev-user-select"
                                class="flex-1 min-h-[40px] border border-[#83B9EF] rounded-[5px] px-3 text-[12px] text-[#181C1F] bg-white focus:outline-none focus:border-[#0773DF]"
                            >
                                ${studentUsers.map((u) => `
                                    <option value="${escapeHtml(u.email)}|${escapeHtml(u.user_role)}" ${u.email === state.user?.email ? 'selected' : ''}>
                                        ${escapeHtml(u.name || u.email)} (${escapeHtml(u.email)})
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
        case 'role-congrats':
            dialogHtml = renderRoleCongratsModal(state.modal);
            break;
        case 'team-detail':
            dialogHtml = renderTeamDetailModal(state);
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
