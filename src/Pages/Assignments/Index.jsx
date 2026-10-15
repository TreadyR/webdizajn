import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ClipboardList, Clock3, CheckCircle2, AlertTriangle, Search, Plus } from 'lucide-react';

export default function Index({ auth, assignments, theses = [], filters = {}, canCreate = false }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [thesisFilter, setThesisFilter] = useState(filters.thesis_id || '');
    const [mouse, setMouse] = useState({ x: 50, y: 22 });

    const quickStatusFilters = [
        { value: '', label: 'Všetky' },
        { value: 'pending', label: 'Na riešenie' },
        { value: 'submitted', label: 'Odovzdané' },
        { value: 'approved', label: 'Schválené' },
        { value: 'rejected', label: 'Vrátené' },
        { value: 'cancelled', label: 'Zrušené' },
    ];

    const applyFilters = (next = {}) => {
        const payload = {
            search,
            status: statusFilter,
            thesis_id: thesisFilter,
            ...next,
        };

        router.get(route('assignments.index'), payload, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const handleQuickStatusClick = (nextStatus) => {
        setStatusFilter(nextStatus);
        applyFilters({ status: nextStatus });
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('');
        setThesisFilter('');
        router.get(route('assignments.index'), {}, { preserveState: true, replace: true });
    };

    const formatDate = (date) => {
        if (!date) return 'Nezadané';
        return new Date(date).toLocaleDateString('sk-SK');
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
            submitted: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
            approved: 'bg-green-500/20 text-green-300 border-green-500/30',
            rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
            cancelled: 'bg-slate-500/20 text-slate-300 border-slate-500/30'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'Čaká na riešenie',
            submitted: 'Odovzdaná',
            approved: 'Schválená',
            rejected: 'Vrátená na prepracovanie',
            cancelled: 'Zrušená'
        };
        return texts[status] || status;
    };

    const isOverdue = (dueDate, status) => {
        if (status === 'approved' || status === 'submitted') return false;
        return new Date(dueDate) < new Date();
    };

    const getDaysUntilDue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return `${Math.abs(diffDays)} dní po termíne`;
        if (diffDays === 0) return 'Dnes';
        if (diffDays === 1) return 'Zajtra';
        return `${diffDays} dní`;
    };

    const totals = {
        all: assignments?.data?.length || 0,
        pending: assignments?.data?.filter((a) => a.status === 'pending').length || 0,
        submitted: assignments?.data?.filter((a) => a.status === 'submitted').length || 0,
        overdue: assignments?.data?.filter((a) => isOverdue(a.due_date, a.status)).length || 0,
    };

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setMouse({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 min-w-0 w-full">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl font-semibold leading-tight text-foreground truncate">
                            Úlohy
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">
                            {auth.user.role === 'student' && 'Vaše úlohy k riešeniu'}
                            {auth.user.role === 'supervisor' && 'Úlohy pre vašich študentov'}
                            {auth.user.role === 'admin' && 'Všetky úlohy v systéme'}
                        </p>
                    </div>
                    {canCreate && (
                        <Link href={route('assignments.create')} className="flex-shrink-0">
                            <Button size="sm" className="w-full sm:w-auto">
                                <span className="sm:hidden">Nová úloha</span>
                                <span className="hidden sm:inline">Vytvoriť novú úlohu</span>
                            </Button>
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Úlohy" />

            <div
                className="ambient-page-shell"
                onMouseMove={handleMouseMove}
                style={{ '--mx': `${mouse.x}%`, '--my': `${mouse.y}%` }}
            >
                <div className="ambient-page-grid" />
                <div className="ambient-page-spotlight" />

                <div className="mx-auto max-w-7xl space-y-6 page-enter-fade ambient-page-content">
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-2 section-lift-in" style={{ animationDelay: '40ms' }}>
                        <Card className="border-border/70 bg-card/70 backdrop-blur-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Všetky úlohy</p>
                                    <p className="text-2xl font-semibold text-foreground">{totals.all}</p>
                                </div>
                                <ClipboardList className="h-5 w-5 text-primary" />
                            </CardContent>
                        </Card>
                        <Card className="border-border/70 bg-card/70 backdrop-blur-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Čaká na riešenie</p>
                                    <p className="text-2xl font-semibold text-foreground">{totals.pending}</p>
                                </div>
                                <Clock3 className="h-5 w-5 text-amber-300" />
                            </CardContent>
                        </Card>
                        <Card className="border-border/70 bg-card/70 backdrop-blur-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Odovzdané</p>
                                    <p className="text-2xl font-semibold text-foreground">{totals.submitted}</p>
                                </div>
                                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                            </CardContent>
                        </Card>
                        <Card className="border-border/70 bg-card/70 backdrop-blur-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Po termíne</p>
                                    <p className="text-2xl font-semibold text-foreground">{totals.overdue}</p>
                                </div>
                                <AlertTriangle className="h-5 w-5 text-rose-300" />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Filters */}
                    <div className="border border-border/70 bg-gradient-to-br from-card/90 via-card/75 to-muted/35 overflow-hidden shadow-sm sm:rounded-xl mb-6 section-lift-in" style={{ animationDelay: '90ms' }}>
                        <div className="p-6">
                            <div className="mb-4 flex flex-wrap gap-2">
                                {quickStatusFilters.map((filterItem) => (
                                    <Button
                                        key={filterItem.value || 'all'}
                                        type="button"
                                        size="sm"
                                        variant={statusFilter === filterItem.value ? 'default' : 'outline'}
                                        onClick={() => handleQuickStatusClick(filterItem.value)}
                                        className="rounded-full"
                                    >
                                        {filterItem.label}
                                    </Button>
                                ))}
                            </div>

                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-1">
                                            <Search className="h-4 w-4 text-muted-foreground" />
                                            Vyhľadávanie
                                        </label>
                                        <Input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Názov úlohy..."
                                            className="w-full"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-card-foreground mb-1">
                                            Stav úlohy
                                        </label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary/40"
                                        >
                                            <option value="">Všetky stavy</option>
                                            <option value="pending">Čaká na riešenie</option>
                                            <option value="submitted">Odovzdaná</option>
                                            <option value="approved">Schválená</option>
                                            <option value="rejected">Vrátená na prepracovanie</option>
                                            <option value="cancelled">Zrušená</option>
                                        </select>
                                    </div>
                                    
                                    {(auth.user.role === 'admin' || (auth.user.role === 'supervisor' && theses.length > 1)) && (
                                        <div>
                                            <label className="block text-sm font-medium text-card-foreground mb-1">
                                                Téma
                                            </label>
                                            <select
                                                value={thesisFilter}
                                                onChange={(e) => setThesisFilter(e.target.value)}
                                                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary/40"
                                            >
                                                <option value="">Všetky témy</option>
                                                {theses.map((thesis) => (
                                                    <option key={thesis.id} value={thesis.id}>
                                                        {thesis.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-end space-x-2">
                                        <Button type="submit" className="flex-1">
                                            Filtrovať
                                        </Button>
                                        {(search || statusFilter || thesisFilter) && (
                                            <Button 
                                                type="button" 
                                                variant="outline"
                                                onClick={clearFilters}
                                            >
                                                Vymazať
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Assignments List */}
                    <div className="overflow-hidden shadow-sm sm:rounded-lg section-lift-in" style={{ animationDelay: '140ms' }}>
                        <div className="p-6">
                            {assignments.data.length > 0 ? (
                                <div className="space-y-4">
                                    {assignments.data.map((assignment, index) => (
                                        <div 
                                            key={assignment.id} 
                                            className={`bg-gradient-to-br from-card via-card to-muted/20 border border-border/70 rounded-xl p-6 hover:border-primary/30 transition-all duration-200 stagger-item card-hover-glow ${
                                                isOverdue(assignment.due_date, assignment.status) 
                                                    ? 'border-red-500/30 bg-red-500/5' 
                                                    : ''
                                            }`}
                                            style={{ animationDelay: `${180 + index * 50}ms` }}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-card-foreground mb-2">
                                                                <Link
                                                                    href={route('assignments.show', assignment.id)}
                                                                    className="hover:text-primary transition-colors"
                                                                >
                                                                    {assignment.title}
                                                                </Link>
                                                            </h3>
                                                            <p className="text-muted-foreground mb-3 line-clamp-2">
                                                                {assignment.description}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end space-y-2 ml-4">
                                                            <Badge className={getStatusColor(assignment.status)}>
                                                                {getStatusText(assignment.status)}
                                                            </Badge>
                                                            {isOverdue(assignment.due_date, assignment.status) && (
                                                                <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                                                                    Po termíne
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                                                        <div>
                                                            <span className="font-medium">Téma:</span> {assignment.thesis?.title || 'Nezadané'}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Termín:</span> 
                                                            <span className={isOverdue(assignment.due_date, assignment.status) ? 'text-red-400 font-medium' : ''}>
                                                                {formatDate(assignment.due_date)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Zostáva:</span> 
                                                            <span className={isOverdue(assignment.due_date, assignment.status) ? 'text-red-400 font-medium' : ''}>
                                                                {getDaysUntilDue(assignment.due_date)}
                                                            </span>
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-between items-center pt-4 border-t border-border">
                                                <div className="flex space-x-3">
                                                    <Link href={route('assignments.show', assignment.id)}>
                                                        <Button variant="outline" size="sm">
                                                            Zobraziť detail
                                                        </Button>
                                                    </Link>
                                                    
                                                    {/* Student actions */}
                                                    {auth.user.role === 'student' && assignment.status === 'pending' && (
                                                        <Link href={route('assignments.show', assignment.id)}>
                                                            <Button size="sm">
                                                                <Plus className="h-4 w-4 mr-1" />
                                                                Riešiť úlohu
                                                            </Button>
                                                        </Link>
                                                    )}

                                                    {auth.user.role === 'student' && assignment.status === 'rejected' && (
                                                        <Link href={route('assignments.show', assignment.id)}>
                                                            <Button size="sm" variant="destructive">
                                                                Prepracovať a odovzdať
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    
                                                    {auth.user.role === 'student' && assignment.status === 'submitted' && (
                                                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                                            Čaká na kontrolu
                                                        </Badge>
                                                    )}
                                                    
                                                    {/* Supervisor actions */}
                                                    {auth.user.role === 'supervisor' && assignment.thesis?.supervisor_id === auth.user.id && (
                                                        <>
                                                            <Link href={route('assignments.edit', assignment.id)}>
                                                                <Button variant="outline" size="sm">
                                                                    Upraviť
                                                                </Button>
                                                            </Link>
                                                            
                                                            {assignment.status === 'submitted' && (
                                                                <div className="flex space-x-2">
                                                                    <form 
                                                                        method="POST" 
                                                                        action={route('assignments.approve', assignment.id)}
                                                                        className="inline"
                                                                    >
                                                                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />
                                                                        <Button type="submit">
                                                                            Schváliť
                                                                        </Button>
                                                                    </form>
                                                                    <Link href={route('assignments.show', assignment.id)}>
                                                                        <Button variant="outline" size="sm">
                                                                            Hodnotiť
                                                                        </Button>
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                
                                                <div className="text-sm text-muted-foreground">
                                                    Poradie: {assignment.order}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-muted-foreground text-6xl mb-4">📋</div>
                                    <h3 className="text-lg font-medium text-card-foreground mb-2">
                                        Žiadne úlohy
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        {(search || statusFilter || thesisFilter) 
                                            ? 'Neboli nájdené žiadne úlohy vyhovujúce filtrom.'
                                            : auth.user.role === 'student' 
                                                ? 'Zatiaľ nemáte priradené žiadne úlohy.'
                                                : 'V systéme zatiaľ nie sú žiadne úlohy.'
                                        }
                                    </p>
                                    {canCreate && (
                                        <Link href={route('assignments.create')}>
                                            <Button>
                                                Vytvoriť prvú úlohu
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {assignments.links && assignments.links.length > 3 && (
                        <div className="flex justify-center mt-6">
                            <nav className="flex space-x-1">
                                {assignments.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => router.visit(link.url)}
                                        disabled={!link.url}
                                        className={`px-3 py-2 text-sm rounded ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : link.url
                                                ? 'bg-background text-card-foreground hover:bg-muted border border-border'
                                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}