import ModernLayout from './ModernLayout';

export default function AuthenticatedLayout({ header, children }) {
    return <ModernLayout header={header}>{children}</ModernLayout>;
}