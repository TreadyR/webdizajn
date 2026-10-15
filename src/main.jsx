import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './Pages/Dashboard';
import ThesisIndex from './Pages/Theses/Index';
import AssignmentIndex from './Pages/Assignments/Index';
import ProgressIndex from './Pages/Progress/Index';
import MessageIndex from './Pages/Messages/Index';
import AppointmentIndex from './Pages/Appointments/Index';
import AppointmentShow from './Pages/Appointments/Show';
import AppointmentCreate from './Pages/Appointments/Create';
import AssignmentShow from './Pages/Assignments/Show';
import AssignmentEdit from './Pages/Assignments/Edit';
import AssignmentCreate from './Pages/Assignments/Create';
import ThesisShow from './Pages/Theses/Show';
import ThesisEdit from './Pages/Theses/Edit';
import ThesisCreate from './Pages/Theses/Create';
import { PageContext } from './mock/inertia';
import { mockProps } from './mock/data';
import './app.css';

function pageForPath(pathname) {
    if (/^\/theses\/\d+\/edit$/.test(pathname)) return ThesisEdit;
    if (pathname === '/theses/create') return ThesisCreate;
    if (/^\/theses\/\d+$/.test(pathname)) return ThesisShow;
    if (/^\/assignments\/\d+\/edit$/.test(pathname)) return AssignmentEdit;
    if (pathname === '/assignments/create') return AssignmentCreate;
    if (/^\/assignments\/\d+$/.test(pathname)) return AssignmentShow;
    if (pathname === '/appointments/create') return AppointmentCreate;
    if (/^\/appointments\/\d+$/.test(pathname)) return AppointmentShow;
    if (pathname.startsWith('/theses')) return ThesisIndex;
    if (pathname.startsWith('/assignments')) return AssignmentIndex;
    if (pathname.startsWith('/progress')) return ProgressIndex;
    if (pathname.startsWith('/messages')) return MessageIndex;
    if (pathname.startsWith('/appointments')) return AppointmentIndex;
    return Dashboard;
}

function paginate(items) {
    return {
        data: items,
        current_page: 1,
        last_page: 1,
        per_page: items.length || 10,
        total: items.length,
        from: items.length ? 1 : null,
        to: items.length || null,
    };
}

function itemId(pathname) {
    const match = pathname.match(/\/(?:theses|assignments|appointments)\/(\d+)/);
    return match ? Number(match[1]) : null;
}

function mockThesis(thesis) {
    return {
        ...thesis,
        description: thesis.description || 'Praktická záverečná práca s priebežnými konzultáciami a definovanými výstupmi.',
        type: thesis.type || 'bachelor',
        deadline: thesis.deadline || '2026-12-15',
        requirements: thesis.requirements || 'Spracovanie teoretickej a praktickej časti práce.',
        status: thesis.status || 'in_progress',
    };
}

function mockAssignment(assignment, thesis) {
    return {
        ...assignment,
        description: assignment.description || 'Priebežná úloha k záverečnej práci.',
        order: assignment.order || 1,
        thesis: mockThesis(thesis),
        student: thesis?.student || { name: 'Mária Nováková' },
        supervisor: thesis?.supervisor || mockProps.auth.user,
        files: assignment.files || [],
    };
}

function propsForPage(Page, pathname) {
    const { auth, dashboardData } = mockProps;
    const id = itemId(pathname);
    const thesis = mockThesis(dashboardData.activeTheses.find((item) => item.id === id) || dashboardData.activeTheses[0]);
    const assignment = mockAssignment(
        dashboardData.pendingAssignments.find((item) => item.id === id) || dashboardData.pendingAssignments[0],
        thesis,
    );
    const appointment = dashboardData.upcomingMeetings.find((item) => item.id === id) || dashboardData.upcomingMeetings[0];
    if (Page === ThesisShow) return { auth, thesis, canEdit: true, canAssignStudent: true, canRemoveStudent: true, availableStudents: [] };
    if (Page === ThesisEdit) return { auth, thesis };
    if (Page === ThesisCreate) return { auth };
    if (Page === AssignmentShow) return { auth, assignment, canEdit: true, canSubmit: true };
    if (Page === AssignmentEdit) return { auth, assignment };
    if (Page === AssignmentCreate) return { auth, theses: dashboardData.activeTheses };
    if (Page === AppointmentShow) return {
        auth,
        appointment: {
            ...appointment,
            status: appointment.status || 'pending',
            can_edit: true,
            can_approve: true,
            last_requested_by_id: auth.user.id,
            duration: appointment.duration || 60,
            agenda: appointment.agenda || 'Prezentácia priebežných výsledkov práce.',
        },
    };
    if (Page === AppointmentCreate) return { auth, theses: dashboardData.activeTheses };
    if (Page === ThesisIndex) return { auth, theses: paginate(dashboardData.activeTheses), canCreate: true, canAssignStudents: true, filters: {} };
    if (Page === AssignmentIndex) return { auth, assignments: paginate(dashboardData.pendingAssignments), theses: dashboardData.activeTheses, canCreate: true, filters: {} };
    if (Page === ProgressIndex) return { auth, thesis: null, milestones: [], supervisedTheses: dashboardData.activeTheses, filters: {} };
    if (Page === MessageIndex) return { auth, conversations: [] };
    if (Page === AppointmentIndex) return { auth, appointments: dashboardData.upcomingMeetings.map((meeting) => ({ ...meeting, status: 'confirmed', scheduled_at: meeting.scheduled_at })) };
    return { auth, dashboardData };
}

function App() {
    const [pathname, setPathname] = useState(() => window.location.pathname);
    useEffect(() => {
        const handlePopState = () => setPathname(window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const Page = pageForPath(pathname);
    return <PageContext.Provider value={mockProps}><Page {...propsForPage(Page, pathname)} /></PageContext.Provider>;
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);