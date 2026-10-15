import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { BookOpenText, Users, Search, GraduationCap } from 'lucide-react';

export default function Index({ auth, theses, canCreate, canAssignStudents, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');
    const [mouse, setMouse] = useState({ x: 50, y: 22 });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('theses.index'), {
            search,
            status: statusFilter,
            type: typeFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('');
        setTypeFilter('');
        router.get(route('theses.index'));
    };

    const formatDate = (date) => {
        if (!date) return 'Nezadané';
        return new Date(date).toLocaleDateString('sk-SK');
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-muted text-foreground border-border',
            available: 'bg-green-500/15 text-green-300 border-green-500/40', 
            assigned: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
            in_progress: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
            completed: 'bg-violet-500/15 text-violet-300 border-violet-500/40',
            defended: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
        };
        return colors[status] || 'bg-muted text-foreground border-border';
    };

    const getStatusText = (status) => {
        const texts = {
            draft: 'Návrh',
            available: 'Dostupná',
            assigned: 'Priradená', 
            in_progress: 'Prebieha',
            completed: 'Dokončená',
            defended: 'Obhájená'
        };
        return texts[status] || status;
    };

    const getTypeColor = (type) => {
        const colors = {
            bachelor: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
            master: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40',
            phd: 'bg-rose-500/15 text-rose-300 border-rose-500/40'
        };
        return colors[type] || 'bg-muted text-foreground border-border';
    };

    const getTypeText = (type) => {
        const texts = {
            bachelor: 'Bakalárska',
            master: 'Diplomová',
            phd: 'Dizertačná'
        };
        return texts[type] || type;
    };

    const thesisStats = {
        total: theses?.data?.length || 0,
        active: theses?.data?.filter((t) => ['assigned', 'in_progress'].includes(t.status)).length || 0,
        available: theses?.data?.filter((t) => t.status === 'available').length || 0,
        withStudent: theses?.data?.filter((t) => !!t.student_id).length || 0,
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 min-w-0 w-full">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl font-semibold leading-tight text-foreground truncate">
                            Témy záverečných prác
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">
                            {auth.user.role === 'student' && 'Vaše priradené témy'}
                            {auth.user.role === 'supervisor' && 'Témy, ktoré vedême'}
                            {auth.user.role === 'admin' && 'Všetky témy v systéme'}
                        </p>
                    </div>
                    {canCreate && (
                        <Link href={route('theses.create')} className="hidden sm:inline-flex flex-shrink-0 self-start sm:self-auto">
                            <Button size="sm" className="w-auto whitespace-nowrap">
                                <span className="sm:hidden">Nová téma</span>
                                <span className="hidden sm:inline">Vytvoriť novú tému</span>
                            </Button>
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Témy" />

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
                                    <p className="text-xs text-muted-foreground">Spolu tém</p>
                                    <p className="text-2xl font-semibold text-foreground">{thesisStats.total}</p>
                                </div>
                                <BookOpenText className="h-5 w-5 text-primary" />
                            </CardContent>
                        </Card>
                        <Card className="border-border/70 bg-card/70 backdrop-blur-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Aktívne</p>
                                    <p className="text-2xl font-semibold text-foreground">{thesisStats.active}</p>
                                </div>
                                <GraduationCap className="h-5 w-5 text-emerald-300" />
                            </CardContent>
                        </Card>
                        <Card className="border-border/70 bg-card/70 backdrop-blur-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Dostupné</p>
                                    <p className="text-2xl font-semibold text-foreground">{thesisStats.available}</p>
                                </div>
                                <Search className="h-5 w-5 text-sky-300" />
                            </CardContent>
                        </Card>
                        <Card className="border-border/70 bg-card/70 backdrop-blur-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Priradené študentom</p>
                                    <p className="text-2xl font-semibold text-foreground">{thesisStats.withStudent}</p>
                                </div>
                                <Users className="h-5 w-5 text-violet-300" />
                            </CardContent>
                        </Card>
                    </div>

                    {canCreate && (
                        <div className="sm:hidden section-lift-in" style={{ animationDelay: '60ms' }}>
                            <Link href={route('theses.create')} className="block">
                                <Button className="w-full">Nová téma</Button>
                            </Link>
                        </div>
                    )}

                    {/* Search and Filters */}
                    <div className="border border-border/70 bg-gradient-to-br from-card/90 via-card/75 to-muted/35 overflow-hidden shadow-sm sm:rounded-xl mb-6 section-lift-in" style={{ animationDelay: '90ms' }}>
                        <div className="p-4 sm:p-6">
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-card-foreground mb-1">
                                            Vyhľadávanie
                                        </label>
                                        <Input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Názov témy, školiteľ..."
                                            className="w-full"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-card-foreground mb-1">
                                            Stav
                                        </label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary/40"
                                        >
                                            <option value="">Všetky stavy</option>
                                            <option value="draft">Návrh</option>
                                            <option value="available">Dostupná</option>
                                            <option value="assigned">Priradená</option>
                                            <option value="in_progress">Prebieha</option>
                                            <option value="completed">Dokončená</option>
                                            <option value="defended">Obhájená</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-card-foreground mb-1">
                                            Typ práce
                                        </label>
                                        <select
                                            value={typeFilter}
                                            onChange={(e) => setTypeFilter(e.target.value)}
                                            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary/40"
                                        >
                                            <option value="">Všetky typy</option>
                                            <option value="bachelor">Bakalárska</option>
                                            <option value="master">Diplomová</option>
                                            <option value="phd">Dizertačná</option>
                                        </select>
                                    </div>
                                    
                                    <div className="flex items-end gap-2 flex-wrap sm:flex-nowrap">
                                        <Button type="submit" className="w-full sm:flex-1">
                                            Filtrovať
                                        </Button>
                                        {(search || statusFilter || typeFilter) && (
                                            <Button 
                                                type="button" 
                                                variant="outline"
                                                onClick={clearFilters}
                                                className="w-full sm:w-auto"
                                            >
                                                Vymazať
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Theses List */}
                    <div className="bg-card/70 border border-border/70 overflow-hidden shadow-sm sm:rounded-lg backdrop-blur-sm section-lift-in" style={{ animationDelay: '140ms' }}>
                        <div className="p-4 sm:p-6">
                            {theses.data.length > 0 ? (
                                <div className="space-y-4">
                                    {theses.data.map((thesis, index) => (
                                        <div key={thesis.id} className="bg-gradient-to-br from-card via-card to-muted/20 border border-border/70 rounded-xl p-4 sm:p-6 hover:border-primary/30 transition-all duration-200 stagger-item card-hover-glow" style={{ animationDelay: `${180 + index * 50}ms` }}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                                                        <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-1 sm:mb-2 break-words">
                                                            <Link
                                                                href={route('theses.show', thesis.id)}
                                                                className="hover:text-primary transition-colors"
                                                            >
                                                                {thesis.title}
                                                            </Link>
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2 sm:ml-4">
                                                            <Badge className={getStatusColor(thesis.status)}>
                                                                {getStatusText(thesis.status)}
                                                            </Badge>
                                                            <Badge className={getTypeColor(thesis.type)}>
                                                                {getTypeText(thesis.type)}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-muted-foreground mb-3 line-clamp-2">
                                                        {thesis.description}
                                                    </p>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                                        <div>
                                                            <span className="font-medium">Školiteľ:</span> {thesis.supervisor?.name || 'Nezadané'}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Študent:</span> {thesis.student?.name || 'Nepriradený'}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Termín:</span> {formatDate(thesis.deadline)}
                                                        </div>
                                                    </div>
                                                    
                                                    {thesis.requirements && (
                                                        <div className="mt-3">
                                                            <span className="text-sm font-medium text-muted-foreground">Požiadavky:</span>
                                                            <p className="text-sm text-muted-foreground mt-1">{thesis.requirements}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 border-t">
                                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                                    <Link href={route('theses.show', thesis.id)}>
                                                        <Button variant="outline" size="sm">
                                                            Zobraziť detail
                                                        </Button>
                                                    </Link>
                                                    
                                                    {/* Actions based on user role and thesis state */}
                                                    {auth.user.role === 'supervisor' && thesis.supervisor_id === auth.user.id && (
                                                        <>
                                                            <Link href={route('theses.edit', thesis.id)}>
                                                                <Button variant="outline" size="sm">
                                                                    Upraviť
                                                                </Button>
                                                            </Link>
                                                            
                                                            {thesis.student_id && (
                                                                <Link href={route('assignments.create', { thesis_id: thesis.id })}>
                                                                    <Button size="sm">
                                                                        Vytvoriť úlohu
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                            
                                                            {canAssignStudents && thesis.status === 'available' && (
                                                                <Button variant="outline" size="sm">
                                                                    Priradiť študenta
                                                                </Button>
                                                            )}
                                                        </>
                                                    )}
                                                    
                                                    {auth.user.role === 'student' && thesis.student_id === auth.user.id && (
                                                        <div className="text-sm text-muted-foreground">
                                                            Vaša priradená téma
                                                        </div>
                                                    )}
                                                </div>
                                                
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-muted-foreground text-6xl mb-4">📚</div>
                                    <h3 className="text-lg font-medium text-card-foreground mb-2">
                                        Žiadne témy
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        {(search || statusFilter || typeFilter) 
                                            ? 'Neboli nájdené žiadne témy vyhovujúce filtrom.'
                                            : 'V systéme zatiaľ nie sú žiadne témy.'
                                        }
                                    </p>
                                    {canCreate && (
                                        <Link href={route('theses.create')}>
                                            <Button>
                                                Vytvoriť prvú tému
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {theses.links && theses.links.length > 3 && (
                        <div className="bg-card px-4 py-3 flex items-center justify-between border-t border-border sm:px-6 mt-6 rounded-lg shadow-sm">
                            <div className="flex-1 flex justify-between sm:hidden">
                                {theses.prev_page_url && (
                                    <Link 
                                        href={theses.prev_page_url}
                                        className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-card hover:bg-accent"
                                    >
                                        Predchádzajúca
                                    </Link>
                                )}
                                {theses.next_page_url && (
                                    <Link 
                                        href={theses.next_page_url}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-card hover:bg-accent"
                                    >
                                        Ďalšia
                                    </Link>
                                )}
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Zobrazuje <span className="font-medium">{theses.from}</span> až{' '}
                                        <span className="font-medium">{theses.to}</span> z{' '}
                                        <span className="font-medium">{theses.total}</span> výsledkov
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {theses.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? 'z-10 bg-primary/10 border-primary text-primary'
                                                        : 'bg-card border-border text-foreground hover:bg-accent'
                                                } ${index === 0 ? 'rounded-l-md' : ''} ${
                                                    index === theses.links.length - 1 ? 'rounded-r-md' : ''
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}