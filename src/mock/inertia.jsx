import React, { createContext, useContext, useState } from 'react';
import { mockProps } from './data';

const PageContext = createContext(mockProps);

export function usePage() {
    return { props: useContext(PageContext) };
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

export const router = {
    visit: (href) => navigate(href),
    get: (href) => navigate(href),
    post: (_href, _data, options = {}) => options.onSuccess?.(),
    put: (_href, _data, options = {}) => options.onSuccess?.(),
    patch: (_href, _data, options = {}) => options.onSuccess?.(),
    delete: (_href, _data, options = {}) => options.onSuccess?.(),
    reload: () => window?.dispatchEvent(new PopStateEvent('popstate')),
};

export function useForm(initialData = {}) {
    const [data, setDataState] = useState(initialData);
    const [processing, setProcessing] = useState(false);
    const run = (method, href, options = {}) => {
        setProcessing(true);
        options.onSuccess?.();
        setProcessing(false);
        if (method === 'post' && /\/(appointments|theses|assignments)\/store$/.test(String(href))) {
            navigate(`/${String(href).split('/')[1]}`);
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
            'theses.show': `/theses/${id}`,
            'theses.edit': `/theses/${id}/edit`,
            'progress.index': '/progress',
            'assignments.index': '/assignments',
            'assignments.create': '/assignments/create',
            'assignments.show': `/assignments/${id}`,
            'assignments.edit': `/assignments/${id}/edit`,
            'messages.index': '/messages',
            'appointments.index': '/appointments',
            'appointments.create': '/appointments/create',
            'appointments.show': `/appointments/${id}`,
            'admin.users': '/admin/users',
            'admin.system': '/admin/system',
            'admin.reports': '/admin/reports',
        };
        return paths[name] || `/${String(name).replaceAll('.', '/')}${id ? `/${id}` : ''}`;
    };
}
