import { normalizeRoleCode } from './utils.js';

export function flower8Petal(className = 'w-20 h-20') {
    const petals = Array.from({ length: 8 }, (_, i) => {
        const angle = i * 45;
        return `<ellipse cx="50" cy="22" rx="13" ry="18" fill="#A2CEF9" transform="rotate(${angle} 50 50)"/>`;
    }).join('');

    const innerCenter = Array.from({ length: 8 }, (_, i) => {
        const angle = i * 45;
        return `<circle cx="50" cy="37" r="6" fill="#045DDA" transform="rotate(${angle} 50 50)"/>`;
    }).join('');

    return `
        <svg viewBox="0 0 100 100" fill="none" class="${className}" aria-hidden="true">
            ${petals}
            ${innerCenter}
            <circle cx="50" cy="50" r="11" fill="#045DDA"/>
        </svg>
    `;
}

export function flower6Petal(className = 'w-20 h-20') {
    const petals = Array.from({ length: 6 }, (_, i) => {
        const angle = i * 60;
        return `<ellipse cx="50" cy="23" rx="14" ry="19" fill="#A2CEF9" transform="rotate(${angle} 50 50)"/>`;
    }).join('');

    const dots = Array.from({ length: 6 }, (_, i) => {
        const angle = i * 60;
        return `<circle cx="50" cy="39" r="5" fill="#045DDA" transform="rotate(${angle} 50 50)"/>`;
    }).join('');

    return `
        <svg viewBox="0 0 100 100" fill="none" class="${className}" aria-hidden="true">
            ${petals}
            ${dots}
            <circle cx="50" cy="50" r="9.5" fill="#045DDA"/>
        </svg>
    `;
}

export function flower5Petal(className = 'w-20 h-20') {
    const petals = Array.from({ length: 5 }, (_, i) => {
        const angle = i * 72;
        return `
            <g transform="rotate(${angle} 50 50)">
                <path d="M50 47 C38 38, 33 22, 43 13 C46 10, 49 14, 50 17 C51 14, 54 10, 57 13 C67 22, 62 38, 50 47 Z" fill="#A2CEF9"/>
            </g>
        `;
    }).join('');

    const centerArms = Array.from({ length: 5 }, (_, i) => {
        const angle = i * 72;
        return `<ellipse cx="50" cy="39" rx="4.5" ry="9" fill="#045DDA" transform="rotate(${angle} 50 50)"/>`;
    }).join('');

    return `
        <svg viewBox="0 0 100 100" fill="none" class="${className}" aria-hidden="true">
            ${petals}
            ${centerArms}
            <circle cx="50" cy="50" r="7.5" fill="#045DDA"/>
        </svg>
    `;
}

export function flowerStar6Petal(className = 'w-20 h-20') {
    const petals = Array.from({ length: 6 }, (_, i) => {
        const angle = i * 60;
        return `<path d="M50 48 C43 37, 42 20, 50 8 C58 20, 57 37, 50 48 Z" fill="#A2CEF9" transform="rotate(${angle} 50 50)"/>`;
    }).join('');

    const centerArms = Array.from({ length: 6 }, (_, i) => {
        const angle = i * 60;
        return `<path d="M50 49 L46 37 L50 31 L54 37 Z" fill="#045DDA" transform="rotate(${angle} 50 50)"/>`;
    }).join('');

    return `
        <svg viewBox="0 0 100 100" fill="none" class="${className}" aria-hidden="true">
            ${petals}
            ${centerArms}
            <circle cx="50" cy="50" r="7" fill="#045DDA"/>
        </svg>
    `;
}

