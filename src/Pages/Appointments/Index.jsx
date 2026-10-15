import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Head, Link } from '@inertiajs/react';
import { 
    Calendar, 
    Clock, 
    MapPin, 
    User, 
    Plus,
    Info,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { sk } from 'date-fns/locale';
import { parseServerDateTime } from '@/utils/datetime';

export default function Index({ auth, appointments }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getEffectiveDate = (appointment) => {
        if (appointment.status === 'pending' && appointment.proposed_scheduled_at) {
            return parseServerDateTime(appointment.proposed_scheduled_at);
        }

        return parseServerDateTime(appointment.scheduled_at);
    };

    const appointmentsWithEffectiveDate = appointments.map((apt) => ({
        ...apt,
        effectiveDate: getEffectiveDate(apt),
    }));

    const upcomingAppointments = appointmentsWithEffectiveDate
        .filter((apt) => !['cancelled', 'completed'].includes(apt.status))
        .filter((apt) => apt.effectiveDate && apt.effectiveDate >= new Date())
        .sort((a, b) => a.effectiveDate - b.effectiveDate)
        .slice(0, 5);

    const getStatusVariant = (status) => {
        switch (status) {
            case 'pending':
                return 'secondary';
            case 'confirmed':
                return 'default';
            case 'completed':
                return 'outline';
            case 'cancelled':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const getStatusBadgeClass = (appointment) => {
        if (appointment.status === 'pending' && appointment.proposed_scheduled_at) {
            return 'bg-violet-500/20 text-violet-200 border-violet-500/40';
        }

        if (appointment.status === 'pending' && appointment.responded_at) {
            return 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40';
        }

        if (appointment.status === 'pending') {
            return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/40';
        }

        return '';
    };

    const getStatusText = (appointment) => {
        if (appointment.status === 'pending' && appointment.proposed_scheduled_at) {
            return 'Návrh zmeny termínu';
        }

        if (appointment.status === 'pending' && appointment.responded_at) {
            return 'Čaká na schválenie (zmenený plán)';
        }

        const status = appointment.status;
        switch (status) {
            case 'pending':
                return 'Čaká na schválenie';
            case 'confirmed':
                return 'Potvrdené';
            case 'completed':
                return 'Dokončené';
            case 'cancelled':
                return 'Zrušené';
            default:
                return status;
        }
    };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    // Get full calendar grid (includes days from previous/next month)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const getAppointmentsForDay = (day) => {
        const dayAppointments = appointmentsWithEffectiveDate.filter((appointment) => {
            const appointmentDate = appointment.effectiveDate;
            if (!appointmentDate) {
                return false;
            }
            return isSameDay(appointmentDate, day);
        });
        
        return dayAppointments;
    };

    const previousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 min-w-0 w-full">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl font-semibold leading-tight text-foreground truncate">
                            Konzultácie
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {auth.user.role === 'student' && 'Vaše naplánované konzultácie'}
                            {auth.user.role === 'supervisor' && 'Konzultácie so študentmi'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="h-10 w-10" aria-label="Návod ku konzultáciám">
                                    <Info className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" align="end" className="max-w-sm text-left">
                                <div className="space-y-2 text-xs leading-relaxed">
                                    <p className="font-semibold">Ako fungujú konzultácie</p>
                                    <p>1. Študent alebo školiteľ navrhne termín.</p>
                                    <p>2. Druhá strana môže termín prijať, navrhnúť nový plán alebo zamietnuť.</p>
                                    <p>3. Pri každej zmene plánu zostáva konzultácia v stave čakania na schválenie.</p>
                                    <p>4. Aj potvrdenú konzultáciu je možné znovu preplánovať.</p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                        <Link href={route('appointments.create')}>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Navrhnúť stretnutie</span>
                                <span className="sm:hidden">Nové</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Konzultácie" />

            <TooltipProvider>
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Calendar View */}
                    <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <Calendar className="h-5 w-5" />
                                {format(currentDate, 'LLLL yyyy', { locale: sk })}
                            </CardTitle>
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                <Button variant="outline" size="sm" onClick={previousMonth}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={nextMonth}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto pb-1">
                            <div className="min-w-[700px]">
                                <div className="grid grid-cols-7 gap-2 mb-4">
                                    {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map((day) => (
                                        <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-2">
                                    {calendarDays.map((day) => {
                                        const dayAppointments = getAppointmentsForDay(day);
                                        const isCurrentMonth = isSameMonth(day, currentDate);
                                        
                                        return (
                                            <div 
                                                key={day.toString()} 
                                                className={`min-h-[80px] p-2 border rounded-lg ${
                                                    isCurrentMonth ? 'bg-background' : 'bg-muted/30'
                                                }`}
                                            >
                                                <div className={`text-sm font-medium mb-1 ${
                                                    isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                                                }`}>
                                                    {format(day, 'd')}
                                                </div>
                                                <div className="space-y-1">
                                                    {dayAppointments.slice(0, 2).map((appointment) => (
                                                        <Tooltip key={appointment.id}>
                                                            <TooltipTrigger asChild>
                                                                <Link
                                                                    href={route('appointments.show', appointment.id)}
                                                                    className="block"
                                                                >
                                                                    <div className={`text-xs p-2 rounded hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer ${
                                                                        (appointment.status === 'pending' && appointment.proposed_scheduled_at) ? 'bg-violet-500/20 text-violet-200 hover:bg-violet-500/30 ring-1 ring-violet-500/30' :
                                                                        (appointment.status === 'pending' && appointment.responded_at) ? 'bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 ring-1 ring-indigo-500/30' :
                                                                        appointment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500/30' :
                                                                        appointment.status === 'confirmed' ? 'bg-green-500/20 text-green-700 dark:text-green-300 hover:bg-green-500/30' :
                                                                        appointment.status === 'completed' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-500/30' :
                                                                        'bg-red-500/20 text-red-700 dark:text-red-300 hover:bg-red-500/30'
                                                                    }`}>
                                                                        <div className="font-medium">
                                                                            {appointment.effectiveDate ? format(appointment.effectiveDate, 'HH:mm') : '--:--'}
                                                                        </div>
                                                                        <div className="truncate text-[10px] opacity-90 mt-0.5">
                                                                            {appointment.thesis?.title?.length > 20 
                                                                                ? appointment.thesis.title.substring(0, 20) + '...' 
                                                                                : appointment.thesis?.title || 'Bez názvu'
                                                                            }
                                                                        </div>
                                                                        <div className="text-[9px] opacity-75 mt-0.5">
                                                                            {auth.user.role === 'supervisor' 
                                                                                ? appointment.thesis?.student?.name?.split(' ')[0] || 'Neznámy'
                                                                                : appointment.thesis?.supervisor?.name?.split(' ')[0] || 'Neznámy'
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="right" className="max-w-xs">
                                                                <div className="space-y-2">
                                                                    <div className="font-semibold">
                                                                        {(appointment.effectiveDate ? format(appointment.effectiveDate, 'HH:mm') : '--:--')} - {appointment.thesis?.title || 'Bez názvu'}
                                                                    </div>
                                                                    <div className="text-sm space-y-1">
                                                                        <div>👨‍🎓 <strong>Študent:</strong> {appointment.thesis?.student?.name || 'Neznámy'}</div>
                                                                        <div>👨‍🏫 <strong>Vedúci:</strong> {appointment.thesis?.supervisor?.name || 'Neznámy'}</div>
                                                                        <div>📊 <strong>Stav:</strong> {
                                                                            (appointment.status === 'pending' && appointment.proposed_scheduled_at) ? 'Návrh zmeny termínu' :
                                                                            appointment.status === 'pending' ? 'Čaká na potvrdenie' :
                                                                            appointment.status === 'confirmed' ? 'Potvrdené' :
                                                                            appointment.status === 'completed' ? 'Ukončené' : 'Zrušené'
                                                                        }</div>
                                                                        {appointment.location && (
                                                                            <div>📍 <strong>Miesto:</strong> {appointment.location}</div>
                                                                        )}
                                                                        {appointment.agenda && (
                                                                            <div className="mt-2">
                                                                                <strong>📝 Agenda:</strong>
                                                                                <div className="text-xs opacity-90 mt-1">
                                                                                    {appointment.agenda.substring(0, 100)}{appointment.agenda.length > 100 ? '...' : ''}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    ))}
                                                    {dayAppointments.length > 2 && (
                                                        <div className="text-xs text-muted-foreground">
                                                            +{dayAppointments.length - 2} ďalších
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    </Card>

                    {/* Upcoming Appointments List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Nadchádzajúce konzultácie</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {appointments.length === 0 ? (
                            <div className="text-center py-8">
                                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-2 text-sm font-medium text-card-foreground">Žiadne konzultácie</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Zatiaľ nemáte naplánované žiadne konzultácie.
                                </p>
                                <div className="mt-6">
                                    <Link href={route('appointments.create')}>
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Navrhnúť stretnutie
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : upcomingAppointments.length === 0 ? (
                            <div className="text-center py-8">
                                <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-2 text-sm font-medium text-card-foreground">Žiadne nadchádzajúce konzultácie</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Máte len minulé alebo uzavreté konzultácie. Nový termín môžete navrhnúť cez tlačidlo vyššie.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingAppointments.map((appointment) => (
                                    <Link
                                        key={appointment.id}
                                        href={route('appointments.show', appointment.id)}
                                        className="block"
                                    >
                                        <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 min-w-0">
                                                        <h4 className="font-medium text-card-foreground break-words">
                                                            {appointment.thesis.title}
                                                        </h4>
                                                        <Badge className={getStatusBadgeClass(appointment)} variant={getStatusVariant(appointment.status)}>
                                                            {getStatusText(appointment)}
                                                        </Badge>
                                                    </div>
                                                    
                                                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            {appointment.effectiveDate ? format(appointment.effectiveDate, 'dd.MM.yyyy HH:mm') : '-'}
                                                        </div>
                                                        {appointment.location && (
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="h-4 w-4" />
                                                                {appointment.location}
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1">
                                                            <User className="h-4 w-4" />
                                                            {auth.user.role === 'student' 
                                                                ? appointment.thesis.supervisor?.name 
                                                                : appointment.thesis.student?.name
                                                            }
                                                        </div>
                                                    </div>
                                                    
                                                    {appointment.agenda && (
                                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                            {appointment.agenda}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
                </div>
            </TooltipProvider>
        </AuthenticatedLayout>
    );
}