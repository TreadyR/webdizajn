import React, { createContext, useContext, useState } from 'react';
import { mockProps } from './data';

const PageContext = createContext(mockProps);

export function usePage() {
    return {
        props: useContext(PageContext),
        url: typeof window !== 'undefined' ? window.location.href : '/',
    };
}

export function Head({ title }) {
    if (typeof document !== 'undefined' && title) document.title = `${title} - Thesis Manager`;
    return null;
}

export function navigate(href = '/') {
    if (typeof window === 'undefined') return;
    const nextUrl = String(href || '/');
    window.history.pushState({}, '', nextUrl);
    window.dispatchEvent(new PopStateEvent('popstate'));
}

export const Link = React.forwardRef(function Link({ href = '#', children, onClick, ...props }, ref) {
    return <a ref={ref} href={href} onClick={(event) => { event.preventDefault(); onClick?.(event); navigate(href); }} {...props}>{children}</a>;
});

function resourceFromUrl(href) {
    const match = String(href || '').match(/^\/(theses|assignments|appointments)(?:\/(\d+))?(?:\/([^/?]+))?/);
    return match ? { resource: match[1], id: match[2] ? Number(match[2]) : null, action: match[3] || '' } : null;
}

function collectionFor(resource) {
    const collections = {
        theses: mockProps.dashboardData.activeTheses,
        assignments: mockProps.dashboardData.pendingAssignments,
        appointments: mockProps.dashboardData.upcomingMeetings,
        users: mockProps.adminUsers || [],
    };
    return collections[resource];
}

function nextId(items) {
    return items.reduce((largest, item) => Math.max(largest, Number(item.id) || 0), 0) + 1;
}

function applyMockRequest(method, href, payload = {}) {
    const parsed = resourceFromUrl(href);
    const adminMatch = String(href || '').match(/^\/admin\/users(?:\/(\d+))?(?:\/([^/?]+))?/);
    if (adminMatch) {
        const users = mockProps.adminUsers || (mockProps.adminUsers = []);
        const id = adminMatch[1] ? Number(adminMatch[1]) : null;
        const action = adminMatch[2] || '';
        if (method === 'post' && action === 'store') {
            const user = { ...payload, id: nextId(users), created_at: new Date().toISOString(), is_active: payload.is_active !== false };
            users.push(user);
            return user;
        }
        const user = users.find((entry) => Number(entry.id) === id);
        if (!user) return null;
        if (method === 'delete' || action === 'destroy') {
            users.splice(users.indexOf(user), 1);
            return user;
        }
        if (action === 'toggle') {
            user.is_active = !user.is_active;
            return user;
        }
        if (['put', 'patch'].includes(method) && action === 'update') {
            Object.assign(user, payload);
            return user;
        }
        return user;
    }
    if (!parsed) return null;
    const items = collectionFor(parsed.resource);
    if (!items) return null;

    if (method === 'post' && parsed.action === 'store') {
        const item = { ...payload, id: nextId(items) };
        if (parsed.resource === 'theses') {
            item.status = item.status || 'assigned';
            item.progress = 0;
        }
        if (parsed.resource === 'assignments') {
            item.status = 'pending';
            item.order = Number(item.order) || 1;
            item.thesis = mockProps.dashboardData.activeTheses.find((thesis) => Number(thesis.id) === Number(item.thesis_id));
        }
        if (parsed.resource === 'appointments') {
            item.status = 'pending';
            item.duration = Number(item.duration) || 60;
        }
        items.push(item);
        return item;
    }

    const item = items.find((entry) => Number(entry.id) === parsed.id);
    if (!item) return null;

    if (parsed.resource === 'theses' && parsed.action === 'assign-student') {
        const student = (mockProps.adminUsers || []).find((user) => Number(user.id) === Number(payload.student_id));
        item.student_id = student?.id || payload.student_id;
        item.student = student ? { name: student.name } : item.student;
        item.status = 'assigned';
        return item;
    }
    if (parsed.resource === 'theses' && parsed.action === 'remove-student') {
        delete item.student_id;
        delete item.student;
        item.status = 'available';
        return item;
    }

    if (method === 'delete' || parsed.action === 'destroy') {
        items.splice(items.indexOf(item), 1);
        return item;
    }

    if (['put', 'patch'].includes(method) && ['update', ''].includes(parsed.action)) {
        Object.assign(item, payload);
        return item;
    }
    if (parsed.resource === 'appointments' && parsed.action === 'propose-reschedule') {
        Object.assign(item, payload, { status: 'pending' });
        return item;
    }
    if (parsed.resource === 'appointments' && parsed.action === 'respond-reschedule') {
        if (payload.action === 'accept') item.status = 'confirmed';
        if (payload.action === 'counter') Object.assign(item, payload, { status: 'pending' });
        return item;
    }
    if (parsed.resource === 'appointments' && parsed.action === 'cancel-reschedule-proposal') {
        delete item.reschedule_note;
        return item;
    }
    if (parsed.resource === 'assignments' && parsed.action === 'feedback') {
        Object.assign(item, { feedback: payload.feedback || '' });
        return item;
    }

    const statusActions = {
        approve: 'approved',
        complete: 'completed',
        'return-for-rework': 'rejected',
        cancel: 'cancelled',
        submit: 'submitted',
        reject: 'rejected',
    };
    if (statusActions[parsed.action]) {
        item.status = statusActions[parsed.action];
        if (parsed.resource === 'theses' && parsed.action === 'mark-completed') item.progress = 100;
        return item;
    }
    if (parsed.action === 'mark-completed') {
        item.status = 'completed';
        item.progress = 100;
        return item;
    }
    return item;
}

