import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowRight, CalendarDays, Search, Target } from 'lucide-react';
import { useEffect, useState } from 'react';

const statusLabel = (status) => {
    const labels = {
        planned: 'Plánované',
        in_progress: 'Prebieha',
        review: 'Na kontrole',
        completed: 'Dokončené',
    };

    return labels[status] || status;
};

export default function List({ auth, supervisedTheses, filters }) {
    const items = supervisedTheses?.data || [];
    const [search, setSearch] = useState(filters?.search || '');
    const [sort, setSort] = useState(filters?.sort || 'recent');

    useEffect(() => {
        setSearch(filters?.search || '');
        setSort(filters?.sort || 'recent');
    }, [filters?.search, filters?.sort]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const currentSearch = filters?.search || '';
            const currentSort = filters?.sort || 'recent';

            if (search === currentSearch && sort === currentSort) {
                return;
            }

            router.get(
                route('progress.index'),
                {
                    search: search || undefined,
                    sort: sort || undefined,
                },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 350);

        return () => clearTimeout(timer);
    }, [search, sort, filters?.search, filters?.sort]);

    return (
        <AuthenticatedLayout
            header={
                <div className="min-w-0 w-full">
                    <h2 className="text-lg sm:text-xl font-semibold leading-tight text-foreground truncate">
                        Progres študentov
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                        Vyberte študenta, pozrite rýchly náhľad míľnikov na hover a detail otvorte kliknutím.
                    </p>
                </div>
            }
        >
            <Head title="Progres študentov" />

            <div className="mx-auto max-w-7xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Filtrovanie a vyhľadávanie</CardTitle>
                        <CardDescription>
                            Hľadanie funguje podľa mena, AIS ID, emailu a názvu témy aj bez diakritiky.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Meno, AIS ID, email alebo názov témy..."
                                className="pl-10"
                            />
                        </div>

                        <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger>
                                <SelectValue placeholder="Triedenie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Recent (naposledy aktívne)</SelectItem>
                                <SelectItem value="progress_asc">Progres vzostupne</SelectItem>
                                <SelectItem value="progress_desc">Progres zostupne</SelectItem>
                                <SelectItem value="name_asc">Meno A-Z</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                <TooltipProvider delayDuration={120}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Študenti a ich progres</CardTitle>
                            <CardDescription>
                                Hover na karte ukáže základné míľniky, klik otvorí samostatnú stránku detailu progresu.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {items.length > 0 ? (
                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <Tooltip key={item.id}>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={route('progress.thesis', {
                                                        thesis: item.id,
                                                        search: filters?.search || undefined,
                                                        sort: filters?.sort || undefined,
                                                    })}
                                                    className="block rounded-lg border border-border p-3 hover:border-primary/40 hover:bg-muted/30 transition-all"
                                                >
                                                    <div className="flex items-center justify-between gap-3 mb-2">
                                                        <div className="min-w-0">
                                                            <p className="font-medium truncate">{item.student?.name || 'Bez študenta'}</p>
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                AIS: {item.student?.student_id || 'N/A'} | {item.title}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <span className="text-sm font-semibold text-muted-foreground">{item.progress || 0}%</span>
                                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    </div>
                                                    <Progress value={item.progress || 0} className="h-2" />
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-sm bg-card text-card-foreground border border-border shadow-xl p-3" side="top" align="start">
                                                <p className="text-xs font-semibold mb-2 flex items-center gap-1">
                                                    <Target className="h-3.5 w-3.5" />
                                                    Základné míľniky
                                                </p>
                                                {item.milestone_preview?.length ? (
                                                    <div className="space-y-1.5">
                                                        {item.milestone_preview.map((milestone) => (
                                                            <div key={milestone.id} className="text-xs rounded-md bg-muted/50 px-2 py-1.5">
                                                                <div className="font-medium truncate">{milestone.title}</div>
                                                                <div className="text-muted-foreground flex items-center justify-between mt-0.5">
                                                                    <span>{statusLabel(milestone.status)}</span>
                                                                    <span className="inline-flex items-center gap-1">
                                                                        <CalendarDays className="h-3 w-3" />
                                                                        {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString('sk-SK') : 'bez termínu'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">Téma zatiaľ nemá vytvorené míľniky.</p>
                                                )}
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    {filters?.search
                                        ? 'Nenašli sa žiadni študenti pre zadané filtrovanie.'
                                        : 'Zatiaľ nemáte priradených študentov.'}
                                </div>
                            )}

                            {supervisedTheses?.links && supervisedTheses.links.length > 3 && (
                                <div className="flex justify-center mt-5">
                                    <div className="flex flex-wrap gap-2">
                                        {supervisedTheses.links.map((link, index) => (
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
                </TooltipProvider>
            </div>
        </AuthenticatedLayout>
    );
}
