import { uiIcons } from '../icons.js';
import {
    escapeHtml,
    roleFullTitle,
} from '../utils.js';
import {
    renderGreenComplaintDetail,
    renderGreenComplaintsList,
    renderGreenProjectFormCard,
} from './practitionerView.js';

function countRoleQuotaTables(evaluations = []) {
    const groups = {
        PM: { title: 'Project Manager', code: 'PM', rows: [] },
        UIUX: { title: 'UI/UX', code: 'UIUX', rows: [] },
        FE: { title: 'FrontEnd Dev', code: 'FE', rows: [] },
        BE: { title: 'BackEnd Dev', code: 'BE', rows: [] },
    };

    for (const ev of evaluations) {
        if (ev.is_bypass) continue;
        const code = String(ev.final_role?.code || ev.recommended_role?.code || ev.role_1?.code || '').toUpperCase();
        if (!groups[code]) continue;
        const score = Number(ev.recommended_score ?? ev.score_role_1 ?? 0);
        groups[code].rows.push({
            user_id: ev.user_id,
            name: ev.name || ev.email || 'Mahasiswa',
            nim: ev.nim || '-',
            score,
        });
    }

    Object.values(groups).forEach((g) => {
        g.rows.sort((a, b) => b.score - a.score);
    });

    const minBalanced = Math.min(
        groups.PM.rows.length,
        groups.UIUX.rows.length,
        groups.FE.rows.length,
        groups.BE.rows.length
    );
    const effectiveQuota = minBalanced > 0 ? minBalanced : 2;

    return { groups, effectiveQuota };
}