export const router = {
    visit: (href) => navigate(href),
    get: (href) => navigate(href),
    post: (href, data = {}, options = {}) => {
        applyMockRequest('post', href, data);
        options.onSuccess?.();
        window?.dispatchEvent(new PopStateEvent('popstate'));
    },
    put: (href, data = {}, options = {}) => {
        applyMockRequest('put', href, data);
        options.onSuccess?.();
        window?.dispatchEvent(new PopStateEvent('popstate'));
    },
    patch: (href, data = {}, options = {}) => {
        applyMockRequest('patch', href, data);
        options.onSuccess?.();
        window?.dispatchEvent(new PopStateEvent('popstate'));
    },
    delete: (href, data = {}, options = {}) => {
        applyMockRequest('delete', href, data);
        options.onSuccess?.();
        navigate(String(href).startsWith('/admin/users') ? '/admin/users' : href.replace(/\/[^/]+$/, ''));
    },
    reload: () => window?.dispatchEvent(new PopStateEvent('popstate')),
};

export function useForm(initialData = {}) {
    const [data, setDataState] = useState(initialData);
    const [processing, setProcessing] = useState(false);
    const run = (method, href, options = {}) => {
        setProcessing(true);
        applyMockRequest(method, href, options.data || data);
        options.onSuccess?.();
        setProcessing(false);
        const parsed = resourceFromUrl(href);
        const adminMatch = String(href || '').match(/^\/admin\/users(?:\/(\d+))?\/([^/?]+)/);
        if (adminMatch) {
            if (adminMatch[2] === 'store') {
                navigate('/admin/users');
                return;
            }
            if (adminMatch[2] === 'update') {
                navigate(`/admin/users/${adminMatch[1]}/edit`);
                return;
            }
        }
        if (method === 'post' && parsed?.action === 'store') {
            navigate(`/${String(href).split('/')[1]}`);
            return;
        }
        if (parsed?.action === 'destroy' || method === 'delete') {
            navigate(`/${parsed?.resource || ''}`);
            return;
        }
        if (parsed?.id && ['put', 'patch'].includes(method) && parsed.action === 'update') {
            navigate(`/${parsed.resource}/${parsed.id}`);
            return;
        }
        window?.dispatchEvent(new PopStateEvent('popstate'));
    };
    return {
        data,
        setData: (key, value) => setDataState((current) => typeof key === 'object' ? key : { ...current, [key]: value }),
        errors: {},
        processing,
        reset: () => setDataState(initialData),
        clearErrors: () => {},
        transform: () => {},
        submit: (method, href, options) => run(method, href, options),
        get: (href, options) => run('get', href, options),
        post: (href, options = {}) => run('post', href, options),
        put: (href, options = {}) => run('put', href, options),
        patch: (href, options = {}) => run('patch', href, options),
        delete: (href, options = {}) => run('delete', href, options),
    };
}

