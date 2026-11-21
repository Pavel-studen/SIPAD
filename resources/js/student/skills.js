import { normalizeRoleCode } from './utils.js';

const CATEGORY_SCHEMAS = {
    UIUX: [
        {
            title: 'Tools Design yang akan digunakan?',
            match: /figma|adobe|xd|protopie|framer|sketch|canva|tool/i,
        },
        {
            title: 'UI Design skills yang dikuasai?',
            match: /ui design|prototyp|grid|auto-layout|typography|color|micro-interaction|component library|visual/i,
        },
        {
            title: 'UX & Research skills yang dikuasai?',
            match: /ux|research|interview|usability|journey|persona|wirefram|ia\b/i,
        },
        {
            title: 'Collaboration & Feasibility skills?',
            match: /handoff|zeplin|dev mode|html|css|collab|feasib/i,
        },
    ],
    PM: [
        {
            title: 'Metodologi yang digunakan?',
            match: /agile|scrum|kanban|waterfall|method/i,
        },
        {
            title: 'Tools yang dikuasai?',
            match: /jira|trello|clickup|linear|notion|gantt|asana|tool/i,
        },
        {
            title: 'Manajemen & Dokumentasi skills?',
            match: /prd|brd|sprint|backlog|risk|mitig|estimat|manajemen|dokumentasi/i,
        },
        {
            title: 'Soft Skills yang dimiliki?',
            match: /stakeholder|communication|conflict|leadership|soft|team/i,
        },
    ],
    FE: [
        {
            title: 'Core Technology yang dikuasai?',
            match: /html|css3|tailwind|javascript|typescript|core/i,
        },
        {
            title: 'Framework / Library yang dikuasai?',
            match: /react|vue|next|nuxt|angular|svelte|bootstrap|framework|library/i,
        },
        {
            title: 'State & Data Management?',
            match: /state|redux|zustand|context|rest|api|graphql|data|fetch|axios/i,
        },
        {
            title: 'Tooling & Optimization skills?',
            match: /git|performance|responsive|optim|tool|version|vite|webpack/i,
        },
    ],
    BE: [
        {
            title: 'Bahasa & Framework yang dikuasai?',
            match: /node|express|nest|python|fastapi|django|php|laravel|go\b|java\b|framework|bahasa/i,
        },
        {
            title: 'Database skills?',
            match: /database|db\b|sql|mysql|postgres|mongo|nosql|schema|orm|prisma|eloquent|sequelize/i,
        },
        {
            title: 'API & Keamanan skills?',
            match: /api|rest|oauth|jwt|sanctum|auth|security|rate|keamanan/i,
        },
        {
            title: 'DevOps & Infrastructure skills?',
            match: /docker|container|ci\/cd|ci-cd|pipeline|git|devops|infra|linux|nginx/i,
        },
    ],
};

export function groupRoleSkills(role) {
    if (!role || !Array.isArray(role.skills)) return [];

    const code = normalizeRoleCode(role.code || role.name);
    const schema = CATEGORY_SCHEMAS[code] || [];
    const buckets = schema.map((cat) => ({
        title: cat.title,
        skills: [],
    }));
    const otherBucket = {
        title: 'Keahlian Lainnya?',
        skills: [],
    };

    for (const skill of role.skills) {
        const name = String(skill?.name || '');
        const idx = schema.findIndex((cat) => cat.match.test(name));
        if (idx >= 0) {
            buckets[idx].skills.push(skill);
        } else {
            otherBucket.skills.push(skill);
        }
    }

    const groups = buckets.filter((g) => g.skills.length > 0);
    if (otherBucket.skills.length > 0) {
        groups.push(otherBucket);
    }

    return groups;
}