export function roleIcon(codeOrName, className = 'w-4 h-4 text-[#0773DF]') {
    const code = normalizeRoleCode(codeOrName);
    switch (code) {
        case 'PM':
            return `
                <svg viewBox="0 0 24 24" fill="currentColor" class="${className}" aria-hidden="true">
                    <path d="M4 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4Zm3.25 13.5a1.25 1.25 0 0 1-1.25-1.25v-3.5a1.25 1.25 0 1 1 2.5 0v3.5A1.25 1.25 0 0 1 7.25 16.5Zm4.75 0a1.25 1.25 0 0 1-1.25-1.25v-7.5a1.25 1.25 0 1 1 2.5 0v7.5A1.25 1.25 0 0 1 12 16.5Zm4.75 0a1.25 1.25 0 0 1-1.25-1.25v-5.25a1.25 1.25 0 1 1 2.5 0v5.25a1.25 1.25 0 0 1-1.25 1.25Z"/>
                </svg>
            `;
        case 'UIUX':
            return `
                <svg viewBox="0 0 24 24" fill="currentColor" class="${className}" aria-hidden="true">
                    <path d="M19.8 3.2a1.7 1.7 0 0 1 0 2.4l-6.9 6.9-2.4-2.4 6.9-6.9a1.7 1.7 0 0 1 2.4 0ZM9.2 11.4l2.4 2.4-1.3 1.3 1.7 1.7c.7.7.7 1.8 0 2.4-.7.6-1.9 1.1-3.3 1.4-2.1.4-4.7.3-5.7-.2-.3-.2-.4-.6-.2-.9.9-1.2 1.8-2.8 2.2-4.6.3-1.4.8-2.3 1.5-3l1.7 1.7 1-1.2Zm7.5 2.4c1.3 1.3 2.3 2.7 2.3 4a2.3 2.3 0 0 1-4.6 0c0-1.3 1-2.7 2.3-4Z"/>
                </svg>
            `;
        case 'FE':
            return `
                <svg viewBox="0 0 24 24" fill="currentColor" class="${className}" aria-hidden="true">
                    <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-6.5l1.2 2h1.8a1 1 0 1 1 0 2h-9a1 1 0 1 1 0-2h1.8l1.2-2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v10h16V6H4Zm7 1.75a1 1 0 0 1 2 0V10h2.25a1 1 0 1 1 0 2H13v2.25a1 1 0 1 1-2 0V12H8.75a1 1 0 1 1 0-2H11V7.75Z"/>
                </svg>
            `;
        case 'BE':
            return `
                <svg viewBox="0 0 24 24" fill="currentColor" class="${className}" aria-hidden="true">
                    <ellipse cx="12" cy="5.5" rx="8" ry="3"/>
                    <path d="M4 8.2v3.3c0 1.66 3.58 3 8 3s8-1.34 8-3V8.2c-1.74 1.13-4.66 1.8-8 1.8s-6.26-.67-8-1.8Z"/>
                    <path d="M4 13.7V17c0 1.66 3.58 3 8 3s8-1.34 8-3v-3.3c-1.74 1.13-4.66 1.8-8 1.8s-6.26-.67-8-1.8Z"/>
                </svg>
            `;
        default:
            return uiIcons.userPlus(className);
    }
}

