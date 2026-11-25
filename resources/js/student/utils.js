export const NIM_REGEX = /^\d{2}\/\d{6}\/[A-Za-z]{2}\/\d{5}$/;

export function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function formatApiError(error, fallback = 'Terjadi kesalahan. Silakan coba lagi.') {
    const data = error?.response?.data;
    if (data?.errors && typeof data.errors === 'object') {
        const firstField = Object.values(data.errors)[0];
        if (Array.isArray(firstField) && firstField.length > 0) {
            return String(firstField[0]);
        }
    }
    if (typeof data?.message === 'string' && data.message.trim() !== '') {
        return data.message;
    }
    if (typeof error?.message === 'string' && error.message.trim() !== '') {
        return error.message;
    }
    return fallback;
}

export function normalizeRoleCode(codeOrName) {
    const raw = String(codeOrName || '').trim().toUpperCase();
    if (raw === 'PM' || raw.includes('PROJECT')) return 'PM';
    if (raw === 'UIUX' || raw.includes('UI/UX') || raw.includes('UIUX')) return 'UIUX';
    if (raw === 'FE' || raw.includes('FRONT')) return 'FE';
    if (raw === 'BE' || raw.includes('BACK')) return 'BE';
    return raw || 'UIUX';
}

export function roleShortLabel(code, fallbackName = '') {
    switch (normalizeRoleCode(code || fallbackName)) {
        case 'PM':
            return 'Project Manager';
        case 'UIUX':
            return 'UI/UX';
        case 'FE':
            return 'FrontEnd Dev';
        case 'BE':
            return 'BackEnd Dev';
        default:
            return fallbackName || code || 'Role';
    }
}

export function roleFullTitle(code, fallbackName = '') {
    switch (normalizeRoleCode(code || fallbackName)) {
        case 'PM':
            return 'Project Manager';
        case 'UIUX':
            return 'UI/UX Designer';
        case 'FE':
            return 'Frontend Developer';
        case 'BE':
            return 'Backend Developer';
        default:
            return fallbackName || code || 'Role';
    }
}

export function roleCardCornerCode(code, fallbackName = '') {
    switch (normalizeRoleCode(code || fallbackName)) {
        case 'UIUX':
            return 'UI/UX';
        case 'PM':
            return 'PM';
        case 'FE':
            return 'FE';
        case 'BE':
            return 'BE';
        default:
            return String(code || 'ROLE').toUpperCase();
    }
}

export function roleModalSectionTitle(code, fallbackName = '') {
    switch (normalizeRoleCode(code || fallbackName)) {
        case 'PM':
            return 'Project Manager';
        case 'UIUX':
            return 'UI/UX';
        case 'FE':
            return 'Front End';
        case 'BE':
            return 'Back End';
        default:
            return fallbackName || code || 'Anggota';
    }
}

export function roleDisplayTag(code, fallbackName = '') {
    switch (normalizeRoleCode(code || fallbackName)) {
        case 'UIUX':
            return 'UI/UX';
        case 'PM':
            return 'Project Manager';
        case 'FE':
            return 'Front End';
        case 'BE':
            return 'Back End';
        default:
            return fallbackName || code || '-';
    }
}

export function roleTableLabel(code, fallbackName = '') {
    switch (normalizeRoleCode(code || fallbackName)) {
        case 'UIUX':
            return 'UI/UX';
        case 'PM':
            return 'Project Manager';
        case 'FE':
            return 'Frontend';
        case 'BE':
            return 'Backend';
        default:
            return fallbackName || code || '-';
    }
}

export function parseComplaintText(rawDescription) {
    const raw = String(rawDescription || '').trim();
    if (!raw) return { reason: '-', details: '-' };

    const lines = raw.split(/\r?\n/);
    const firstLine = lines[0]?.trim() || '';
    if (/^Alasan:\s*/i.test(firstLine)) {
        const reason = firstLine.replace(/^Alasan:\s*/i, '').trim() || '-';
        const details = lines.slice(1).join('\n').trim() || reason;
        return { reason, details };
    }

    const shortReason = raw.length > 56 ? `${raw.slice(0, 56).trim()}...` : raw;
    return { reason: shortReason, details: raw };
}

export function parseNimStatus(nim) {
    const trimmed = String(nim || '').trim();
    if (!trimmed) {
        return { empty: true, valid: false, angkatan: null };
    }
    const valid = NIM_REGEX.test(trimmed);
    const angkatan = valid ? `20${trimmed.slice(0, 2)}` : null;
    return { empty: false, valid, angkatan };
}

export function formatFileSize(bytes) {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const INDONESIAN_MONTHS = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

export function formatIsoToIndoDate(isoDate) {
    if (!isoDate) return '';
    const parts = String(isoDate).split('-').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return String(isoDate);
    const [year, month, day] = parts;
    return `${day} ${INDONESIAN_MONTHS[month - 1] || ''} ${year}`.trim();
}

export function formatIndoDateRange(startIso, endIso) {
    if (!startIso) return '-';
    if (!endIso || startIso === endIso) return formatIsoToIndoDate(startIso);
    const s = String(startIso).split('-').map(Number);
    const e = String(endIso).split('-').map(Number);
    if (s.length === 3 && e.length === 3 && !s.some(Number.isNaN) && !e.some(Number.isNaN)) {
        if (s[0] === e[0] && s[1] === e[1]) {
            return `${s[2]} ${INDONESIAN_MONTHS[s[1] - 1]} ${s[0]} - ${e[2]} ${INDONESIAN_MONTHS[e[1] - 1]} ${e[0]}`;
        }
    }
    return `${formatIsoToIndoDate(startIso)} - ${formatIsoToIndoDate(endIso)}`;
}

export function formatShortRangeHeader(startIso, endIso) {
    if (!startIso) return 'Belum dipilih';
    if (!endIso || startIso === endIso) return formatIsoToIndoDate(startIso);
    const s = String(startIso).split('-').map(Number);
    const e = String(endIso).split('-').map(Number);
    if (s.length === 3 && e.length === 3 && s[0] === e[0] && s[1] === e[1]) {
        return `${s[2]}–${e[2]} ${INDONESIAN_MONTHS[e[1] - 1]} ${e[0]}`;
    }
    return `${formatIsoToIndoDate(startIso)} – ${formatIsoToIndoDate(endIso)}`;
}

export function roleCompactCode(code, fallbackName = '') {
    switch (normalizeRoleCode(code || fallbackName)) {
        case 'PM':
            return 'PM';
        case 'UIUX':
            return 'UI/UX';
        case 'FE':
            return 'FE';
        case 'BE':
            return 'BE';
        default:
            return String(code || fallbackName || '-');
    }
}

export function downloadCsvFile(filename, headers, rows) {
    const escapeCell = (val) => {
        const s = String(val ?? '');
        if (/[",\n\r]/.test(s)) {
            return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
    };
    const csvLines = [
        headers.map(escapeCell).join(','),
        ...rows.map((r) => r.map(escapeCell).join(',')),
    ];
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

export function formatDateIndo(isoString) {
    if (!isoString) return '-';
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
