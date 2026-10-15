import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    UserPlus, 
    Users, 
    Search, 
    Edit, 
    Trash2, 
    ToggleRight,
    GraduationCap,
    UserCheck,
    ShieldCheck,
    Filter,
    Mail,
    Building2,
    UserX,
    Clock3,
    Upload
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminUsers({ auth, users, stats, roles, filters = {} }) {
    const [mouse, setMouse] = useState({ x: 50, y: 22 });
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [sortFilter, setSortFilter] = useState(filters.sort || 'latest');
    const flash = usePage().props.flash || {};
    const importForm = useForm({
        csv_file: null,
        delimiter: 'auto',
        default_password: 'ChangeMe123!',
    });

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        setMouse({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'student':
                return <GraduationCap className="h-4 w-4" />;
            case 'supervisor':
                return <UserCheck className="h-4 w-4" />;
            case 'admin':
                return <ShieldCheck className="h-4 w-4" />;
            default:
                return <Users className="h-4 w-4" />;
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-destructive/20 text-destructive border-destructive/30';
            case 'supervisor':
                return 'bg-chart-2/20 text-chart-2 border-chart-2/30';
            case 'student':
                return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
            default:
                return 'bg-muted/50 text-muted-foreground border-muted-foreground/30';
        }
    };

    const deleteUser = (user) => {
        if (confirm(`Naozaj chcete zmazať používateľa ${user.name}?`)) {
            router.delete(route('admin.users.destroy', user.id));
        }
    };

    const submitCsvImport = (event) => {
        event.preventDefault();

        importForm.post(route('admin.users.import-csv'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                importForm.reset('csv_file');
            },
        });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(route('admin.users'), {
                search,
                role: roleFilter,
                sort: sortFilter,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['users', 'filters'],
            });
        }, 250);

        return () => clearTimeout(timeout);
    }, [search, roleFilter, sortFilter]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Admin centrum: Používatelia</h2>
                        <p className="text-sm text-muted-foreground">
                            Riadenie rolí, aktivácie účtov a životného cyklu používateľov
                        </p>
                    </div>
                    <Link href={route('admin.users.create')}>
                        <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Pridať používateľa
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Správa používateľov" />

            <div
                className="ambient-page-shell page-enter-fade rounded-2xl border border-border/70 bg-card/55 backdrop-blur-md p-5 md:p-7"
                onMouseMove={handleMouseMove}
                style={{ '--mx': `${mouse.x}%`, '--my': `${mouse.y}%` }}
            >
                <div className="ambient-page-spotlight" />
                <div className="ambient-page-grid" />

                <div className="ambient-page-content space-y-6">
                {(flash.error || flash.warning || flash.success) && (
                    <div className="section-lift-in" style={{ animationDelay: '20ms' }}>
                        {flash.error && (
                            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                                {flash.error}
                            </div>
                        )}
                        {flash.warning && (
                            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 mt-3">
                                {flash.warning}
                            </div>
                        )}
                        {flash.success && (
                            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 mt-3">
                                {flash.success}
                            </div>
                        )}
                    </div>
                )}
                <Card className="border-border/70 bg-gradient-to-r from-card via-card to-muted/40 section-lift-in card-hover-glow" style={{ animationDelay: '40ms' }}>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Kontrolný panel používateľov</p>
                                <p className="text-lg font-semibold text-foreground">Aktívny dohľad nad prístupom do systému</p>
                            </div>
                            <Badge className="w-fit bg-primary/15 text-primary border-primary/30">
                                <Filter className="h-3.5 w-3.5 mr-1" />
                                {users.total} výsledkov
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="section-lift-in card-hover-glow" style={{ animationDelay: '70ms' }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Hromadný import používateľov (CSV)
                        </CardTitle>
                        <CardDescription>
                            Povinné stĺpce: name, email, role. Pre študenta je povinné AIS ID (student_id alebo ais_id).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitCsvImport} className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                            <div className="lg:col-span-2">
                                <Input
                                    type="file"
                                    accept=".csv,text/csv,text/plain"
                                    onChange={(e) => importForm.setData('csv_file', e.target.files?.[0] || null)}
                                    required
                                />
                            </div>
                            <div>
                                <select
                                    value={importForm.data.delimiter}
                                    onChange={(e) => importForm.setData('delimiter', e.target.value)}
                                    className="h-10 block w-full rounded-md border border-border bg-background py-2 px-3 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary/40"
                                >
                                    <option value="auto">Oddeľovač: auto</option>
                                    <option value="comma">Oddeľovač: čiarka (,)</option>
                                    <option value="semicolon">Oddeľovač: bodkočiarka (;)</option>
                                </select>
                            </div>
                            <div>
                                <Input
                                    value={importForm.data.default_password}
                                    onChange={(e) => importForm.setData('default_password', e.target.value)}
                                    placeholder="Predvolené heslo"
                                />
                            </div>
                            <div className="lg:col-span-4 flex flex-wrap items-center gap-2">
                                <Button type="submit" disabled={importForm.processing || !importForm.data.csv_file}>
                                    Importovať CSV
                                </Button>
                                <a
                                    href="/templates/users_import_template.csv"
                                    className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-muted/80"
                                >
                                    Stiahnuť CSV šablónu
                                </a>
                                <span className="text-xs text-muted-foreground">
                                    Voliteľné stĺpce: password, phone, department, title, bio, supervisor_code, is_active.
                                </span>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Štatistiky */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 section-lift-in" style={{ animationDelay: '90ms' }}>
                    <Card className="card-hover-glow">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <div className="text-2xl font-bold text-foreground">
                                        {stats.total}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Celkom</div>
                                </div>
                                <Users className="h-8 w-8 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover-glow">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <div className="text-2xl font-bold text-foreground">
                                        {stats.students}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Študenti</div>
                                </div>
                                <GraduationCap className="h-8 w-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover-glow">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <div className="text-2xl font-bold text-foreground">
                                        {stats.supervisors}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Školiteľia</div>
                                </div>
                                <UserCheck className="h-8 w-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover-glow">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <div className="text-2xl font-bold text-foreground">
                                        {stats.admins}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Admini</div>
                                </div>
                                <ShieldCheck className="h-8 w-8 text-red-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover-glow">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <div className="text-2xl font-bold text-foreground">
                                        {stats.active}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Aktívni</div>
                                </div>
                                <ToggleRight className="h-8 w-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Vyhľadávanie */}
                <Card className="section-lift-in card-hover-glow" style={{ animationDelay: '130ms' }}>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Vyhľadať podľa mena, emailu alebo katedry..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {['all', 'student', 'supervisor', 'admin'].map((role) => (
                                    <Button
                                        key={role}
                                        type="button"
                                        variant={roleFilter === role ? 'default' : 'outline'}
                                        className="h-9"
                                        onClick={() => setRoleFilter(role)}
                                    >
                                        {role === 'all' ? 'Všetky roly' : roles[role]}
                                    </Button>
                                ))}
                                <Button
                                    type="button"
                                    variant={sortFilter === 'latest' ? 'default' : 'outline'}
                                    className="h-9"
                                    onClick={() => setSortFilter('latest')}
                                >
                                    <Clock3 className="h-3.5 w-3.5 mr-1.5" />
                                    Najnovší
                                </Button>
                                <Button
                                    type="button"
                                    variant={sortFilter === 'oldest' ? 'default' : 'outline'}
                                    className="h-9"
                                    onClick={() => setSortFilter('oldest')}
                                >
                                    <Clock3 className="h-3.5 w-3.5 mr-1.5" />
                                    Najstarší
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Zoznam používateľov */}
                <Card className="section-lift-in" style={{ animationDelay: '170ms' }}>
                    <CardHeader>
                        <CardTitle>Používatelia</CardTitle>
                        <CardDescription>
                            Na stránke: {users.data.length} z celkovo: {users.total} používateľov
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {users.data.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-border p-10 text-center">
                                <UserX className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                                <h3 className="font-medium text-foreground">Žiadni používatelia pre tento filter</h3>
                                <p className="text-sm text-muted-foreground mt-1">Skúste zmeniť text vyhľadávania alebo filter roly.</p>
                            </div>
                        ) : (
                        <div className="space-y-3">
                            {users.data.map((user, index) => (
                                <div key={user.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors stagger-item card-hover-glow" style={{ animationDelay: `${210 + index * 45}ms` }}>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                            {getRoleIcon(user.role)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-medium text-foreground">{user.name}</h3>
                                                <Badge className={getRoleBadgeColor(user.role)}>
                                                    {roles[user.role]}
                                                </Badge>
                                                {!user.is_active && (
                                                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                                        Neaktívny
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <Mail className="h-3.5 w-3.5" />
                                                {user.email}
                                            </div>
                                            {user.department && (
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    <Building2 className="h-3.5 w-3.5" />
                                                    {user.department}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                <Clock3 className="h-3.5 w-3.5" />
                                                Vytvorený: {new Date(user.created_at).toLocaleDateString('sk-SK')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 self-end lg:self-auto">
                                        <Link href={route('admin.users.edit', user.id)}>
                                            <Button variant="outline" size="sm" title="Otvoriť profil">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Otvoriť profil
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteUser(user)}
                                            title="Zmazať"
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}

                        {/* Pagination */}
                        {users.links && (
                            <div className="flex justify-center mt-6">
                                <div className="flex gap-2">
                                    {users.links.map((link, index) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 text-sm rounded ${
                                                    link.active 
                                                        ? 'bg-primary text-primary-foreground' 
                                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                className="px-3 py-2 text-sm rounded opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}