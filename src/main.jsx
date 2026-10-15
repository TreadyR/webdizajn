import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './Pages/Dashboard';
import { PageContext } from './mock/inertia';
import { mockProps } from './mock/data';
import './app.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <PageContext.Provider value={mockProps}>
            <Dashboard auth={mockProps.auth} dashboardData={mockProps.dashboardData} />
        </PageContext.Provider>
    </StrictMode>,
);