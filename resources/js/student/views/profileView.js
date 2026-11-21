import { roleIcon, uiIcons } from '../icons.js';
import { groupRoleSkills } from '../skills.js';
import {
    escapeHtml,
    parseNimStatus,
    roleFullTitle,
    roleShortLabel,
} from '../utils.js';

function renderRolePopover(roles, slot, selectedRole1Id, selectedRole2Id) {
    return `
        <div
            data-dropdown-panel="role-${slot}"
            class="absolute left-0 top-[calc(100%+6px)] lg:left-[calc(100%+12px)] lg:top-0 w-full lg:w-[198px] z-30 bg-white border border-[#83B9EF] rounded-[4px] shadow-[0_8px_22px_rgba(7,115,223,0.14)] overflow-hidden animate-modal-in"
        >
            ${roles.map((role) => {
                const isTakenByRole1 = slot === 2 && Number(role.id) === Number(selectedRole1Id);
                const isSelected = slot === 1
                    ? Number(role.id) === Number(selectedRole1Id)
                    : Number(role.id) === Number(selectedRole2Id);

                if (isTakenByRole1) {
                    return `
                        <div
                            aria-disabled="true"
                            class="w-full px-3.5 py-2.5 min-h-[40px] flex items-center justify-between gap-2 text-[12.5px] italic text-slate-400 bg-slate-50 border-b last:border-b-0 border-[#83B9EF]/60 cursor-not-allowed"
                        >
                            <span class="flex items-center gap-2.5 truncate">
                                ${roleIcon(role.code, 'w-4 h-4 text-slate-300 shrink-0')}
                                <span class="truncate">${escapeHtml(roleShortLabel(role.code, role.name))}</span>
                            </span>
                            <span class="text-[10px] not-italic font-medium text-slate-400 shrink-0">Role 1</span>
                        </div>
                    `;
                }

                return `
                    <button
                        type="button"
                        data-action="select-role"
                        data-slot="${slot}"
                        data-role-id="${role.id}"
                        class="w-full px-3.5 py-2.5 min-h-[40px] flex items-center justify-between gap-2 text-[12.5px] italic text-[#486284] hover:bg-[#EDF5FF] transition border-b last:border-b-0 border-[#83B9EF]/70 text-left cursor-pointer ${isSelected ? 'bg-[#E6F2FF] font-semibold text-[#0773DF]' : ''}"
                    >
                        <span class="flex items-center gap-2.5 truncate">
                            ${roleIcon(role.code, 'w-4 h-4 text-[#0773DF] shrink-0')}
                            <span class="truncate">${escapeHtml(roleShortLabel(role.code, role.name))}</span>
                        </span>
                        ${isSelected ? `<span class="text-[#0773DF] shrink-0">${uiIcons.check('w-3.5 h-3.5')}</span>` : ''}
                    </button>
                `;
            }).join('')}
        </div>
    `;
}

