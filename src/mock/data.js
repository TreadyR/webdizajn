export const mockProps = {
    auth: { user: { id: 7, name: 'Ján Kráľ', email: 'jan.kral@example.com', role: 'supervisor' } },
    navCounts: { assignments: 4, messages: 2, appointments: 3 },
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
            { id: 1, title: 'Digitálna transformácia malých podnikov', student: { name: 'Mária Nováková' }, progress: 68, status: 'in_progress' },
            { id: 2, title: 'Bezpečnostné riziká cloudových služieb', student: { name: 'Tomáš Kováč' }, progress: 22, status: 'assigned' },
            { id: 3, title: 'Použiteľnosť moderných e-shopov', student: { name: 'Lucia Horváthová' }, progress: 100, status: 'completed' },
        ],
        recentTheses: [], recentUsers: [], systemStats: {},
    },
};