import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './Pages/Dashboard';
import ThesisIndex from './Pages/Theses/Index';
import AssignmentIndex from './Pages/Assignments/Index';
import ProgressIndex from './Pages/Progress/Index';
import MessageIndex from './Pages/Messages/Index';
import AppointmentIndex from './Pages/Appointments/Index';
import { PageContext } from './mock/inertia';
import { mockProps } from './mock/data';
import './app.css';

function pageForPath(pathname) {
    if (pathname.startsWith('/theses')) return ThesisIndex;
    if (pathname.startsWith('/assignments')) return AssignmentIndex;
    if (pathname.startsWith('/progress')) return ProgressIndex;
    if (pathname.startsWith('/messages')) return MessageIndex;
    if (pathname.startsWith('/appointments')) return AppointmentIndex;
    return Dashboard;
}

function propsForPage(Page) {
    const { auth, dashboardData } = mockProps;
    if (Page === ThesisIndex) return { auth, theses: dashboardData.activeTheses, canCreate: true, canAssignStudents: true, filters: {} };
    if (Page === AssignmentIndex) return { auth, assignments: dashboardData.pendingAssignments, theses: dashboardData.activeTheses, canCreate: true, filters: {} };
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
    return <PageContext.Provider value={mockProps}><Page {...propsForPage(Page)} /></PageContext.Provider>;
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);