export function createInertiaApp() {
    throw new Error('Inertia is disabled in the Vercel mock frontend.');
}

export { PageContext };

if (typeof globalThis.route !== 'function') {
    globalThis.route = (name, params) => {
        if (!name) {
            return {
                current: (pattern) => {
                    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
                    const currentName = currentPath === '/' ? 'dashboard' : currentPath.slice(1).replaceAll('/', '.');
                    return pattern.endsWith('.*')
                        ? currentName.startsWith(pattern.slice(0, -2))
                        : currentName === pattern;
                },
            };
        }

        const id = Array.isArray(params)
            ? params[params.length - 1]
            : typeof params === 'object' && params !== null
                ? Object.values(params)[0]
                : params;
        const paths = {
            dashboard: '/',
            'theses.index': '/theses',
            'theses.create': '/theses/create',
                'theses.store': '/theses/store',
                'theses.update': `/theses/${id}/update`,
                'theses.destroy': `/theses/${id}/destroy`,
                'theses.mark-completed': `/theses/${id}/mark-completed`,
                'theses.assign-student': `/theses/${id}/assign-student`,
                'theses.remove-student': `/theses/${id}/remove-student`,
                'theses.available-students': `/theses/${id}/available-students`,
            'theses.show': `/theses/${id}`,
            'theses.edit': `/theses/${id}/edit`,
            'progress.index': '/progress',
            'assignments.index': '/assignments',
            'assignments.create': '/assignments/create',
                'assignments.store': '/assignments/store',
                'assignments.update': `/assignments/${id}/update`,
                'assignments.destroy': `/assignments/${id}/destroy`,
                'assignments.submit': `/assignments/${id}/submit`,
                'assignments.approve': `/assignments/${id}/approve`,
                'assignments.return-for-rework': `/assignments/${id}/return-for-rework`,
                'assignments.cancel': `/assignments/${id}/cancel`,
                'assignments.feedback': `/assignments/${id}/feedback`,
            'assignments.show': `/assignments/${id}`,
            'assignments.edit': `/assignments/${id}/edit`,
            'messages.index': '/messages',
            'appointments.index': '/appointments',
            'appointments.create': '/appointments/create',
                'appointments.store': '/appointments/store',
                'appointments.update': `/appointments/${id}/update`,
                'appointments.destroy': `/appointments/${id}/destroy`,
                'appointments.approve': `/appointments/${id}/approve`,
                'appointments.complete': `/appointments/${id}/complete`,
                'appointments.reject': `/appointments/${id}/reject`,
                'appointments.propose-reschedule': `/appointments/${id}/propose-reschedule`,
                'appointments.respond-reschedule': `/appointments/${id}/respond-reschedule`,
                'appointments.cancel-reschedule-proposal': `/appointments/${id}/cancel-reschedule-proposal`,
            'appointments.show': `/appointments/${id}`,
                'admin.users': '/admin/users',
                'admin.users.create': '/admin/users/create',
                'admin.users.store': '/admin/users/store',
                'admin.users.edit': `/admin/users/${id}/edit`,
                'admin.users.update': `/admin/users/${id}/update`,
                'admin.users.destroy': `/admin/users/${id}/destroy`,
                'admin.users.toggle': `/admin/users/${id}/toggle`,
            'admin.users': '/admin/users',
            'admin.system': '/admin/system',
            'admin.reports': '/admin/reports',
        };
        return paths[name] || `/${String(name).replaceAll('.', '/')}${id ? `/${id}` : ''}`;
    };
}
