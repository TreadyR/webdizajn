import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    ArrowRight,
    ArrowUpRight,
    Sparkles,
} from 'lucide-react';
import {
    AcademicCapIcon,
    ArrowTrendingUpIcon,
    BookOpenIcon,
    CalendarDaysIcon,
    CircleStackIcon,
    ChartBarIcon,
    ChatBubbleLeftRightIcon,
    CheckBadgeIcon,
    ClipboardDocumentCheckIcon,
    Cog6ToothIcon,
    EnvelopeIcon,
    ExclamationTriangleIcon,
    SignalIcon,
    UsersIcon,
    ClockIcon,
    UserPlusIcon,
    ShieldCheckIcon,
    WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Dashboard({ auth, dashboardData }) {
    const user = auth.user;
    const [mouse, setMouse] = useState({ x: 50, y: 22 });
    const isStudentView = user.role === 'student';
    const isSupervisorView = user.role === 'supervisor';
    const isAdminView = user.role === 'admin';

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        setMouse({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('sk-SK', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return { date: '', time: '' };
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('sk-SK', { day: 'numeric', month: 'long' }),
            time: date.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
            'approved': 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
            'rejected': 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
            'cancelled': 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20',
            'submitted': 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
            'completed': 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
        };
        return colors[status] || 'bg-gray-500/10 text-gray-500';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'Čaká na riešenie',
            submitted: 'Odovzdané',
            approved: 'Schválené',
            rejected: 'Vrátené na prepracovanie',
            cancelled: 'Zrušené',
        };

        return texts[status] || status;
    };

    const getDeadlineTheme = (deadlineColor) => {
        if (deadlineColor === 'red') {
            return {
                card: 'border-l-red-400 bg-gradient-to-br from-red-500/14 via-red-500/8 to-background ring-1 ring-red-500/25',
                icon: 'text-red-300',
            };
        }

        if (deadlineColor === 'yellow') {
            return {
                card: 'border-l-amber-400 bg-gradient-to-br from-amber-500/14 via-amber-500/8 to-background ring-1 ring-amber-500/25',
                icon: 'text-amber-300',
            };
        }

        return {
            card: 'border-l-emerald-400 bg-gradient-to-br from-emerald-500/14 via-emerald-500/8 to-background ring-1 ring-emerald-500/25',
            icon: 'text-emerald-300',
        };
    };

    const isToday = (dateString) => {
        const today = new Date();
        const date = new Date(dateString);
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const thesisStatusLabel = (status) => {
        const labels = {
            draft: 'Návrh',
            available: 'Voľná',
            assigned: 'Priradená',
            in_progress: 'V riešení',
            completed: 'Dokončená',
            defended: 'Obhájená',
        };

        return labels[status] || status;
    };

    const thesisStatusTone = (status) => {
        const tones = {
            draft: 'bg-slate-500/15 text-slate-300 border-slate-400/30',
            available: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30',
            assigned: 'bg-violet-500/15 text-violet-300 border-violet-400/30',
            in_progress: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
            completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
            defended: 'bg-green-500/15 text-green-300 border-green-400/30',
        };

        return tones[status] || 'bg-muted/50 text-muted-foreground border-border';
    };

    const roleLabel = (role) => {
        const labels = {
            admin: 'Admin',
            supervisor: 'Školiteľ',
            student: 'Študent',
        };

        return labels[role] || role;
    };

    const roleTone = (role) => {
        const tones = {
            admin: 'bg-red-500/15 text-red-300 border-red-400/30',
            supervisor: 'bg-violet-500/15 text-violet-300 border-violet-400/30',
            student: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
        };

        return tones[role] || 'bg-muted/50 text-muted-foreground border-border';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-foreground leading-tight">Nástenka</h2>}
        >
            <Head title="Nástenka" />

            <div
                className={`ambient-page-shell page-enter-fade ${isStudentView ? 'student-dashboard-shell' : isSupervisorView ? 'supervisor-dashboard-shell' : isAdminView ? 'admin-dashboard-shell' : ''}`}
                onMouseMove={handleMouseMove}
                style={{ '--mx': `${mouse.x}%`, '--my': `${mouse.y}%` }}
            >
                <div className="ambient-page-spotlight" />
                <div className="ambient-page-grid" />

                {isStudentView && (
                    <div className="student-dashboard-ambient" aria-hidden="true">
                        <span className="student-orb student-orb-1" />
                        <span className="student-orb student-orb-2" />
                        <span className="student-orb student-orb-3" />
                        <span className="student-grid" />
                    </div>
                )}

                {isSupervisorView && (
                    <div className="supervisor-dashboard-ambient" aria-hidden="true">
                        <span className="supervisor-orb supervisor-orb-1" />
                        <span className="supervisor-orb supervisor-orb-2" />
                        <span className="supervisor-orb supervisor-orb-3" />
                        <span className="supervisor-grid" />
                    </div>
                )}

                {isAdminView && (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                        <span className="absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
                        <span className="absolute top-1/3 -right-12 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
                        <span className="absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
                        <span className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
                    </div>
                )}

                <div className="ambient-page-content relative z-10 py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* Welcome Section */}
                {isStudentView ? (
                    <div className="student-welcome-hero section-lift-in" style={{ animationDelay: '40ms' }}>
                        <div className="student-welcome-content">
                            <h1 className="student-welcome-title">
                                Vitajte, {user.name}!
                            </h1>
                            <p className="student-welcome-subtitle">
                                Tu je prehľad vášho postupu pri záverečnej práci.
                            </p>
                        </div>

                        {!dashboardData.activeThesis && (
                            <Link href={route('theses.index')}>
                                <Button className="student-welcome-button">
                                    <BookOpenIcon className="mr-2 h-4 w-4" />
                                    Prehľadávať témy
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : isSupervisorView ? (
                    <div className="supervisor-welcome-hero section-lift-in" style={{ animationDelay: '40ms' }}>
                        <div className="supervisor-welcome-content">
                            <h1 className="supervisor-welcome-title">
                                Vitajte, {user.name}!
                            </h1>
                            <p className="supervisor-welcome-subtitle">
                                Prehľad vašich študentov, progresu a nadchádzajúcich termínov.
                            </p>
                        </div>
                        <Link href={route('assignments.index')}>
                            <Button className="supervisor-welcome-button">
                                <ClipboardDocumentCheckIcon className="mr-2 h-4 w-4" />
                                Skontrolovať úlohy
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="relative overflow-hidden rounded-2xl border border-emerald-400/25 bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-background p-6 md:p-8 section-lift-in" style={{ animationDelay: '40ms' }}>
                        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_55%)]" />
                        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 mb-3">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Admin Control Center
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                    Vitajte, {user.name}!
                                </h1>
                                <p className="text-muted-foreground mt-2 max-w-2xl">
                                    Centrálne riadenie systému: používatelia, systémové zdravie, reporty a rýchle administrátorské akcie.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Link href={route('admin.users')}>
                                    <Button className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400">
                                        <UsersIcon className="mr-2 h-4 w-4" />
                                        Používatelia
                                    </Button>
                                </Link>
                                <Link href={route('admin.reports')}>
                                    <Button variant="outline" className="border-cyan-300/40 text-cyan-200 hover:bg-cyan-500/10 hover:text-cyan-100">
                                        <ChartBarIcon className="mr-2 h-4 w-4" />
                                        Reporty
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Student Dashboard */}
                {user.role === 'student' && (
                    <div className="space-y-6 section-lift-in" style={{ animationDelay: '90ms' }}>
                        {dashboardData.activeThesis ? (
                            <>
                                {/* Progress & Status Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Overall Progress */}
                                    <Link href={route('progress.index')} className="md:col-span-1 block group">
                                        <Card className="student-card h-full transition-shadow hover:shadow-md cursor-pointer">
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center justify-between">
                                                    <span>Celkový progres</span>
                                                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center py-6">
                                                <div className="relative w-32 h-32 flex items-center justify-center">
                                                    {/* Circular Progress Placeholder - CSS implementation */}
                                                    <svg className="w-full h-full transform -rotate-90">
                                                        <circle
                                                            cx="64"
                                                            cy="64"
                                                            r="56"
                                                            stroke="currentColor"
                                                            strokeWidth="12"
                                                            fill="transparent"
                                                            className="text-muted/20"
                                                        />
                                                        <circle
                                                            cx="64"
                                                            cy="64"
                                                            r="56"
                                                            stroke="currentColor"
                                                            strokeWidth="12"
                                                            fill="transparent"
                                                            strokeDasharray={351.86}
                                                            strokeDashoffset={351.86 - (351.86 * dashboardData.progress) / 100}
                                                            className="text-primary transition-all duration-1000 ease-out"
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-3xl font-bold">{dashboardData.progress}%</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-4 group-hover:text-primary transition-colors">
                                                    {dashboardData.completedMilestones} z {dashboardData.totalMilestones} etáp dokončených
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>

                                    {/* Next Deadline - Highlighted */}
                                    <Card className={`student-card md:col-span-1 border-l-4 ${getDeadlineTheme(dashboardData.deadlineColor).card}`}>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <ExclamationTriangleIcon className={`h-5 w-5 ${getDeadlineTheme(dashboardData.deadlineColor).icon}`} />
                                                Najbližší termín
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {dashboardData.nextDeadline ? (
                                                <div className="space-y-4">
                                                    <div>
                                                        <h3 className="font-semibold text-xl">
                                                            {dashboardData.nextDeadline.title}
                                                        </h3>
                                                        <p className="text-muted-foreground">
                                                            {formatDate(dashboardData.nextDeadline.deadline)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">
                                                            {dashboardData.daysUntilDetail}
                                                        </span>
                                                    </div>
                                                 </div>
                                            ) : (
                                                <div className="h-full flex flex-col justify-center text-muted-foreground">
                                                    <CheckBadgeIcon className="h-8 w-8 mb-2 text-green-500" />
                                                    <p>Všetky termíny splnené!</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Thesis Info */}
                                    <Card className="student-card md:col-span-1">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Vaša práca</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <h4 className="font-medium text-sm text-muted-foreground mb-1">Téma</h4>
                                                <p className="font-medium line-clamp-2">{dashboardData.activeThesis.title}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-sm text-muted-foreground mb-1">Školiteľ</h4>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                        {dashboardData.activeThesis.supervisor?.name.charAt(0)}
                                                    </div>
                                                    <span>{dashboardData.activeThesis.supervisor?.name}</span>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <Link href={route('theses.show', dashboardData.activeThesis.id)}>
                                                    <Button variant="outline" className="w-full">
                                                        Detail práce
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Assignments & Activity */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Pending Assignments */}
                                    <Card className="student-card">
                                        <CardHeader>
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-lg">Aktuálne úlohy</CardTitle>
                                                <Link href={route('assignments.index')}>
                                                    <Button variant="ghost" size="sm">
                                                        Všetky
                                                        <ArrowRight className="ml-1 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {dashboardData.pendingAssignments && dashboardData.pendingAssignments.length > 0 ? (
                                                    dashboardData.pendingAssignments.map((assignment) => (
                                                        <div key={assignment.id} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                                                            <div>
                                                                <h4 className="font-medium">{assignment.title}</h4>
                                                                <p className="text-sm text-muted-foreground line-clamp-1">{assignment.description}</p>
                                                                <p className="text-xs text-muted-foreground mt-1">Termín: {formatDate(assignment.due_date)}</p>
                                                            </div>
                                                            <Badge variant="outline" className={getStatusColor(assignment.status)}>
                                                                {getStatusText(assignment.status)}
                                                            </Badge>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-muted-foreground text-center py-4">Žiadne aktívne úlohy</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Upcoming Meetings */}
                                    <Card className="student-card">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Nadchádzajúce konzultácie</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {dashboardData.upcomingMeetings && dashboardData.upcomingMeetings.length > 0 ? (
                                                    dashboardData.upcomingMeetings.map((meeting) => {
                                                        const { date, time } = formatDateTime(meeting.scheduled_at);
                                                        return (
                                                            <div key={meeting.id} className="flex items-center gap-4 border-b pb-3 last:border-0 last:pb-0">
                                                                <div className="bg-primary/10 p-2 rounded-lg text-center min-w-[60px]">
                                                                    <div className="text-xs font-bold uppercase text-primary">{date.split(' ')[1]}</div>
                                                                    <div className="text-lg font-bold">{date.split(' ')[0].replace('.', '')}</div>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-medium">{meeting.title || 'Konzultácia'}</h4>
                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                        <ClockIcon className="h-3 w-3" />
                                                                        {time}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="text-sm text-muted-foreground text-center py-4">Žiadne naplánované konzultácie</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        ) : (
                            <Card className="student-card bg-muted/50 border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <BookOpenIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Ešte nemáte vybranú tému</h3>
                                    <p className="text-muted-foreground max-w-sm mb-6">
                                        Vyberte si tému záverečnej práce zo zoznamu dostupných tém a začnite pracovať na svojom výskume.
                                    </p>
                                    <Link href={route('theses.index')}>
                                        <Button>Prehľadávať témy</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Supervisor Dashboard */}
                {user.role === 'supervisor' && (
                    <div className="space-y-6 section-lift-in" style={{ animationDelay: '90ms' }}>
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="supervisor-card supervisor-stat-card">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Vedení študenti</p>
                                            <div className="text-2xl font-bold">{dashboardData.totalStudents}</div>
                                        </div>
                                        <UsersIcon className="h-8 w-8 text-blue-500/60" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="supervisor-card supervisor-stat-card">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Čaká na kontrolu</p>
                                            <div className="text-2xl font-bold">{dashboardData.pendingAssignmentsCount ?? dashboardData.pendingAssignments?.length ?? 0}</div>
                                        </div>
                                        <ClipboardDocumentCheckIcon className="h-8 w-8 text-yellow-500/60" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="supervisor-card supervisor-stat-card">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Nové správy</p>
                                            <div className="text-2xl font-bold">{dashboardData.unreadMessages}</div>
                                        </div>
                                        <ChatBubbleLeftRightIcon className="h-8 w-8 text-red-500/60" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="supervisor-card supervisor-stat-card">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Konzultácie</p>
                                            <div className="text-2xl font-bold">{dashboardData.upcomingMeetings?.length || 0}</div>
                                        </div>
                                        <CalendarDaysIcon className="h-8 w-8 text-green-500/60" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Student Progress List - Takes 2 cols */}
                            <Card className="supervisor-card lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Prehľad progresu študentov</CardTitle>
                                    <CardDescription>Aktuálny stav rozpracovanosti vedených prác</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {dashboardData.activeTheses && dashboardData.activeTheses.length > 0 ? (
                                            dashboardData.activeTheses.map((thesis) => (
                                                <Link 
                                                    href={route('progress.thesis', thesis.id)} 
                                                    key={thesis.id} 
                                                    className="block space-y-2 p-3 rounded-lg border border-border/60 bg-background/40 hover:bg-background/70 hover:border-primary/35 transition-all group cursor-pointer"
                                                >
                                                    <div className="flex justify-between items-center text-sm">
                                                        <div className="font-medium flex items-center gap-2 group-hover:text-primary transition-colors">
                                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                                {thesis.student?.name.charAt(0)}
                                                            </div>
                                                            {thesis.student?.name}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-muted-foreground font-semibold">{thesis.progress || 0}%</span>
                                                            <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                                        </div>
                                                    </div>
                                                    <Progress value={thesis.progress || 0} className="h-2" />
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span className="truncate max-w-[200px] group-hover:text-foreground transition-colors">{thesis.title}</span>
                                                        <span>{thesis.status === 'in_progress' ? 'V riešení' : thesis.status}</span>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                Zatiaľ nevediete žiadne aktívne práce.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Upcoming Meetings List */}
                            <Card className="supervisor-card lg:col-span-1">
                                <CardHeader>
                                    <CardTitle>Najbližšie stretnutia</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {dashboardData.upcomingMeetings && dashboardData.upcomingMeetings.slice(0, 5).map((meeting) => {
                                            const { date, time } = formatDateTime(meeting.scheduled_at);
                                            return (
                                                <div key={meeting.id} className="rounded-lg border border-border/60 bg-background/45 px-4 py-3">
                                                    <h4 className="font-medium text-sm">{meeting.student?.name}</h4>
                                                    <p className="text-xs text-muted-foreground">{meeting.title || 'Konzultácia'}</p>
                                                    <div className="flex items-center gap-2 mt-1 text-xs font-semibold">
                                                        <span>{date}</span>
                                                        <span>•</span>
                                                        <span>{time}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {(!dashboardData.upcomingMeetings || dashboardData.upcomingMeetings.length === 0) && (
                                            <p className="text-sm text-muted-foreground text-center py-4">Žiadne naplánované stretnutia</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Admin Dashboard */}
                {user.role === 'admin' && (
                    <div className="space-y-6 section-lift-in" style={{ animationDelay: '90ms' }}>
                        <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Rýchle akcie</CardTitle>
                                <CardDescription>Najčastejšie administrátorské úkony na jedno kliknutie</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Link href={route('admin.users.create')} className="block">
                                    <Button variant="outline" className="w-full justify-between h-11">
                                        Nový používateľ
                                        <UserPlusIcon className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href={route('admin.system')} className="block">
                                    <Button variant="outline" className="w-full justify-between h-11">
                                        Systémový monitoring
                                        <Cog6ToothIcon className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href={route('admin.reports')} className="block">
                                    <Button variant="outline" className="w-full justify-between h-11">
                                        Reporty a analytika
                                        <ChartBarIcon className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            <Card className="border-border/70 bg-card/75 backdrop-blur-sm">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Používatelia</p>
                                            <div className="text-3xl font-bold mt-1">{dashboardData.systemStats?.totalUsers ?? 0}</div>
                                        </div>
                                        <UsersIcon className="h-6 w-6 text-cyan-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/70 bg-card/75 backdrop-blur-sm">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Študenti</p>
                                            <div className="text-3xl font-bold mt-1">{dashboardData.systemStats?.totalStudents ?? 0}</div>
                                        </div>
                                        <AcademicCapIcon className="h-6 w-6 text-emerald-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/70 bg-card/75 backdrop-blur-sm">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Školitelia</p>
                                            <div className="text-3xl font-bold mt-1">{dashboardData.systemStats?.totalSupervisors ?? 0}</div>
                                        </div>
                                        <ShieldCheckIcon className="h-6 w-6 text-violet-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/70 bg-card/75 backdrop-blur-sm">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Všetky témy</p>
                                            <div className="text-3xl font-bold mt-1">{dashboardData.systemStats?.totalTheses ?? 0}</div>
                                        </div>
                                        <BookOpenIcon className="h-6 w-6 text-amber-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/70 bg-card/75 backdrop-blur-sm">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Aktívne témy</p>
                                            <div className="text-3xl font-bold mt-1">{dashboardData.systemStats?.activeTheses ?? 0}</div>
                                        </div>
                                        <ArrowTrendingUpIcon className="h-6 w-6 text-blue-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/70 bg-card/75 backdrop-blur-sm">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Dokončené/obhájené</p>
                                            <div className="text-3xl font-bold mt-1">{dashboardData.systemStats?.completedTheses ?? 0}</div>
                                        </div>
                                        <CheckBadgeIcon className="h-6 w-6 text-green-300" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            <Card className="xl:col-span-2 border-border/70 bg-card/80 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg">Nedávno vytvorené témy</CardTitle>
                                            <CardDescription>Rýchly prehľad posledných tém so stavom</CardDescription>
                                        </div>
                                        <Link href={route('theses.index')}>
                                            <Button variant="ghost" size="sm">
                                                Otvoriť všetky
                                                <ArrowUpRight className="ml-1 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {dashboardData.recentTheses && dashboardData.recentTheses.length > 0 ? (
                                        dashboardData.recentTheses.map((thesis) => (
                                            <Link key={thesis.id} href={route('theses.show', thesis.id)} className="block">
                                                <div className="rounded-lg border border-border/70 p-4 hover:bg-muted/35 transition-colors">
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                                        <div>
                                                            <p className="font-medium text-foreground line-clamp-1">{thesis.title}</p>
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                Školiteľ: {thesis.supervisor?.name || 'Nepriradený'}
                                                                {' • '}
                                                                Študent: {thesis.student?.name || 'Nepriradený'}
                                                            </div>
                                                        </div>
                                                        <Badge className={thesisStatusTone(thesis.status)}>
                                                            {thesisStatusLabel(thesis.status)}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-6">Zatiaľ nie sú dostupné žiadne témy.</p>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="space-y-6">
                                <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Nedávno vytvorení používatelia</CardTitle>
                                        <CardDescription>Rýchly vstup do profilu používateľa</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {dashboardData.recentUsers && dashboardData.recentUsers.length > 0 ? (
                                            dashboardData.recentUsers.map((recentUser) => (
                                                <Link key={recentUser.id} href={route('admin.users.edit', recentUser.id)} className="block">
                                                    <div className="rounded-lg border border-border/70 p-3 hover:bg-muted/35 transition-colors">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-foreground truncate">{recentUser.name}</p>
                                                                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 truncate">
                                                                    <EnvelopeIcon className="h-3 w-3" />
                                                                    {recentUser.email}
                                                                </div>
                                                            </div>
                                                            <Badge className={roleTone(recentUser.role)}>
                                                                {roleLabel(recentUser.role)}
                                                            </Badge>
                                                        </div>
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <span className="text-[11px] text-muted-foreground">
                                                                {new Date(recentUser.created_at).toLocaleDateString('sk-SK')}
                                                            </span>
                                                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                                                <WrenchScrewdriverIcon className="h-3.5 w-3.5 mr-1" />
                                                                Otvoriť
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground text-center py-4">Žiadni noví používatelia.</p>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <CircleStackIcon className="h-5 w-5 text-cyan-300" />
                                            Súhrnný report
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-muted-foreground">Aktívne témy</span>
                                                <span className="font-medium">{dashboardData.systemStats?.activeTheses ?? 0} / {dashboardData.systemStats?.totalTheses ?? 0}</span>
                                            </div>
                                            <Progress
                                                value={
                                                    (dashboardData.systemStats?.totalTheses ?? 0) > 0
                                                        ? Math.round(((dashboardData.systemStats?.activeTheses ?? 0) / (dashboardData.systemStats?.totalTheses ?? 0)) * 100)
                                                        : 0
                                                }
                                                className="h-2"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-muted-foreground">Dokončené/obhájené</span>
                                                <span className="font-medium">{dashboardData.systemStats?.completedTheses ?? 0} / {dashboardData.systemStats?.totalTheses ?? 0}</span>
                                            </div>
                                            <Progress
                                                value={
                                                    (dashboardData.systemStats?.totalTheses ?? 0) > 0
                                                        ? Math.round(((dashboardData.systemStats?.completedTheses ?? 0) / (dashboardData.systemStats?.totalTheses ?? 0)) * 100)
                                                        : 0
                                                }
                                                className="h-2"
                                            />
                                        </div>
                                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200 flex items-start gap-2">
                                            <SignalIcon className="h-4 w-4 mt-0.5" />
                                            Systém je pripravený na administrátorské zásahy a reportovanie.
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
