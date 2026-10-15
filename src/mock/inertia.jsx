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

export function Link({ href = '#', children, onClick, ...props }) {
    return <a href={href} onClick={(event) => { event.preventDefault(); onClick?.(event); }} {...props}>{children}</a>;
}

export const router = {
    visit: () => {},
    get: () => {},
    post: () => {},
    put: () => {},
    patch: () => {},
    delete: () => {},
};

export function useForm(initialData = {}) {
    const [data, setDataState] = useState(initialData);
    return {
        data,
        setData: (key, value) => setDataState((current) => typeof key === 'object' ? key : { ...current, [key]: value }),
        errors: {},
        processing: false,
        reset: () => setDataState(initialData),
        clearErrors: () => {},
        transform: () => {},
        submit: () => {},
        get: () => {}, post: () => {}, put: () => {}, patch: () => {}, delete: () => {},
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
            'progress.index': '/progress',
            'assignments.index': '/assignments',
            'messages.index': '/messages',
            'appointments.index': '/appointments',
            'admin.users': '/admin/users',
            'admin.system': '/admin/system',
            'admin.reports': '/admin/reports',
        };
        return paths[name] || `/${String(name).replaceAll('.', '/')}${id ? `/${id}` : ''}`;
    };
}
