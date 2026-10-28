export const mockProps = {
    auth: { user: { id: 7, name: 'Ján Kráľ', email: 'jan.kral@example.com', role: 'supervisor' } },
    navCounts: { assignments: 4, messages: 2, appointments: 3 },
    adminUsers: [
        { id: 1, name: 'Mária Nováková', email: 'maria.novakova@example.com', role: 'student', is_active: true, created_at: '2026-01-15T10:00:00Z' },
        { id: 2, name: 'Tomáš Kováč', email: 'tomas.kovac@example.com', role: 'student', is_active: true, created_at: '2026-01-20T10:00:00Z' },
        { id: 3, name: 'Ján Kráľ', email: 'jan.kral@example.com', role: 'supervisor', is_active: true, created_at: '2026-01-01T10:00:00Z' },
    ],
    navPreviews: {
        assignments: [{ id: 1, title: 'Metodika výskumu', subtitle: 'Mária Nováková' }],
        messages: [{ id: 2, title: 'Návrh práce', subtitle: 'Tomáš Kováč' }],
        appointments: [{ id: 3, title: 'Konzultácia', subtitle: 'Zajtra o 13:30' }],
    },
    dashboardData: {
        activeThesis: null, progress: 68, completedMilestones: 4, totalMilestones: 6,
        deadlineColor: 'yellow', nextDeadline: { title: 'Metodika výskumu', deadline: '2026-10-18T23:59:00' }, daysUntilDetail: 'O 3 dni',
        pendingAssignments: [
            { id: 1, title: 'Metodika výskumu', description: 'Doplňte metodiku bakalárskej práce.', due_date: '2026-10-18', status: 'pending' },
            { id: 2, title: 'Vyhodnotenie dotazníka', description: 'Spracujte výsledky prieskumu.', due_date: '2026-10-24', status: 'submitted' },
        ],
        upcomingMeetings: [
            {
                id: 1,
                title: 'Konzultácia s Máriou Novákovou',
                scheduled_at: '2026-10-16T13:30:00',
                location: 'Online',
                thesis: {
                    id: 1,
                    title: 'Digitálna transformácia malých podnikov',
                    student: { name: 'Mária Nováková' },
                    supervisor: { name: 'Ján Kráľ' },
                },
            },
            {
                id: 2,
                title: 'Kontrola návrhu práce',
                scheduled_at: '2026-10-21T10:00:00',
                location: 'Kabinet 2.14',
                thesis: {
                    id: 2,
                    title: 'Bezpečnostné riziká cloudových služieb',
                    student: { name: 'Tomáš Kováč' },
                    supervisor: { name: 'Ján Kráľ' },
                },
            },
        ],
        totalStudents: 12, unreadMessages: 2,
        activeTheses: [
            { id: 1, title: 'Digitálna transformácia malých podnikov', student: { name: 'Mária Nováková' }, progress: 68, status: 'in_progress', milestones: [
                { id: 1, title: 'Návrh práce', status: 'completed', progress: 100, due_date: '2026-09-15' },
                { id: 2, title: 'Metodika výskumu', status: 'in_progress', progress: 65, due_date: '2026-10-18' },
                { id: 3, title: 'Vyhodnotenie výsledkov', status: 'pending', progress: 0, due_date: '2026-11-15' },
                { id: 4, title: 'Záverečná verzia', status: 'pending', progress: 0, due_date: '2026-12-15' },
            ] },
            { id: 2, title: 'Bezpečnostné riziká cloudových služieb', student: { name: 'Tomáš Kováč' }, progress: 22, status: 'assigned', milestones: [
                { id: 5, title: 'Štúdium zdrojov', status: 'completed', progress: 100, due_date: '2026-09-30' },
                { id: 6, title: 'Analýza rizík', status: 'in_progress', progress: 32, due_date: '2026-11-01' },
                { id: 7, title: 'Návrh opatrení', status: 'pending', progress: 0, due_date: '2026-12-01' },
            ] },
            { id: 3, title: 'Použiteľnosť moderných e-shopov', student: { name: 'Lucia Horváthová' }, progress: 100, status: 'completed', milestones: [
                { id: 8, title: 'Výskum', status: 'completed', progress: 100, due_date: '2026-06-15' },
                { id: 9, title: 'Testovanie', status: 'completed', progress: 100, due_date: '2026-08-15' },
            ] },
        ],
        recentTheses: [], recentUsers: [], systemStats: {},
    },
};