export function playingCardBackSvg() {
    const mandalaPetals = Array.from({ length: 12 }, (_, i) => {
        const angle = i * 30;
        return `<path d="M100 135 C92 120, 93 102, 100 94 C107 102, 108 120, 100 135 Z" fill="#0773DF" stroke="#FFFFFF" stroke-width="1.8" transform="rotate(${angle} 100 145)"/>`;
    }).join('');

    const outerScrolls = [0, 180].map((rot) => `
        <g transform="rotate(${rot} 100 145)">
            <path d="M30 50 C45 30, 82 32, 100 58 C118 32, 155 30, 170 50 C176 62, 165 82, 146 82 C132 82, 126 68, 134 58" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
            <path d="M30 50 C25 70, 38 92, 58 88 C70 85, 74 70, 66 60" fill="none" stroke="#83B9EF" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M100 28 C82 28, 70 42, 74 58 C80 72, 95 75, 100 64 C105 75, 120 72, 126 58 C130 42, 118 28, 100 28 Z" fill="#0773DF" stroke="#FFFFFF" stroke-width="2.2"/>
            <path d="M40 94 C54 88, 65 98, 60 112 C56 122, 42 120, 38 108 Z" fill="#83B9EF" stroke="#FFFFFF" stroke-width="1.6"/>
            <path d="M160 94 C146 88, 135 98, 140 112 C144 122, 158 120, 162 108 Z" fill="#83B9EF" stroke="#FFFFFF" stroke-width="1.6"/>
            <circle cx="48" cy="54" r="5" fill="#FFFFFF"/>
            <circle cx="152" cy="54" r="5" fill="#FFFFFF"/>
            <circle cx="100" cy="48" r="4" fill="#A2CEF9"/>
            <circle cx="72" cy="76" r="3" fill="#FFFFFF"/>
            <circle cx="128" cy="76" r="3" fill="#FFFFFF"/>
        </g>
    `).join('');

    return `
        <svg viewBox="0 0 200 290" class="w-full h-full rounded-[10px]" aria-hidden="true">
            <rect x="0" y="0" width="200" height="290" rx="10" fill="#FFFFFF"/>
            <rect x="9" y="9" width="182" height="272" rx="6" fill="none" stroke="#486284" stroke-width="3" stroke-dasharray="3 3"/>
            <rect x="14" y="14" width="172" height="262" rx="4" fill="#045DDA"/>
            <path d="M18 18 H182 V272 H18 Z" fill="none" stroke="#83B9EF" stroke-width="2"/>
            <path d="M22 145 C22 86, 52 38, 100 32 C148 38, 178 86, 178 145 C178 204, 148 252, 100 258 C52 252, 22 204, 22 145 Z" fill="#0773DF" opacity="0.55"/>
            ${outerScrolls}
            <circle cx="100" cy="145" r="44" fill="#045DDA" stroke="#FFFFFF" stroke-width="2.5"/>
            ${mandalaPetals}
            <circle cx="100" cy="145" r="14" fill="#FFFFFF"/>
            <circle cx="100" cy="145" r="8" fill="#045DDA"/>
            <circle cx="100" cy="145" r="3.5" fill="#83B9EF"/>
        </svg>
    `;
}