function renderProfileStep(state) {
    const { config, roles, form, openRoleDropdown, avatarPreview, avatarUploading } = state.profiling;
    const isLocked = Boolean(config.is_locked);
    const isBypass = Boolean(config.is_bypass) || config.role_2_status === 'disabled';
    const isRole2Required = Boolean(config.is_role_2_required);

    const role1 = roles.find((r) => Number(r.id) === Number(form.role_1_id)) || null;
    const role2 = roles.find((r) => Number(r.id) === Number(form.role_2_id)) || null;
    const avatarUrl = avatarPreview || state.user?.avatar_link;
    const nimStatus = parseNimStatus(form.nim);

    return `
        <div class="w-full max-w-[770px] mx-auto relative z-10">
            <!-- Title Box -->
            <div class="border border-[#83B9EF] bg-white px-5 py-2.5 sm:px-6 sm:py-3 mb-4 sm:mb-5">
                <h1 class="text-[26px] sm:text-[34px] font-bold text-[#486284] leading-tight tracking-tight">Profile</h1>
            </div>

            <!-- Main Card -->
            <div class="border border-[#83B9EF] bg-white p-5 sm:p-7 lg:px-8 lg:py-8">
                ${isLocked ? `
                    <div class="mb-5 border border-[#83B9EF] bg-[#F0F7FF] rounded-[6px] px-4 py-2.5 flex items-center gap-2.5 text-[12.5px] text-[#045DDA] font-medium">
                        ${uiIcons.lockClosed('w-4 h-4 shrink-0')}
                        <span>Form profiling telah dikunci oleh dosen pengampu. Data profil hanya dapat dilihat.</span>
                    </div>
                ` : ''}

                <div class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-7">
                    <!-- Left Avatar Column -->
                    <div class="w-full md:w-[158px] flex flex-col items-center shrink-0 pt-1">
                        <div class="w-[122px] h-[122px] sm:w-[144px] sm:h-[144px] rounded-full border border-[#83B9EF] bg-white overflow-hidden flex items-center justify-center">
                            ${avatarUrl
                                ? `<img src="${escapeHtml(avatarUrl)}" alt="Foto Profil Mahasiswa" class="w-full h-full object-cover" />`
                                : uiIcons.avatarPlaceholder('w-[86%] h-[86%] text-[#0773DF]')
                            }
                        </div>

                        <div class="mt-3 flex items-center justify-center gap-2">
                            <input
                                type="file"
                                id="profile-avatar-input"
                                data-action="upload-avatar"
                                accept="image/png,image/jpeg,image/webp"
                                class="hidden"
                                ${isLocked ? 'disabled' : ''}
                            />
                            <label
                                for="profile-avatar-input"
                                class="inline-flex items-center gap-2 ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group'}"
                            >
                                <span class="bg-[#0773DF] group-hover:bg-[#0561BF] text-white rounded-[4px] px-2 py-1 inline-flex items-center justify-center transition shadow-2xs">
                                    ${uiIcons.uploadTray('w-3.5 h-3.5 text-white')}
                                </span>
                                <span class="text-[11px] sm:text-[11.5px] italic text-[#5F7693] group-hover:text-[#0773DF] transition">
                                    ${avatarUploading ? 'Mengunggah foto...' : 'Upload Your Best Look!'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- Right Form Column (sized so right-side Role popover stays completely inside card on lg+) -->
                    <div class="w-full md:flex-1 lg:flex-none lg:w-[325px] max-w-[395px] space-y-3">
                        <!-- 1. Nama -->
                        <div class="flex items-center border border-[#83B9EF] focus-within:border-[#0773DF] focus-within:ring-1 focus-within:ring-[#83B9EF] rounded-[5px] bg-white h-[42px] sm:h-[38px] px-3 gap-2.5 transition">
                            ${uiIcons.userEdit('w-4 h-4 text-[#0773DF] shrink-0')}
                            <input
                                type="text"
                                data-input="profile-name"
                                value="${escapeHtml(form.name)}"
                                placeholder="Nama Kamu siapa?"
                                ${isLocked ? 'readonly' : ''}
                                class="w-full bg-transparent text-[12.5px] sm:text-[13px] ${form.name ? 'not-italic text-[#181C1F]' : 'italic'} placeholder:italic placeholder:text-[#5F7693] focus:outline-none"
                            />
                        </div>

                        <!-- 2. Email (read-only) -->
                        <div class="flex items-center border border-[#83B9EF] rounded-[5px] bg-[#FAFBFD] h-[42px] sm:h-[38px] px-3 gap-2.5">
                            ${uiIcons.envelope('w-4 h-4 text-[#0773DF] shrink-0')}
                            <span class="w-full text-[12.5px] text-[#0773DF] truncate select-all">${escapeHtml(form.email || state.user?.email || '-')}</span>
                        </div>

                        <!-- 3. NIM / Angkatan -->
                        <div>
                            <div class="flex items-center border border-[#83B9EF] focus-within:border-[#0773DF] focus-within:ring-1 focus-within:ring-[#83B9EF] rounded-[5px] bg-white h-[42px] sm:h-[38px] px-3 gap-2.5 transition">
                                ${uiIcons.hashtag('w-4 h-4 text-[#0773DF] shrink-0')}
                                <input
                                    type="text"
                                    data-input="profile-nim"
                                    value="${escapeHtml(form.nim)}"
                                    placeholder="Angkatan Berapa Nihh"
                                    ${isLocked ? 'readonly' : ''}
                                    class="w-full bg-transparent text-[12.5px] sm:text-[13px] ${form.nim ? 'not-italic text-[#181C1F]' : 'italic'} placeholder:italic placeholder:text-[#5F7693] focus:outline-none"
                                />
                            </div>
                            <div id="nim-status-helper" class="mt-1 px-0.5 text-[10.5px] leading-tight">
                                ${nimStatus.empty
                                    ? '<span class="text-[#5F7693]">Format NIM UGM: <span class="font-mono">21/471001/SV/19001</span></span>'
                                    : nimStatus.valid
                                        ? `<span class="text-[#308242] font-medium">Format NIM valid • Angkatan ${escapeHtml(nimStatus.angkatan)}</span>`
                                        : '<span class="text-amber-600 font-medium">Gunakan format NIM UGM: 21/471001/SV/19001</span>'
                                }
                            </div>
                        </div>

                        <!-- 4. Role 1 Dropdown -->
                        <div class="relative">
                            <button
                                type="button"
                                data-action="toggle-role-dropdown"
                                data-slot="1"
                                ${isLocked ? 'disabled' : ''}
                                aria-expanded="${openRoleDropdown === 1 ? 'true' : 'false'}"
                                class="w-full flex items-center justify-between border border-[#83B9EF] hover:border-[#0773DF] rounded-[5px] bg-white h-[42px] sm:h-[38px] px-3 gap-2.5 text-left transition ${isLocked ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}"
                            >
                                <span class="flex items-center gap-2.5 min-w-0">
                                    ${role1
                                        ? roleIcon(role1.code, 'w-4 h-4 text-[#0773DF] shrink-0')
                                        : uiIcons.userPlus('w-4 h-4 text-[#0773DF] shrink-0')
                                    }
                                    <span class="text-[12.5px] italic truncate ${role1 ? 'text-[#181C1F] font-medium' : 'text-[#5F7693]'}">
                                        ${role1 ? escapeHtml(roleShortLabel(role1.code, role1.name)) : 'Kamu jago apa? Pilih Role Kamu'}
                                    </span>
                                </span>
                                <span class="text-[#0773DF] shrink-0 transition-transform duration-150 ${openRoleDropdown === 1 ? 'rotate-180' : ''}">
                                    ${uiIcons.chevronDown('w-3.5 h-3.5')}
                                </span>
                            </button>
                            ${openRoleDropdown === 1 ? renderRolePopover(roles, 1, form.role_1_id, form.role_2_id) : ''}
                        </div>

                        <!-- 5. Role 2 Dropdown (Branch: Disabled for Bypass vs Optional/Required) -->
                        <div class="relative">
                            ${isBypass ? `
                                <div
                                    aria-disabled="true"
                                    title="Akun jalur bypass (GEMASTIK/LIDM) hanya memilih 1 role utama"
                                    class="w-full flex items-center border border-[#83B9EF] rounded-[5px] bg-[#F8FAFC] h-[42px] sm:h-[38px] px-3 gap-2.5 cursor-not-allowed"
                                >
                                    ${uiIcons.userPlus('w-4 h-4 text-[#64748B] shrink-0')}
                                    <span class="text-[12.5px] italic text-[#64748B] truncate">Gabisa ambil role kedua :(</span>
                                </div>
                            ` : `
                                <div class="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        data-action="toggle-role-dropdown"
                                        data-slot="2"
                                        ${isLocked ? 'disabled' : ''}
                                        aria-expanded="${openRoleDropdown === 2 ? 'true' : 'false'}"
                                        class="flex-1 min-w-0 flex items-center justify-between border border-[#83B9EF] hover:border-[#0773DF] rounded-[5px] bg-white h-[42px] sm:h-[38px] px-3 gap-2 text-left transition ${isLocked ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}"
                                    >
                                        <span class="flex items-center gap-2.5 min-w-0">
                                            ${role2
                                                ? roleIcon(role2.code, 'w-4 h-4 text-[#0773DF] shrink-0')
                                                : uiIcons.userPlus('w-4 h-4 text-[#0773DF] shrink-0')
                                            }
                                            <span class="text-[12.5px] italic truncate ${role2 ? 'text-[#181C1F] font-medium' : 'text-[#5F7693]'}">
                                                ${role2 ? escapeHtml(roleShortLabel(role2.code, role2.name)) : 'Eurm, bisa ambil role kedua nih! Pilih role kamu ya!'}
                                            </span>
                                        </span>
                                        <span class="flex items-center gap-1.5 shrink-0">
                                            ${isRole2Required && !role2 ? '<span class="text-[10px] not-italic font-semibold bg-[#E6F2FF] text-[#0773DF] px-1.5 py-0.5 rounded">Wajib</span>' : ''}
                                            <span class="text-[#0773DF] transition-transform duration-150 ${openRoleDropdown === 2 ? 'rotate-180' : ''}">
                                                ${uiIcons.chevronDown('w-3.5 h-3.5')}
                                            </span>
                                        </span>
                                    </button>
                                    ${role2 && !isRole2Required && !isLocked ? `
                                        <button
                                            type="button"
                                            data-action="clear-role-2"
                                            title="Hapus pilihan role ke-2"
                                            class="h-[42px] sm:h-[38px] px-2.5 border border-[#83B9EF] hover:border-red-400 hover:text-red-500 rounded-[5px] text-[#5F7693] text-[13px] font-bold transition cursor-pointer"
                                        >&times;</button>
                                    ` : ''}
                                </div>
                                ${openRoleDropdown === 2 ? renderRolePopover(roles, 2, form.role_1_id, form.role_2_id) : ''}
                            `}
                        </div>

                        <!-- 6. Portofolio -->
                        <div class="flex items-center border border-[#83B9EF] focus-within:border-[#0773DF] focus-within:ring-1 focus-within:ring-[#83B9EF] rounded-[5px] bg-white h-[42px] sm:h-[38px] px-3 gap-2.5 transition">
                            ${uiIcons.docEdit('w-4 h-4 text-[#0773DF] shrink-0')}
                            <input
                                type="text"
                                data-input="profile-portfolio"
                                value="${escapeHtml(form.portfolio_link)}"
                                placeholder="Kamu punya portofolio? Bisa banget ditambah!"
                                ${isLocked ? 'readonly' : ''}
                                class="w-full bg-transparent text-[12.5px] sm:text-[13px] ${form.portfolio_link ? 'not-italic text-[#181C1F]' : 'italic'} placeholder:italic placeholder:text-[#5F7693] focus:outline-none"
                            />
                        </div>

                        <!-- 7. Selanjutnya Button -->
                        <div class="pt-1">
                            <button
                                type="button"
                                data-action="go-skillset"
                                class="bg-[#0773DF] hover:bg-[#0561BF] text-white font-semibold text-[12.5px] px-4 py-2 min-h-[40px] sm:min-h-[34px] rounded-[5px] inline-flex items-center gap-2 transition shadow-xs cursor-pointer"
                            >
                                ${uiIcons.arrowRight('w-3.5 h-3.5 text-white')}
                                <span>Selanjutnya</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderSkillsetStep(state) {
    const { config, roles, form, activeSkillRoleSlot, submitting } = state.profiling;
    const isLocked = Boolean(config.is_locked);
    const role1 = roles.find((r) => Number(r.id) === Number(form.role_1_id)) || null;
    const role2 = !config.is_bypass && config.role_2_status !== 'disabled'
        ? roles.find((r) => Number(r.id) === Number(form.role_2_id)) || null
        : null;

    const currentSlot = activeSkillRoleSlot === 2 && role2 ? 2 : 1;
    const activeRole = currentSlot === 2 ? role2 : role1;
    const groups = groupRoleSkills(activeRole);

    const countSelectedForRole = (role) => {
        if (!role || !Array.isArray(role.skills)) return 0;
        return role.skills.filter((s) => form.skill_ids.has(Number(s.id))).length;
    };

    return `
        <div class="w-full max-w-[770px] mx-auto relative z-10">
            <!-- Title Box -->
            <div class="border border-[#83B9EF] bg-white px-5 py-2.5 sm:px-6 sm:py-3 mb-4 sm:mb-5">
                <h1 class="text-[26px] sm:text-[34px] font-bold text-[#486284] leading-tight tracking-tight">Skillset Form</h1>
            </div>

            <!-- Main Card -->
            <div class="border border-[#83B9EF] bg-white p-5 sm:p-7 lg:px-8 lg:py-7 space-y-4">
                <!-- Role Header + Back Button -->
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <h2 class="text-[18px] sm:text-[20px] font-bold text-[#0773DF] underline underline-offset-4 decoration-2">
                        ${escapeHtml(roleFullTitle(activeRole?.code, activeRole?.name))}
                    </h2>

                    <button
                        type="button"
                        data-action="back-to-profile"
                        class="bg-[#0773DF] hover:bg-[#0561BF] text-white font-semibold text-[12px] px-3.5 py-1.5 min-h-[36px] sm:min-h-[30px] rounded-[5px] inline-flex items-center gap-1.5 transition cursor-pointer"
                    >
                        ${uiIcons.arrowLeft('w-3.5 h-3.5 text-white')}
                        <span>Kembali</span>
                    </button>
                </div>

                ${role2 ? `
                    <div class="flex flex-wrap items-center gap-2 pb-1">
                        <button
                            type="button"
                            data-action="switch-skill-role"
                            data-slot="1"
                            class="px-3 py-1.5 rounded-[5px] text-[12px] font-semibold border transition cursor-pointer ${currentSlot === 1
                                ? 'bg-[#0773DF] border-[#0773DF] text-white'
                                : 'bg-white border-[#83B9EF] text-[#486284] hover:bg-[#F0F7FF]'
                            }"
                        >
                            Role 1: ${escapeHtml(roleShortLabel(role1?.code, role1?.name))} (${countSelectedForRole(role1)})
                        </button>
                        <button
                            type="button"
                            data-action="switch-skill-role"
                            data-slot="2"
                            class="px-3 py-1.5 rounded-[5px] text-[12px] font-semibold border transition cursor-pointer ${currentSlot === 2
                                ? 'bg-[#0773DF] border-[#0773DF] text-white'
                                : 'bg-white border-[#83B9EF] text-[#486284] hover:bg-[#F0F7FF]'
                            }"
                        >
                            Role 2: ${escapeHtml(roleShortLabel(role2?.code, role2?.name))} (${countSelectedForRole(role2)})
                        </button>
                    </div>
                ` : ''}

                <!-- Categorized Skill Checkboxes -->
                ${groups.length === 0 ? `
                    <div class="border border-[#83B9EF] rounded-[6px] p-6 text-center text-[13px] text-[#5F7693]">
                        Belum ada item skillset terdaftar untuk role ini.
                    </div>
                ` : `
                    <div class="space-y-4">
                        ${groups.map((group) => `
                            <div>
                                <h3 class="text-[12.5px] sm:text-[13px] font-bold text-[#486284] mb-1.5">
                                    ${escapeHtml(group.title)}
                                </h3>
                                <div class="border border-[#83B9EF] rounded-[5px] px-3.5 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                                    ${group.skills.map((skill) => {
                                        const checked = form.skill_ids.has(Number(skill.id));
                                        return `
                                            <label class="flex items-center gap-2.5 min-h-[38px] sm:min-h-[28px] select-none ${isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer group'}">
                                                <input
                                                    type="checkbox"
                                                    data-action="toggle-skill"
                                                    data-skill-id="${skill.id}"
                                                    ${checked ? 'checked' : ''}
                                                    ${isLocked ? 'disabled' : ''}
                                                    class="sr-only"
                                                />
                                                <span class="w-[20px] h-[20px] sm:w-[18px] sm:h-[18px] rounded-[4px] border shrink-0 flex items-center justify-center transition ${checked
                                                    ? 'bg-[#0773DF] border-[#0773DF] text-white'
                                                    : 'bg-white border-[#83B9EF] group-hover:border-[#0773DF]'
                                                }">
                                                    ${checked ? uiIcons.check('w-3.5 h-3.5 text-white') : ''}
                                                </span>
                                                <span class="text-[12px] text-[#486284] leading-snug">
                                                    ${escapeHtml(skill.name)}
                                                </span>
                                            </label>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}

                <!-- Bottom Actions -->
                <div class="pt-2 flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        data-action="submit-profile-check"
                        ${isLocked || submitting ? 'disabled' : ''}
                        class="bg-[#308242] hover:bg-[#256834] disabled:opacity-55 text-white font-semibold text-[12.5px] min-w-[120px] min-h-[42px] sm:min-h-[34px] px-5 rounded-[5px] transition shadow-xs cursor-pointer"
                    >
                        ${submitting ? 'Menyimpan...' : 'Simpannn!!'}
                    </button>

                    <button
                        type="button"
                        data-action="clear-role-skills"
                        data-role-id="${activeRole?.id || ''}"
                        ${isLocked || submitting ? 'disabled' : ''}
                        class="bg-[#9EA2AE] hover:bg-[#858A98] disabled:opacity-55 text-white font-semibold text-[12.5px] min-w-[120px] min-h-[42px] sm:min-h-[34px] px-5 rounded-[5px] transition shadow-xs cursor-pointer"
                    >
                        Clear
                    </button>

                    ${role2 && currentSlot === 1 ? `
                        <button
                            type="button"
                            data-action="switch-skill-role"
                            data-slot="2"
                            class="sm:ml-auto border border-[#0773DF] text-[#0773DF] hover:bg-[#F0F7FF] font-semibold text-[12px] min-h-[42px] sm:min-h-[34px] px-3.5 rounded-[5px] inline-flex items-center gap-1.5 transition cursor-pointer"
                        >
                            <span>Lanjut Skill Role 2</span>
                            ${uiIcons.arrowRight('w-3.5 h-3.5 text-[#0773DF]')}
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

export function renderProfileView(state) {
    if (state.profiling.loading && !state.profiling.loaded) {
        return `
            <div class="w-full max-w-[820px] mx-auto relative z-10 py-16 flex flex-col items-center justify-center gap-3">
                <div class="w-9 h-9 rounded-full border-4 border-[#C0DDF9] border-t-[#0773DF] animate-spin"></div>
                <p class="text-[13px] font-medium text-[#486284]">Memuat konfigurasi profiling...</p>
            </div>
        `;
    }

    if (state.profiling.error && !state.profiling.loaded) {
        return `
            <div class="w-full max-w-[600px] mx-auto relative z-10 border border-[#83B9EF] bg-white p-6 text-center space-y-3">
                <p class="text-[14px] font-semibold text-[#486284]">${escapeHtml(state.profiling.error)}</p>
                <button type="button" data-action="retry-tab" class="bg-[#0773DF] hover:bg-[#0561BF] text-white text-[13px] font-semibold px-4 py-2 rounded-[5px] cursor-pointer">
                    Muat Ulang
                </button>
            </div>
        `;
    }

    return state.profiling.step === 'skillset'
        ? renderSkillsetStep(state)
        : renderProfileStep(state);
}