function renderRoleResultCard(group, quota) {
    const quotaCount = Math.max(1, quota);
    const bodyRows = group.rows.length > 0
        ? group.rows.map((r, idx) => {
            const rank = idx + 1;
            const inQuota = rank <= quotaCount;
            return `
                <tr class="border-b border-[#E2F3E7] last:border-b-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FCFA]'}">
                    <td class="py-2 px-3 text-[11.5px] text-[#64748B] w-[42px]">${rank}</td>
                    <td class="py-2 px-3 text-[11.5px] font-bold text-[#1E293B] w-[62px]">${rank}</td>
                    <td class="py-2 px-3 text-[12px] text-[#475569]">
                        <span class="font-medium text-[#1E293B]">${escapeHtml(r.name)}</span>
                        <span class="text-[11px] font-mono text-[#64748B] ml-1">(${escapeHtml(r.nim)})</span>
                    </td>
                    <td class="py-2 px-3 font-mono text-[11.5px] font-semibold text-[#334155] text-right whitespace-nowrap w-[66px]">
                        ${Number(r.score || 0).toFixed(1)}
                    </td>
                    <td class="py-2 px-3 text-center w-[112px]">
                        ${inQuota
                            ? '<span class="inline-block bg-[#308242] text-white text-[10px] font-bold px-2.5 py-1 rounded-[4px] whitespace-nowrap">Masuk Kuota</span>'
                            : '<span class="inline-block bg-white border border-[#CBD5E1] text-[#64748B] text-[10px] font-bold px-2.5 py-1 rounded-[4px] whitespace-nowrap">Di Luar Kuota</span>'
                        }
                    </td>
                </tr>
            `;
        }).join('')
        : `
            <tr>
                <td colspan="5" class="py-5 px-3 text-center text-[12px] text-[#94A3B8]">
                    Belum ada mahasiswa pada role ${escapeHtml(group.title)}.
                </td>
            </tr>
        `;

    return `
        <div class="bg-white border-[1.5px] border-[#308242] rounded-[4px] p-4 space-y-2.5 shadow-[0_2px_10px_rgba(48,130,66,0.04)]">
            <div class="flex items-center justify-between gap-2">
                <div>
                    <h3 class="text-[14px] font-bold text-[#486284]">${escapeHtml(group.title)}</h3>
                    <p class="text-[11px] text-[#64748B]">Kuota: ${group.rows.length > 0 ? Math.min(group.rows.length, quotaCount) : quotaCount} (${group.rows.length} Terdata)</p>
                </div>
                <span class="bg-[#C5E9CD] text-[#14532D] font-bold text-[11px] px-2.5 py-1 rounded-[4px]">
                    ${group.rows.length} Kuota
                </span>
            </div>

            <div class="border border-[#B7E1C1] rounded-[4px] overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[440px]">
                    <thead class="bg-[#C5E9CD] text-[#143D20] text-[11px] font-bold">
                        <tr>
                            <th class="py-2 px-3 w-[42px]">No</th>
                            <th class="py-2 px-3 w-[62px]">Peringkat</th>
                            <th class="py-2 px-3">Identitas Mahasiswa</th>
                            <th class="py-2 px-3 text-right w-[66px]">Skor</th>
                            <th class="py-2 px-3 text-center w-[112px]">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bodyRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderControlTab(state) {
    const d = state.dosen;
    const evals = Array.isArray(d.evaluationsAll) ? d.evaluationsAll : [];
    const teams = Array.isArray(d.teams) ? d.teams : [];
    const settings = d.settings || {};
    const allSettings = settings.all_settings || {};

    const totalKrs = evals.length;
    const formDoneCount = evals.filter((e) => e.role_1 || e.final_role || e.recommended_role).length;
    const formDonePct = totalKrs > 0 ? ((formDoneCount / totalKrs) * 100).toFixed(1) : '0';

    const exclusiveTeams = teams.filter((t) => t.team_type === 'external');
    const internalTeams = teams.filter((t) => t.team_type === 'internal');
    const hasLockedRegularTeams = internalTeams.some((t) => Boolean(t.is_locked));

    const bypassMemberTotal = exclusiveTeams.reduce((acc, t) => acc + Number(t.members_count || t.members?.length || 0), 0);

    const regularLockedEvals = evals.filter((e) => !e.is_bypass && e.is_locked && (e.final_role?.code || e.recommended_role?.code));
    const lockedCount = evals.filter((e) => e.is_locked).length;
    const allLocked = totalKrs > 0 && lockedCount === totalKrs;

    const regTimeline = settings.registration_timeline || '1 Agustus 2026 - 28 Agustus 2026';
    const releaseTimeline = allSettings.team_release_date || '6 September 2026';
    const isRole2Req = Boolean(settings.is_role_2_required);

    const { groups, effectiveQuota } = countRoleQuotaTables(evals);

    const minLockedPerRole = Math.min(
        regularLockedEvals.filter((e) => e.final_role?.code === 'PM').length,
        regularLockedEvals.filter((e) => e.final_role?.code === 'UIUX').length,
        regularLockedEvals.filter((e) => e.final_role?.code === 'FE').length,
        regularLockedEvals.filter((e) => e.final_role?.code === 'BE').length
    );
    const canAutoGroup = minLockedPerRole >= 1 && !hasLockedRegularTeams;

    let statusPillHtml = '';
    if (canAutoGroup) {
        statusPillHtml = `
            <span class="bg-[#C5E9CD] text-[#14532D] font-bold text-[11px] px-2.5 py-0.5 rounded-[4px]">Siap</span>
            <span class="font-semibold text-[#486284] text-[13px]">
                ${regularLockedEvals.length} Mahasiswa Reguler + ${exclusiveTeams.length} Tim Khusus Terkunci
            </span>
        `;
    } else if (internalTeams.length > 0 && hasLockedRegularTeams) {
        statusPillHtml = `
            <span class="bg-[#C5E9CD] text-[#14532D] font-bold text-[11px] px-2.5 py-0.5 rounded-[4px]">Selesai</span>
            <span class="font-semibold text-[#486284] text-[13px]">
                ${internalTeams.length} Tim Reguler Terkunci + ${exclusiveTeams.length} Tim Khusus
            </span>
        `;
    } else {
        const unlockedRegCount = evals.filter((e) => !e.is_bypass && !e.is_locked).length;
        statusPillHtml = `
            <span class="bg-rose-100 text-rose-700 font-bold text-[11px] px-2.5 py-0.5 rounded-[4px]">Belum Siap</span>
            <span class="font-semibold text-[#486284] text-[13px]">
                ${unlockedRegCount} Mahasiswa Reguler Belum Terkunci (${regularLockedEvals.length} Terkunci)
            </span>
        `;
    }

    const busyLock = d.busyAction === 'lock';
    const busyAutoGroup = d.busyAction === 'autogroup';

    return `
        <div class="w-full max-w-[780px] mx-auto space-y-5 relative z-10">
            <!-- Monitoring Title -->
            <div class="bg-white border-[1.5px] border-[#308242] rounded-[4px] py-4 px-5 text-center shadow-[0_2px_10px_rgba(48,130,66,0.05)]">
                <h1 class="text-[24px] sm:text-[30px] font-bold text-[#486284] tracking-tight">
                    Monitoring
                </h1>
            </div>

            ${d.error ? `
                <div class="bg-red-50 border border-red-200 text-red-700 rounded-[4px] px-4 py-3 text-[13px] flex items-center justify-between gap-2">
                    <span>${escapeHtml(d.error)}</span>
                    <button type="button" data-action="retry-tab" class="font-semibold underline cursor-pointer">Coba Lagi</button>
                </div>
            ` : ''}

            <!-- 4 KPI Cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="bg-white border-[1.5px] border-[#72C384] rounded-[4px] p-3">
                    <p class="text-[11px] font-bold text-[#308242]">Total KRS</p>
                    <p class="text-[13px] font-semibold text-[#486284] mt-1">${totalKrs} Mahasiswa</p>
                </div>
                <div class="bg-white border-[1.5px] border-[#72C384] rounded-[4px] p-3">
                    <p class="text-[11px] font-bold text-[#308242]">Form Selesai</p>
                    <p class="text-[13px] font-semibold text-[#486284] mt-1">${formDoneCount} / ${totalKrs} (${formDonePct}%)</p>
                </div>
                <div class="bg-white border-[1.5px] border-[#72C384] rounded-[4px] p-3">
                    <p class="text-[11px] font-bold text-[#308242]">Tim Gemastik & LIDM</p>
                    <p class="text-[13px] font-semibold text-[#486284] mt-1">${exclusiveTeams.length} Tim (${bypassMemberTotal} Mhs)</p>
                </div>
                <div class="bg-white border-[1.5px] border-[#72C384] rounded-[4px] p-3">
                    <p class="text-[11px] font-bold text-[#308242]">Status Kunci Data</p>
                    <p class="text-[13px] font-semibold text-[#486284] mt-1 inline-flex items-center gap-1.5">
                        ${allLocked ? uiIcons.lockClosed('w-3.5 h-3.5 text-[#308242]') : uiIcons.unlockOpen('w-3.5 h-3.5 text-[#308242]')}
                        <span>${allLocked ? 'Terkunci' : 'Buka'}</span>
                    </p>
                </div>
            </div>

            <!-- Schedule & Lock Controls Card -->
            <div class="bg-white border-[1.5px] border-[#308242] rounded-[4px] p-4 sm:p-5 space-y-3 shadow-[0_2px_10px_rgba(48,130,66,0.05)]">
                <!-- Row 1: Jadwal Pendaftaran -->
                <div class="grid grid-cols-1 sm:grid-cols-[200px_1fr_88px] gap-2 items-stretch">
                    <div class="bg-[#C5E9CD] text-[#14532D] font-bold text-[12.5px] rounded-[4px] px-3 py-2 flex items-center justify-center sm:justify-start">
                        Jadwal Pendaftaran
                    </div>
                    <div class="border border-[#72C384] rounded-[4px] px-3 py-2 text-[12.5px] font-semibold text-[#486284] flex items-center justify-center text-center">
                        ${escapeHtml(regTimeline)}
                    </div>
                    <button
                        type="button"
                        data-action="dosen-open-calendar"
                        data-kind="registration"
                        class="min-h-[38px] bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[12.5px] rounded-[4px] inline-flex items-center justify-center gap-1.5 px-3 transition cursor-pointer"
                    >
                        ${uiIcons.pencil('w-3.5 h-3.5 text-white')}
                        <span>Edit</span>
                    </button>
                </div>

                <!-- Row 2: Jadwal Rilis Tim PAD -->
                <div class="grid grid-cols-1 sm:grid-cols-[200px_1fr_88px] gap-2 items-stretch">
                    <div class="bg-[#C5E9CD] text-[#14532D] font-bold text-[12.5px] rounded-[4px] px-3 py-2 flex items-center justify-center sm:justify-start">
                        Jadwal Rilis Tim PAD
                    </div>
                    <div class="border border-[#72C384] rounded-[4px] px-3 py-2 text-[12.5px] font-semibold text-[#486284] flex items-center justify-center text-center">
                        ${escapeHtml(releaseTimeline)}
                    </div>
                    <button
                        type="button"
                        data-action="dosen-open-calendar"
                        data-kind="release"
                        class="min-h-[38px] bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[12.5px] rounded-[4px] inline-flex items-center justify-center gap-1.5 px-3 transition cursor-pointer"
                    >
                        ${uiIcons.pencil('w-3.5 h-3.5 text-white')}
                        <span>Edit</span>
                    </button>
                </div>

                <!-- Row 3: Kewajiban Role Sekunder -->
                <div class="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 items-stretch">
                    <div class="bg-[#C5E9CD] text-[#14532D] font-bold text-[12.5px] rounded-[4px] px-3 py-2 flex items-center justify-center sm:justify-start">
                        Kewajiban Role Sekunder (Role 2)
                    </div>
                    <label class="border border-[#72C384] rounded-[4px] px-3 py-2 text-[12.5px] font-medium text-[#486284] flex items-center gap-2.5 cursor-pointer hover:bg-[#F3FBF5]">
                        <input
                            type="checkbox"
                            data-action="dosen-toggle-role2"
                            ${isRole2Req ? 'checked' : ''}
                            class="w-4 h-4 accent-[#308242] cursor-pointer shrink-0"
                        />
                        <span>
                            ${isRole2Req
                                ? 'Aktif (Mahasiswa WAJIB memilih Role Pilihan Kedua)'
                                : 'Opsional (Mahasiswa tidak diwajibkan memilih Role Kedua)'}
                        </span>
                    </label>
                </div>

                <!-- Lock/Unlock All Buttons -->
                <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
                    ${allLocked
                        ? `
                            <button
                                type="button"
                                data-action="dosen-toggle-lock-all"
                                data-mode="unlock"
                                ${busyLock ? 'disabled' : ''}
                                class="min-w-[230px] min-h-[42px] px-5 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[12.5px] rounded-[4px] shadow-xs transition cursor-pointer disabled:opacity-60"
                            >
                                ${busyLock ? 'Memproses...' : 'Buka Kunci Semua Data Mahasiswa'}
                            </button>
                        `
                        : `
                            <button
                                type="button"
                                data-action="dosen-toggle-lock-all"
                                data-mode="lock"
                                ${busyLock ? 'disabled' : ''}
                                class="min-w-[230px] min-h-[42px] px-5 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[12.5px] rounded-[4px] shadow-xs transition cursor-pointer disabled:opacity-60"
                            >
                                ${busyLock ? 'Memproses...' : 'Kunci Semua Data Mahasiswa'}
                            </button>
                            ${lockedCount > 0 ? `
                                <button
                                    type="button"
                                    data-action="dosen-toggle-lock-all"
                                    data-mode="unlock"
                                    ${busyLock ? 'disabled' : ''}
                                    class="min-h-[42px] px-4 border border-[#308242] text-[#308242] hover:bg-[#F1FAF3] font-semibold text-[12.5px] rounded-[4px] transition cursor-pointer"
                                >
                                    Buka Semua Kunci
                                </button>
                            ` : ''}
                        `
                    }
                </div>
            </div>

            <!-- Hasil Perhitungan Sistem (4 Role Tables) -->
            <div class="space-y-3 pt-1">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h2 class="text-[15px] font-bold text-[#486284]">Hasil Perhitungan Sistem</h2>
                        <p class="text-[11px] text-[#64748B]">Pratinjau skor akhir mahasiswa per role sebelum atau sesudah pengacakan tim PAD.</p>
                    </div>
                    <span class="bg-[#E6F5EA] border border-[#8DD99D] text-[#308242] font-semibold text-[11px] px-3 py-1 rounded-[4px]">
                        ${allLocked ? 'Data Final Terkunci' : 'Pratinjau data sistem'}
                    </span>
                </div>

                ${renderRoleResultCard(groups.PM, effectiveQuota)}
                ${renderRoleResultCard(groups.UIUX, effectiveQuota)}
                ${renderRoleResultCard(groups.FE, effectiveQuota)}
                ${renderRoleResultCard(groups.BE, effectiveQuota)}
            </div>

            <!-- Auto-Grouping Engine Execution Card -->
            <div class="bg-white border-[1.5px] border-[#308242] rounded-[4px] p-5 text-center space-y-3 shadow-[0_2px_10px_rgba(48,130,66,0.05)]">
                <div class="flex flex-wrap items-center justify-center gap-2">
                    ${statusPillHtml}
                </div>

                <div class="flex flex-wrap items-center justify-center gap-3">
                    <button
                        type="button"
                        data-action="dosen-open-autogroup-confirm"
                        ${busyAutoGroup ? 'disabled' : ''}
                        class="inline-flex items-center justify-center gap-2 border border-[#72C384] bg-white hover:bg-[#F0FAF2] text-[#308242] font-bold text-[12.5px] px-5 min-h-[42px] rounded-[4px] shadow-2xs transition cursor-pointer disabled:opacity-60"
                    >
                        ${uiIcons.dice('w-4 h-4 text-[#486284]')}
                        <span>${busyAutoGroup ? 'Menjalankan...' : 'Jalankan pengacakan tim PAD otomatis'}</span>
                    </button>

                    ${internalTeams.length > 0 && !hasLockedRegularTeams ? `
                        <button
                            type="button"
                            data-action="dosen-reset-grouping"
                            class="inline-flex items-center justify-center gap-1.5 border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 font-semibold text-[12px] px-4 min-h-[42px] rounded-[4px] transition cursor-pointer"
                        >
                            Reset Pembagian Tim
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function renderUserTab(state) {
    const d = state.dosen;
    const users = Array.isArray(d.users) ? d.users : [];
    const meta = d.usersMeta || { current_page: 1, last_page: 1, per_page: 6, total: 0 };
    const total = Number(meta.total || users.length);
    const perPage = Number(meta.per_page || 6);
    const currentPage = Number(meta.current_page || 1);
    const lastPage = Math.max(1, Number(meta.last_page || 1));
    const fromNum = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const toNum = total === 0 ? 0 : Math.min(total, fromNum + users.length - 1);

    const roleSelectOptions = (selected) => {
        const opts = [
            { value: 'practitioner', label: 'Praktisi' },
            { value: 'assistant', label: 'Asprak' },
            { value: 'student', label: 'Mahasiswa' },
            { value: 'lecturer', label: 'Dosen' },
            { value: 'admin', label: 'Admin' },
        ];
        return opts.map((o) => `
            <option value="${o.value}" ${selected === o.value ? 'selected' : ''}>${escapeHtml(o.label)}</option>
        `).join('');
    };

    const userRows = users.length > 0
        ? users.map((u, idx) => {
            const nameOrNim = u.student_profile?.nim
                ? `${u.name || '-'} (${u.student_profile.nim})`
                : (u.name || u.nip || '-');

            let statusBadge = '<span class="bg-[#E6F5EA] text-[#308242] font-bold text-[10.5px] px-2.5 py-0.5 rounded-[4px]">Verified</span>';
            if (u.user_role === 'student') {
                if (u.is_locked) {
                    statusBadge = '<span class="bg-[#E6F5EA] text-[#308242] font-bold text-[10.5px] px-2.5 py-0.5 rounded-[4px]">Verified</span>';
                } else if (u.has_profile) {
                    statusBadge = '<span class="bg-sky-50 border border-sky-200 text-sky-700 font-bold text-[10.5px] px-2.5 py-0.5 rounded-[4px]">Form Filled</span>';
                } else {
                    statusBadge = '<span class="bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[10.5px] px-2.5 py-0.5 rounded-[4px]">Not Submitted</span>';
                }
            }

            return `
                <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FCFA]'} border-b border-[#E2F3E7] last:border-b-0">
                    <td class="py-2.5 px-3 font-mono text-[11.5px] text-[#334155]">${escapeHtml(u.email)}</td>
                    <td class="py-2.5 px-3 text-[12px] font-medium text-[#1E293B]">${escapeHtml(nameOrNim)}</td>
                    <td class="py-2 px-3">
                        <select
                            data-action="dosen-inline-role"
                            data-user-id="${u.id}"
                            class="h-[32px] px-2 border border-[#72C384] rounded-[4px] bg-white text-[11.5px] font-medium text-[#1E293B] focus:outline-none focus:border-[#308242]"
                        >
                            ${roleSelectOptions(u.user_role)}
                        </select>
                    </td>
                    <td class="py-2.5 px-3 text-center whitespace-nowrap">${statusBadge}</td>
                    <td class="py-2 px-3 text-center w-[64px]">
                        <button
                            type="button"
                            data-action="dosen-delete-user"
                            data-user-id="${u.id}"
                            data-user-email="${escapeHtml(u.email)}"
                            title="Hapus User"
                            class="w-8 h-8 rounded-[4px] bg-[#E8F6EC] hover:bg-rose-100 text-[#308242] hover:text-rose-700 inline-flex items-center justify-center transition cursor-pointer"
                        >
                            ${uiIcons.trash('w-4 h-4')}
                        </button>
                    </td>
                </tr>
            `;
        }).join('')
        : `
            <tr>
                <td colspan="5" class="py-8 px-4 text-center text-[12.5px] text-[#64748B]">
                    Tidak ada email terdaftar yang cocok dengan filter.
                </td>
            </tr>
        `;

    const mobileUserCards = users.length > 0
        ? users.map((u) => `
            <div class="border border-[#B7E1C1] bg-white rounded-[6px] p-3.5 space-y-2.5">
                <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                        <p class="font-semibold text-[13px] text-[#1E293B] truncate">${escapeHtml(u.name || '-')}</p>
                        <p class="font-mono text-[11px] text-[#64748B] truncate">${escapeHtml(u.email)}</p>
                    </div>
                    <button
                        type="button"
                        data-action="dosen-delete-user"
                        data-user-id="${u.id}"
                        data-user-email="${escapeHtml(u.email)}"
                        class="w-10 h-10 rounded-[5px] bg-[#E8F6EC] text-[#308242] flex items-center justify-center shrink-0 cursor-pointer"
                    >
                        ${uiIcons.trash('w-4 h-4')}
                    </button>
                </div>
                <div class="flex items-center justify-between gap-2 pt-1 border-t border-[#E5F2E9]">
                    <select
                        data-action="dosen-inline-role"
                        data-user-id="${u.id}"
                        class="min-h-[38px] px-2.5 border border-[#72C384] rounded-[4px] bg-white text-[13px] font-medium text-[#1E293B]"
                    >
                        ${roleSelectOptions(u.user_role)}
                    </select>
                    <span class="text-[11px] font-semibold text-[#308242]">${escapeHtml(u.role_label || u.user_role)}</span>
                </div>
            </div>
        `).join('')
        : '<p class="text-[12.5px] text-center text-[#64748B] py-5">Tidak ada pengguna ditemukan.</p>';

    const pageNumbers = Array.from({ length: lastPage }, (_, i) => i + 1)
        .slice(Math.max(0, currentPage - 2), Math.max(3, currentPage + 1))
        .map((pg) => `
            <button
                type="button"
                data-action="dosen-user-page"
                data-page="${pg}"
                class="w-7 h-7 rounded-[4px] text-[11.5px] font-bold flex items-center justify-center cursor-pointer ${pg === currentPage ? 'bg-[#308242] text-white' : 'border border-[#CBD5E1] text-[#475569]'}"
            >
                ${pg}
            </button>
        `).join('');

    const supervisedTeams = (d.teams || []).filter((t) => Boolean(t.supervisor));

    const assignRows = supervisedTeams.length > 0
        ? supervisedTeams.map((t, idx) => `
            <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FCFA]'} border-b border-[#E2F3E7] last:border-b-0">
                <td class="py-2.5 px-4 text-[12.5px] font-medium text-[#1E293B]">
                    ${escapeHtml(t.supervisor?.name || t.supervisor?.email || '-')}
                </td>
                <td class="py-2.5 px-4 text-[12.5px] text-[#486284]">
                    Kelompok ${t.id}${t.project?.project_name ? ` — ${escapeHtml(t.project.project_name)}` : ''}
                </td>
                <td class="py-2 px-4 text-center w-[70px]">
                    <button
                        type="button"
                        data-action="dosen-unassign-supervisor"
                        data-team-id="${t.id}"
                        title="Lepas Pembimbing"
                        class="w-8 h-8 rounded-[4px] bg-[#E8F6EC] hover:bg-rose-100 text-[#308242] hover:text-rose-700 inline-flex items-center justify-center transition cursor-pointer"
                    >
                        ${uiIcons.trash('w-4 h-4')}
                    </button>
                </td>
            </tr>
        `).join('')
        : `
            <tr>
                <td colspan="3" class="py-6 px-4 text-center text-[12.5px] text-[#64748B]">
                    Belum ada Asisten Praktikum yang ditugaskan ke kelompok.
                </td>
            </tr>
        `;

    return `
        <div class="w-full max-w-[780px] mx-auto space-y-6 relative z-10">
            <!-- Section 1: TAMBAH STAKEHOLDER -->
            <div class="bg-white border-[1.5px] border-[#308242] rounded-[4px] p-4 sm:p-6 space-y-4 shadow-[0_2px_10px_rgba(48,130,66,0.05)]">
                <h2 class="text-[16px] sm:text-[18px] font-bold text-[#486284] tracking-tight">
                    TAMBAH STAKEHOLDER (MANUAL INPUT)
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3 items-end">
                    <div class="space-y-1">
                        <label for="dosen-stakeholder-email" class="block text-[11.5px] font-bold text-[#308242]">
                            Ketik Alamat Email:
                        </label>
                        <input
                            id="dosen-stakeholder-email"
                            type="email"
                            data-input="dosen-stakeholder-email"
                            value="${escapeHtml(d.stakeholderForm.email || '')}"
                            placeholder="email.user@ugm.ac.id"
                            class="w-full min-h-[40px] px-3 border border-[#72C384] focus:border-[#308242] rounded-[4px] text-[16px] sm:text-[13px] text-[#1E293B] focus:outline-none"
                        />
                    </div>

                    <div class="space-y-1">
                        <label for="dosen-stakeholder-role" class="block text-[11.5px] font-bold text-[#308242]">
                            Pilih Peran Akses:
                        </label>
                        <select
                            id="dosen-stakeholder-role"
                            data-action="dosen-stakeholder-role"
                            class="w-full min-h-[40px] px-3 border border-[#72C384] focus:border-[#308242] rounded-[4px] bg-white text-[16px] sm:text-[13px] text-[#1E293B] focus:outline-none"
                        >
                            <option value="practitioner" ${d.stakeholderForm.role === 'practitioner' ? 'selected' : ''}>Praktisi (Dosen Industri)</option>
                            <option value="assistant" ${d.stakeholderForm.role === 'assistant' ? 'selected' : ''}>Asisten Praktikum</option>
                            <option value="student" ${d.stakeholderForm.role === 'student' ? 'selected' : ''}>Mahasiswa</option>
                            <option value="lecturer" ${d.stakeholderForm.role === 'lecturer' ? 'selected' : ''}>Dosen Pengampu</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        data-action="dosen-add-stakeholder"
                        ${d.busyAction === 'add-stakeholder' ? 'disabled' : ''}
                        class="min-h-[40px] px-4 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[12.5px] rounded-[4px] transition cursor-pointer disabled:opacity-60 whitespace-nowrap"
                    >
                        ${d.busyAction === 'add-stakeholder' ? 'Menambah...' : '+ Tambah Email'}
                    </button>
                </div>

                <div class="flex flex-wrap items-center gap-3 pt-1">
                    <span class="text-[12px] text-[#64748B]">atau</span>
                    <label class="inline-flex items-center justify-center min-h-[40px] px-4 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[12.5px] rounded-[4px] transition cursor-pointer">
                        <span>${d.importingCsv ? 'Mengimpor CSV/Excel...' : 'Import File CSV Peserta KRS'}</span>
                        <input
                            type="file"
                            accept=".csv,.xlsx,.xls,.txt"
                            data-action="dosen-import-csv"
                            class="hidden"
                        />
                    </label>
                </div>
            </div>

            <!-- Section 2: EMAIL TERDAFTAR SYSTEM -->
            <div class="space-y-3">
                <h2 class="text-[16px] sm:text-[18px] font-bold text-[#486284] tracking-tight">
                    EMAIL TERDAFTAR SYSTEM
                </h2>

                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div class="flex items-center gap-2 flex-1 max-w-[360px]">
                        <span class="text-[12px] font-bold text-[#308242] shrink-0">Search:</span>
                        <input
                            type="search"
                            data-input="dosen-user-search"
                            value="${escapeHtml(d.userSearch || '')}"
                            placeholder="Cari Email / Nama..."
                            class="w-full min-h-[36px] px-3 bg-white border border-[#72C384] focus:border-[#308242] rounded-[4px] text-[16px] sm:text-[12.5px] text-[#1E293B] focus:outline-none"
                        />
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[12px] font-bold text-[#308242]">Filter:</span>
                        <select
                            data-action="dosen-user-role-filter"
                            class="min-h-[36px] px-3 bg-white border border-[#72C384] rounded-[4px] text-[16px] sm:text-[12.5px] text-[#1E293B]"
                        >
                            <option value="" ${!d.userRoleFilter ? 'selected' : ''}>Semua Peran</option>
                            <option value="practitioner" ${d.userRoleFilter === 'practitioner' ? 'selected' : ''}>Praktisi</option>
                            <option value="assistant" ${d.userRoleFilter === 'assistant' ? 'selected' : ''}>Asprak</option>
                            <option value="student" ${d.userRoleFilter === 'student' ? 'selected' : ''}>Mahasiswa</option>
                            <option value="lecturer" ${d.userRoleFilter === 'lecturer' ? 'selected' : ''}>Dosen</option>
                            <option value="admin" ${d.userRoleFilter === 'admin' ? 'selected' : ''}>Master Admin</option>
                        </select>
                    </div>
                </div>

                <div class="hidden md:block bg-white border border-[#8DD99D] rounded-[4px] overflow-x-auto shadow-[0_2px_10px_rgba(48,130,66,0.04)]">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-[#8DD99D] text-[#143D20] text-[11px] font-bold">
                            <tr>
                                <th class="py-2.5 px-3">EMAIL</th>
                                <th class="py-2.5 px-3">NAMA / NIM</th>
                                <th class="py-2.5 px-3">PERAN AKSES</th>
                                <th class="py-2.5 px-3 text-center">STATUS DATA</th>
                                <th class="py-2.5 px-3 text-center w-[64px]">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${userRows}
                        </tbody>
                    </table>
                </div>

                <div class="md:hidden space-y-2.5">
                    ${mobileUserCards}
                </div>

                <div class="flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-[#64748B]">
                    <span>Showing ${fromNum}-${toNum} of ${total}</span>
                    <div class="flex items-center gap-1">
                        <button
                            type="button"
                            data-action="dosen-user-page"
                            data-page="${Math.max(1, currentPage - 1)}"
                            ${currentPage <= 1 ? 'disabled' : ''}
                            class="w-7 h-7 rounded-[4px] border border-[#CBD5E1] flex items-center justify-center cursor-pointer disabled:opacity-40"
                        >
                            ${uiIcons.chevronLeft('w-3.5 h-3.5')}
                        </button>
                        ${pageNumbers}
                        <button
                            type="button"
                            data-action="dosen-user-page"
                            data-page="${Math.min(lastPage, currentPage + 1)}"
                            ${currentPage >= lastPage ? 'disabled' : ''}
                            class="w-7 h-7 rounded-[4px] border border-[#CBD5E1] flex items-center justify-center cursor-pointer disabled:opacity-40"
                        >
                            ${uiIcons.chevronRight('w-3.5 h-3.5')}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Section 3: INPUT DETAIL PROYEK -->
            ${renderGreenProjectFormCard(d.teams, d.projectForm, d.busyAction === 'project', 'dosen')}

            <!-- Section 4: ASSIGN ASISTEN - KELOMPOK -->
            <div class="bg-white border-[1.5px] border-[#308242] rounded-[4px] p-4 sm:p-6 space-y-4 shadow-[0_2px_10px_rgba(48,130,66,0.05)]">
                <div>
                    <h2 class="text-[16px] sm:text-[18px] font-bold text-[#486284] tracking-tight">
                        ASSIGN ASISTEN - KELOMPOK
                    </h2>
                    <p class="text-[11.5px] text-[#5F7693] mt-0.5">
                        Daftar asisten praktikum pendamping kelompok PAD aktif.
                    </p>
                </div>

                <div class="border border-[#8DD99D] rounded-[4px] overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-[#8DD99D] text-[#143D20] text-[11px] font-bold">
                            <tr>
                                <th class="py-2.5 px-4">ASISTEN PRAKTIKUM</th>
                                <th class="py-2.5 px-4">KELOMPOK & PROYEK</th>
                                <th class="py-2.5 px-4 text-center w-[70px]">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${assignRows}
                        </tbody>
                    </table>
                </div>

                <div>
                    <button
                        type="button"
                        data-action="dosen-open-assign-modal"
                        class="w-full sm:w-auto min-w-[200px] min-h-[42px] px-5 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[12.5px] rounded-[4px] shadow-xs transition cursor-pointer"
                    >
                        Assign Asprak
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderBypassTab(state) {
    const d = state.dosen;
    const bf = d.bypassForm;
    const allStudents = Array.isArray(d.allStudents) ? d.allStudents : [];
    const exclusiveTeams = (d.teams || []).filter((t) => t.team_type === 'external');

    const addedIds = new Set(bf.members.map((m) => Number(m.user_id || m.id)));
    const q = String(bf.memberQuery || '').trim().toLowerCase();
    const suggestions = q.length >= 2
        ? allStudents
            .filter((u) => !addedIds.has(Number(u.id)))
            .filter((u) =>
                String(u.name || '').toLowerCase().includes(q) ||
                String(u.email || '').toLowerCase().includes(q) ||
                String(u.student_profile?.nim || '').toLowerCase().includes(q)
            )
            .slice(0, 5)
        : [];

    const memberBars = bf.members.length > 0
        ? bf.members.map((m, idx) => `
            <div class="bg-[#C5E9CD] border border-[#72C384] rounded-[4px] px-3.5 py-2 flex items-center justify-between gap-2 text-[12.5px] font-medium text-[#14532D]">
                <span>${escapeHtml(m.nim || m.email || '-')} | ${escapeHtml(m.name || m.email)}${m.roleLabel ? ` (${escapeHtml(m.roleLabel)})` : ''}</span>
                <button
                    type="button"
                    data-action="dosen-bypass-remove-member"
                    data-index="${idx}"
                    aria-label="Hapus Anggota"
                    class="w-7 h-7 rounded-[4px] hover:bg-[#308242]/15 text-[#14532D] font-bold flex items-center justify-center cursor-pointer"
                >
                    X
                </button>
            </div>
        `).join('')
        : '<p class="text-[12px] text-[#94A3B8] italic py-1">Belum ada anggota ditambahkan. Ketik NIM, Nama, atau Email mahasiswa di atas lalu tekan + Tambah Anggota.</p>';

    const exclusiveRows = exclusiveTeams.length > 0
        ? exclusiveTeams.map((t) => {
            const teamTitle = t.project?.project_name || `Tim Khusus #${t.id}`;
            const lomba = t.project?.project_associate || 'GEMASTIK / LIDM';
            const memberNames = (t.members || []).map((m) => m.name || m.email).filter(Boolean).join(', ') || '-';
            return `
                <tr class="bg-white border-b border-[#B7E1C1] last:border-b-0">
                    <td class="py-3 px-4 text-[12.5px] font-medium text-[#1E293B] border-r border-[#B7E1C1]">
                        ${escapeHtml(teamTitle)}
                    </td>
                    <td class="py-3 px-4 text-[12px] text-[#334155] border-r border-[#B7E1C1]">
                        ${escapeHtml(lomba)}
                    </td>
                    <td class="py-3 px-4 text-[12px] text-[#486284]">
                        <span class="font-semibold text-[#1E293B] mr-2">${t.members_count || t.members?.length || 0} Mahasiswa</span>
                        <span>${escapeHtml(memberNames)}</span>
                    </td>
                </tr>
            `;
        }).join('')
        : `
            <tr>
                <td colspan="3" class="py-6 px-4 text-center text-[12.5px] text-[#64748B]">
                    Belum ada tim GEMASTIK / LIDM terdaftar.
                </td>
            </tr>
        `;

    return `
        <div class="w-full max-w-[780px] mx-auto space-y-6 relative z-10">
            <!-- Form Daftarkan Tim GEMASTIK/LIDM -->
            <div class="bg-white border-[1.5px] border-[#308242] rounded-[4px] p-4 sm:p-6 space-y-4 shadow-[0_2px_10px_rgba(48,130,66,0.05)]">
                <h1 class="text-[16px] sm:text-[18px] font-bold text-[#486284] tracking-tight">
                    DAFTARKAN TIM GEMASTIK/LIDM (BYPASS MATCHING ENGINE)
                </h1>

                <div class="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-3">
                    <div class="space-y-1">
                        <label for="bypass-team-name" class="block text-[11.5px] font-bold text-[#308242]">Nama Tim</label>
                        <input
                            id="bypass-team-name"
                            type="text"
                            data-input="dosen-bypass-team-name"
                            value="${escapeHtml(bf.team_name || '')}"
                            placeholder="Tim Software Gemastik A"
                            class="w-full min-h-[40px] px-3 border border-[#72C384] focus:border-[#308242] rounded-[4px] text-[16px] sm:text-[13px] text-[#1E293B] focus:outline-none"
                        />
                    </div>

                    <div class="space-y-1">
                        <label for="bypass-category" class="block text-[11.5px] font-bold text-[#308242]">Kategori Lomba</label>
                        <select
                            id="bypass-category"
                            data-action="dosen-bypass-category"
                            class="w-full min-h-[40px] px-3 border border-[#72C384] focus:border-[#308242] rounded-[4px] bg-white text-[16px] sm:text-[13px] text-[#1E293B]"
                        >
                            <option value="GEMASTIK - Software Development" ${bf.category === 'GEMASTIK - Software Development' ? 'selected' : ''}>GEMASTIK - Software Development</option>
                            <option value="GEMASTIK" ${bf.category === 'GEMASTIK' ? 'selected' : ''}>GEMASTIK</option>
                            <option value="LIDM - Inovasi Digital" ${bf.category === 'LIDM - Inovasi Digital' ? 'selected' : ''}>LIDM - Inovasi Digital</option>
                            <option value="LIDM" ${bf.category === 'LIDM' ? 'selected' : ''}>LIDM</option>
                        </select>
                    </div>
                </div>

                <!-- Anggota Terikat Input -->
                <div class="space-y-2">
                    <div class="grid grid-cols-1 sm:grid-cols-[120px_1fr_auto] gap-2.5 items-center">
                        <label for="bypass-member-query" class="text-[12px] font-bold text-[#308242]">
                            Anggota Terikat
                        </label>
                        <input
                            id="bypass-member-query"
                            type="text"
                            data-input="dosen-bypass-member-query"
                            value="${escapeHtml(bf.memberQuery || '')}"
                            placeholder="Typing NIM / Nama / Email Mahasiswa..."
                            class="w-full min-h-[40px] px-3 border border-[#72C384] focus:border-[#308242] rounded-[4px] text-[16px] sm:text-[13px] text-[#1E293B] focus:outline-none"
                        />
                        <button
                            type="button"
                            data-action="dosen-bypass-add-member"
                            class="min-h-[40px] px-4 bg-[#308242] hover:bg-[#256834] text-white font-semibold text-[12.5px] rounded-[4px] transition cursor-pointer shrink-0"
                        >
                            + Tambah Anggota
                        </button>
                    </div>

                    ${suggestions.length > 0 ? `
                        <div class="sm:ml-[130px] border border-[#8DD99D] rounded-[4px] bg-white divide-y divide-[#E2F3E7] shadow-xs">
                            ${suggestions.map((u) => `
                                <button
                                    type="button"
                                    data-action="dosen-bypass-pick-suggestion"
                                    data-user-id="${u.id}"
                                    class="w-full px-3 py-2 text-left text-[12px] hover:bg-[#F1FAF3] flex items-center justify-between gap-2 cursor-pointer"
                                >
                                    <span class="font-medium text-[#1E293B]">${escapeHtml(u.student_profile?.nim || '-')} | ${escapeHtml(u.name || u.email)}</span>
                                    <span class="text-[11px] font-semibold text-[#308242]">+ Pilih</span>
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div class="space-y-2 pt-1">
                        ${memberBars}
                    </div>
                </div>

                <div class="pt-1 flex justify-center">
                    <button
                        type="button"
                        data-action="dosen-open-bypass-confirm"
                        ${d.busyAction === 'bypass' ? 'disabled' : ''}
                        class="w-full sm:w-auto min-w-[260px] min-h-[42px] px-6 bg-[#308242] hover:bg-[#256834] text-white font-bold text-[12.5px] rounded-[4px] shadow-xs transition cursor-pointer disabled:opacity-60"
                    >
                        KUNCI & SIMPAN TIM KHUSUS
                    </button>
                </div>
            </div>

            <!-- Table: DAFTAR TIM GEMASTIK/LIDM -->
            <div class="space-y-3">
                <h2 class="text-[16px] sm:text-[18px] font-bold text-[#486284] tracking-tight">
                    DAFTAR TIM GEMASTIK/LIDM
                </h2>

                <div class="bg-white border border-[#8DD99D] rounded-[4px] overflow-x-auto shadow-[0_2px_10px_rgba(48,130,66,0.04)]">
                    <table class="w-full text-left border-collapse min-w-[540px]">
                        <thead class="bg-[#C5E9CD] text-[#143D20] text-[11px] font-bold">
                            <tr>
                                <th class="py-2.5 px-4 border-r border-[#8DD99D]">NAMA TIM</th>
                                <th class="py-2.5 px-4 border-r border-[#8DD99D]">LOMBA</th>
                                <th class="py-2.5 px-4">ANGGOTA</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${exclusiveRows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

export function renderDosenView(state) {
    const d = state.dosen;

    if (state.activeTab === 'dosen-complaints') {
        return renderGreenComplaintsList(d.complaints, d.loading && !d.loaded, 'dosen-open-complaint');
    }
    if (state.activeTab === 'dosen-complaint-detail') {
        return renderGreenComplaintDetail(d.detailComplaint, d.detailComplaintLoading, {
            backAction: 'dosen-back-complaints',
            reviewAction: 'dosen-review-complaint',
            reviewingId: d.reviewingId,
        });
    }

    if (d.loading && !d.loaded) {
        return `
            <div class="w-full max-w-[780px] mx-auto py-14 flex flex-col items-center justify-center gap-3">
                <div class="w-9 h-9 rounded-full border-4 border-[#C5E9CD] border-t-[#308242] animate-spin"></div>
                <p class="text-[13px] font-medium text-[#486284]">Memuat Panel Kontrol Dosen Pengampu...</p>
            </div>
        `;
    }

    if (state.activeTab === 'dosen-user') {
        return renderUserTab(state);
    }
    if (state.activeTab === 'dosen-bypass') {
        return renderBypassTab(state);
    }
    return renderControlTab(state);
}
