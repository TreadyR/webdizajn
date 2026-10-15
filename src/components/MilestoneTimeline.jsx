import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useForm, router, Link } from '@inertiajs/react';
import Modal from '@/components/Modal';
import InputError from '@/components/InputError';
import { Target, CheckCircle2, Clock3, Sparkles, Pencil, Trash2 } from 'lucide-react';

export default function MilestoneTimeline({ thesis, milestones, isSupervisor }) {
    const [expandedMilestone, setExpandedMilestone] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState(null);
    const [mouse, setMouse] = useState({ x: 50, y: 24 });

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        description: '',
        due_date: '',
        status: 'planned',
        order: (milestones ? milestones.length + 1 : 1)
    });

    const toggleMilestone = (id) => {
        setExpandedMilestone(expandedMilestone === id ? null : id);
    };

    const openCreateModal = () => {
        reset();
        setEditingMilestone(null);
        setShowCreateModal(true);
    };

    const openEditModal = (milestone) => {
        setEditingMilestone(milestone);
        setData({
            title: milestone.title || '',
            description: milestone.description || '',
            due_date: milestone.due_date ? milestone.due_date.split('T')[0] : '', // format YYYY-MM-DD
            status: milestone.status || 'planned',
            order: milestone.order || 1
        });
        setShowCreateModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingMilestone) {
            put(route('milestones.update', [thesis.id, editingMilestone.id]), {
                preserveScroll: true,
                onSuccess: () => {
                    setShowCreateModal(false);
                    setEditingMilestone(null);
                    reset();
                }
            });
        } else {
            post(route('milestones.store', thesis.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setShowCreateModal(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (milestone) => {
        if (confirm(`Naozaj chcete vymazať míľnik "${milestone.title}"?`)) {
            router.delete(route('milestones.destroy', [thesis.id, milestone.id]), {
                preserveScroll: true
            });
        }
    };

    const handleStatusUpdate = (milestone, newStatus) => {
        router.put(route('milestones.update', [thesis.id, milestone.id]), {
            status: newStatus
        }, {
            preserveScroll: true
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-500 border-green-500';
            case 'in_progress': return 'bg-blue-500 border-blue-500';
            case 'review': return 'bg-yellow-500 border-yellow-500';
            default: return 'bg-gray-300 border-gray-300';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed': return <Badge className="bg-green-500 hover:bg-green-600">Dokončené</Badge>;
            case 'in_progress': return <Badge className="bg-blue-500 hover:bg-blue-600">Prebieha</Badge>;
            case 'review': return <Badge className="bg-yellow-500 hover:bg-yellow-600">Na kontrole</Badge>;
            default: return <Badge variant="secondary">Plánované</Badge>;
        }
    };

    const getProgress = (milestone) => {
        if (!milestone.assignments || milestone.assignments.length === 0) return 0;
        const approvedAssignments = milestone.assignments.filter(a => a.status === 'approved').length;
        return Math.round((approvedAssignments / milestone.assignments.length) * 100);
    };

    const summary = {
        total: milestones?.length || 0,
        completed: milestones?.filter((m) => m.status === 'completed').length || 0,
        inProgress: milestones?.filter((m) => m.status === 'in_progress').length || 0,
        avgProgress: milestones?.length
            ? Math.round(milestones.reduce((acc, m) => acc + getProgress(m), 0) / milestones.length)
            : 0,
    };

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setMouse({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    };

    return (
        <div
            className="space-y-6 ambient-page-shell page-enter-fade rounded-2xl border border-border/70 bg-card/55 backdrop-blur-md p-5 md:p-7"
            onMouseMove={handleMouseMove}
            style={{ '--mx': `${mouse.x}%`, '--my': `${mouse.y}%` }}
        >
            <div className="ambient-page-grid" />
            <div className="ambient-page-spotlight" />

            <div className="ambient-page-content space-y-6 text-foreground">
            <div className="flex justify-between items-center section-lift-in" style={{ animationDelay: '40ms' }}>
                <div>
                    <h3 className="text-xl font-bold text-foreground">Priebeh práce (Míľniky)</h3>
                    <p className="text-sm text-muted-foreground mt-1">Fázy práce, termíny a progres k jednotlivým etapám.</p>
                </div>
                {isSupervisor && (
                    <Button onClick={openCreateModal} size="sm">
                        + Pridať míľnik
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 section-lift-in" style={{ animationDelay: '90ms' }}>
                <Card className="border-border/70 bg-card/70 backdrop-blur-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">Spolu míľnikov</p>
                            <p className="text-2xl font-semibold text-foreground">{summary.total}</p>
                        </div>
                        <Target className="h-5 w-5 text-primary" />
                    </CardContent>
                </Card>
                <Card className="border-border/70 bg-card/70 backdrop-blur-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">Dokončené</p>
                            <p className="text-2xl font-semibold text-foreground">{summary.completed}</p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    </CardContent>
                </Card>
                <Card className="border-border/70 bg-card/70 backdrop-blur-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">Prebieha</p>
                            <p className="text-2xl font-semibold text-foreground">{summary.inProgress}</p>
                        </div>
                        <Clock3 className="h-5 w-5 text-sky-300" />
                    </CardContent>
                </Card>
                <Card className="border-border/70 bg-card/70 backdrop-blur-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">Priemerný progres</p>
                            <p className="text-2xl font-semibold text-foreground">{summary.avgProgress}%</p>
                        </div>
                        <Sparkles className="h-5 w-5 text-violet-300" />
                    </CardContent>
                </Card>
            </div>

            <div className="relative border-l-2 border-border/60 ml-3 md:ml-4 space-y-8 pb-4 pr-1 section-lift-in" style={{ animationDelay: '140ms' }}>
                {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="ml-6 relative">
                        {/* Timeline dot */}
                        <div className={`absolute -left-[33px] top-6 w-4 h-4 rounded-full border-2 bg-background ${getStatusColor(milestone.status)}`} />
                        
                        <Card className={`mb-4 transition-all stagger-item card-hover-glow ${milestone.status === 'completed' ? 'opacity-80' : 'shadow-md'} dark:hover:border-foreground/20 bg-card/80 backdrop-blur-sm`} style={{ animationDelay: `${180 + index * 55}ms` }}>
                            <CardHeader className="pb-2 cursor-pointer hover:bg-muted/50 rounded-t-xl transition-colors group" onClick={() => toggleMilestone(milestone.id)}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <CardTitle className="text-lg group-hover:text-primary transition-colors">{milestone.title}</CardTitle>
                                            {getStatusBadge(milestone.status)}
                                        </div>
                                        <CardDescription className="line-clamp-2">{milestone.description}</CardDescription>
                                        
                                        {/* Progress Bar */}
                                        <div className="mt-3 flex items-center gap-2">
                                            <Progress value={getProgress(milestone)} className="h-2 w-full" />
                                            <span className="text-xs text-muted-foreground w-8 text-right">{getProgress(milestone)}%</span>
                                        </div>

                                        {milestone.due_date && (
                                            <p className="text-xs text-muted-foreground mt-2 flex items-center">
                                                📅 Termín: {new Date(milestone.due_date).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="ml-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleMilestone(milestone.id);
                                        }}
                                    >
                                        {expandedMilestone === milestone.id ? 'Menej' : 'Viac'}
                                    </Button>
                                </div>
                            </CardHeader>
                            
                            {expandedMilestone === milestone.id && (
                                <CardContent className="pt-0">
                                    <div className="mt-4 border-t pt-4">
                                        <h4 className="text-sm font-semibold text-foreground mb-3">Úlohy v tejto fáze:</h4>
                                        
                                        {milestone.assignments && milestone.assignments.length > 0 ? (
                                            <ul className="space-y-2 mb-4">
                                                {milestone.assignments.map(assignment => (
                                                    <Link 
                                                        key={assignment.id} 
                                                        href={route('assignments.show', assignment.id)}
                                                        className="block"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <li className="flex justify-between items-center p-3 bg-secondary/50 hover:bg-secondary/80 rounded-md text-sm border border-border/70 transition-colors cursor-pointer group">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-2 h-2 rounded-full ${
                                                                    assignment.status === 'approved' ? 'bg-green-500' : 
                                                                    assignment.status === 'rejected' ? 'bg-red-500' : 
                                                                    assignment.status === 'cancelled' ? 'bg-slate-500' : 
                                                                    assignment.status === 'submitted' ? 'bg-blue-500' : 'bg-gray-400'
                                                                }`} />
                                                                <span className="group-hover:text-primary transition-colors font-medium">{assignment.title}</span>
                                                            </div>
                                                            <Badge variant={assignment.status === 'rejected' ? 'destructive' : 'outline'} className="text-xs">
                                                                {assignment.status === 'approved' ? 'Schválená' : 
                                                                 assignment.status === 'rejected' ? 'Vrátená' :
                                                                 assignment.status === 'cancelled' ? 'Zrušená' :
                                                                 assignment.status === 'submitted' ? 'Odovzdaná' : 'Čaká'}
                                                            </Badge>
                                                        </li>
                                                    </Link>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic mb-4">Žiadne úlohy.</p>
                                        )}
                                        
                                        {isSupervisor && (
                                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                                                {/* Supervisor Controls */}
                                                {milestone.status !== 'completed' && (
                                                    <Button 
                                                        size="sm" 
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusUpdate(milestone, 'completed');
                                                        }}
                                                    >
                                                        ✓ Dokončiť fázu
                                                    </Button>
                                                )}
                                                
                                                {milestone.status === 'completed' && (
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusUpdate(milestone, 'in_progress');
                                                        }}
                                                    >
                                                        ↺ Vrátiť do riešenia
                                                    </Button>
                                                )}

                                                <Link 
                                                    href={route('assignments.create', { thesis_id: thesis.id, milestone_id: milestone.id })}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Button size="sm" variant="secondary">
                                                        + Pridať úlohu
                                                    </Button>
                                                </Link>

                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditModal(milestone);
                                                    }}
                                                    className="ml-auto text-muted-foreground hover:text-foreground"
                                                >
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Upraviť
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(milestone);
                                                    }}
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    </div>
                ))}
            </div>
            
            {milestones.length === 0 && (
                <div className="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground bg-muted/40 section-lift-in" style={{ animationDelay: '160ms' }}>
                    <p className="mb-2">Zatiaľ neboli definované žiadne míľniky.</p>
                    {isSupervisor && (
                        <Button onClick={openCreateModal} variant="outline">
                            Vytvoriť prvý míľnik
                        </Button>
                    )}
                </div>
            )}
            </div>

            {/* Create / Edit Modal */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
                <form onSubmit={handleSubmit} className="p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 border border-zinc-800/80 rounded-lg">
                    <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                        {editingMilestone ? 'Upraviť míľnik' : 'Pridať nový míľnik'}
                    </h2>

                    <div className="mt-4">
                        <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-2">Názov míľnika</label>
                        <input
                            id="title"
                            type="text"
                            className="block w-full rounded-md border border-zinc-700 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Napr. Analýza literatúry"
                            required
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-2">Popis fázy / Ciele</label>
                        <textarea
                            id="description"
                            className="block w-full rounded-md border border-zinc-700 bg-zinc-900/90 p-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                            rows="3"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Popíšte výstupy a očakávania pre túto fázu..."
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="due_date" className="block text-sm font-medium text-zinc-300 mb-2">Plánovaný termín (Due Date)</label>
                        <input
                            id="due_date"
                            type="date"
                            className="block w-full rounded-md border border-zinc-700 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                            value={data.due_date}
                            onChange={(e) => setData('due_date', e.target.value)}
                        />
                        <InputError message={errors.due_date} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-zinc-100">
                            Zrušiť
                        </Button>
                        <Button disabled={processing} className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400">
                            {editingMilestone ? 'Uložiť úpravy' : 'Vytvoriť'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