export const uiIcons = {
    avatarPlaceholder: (className = 'w-full h-full text-[#0773DF]') => `
        <svg viewBox="0 0 120 120" fill="none" class="${className}" aria-hidden="true">
            <circle cx="60" cy="40" r="17" stroke="currentColor" stroke-width="1.8"/>
            <path d="M24 102 C24 76, 36 66, 60 66 C84 66, 96 76, 96 102" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
    `,
    userEdit: (className = 'w-4 h-4 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="currentColor" class="${className}" aria-hidden="true">
            <path d="M10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 10.6-6l-2.3 2.3-.5 2.4 2.4-.5L15 16.4A7 7 0 0 1 3 20Zm15.4-7.8 1.4 1.4-4.7 4.7-1.9.5.5-1.9 4.7-4.7Z"/>
        </svg>
    `,
    envelope: (className = 'w-4 h-4 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="currentColor" class="${className}" aria-hidden="true">
            <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.4l8 5 8-5V7H4Zm0 2.7V17h16V9.7l-7.5 4.7a1 1 0 0 1-1 0L4 9.7Z"/>
        </svg>
    `,
    hashtag: (className = 'w-4 h-4 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" class="${className}" aria-hidden="true">
            <path d="M10 4 7 20M17 4l-3 16M4 9h16M3 15h16"/>
        </svg>
    `,
    userPlus: (className = 'w-4 h-4 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="currentColor" class="${className}" aria-hidden="true">
            <path d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6 8a6 6 0 0 1 12 0H3Zm15-9V8h2v3h3v2h-3v3h-2v-3h-3v-2h3Z"/>
        </svg>
    `,
    docEdit: (className = 'w-4 h-4 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="currentColor" class="${className}" aria-hidden="true">
            <path d="M6 2h8l5 5v6.5l-5.7 5.7-.8 2.8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.5V8h4.5L13 3.5Zm7.2 10.6 1.7 1.7-5.1 5.1-2.2.5.5-2.2 5.1-5.1Z"/>
        </svg>
    `,
    uploadTray: (className = 'w-3.5 h-3.5 text-white') => `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">
            <path d="M12 15V4m0 0-4 4m4-4 4 4M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>
        </svg>
    `,
    arrowRight: (className = 'w-3.5 h-3.5') => `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">
            <path d="M5 12h14m-6-6 6 6-6 6"/>
        </svg>
    `,
    arrowLeft: (className = 'w-3.5 h-3.5') => `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">
            <path d="M19 12H5m6 6-6-6 6-6"/>
        </svg>
    `,
    idCard: (className = 'w-4 h-4 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="currentColor" class="${className}" aria-hidden="true">
            <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm5.5 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-3.2 4.5h6.4a2.7 2.7 0 0 0-3.2-2.4 2.7 2.7 0 0 0-3.2 2.4ZM14 9h5v1.8h-5V9Zm0 3.6h5v1.8h-5v-1.8Z"/>
        </svg>
    `,
    clipboardQuestion: (className = 'w-4 h-4 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="currentColor" class="${className}" aria-hidden="true">
            <path d="M9 2h6a1 1 0 0 1 1 1v1h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V3a1 1 0 0 1 1-1Zm3 6.2c-1.5 0-2.7 1-2.7 2.3h1.8c0-.5.4-.8.9-.8s.9.3.9.7c0 .4-.2.6-.7 1-.7.5-1 1-1 1.9v.4h1.8v-.3c0-.5.2-.8.7-1.1.7-.5 1.2-1.1 1.2-2 0-1.3-1.2-2.1-2.9-2.1Zm-1 7.6v2h2v-2h-2Z"/>
        </svg>
    `,
    fileDoc: (className = 'w-4 h-4 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="currentColor" class="${className}" aria-hidden="true">
            <path d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.5V8h4.5L13 3.5Z"/>
        </svg>
    `,
    pencil: (className = 'w-4 h-4 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="currentColor" class="${className}" aria-hidden="true">
            <path d="m16.9 3.6 3.5 3.5-11 11-4.1.6.6-4.1 11-11Z"/>
        </svg>
    `,
    check: (className = 'w-3.5 h-3.5') => `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">
            <path d="M5 13l4 4L19 7"/>
        </svg>
    `,
    chevronDown: (className = 'w-3.5 h-3.5') => `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">
            <path d="m6 9 6 6 6-6"/>
        </svg>
    `,
    userOutline: (className = 'w-4 h-4 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">
            <circle cx="12" cy="8" r="4"/>
            <path d="M5 20a7 7 0 0 1 14 0"/>
        </svg>
    `,
    logoutOutline: (className = 'w-4 h-4 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">
            <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8"/>
            <path d="M10 12h10m-3-3 3 3-3 3"/>
        </svg>
    `,
    projectTree: (className = 'w-4 h-4 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="currentColor" class="${className}" aria-hidden="true">
            <rect x="3" y="3" width="6" height="5" rx="1"/>
            <rect x="15" y="3" width="6" height="5" rx="1"/>
            <rect x="9" y="16" width="6" height="5" rx="1"/>
            <path d="M6 8v4h12V8h-2v2H8V8H6Zm5 4v4h2v-4h-2Z"/>
        </svg>
    `,
    exclamationCircle: (className = 'w-12 h-12 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="currentColor" class="${className}" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <rect x="11" y="6.5" width="2" height="7" rx="1" fill="#FFFFFF"/>
            <circle cx="12" cy="16.5" r="1.2" fill="#FFFFFF"/>
        </svg>
    `,
    lockClosed: (className = 'w-4 h-4') => `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">
            <rect x="4" y="11" width="16" height="9" rx="2"/>
            <path d="M8 11V7a4 4 0 1 1 8 0v4"/>
        </svg>
    `,
    swapUsers: (className = 'w-4 h-4 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">
            <path d="M16 3l4 4-4 4"/>
            <path d="M20 7H8"/>
            <path d="M8 21l-4-4 4-4"/>
            <path d="M4 17h12"/>
        </svg>
    `,
    googleG: (className = 'w-4 h-4') => `
        <svg viewBox="0 0 24 24" class="${className}" aria-hidden="true">
            <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3.01h3.88c2.27-2.09 3.54-5.17 3.54-8.88Z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.11A12 12 0 0 0 12 24Z"/>
            <path fill="#FBBC05" d="M5.29 14.29A7.18 7.18 0 0 1 4.92 12c0-.8.14-1.57.37-2.29V6.6H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l4.01-3.11Z"/>
            <path fill="#EA4335" d="M12 4.76c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.6l4.01 3.11C6.23 6.87 8.88 4.76 12 4.76Z"/>
        </svg>
    `,
    fileText: (className = 'w-4 h-4 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="currentColor" class="${className}" aria-hidden="true">
            <path d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.5V8h4.5L13 3.5ZM8 11.5v1.6h8v-1.6H8Zm0 3.4v1.6h8v-1.6H8Zm0 3.4v1.6h5v-1.6H8Z"/>
        </svg>
    `,
    downloadTray: (className = 'w-3.5 h-3.5 text-[#0773DF]') => `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">
            <path d="M12 4v11m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
        </svg>
    `,
    landingHeroArt: () => `
        <svg viewBox="0 0 320 320" fill="none" class="w-full h-full" aria-hidden="true">
            <rect width="320" height="320" rx="20" fill="#E9EFF5"/>
            <circle cx="80" cy="76" r="36" fill="#C0DDF9" opacity="0.7"/>
            <circle cx="246" cy="242" r="46" fill="#A2CEF9" opacity="0.5"/>
            <!-- Main card frame -->
            <rect x="52" y="72" width="216" height="176" rx="14" fill="#FFFFFF" stroke="#83B9EF" stroke-width="2"/>
            <rect x="52" y="72" width="216" height="34" rx="14" fill="#0773DF"/>
            <rect x="52" y="92" width="216" height="14" fill="#0773DF"/>
            <circle cx="72" cy="89" r="4.5" fill="#FFFFFF" opacity="0.85"/>
            <circle cx="87" cy="89" r="4.5" fill="#C0DDF9" opacity="0.85"/>
            <circle cx="102" cy="89" r="4.5" fill="#83B9EF" opacity="0.85"/>
            <!-- 4 balanced role chips -->
            <rect x="70" y="122" width="84" height="46" rx="8" fill="#E6F2FF" stroke="#83B9EF" stroke-width="1.5"/>
            <rect x="82" y="135" width="20" height="20" rx="5" fill="#0773DF"/>
            <rect x="110" y="138" width="32" height="5" rx="2.5" fill="#486284"/>
            <rect x="110" y="148" width="22" height="4" rx="2" fill="#8FA2B7"/>
            <rect x="166" y="122" width="84" height="46" rx="8" fill="#E6F2FF" stroke="#83B9EF" stroke-width="1.5"/>
            <rect x="178" y="135" width="20" height="20" rx="5" fill="#045DDA"/>
            <rect x="206" y="138" width="32" height="5" rx="2.5" fill="#486284"/>
            <rect x="206" y="148" width="22" height="4" rx="2" fill="#8FA2B7"/>
            <rect x="70" y="180" width="84" height="46" rx="8" fill="#E6F2FF" stroke="#83B9EF" stroke-width="1.5"/>
            <rect x="82" y="193" width="20" height="20" rx="5" fill="#308242"/>
            <rect x="110" y="196" width="32" height="5" rx="2.5" fill="#486284"/>
            <rect x="110" y="206" width="22" height="4" rx="2" fill="#8FA2B7"/>
            <rect x="166" y="180" width="84" height="46" rx="8" fill="#E6F2FF" stroke="#83B9EF" stroke-width="1.5"/>
            <rect x="178" y="193" width="20" height="20" rx="5" fill="#0773DF"/>
            <rect x="206" y="196" width="32" height="5" rx="2.5" fill="#486284"/>
            <rect x="206" y="206" width="22" height="4" rx="2" fill="#8FA2B7"/>
        </svg>
    `,
};
