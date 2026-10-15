import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    User,
    BookOpen,
    MessageSquare,
    Check,
    Edit3,
    Plus,
    Trash2,
    XCircle,
    RefreshCcw,
} from 'lucide-react';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { useState } from 'react';
import { fromDatetimeLocalValue, parseServerDateTime, toDatetimeLocalValue } from '@/utils/datetime';

export default function Show({ auth, appointment }) {
    const [isEditingNotes, setIsEditingNotes] = useState(false);

    const isSupervisor = auth.user.role === 'supervisor';

    const isPlanChanged = appointment.status === 'pending' && !!appointment.responded_at;
    const hasRescheduleProposal = appointment.status === 'pending' && !!appointment.proposed_scheduled_at;
    const waitingForStudentDecision = !!appointment.waiting_for_student_decision;
    const waitingForSupervisorDecision = !!appointment.waiting_for_supervisor_decision;
    const asDate = (value) => parseServerDateTime(value) ?? new Date();

    const { data, setData, patch, processing } = useForm({
        notes: appointment.notes || '',
    });

    const approveForm = useForm();
    const completeForm = useForm();
    const deleteForm = useForm();

    const rescheduleForm = useForm({
        scheduled_at: toDatetimeLocalValue(appointment.scheduled_at),
        duration: appointment.duration || 60,
        location: appointment.location || '',
        reschedule_note: '',
    });

    const rejectForm = useForm({
        rejection_reason: '',
    });

    const responseForm = useForm({
        scheduled_at: toDatetimeLocalValue(appointment.scheduled_at),
        duration: appointment.duration || 60,
        location: appointment.location || '',
        reschedule_note: '',
    });

    const cancelRescheduleForm = useForm();

    const getStatusColor = (status) => {
        if (status === 'pending' && hasRescheduleProposal) {
            return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
        }

        switch (status) {
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'confirmed':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'completed':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'cancelled':
                return 'bg-red-500/20 text-red-300 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const getStatusText = (status) => {
        if (status === 'pending' && hasRescheduleProposal) {
            return 'Navrhnutá zmena termínu';
        }

        if (status === 'pending' && isPlanChanged) {
            return 'Čaká na schválenie (zmenený plán)';
        }

        switch (status) {
            case 'pending':
                return 'Čaká na potvrdenie';
            case 'confirmed':
                return 'Potvrdené';
            case 'completed':
                return 'Ukončené';
            case 'cancelled':
                return appointment.rejection_reason ? 'Zamietnuté' : 'Zrušené';
            default:
                return status;
        }
    };

    const handleApprove = () => {
        approveForm.patch(route('appointments.approve', appointment.id));
    };

    const handleComplete = () => {
        completeForm.patch(route('appointments.complete', appointment.id));
    };

    const handleDelete = () => {
        if (confirm('Naozaj chcete zrušiť túto konzultáciu?')) {
            deleteForm.delete(route('appointments.destroy', appointment.id));
        }
    };

    const handleSaveNotes = (e) => {
        e.preventDefault();
        patch(route('appointments.update', appointment.id), {
            onSuccess: () => {
                setIsEditingNotes(false);
            },
        });
    };

    const handleSupervisorReschedule = (e) => {
        e.preventDefault();

        router.patch(route('appointments.propose-reschedule', appointment.id), {
            ...rescheduleForm.data,
            scheduled_at: fromDatetimeLocalValue(rescheduleForm.data.scheduled_at),
        }, {
            preserveScroll: true,
        });
    };

    const handleSupervisorReject = (e) => {
        e.preventDefault();
        rejectForm.patch(route('appointments.reject', appointment.id));
    };

    const handleAcceptReschedule = () => {
        router.patch(route('appointments.respond-reschedule', appointment.id), {
            action: 'accept',
        }, {
            preserveScroll: true,
        });
    };

    const handleCounterProposal = (e) => {
        e.preventDefault();

        router.patch(route('appointments.respond-reschedule', appointment.id), {
            action: 'counter',
            scheduled_at: fromDatetimeLocalValue(responseForm.data.scheduled_at),
            duration: responseForm.data.duration,
            location: responseForm.data.location,
            reschedule_note: responseForm.data.reschedule_note,
        }, {
            preserveScroll: true,
        });
    };

    const handleCancelOwnRescheduleProposal = () => {
        if (confirm('Naozaj chcete zrušiť svoj návrh zmeny termínu? Konzultácia zostane v pôvodnom termíne.')) {
            cancelRescheduleForm.patch(route('appointments.cancel-reschedule-proposal', appointment.id));
        }
    };

    const canEdit = appointment.can_edit;
    const canApprove = appointment.can_approve;
    const currentUserId = Number(auth.user.id);
    const lastRequestedById = Number(appointment.last_requested_by_id ?? appointment.requested_by_user?.id ?? 0);
    const canRespondToRescheduleProposal = hasRescheduleProposal && lastRequestedById > 0 && lastRequestedById !== currentUserId;
    const canCancelOwnRescheduleProposal = hasRescheduleProposal && lastRequestedById > 0 && lastRequestedById === currentUserId;
    const canCancelOwnInitialProposal =
        appointment.status === 'pending'
        && !hasRescheduleProposal
        && lastRequestedById > 0
        && lastRequestedById === currentUserId;
    const canCancelAppointment = canEdit && !['cancelled', 'completed'].includes(appointment.status);
    const isUpcoming = appointment.status === 'confirmed' && asDate(appointment.scheduled_at) > new Date();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('appointments.index')} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h2 className="font-semibold text-xl text-card-foreground leading-tight">Detail konzultácie</h2>
                        <p className="text-sm text-muted-foreground">
                            {format(asDate(appointment.scheduled_at), 'PPP p', { locale: sk })}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Konzultácia - ${appointment.thesis?.title || 'Bez názvu témy'}`} />

            <div className="max-w-5xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5" />
                                <CardTitle>Stav konzultácie</CardTitle>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
                        </div>
                    </CardHeader>

                    {(canApprove || canEdit || isUpcoming || canCancelOwnInitialProposal) && (
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {canApprove && appointment.status === 'pending' && !hasRescheduleProposal && (
                                    <Button
                                        onClick={handleApprove}
                                        disabled={approveForm.processing}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                                                                {approveForm.processing ? 'Spracováva sa...' : 'Potvrdiť'}
                                    </Button>
                                )}

                                {isUpcoming && (
                                    <Button onClick={handleComplete} disabled={completeForm.processing} variant="outline">
                                        <Check className="h-4 w-4 mr-2" />
                                        {completeForm.processing ? 'Ukončuje sa...' : 'Označiť ako ukončené'}
                                    </Button>
                                )}

                                {canCancelAppointment && (
                                    <>
                                        <Button
                                            onClick={handleDelete}
                                            disabled={deleteForm.processing}
                                            variant="outline"
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            {deleteForm.processing ? 'Ruší sa...' : 'Zrušiť'}
                                        </Button>
                                    </>
                                )}

                                {canCancelOwnInitialProposal && (
                                    <Button
                                        onClick={handleDelete}
                                        disabled={deleteForm.processing}
                                        variant="outline"
                                        className="text-orange-300 border-orange-500/40 hover:bg-orange-500/10"
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        {deleteForm.processing ? 'Ruší sa...' : 'Zrušiť môj pôvodný návrh'}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    )}
                </Card>

                {hasRescheduleProposal && (
                    <Card className="border-violet-500/30 bg-violet-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-violet-200">
                                <RefreshCcw className="h-5 w-5" />
                                Návrh na zmenu termínu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground mb-1">Pôvodný dátum a čas</p>
                                <p className="font-medium">
                                    {format(asDate(appointment.scheduled_at), 'PPPP HH:mm', { locale: sk })}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Pôvodné trvanie</p>
                                <p className="font-medium">{appointment.duration} min</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Pôvodné miesto</p>
                                <p className="font-medium">{appointment.location || 'Bez zmeny'}</p>
                            </div>

                            <div className="md:col-span-3 h-px bg-violet-500/20" />

                            <div>
                                <p className="text-muted-foreground mb-1">Navrhnutý nový dátum a čas</p>
                                <p className="font-medium text-violet-100">
                                    {format(asDate(appointment.proposed_scheduled_at), 'PPPP HH:mm', { locale: sk })}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Navrhnuté nové trvanie</p>
                                <p className="font-medium text-violet-100">{appointment.proposed_duration || appointment.duration} min</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Navrhnuté nové miesto</p>
                                <p className="font-medium text-violet-100">{appointment.proposed_location || appointment.location || 'Bez zmeny'}</p>
                            </div>
                            <div className="md:col-span-3">
                                <p className="text-muted-foreground mb-1">Aktuálny návrh od</p>
                                <p className="font-medium">{appointment.requested_by_user?.name || 'Neznámy používateľ'}</p>
                            </div>
                            {appointment.reschedule_note && (
                                <div className="md:col-span-3">
                                    <p className="text-muted-foreground mb-1">Poznámka k zmene</p>
                                    <p className="whitespace-pre-wrap">{appointment.reschedule_note}</p>
                                </div>
                            )}
                            {waitingForStudentDecision && (
                                <div className="md:col-span-3 rounded-md border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-violet-100">
                                    Tento návrh čaká na rozhodnutie študenta.
                                </div>
                            )}
                            {isSupervisor && waitingForSupervisorDecision && (
                                <div className="md:col-span-3 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-yellow-100">
                                    Konzultácia čaká na tvoje rozhodnutie ako školiteľ.
                                </div>
                            )}
                            {canCancelOwnRescheduleProposal && (
                                <div className="md:col-span-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-orange-300 border-orange-500/40 hover:bg-orange-500/10"
                                        onClick={handleCancelOwnRescheduleProposal}
                                        disabled={cancelRescheduleForm.processing}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        {cancelRescheduleForm.processing ? 'Ruší sa návrh...' : 'Zrušiť môj návrh/proti-návrh'}
                                    </Button>
                                </div>
                            )}

                            {canRespondToRescheduleProposal && (
                                <div className="md:col-span-3 flex flex-wrap gap-2 border border-violet-500/30 rounded-lg p-4 bg-violet-500/10">
                                    <Button
                                        onClick={handleAcceptReschedule}
                                        disabled={responseForm.processing}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        {responseForm.processing ? 'Spracováva sa...' : 'Prijať návrh termínu'}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {hasRescheduleProposal && canRespondToRescheduleProposal && (
                    <Card className="border-yellow-500/30 bg-yellow-500/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-100">
                                <RefreshCcw className="h-5 w-5" />
                                Poslať proti-návrh termínu
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCounterProposal} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="counter_scheduled_at">Nový dátum a čas *</Label>
                                        <Input
                                            id="counter_scheduled_at"
                                            type="datetime-local"
                                            value={responseForm.data.scheduled_at}
                                            onChange={(e) => responseForm.setData('scheduled_at', e.target.value)}
                                            required
                                        />
                                        {responseForm.errors.scheduled_at && (
                                            <p className="text-sm text-destructive">{responseForm.errors.scheduled_at}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="counter_duration">Trvanie (minúty)</Label>
                                        <Select
                                            value={String(responseForm.data.duration)}
                                            onValueChange={(value) => responseForm.setData('duration', parseInt(value, 10))}
                                        >
                                            <SelectTrigger id="counter_duration">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="30">30 minút</SelectItem>
                                                <SelectItem value="45">45 minút</SelectItem>
                                                <SelectItem value="60">60 minút</SelectItem>
                                                <SelectItem value="90">90 minút</SelectItem>
                                                <SelectItem value="120">120 minút</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="counter_location">Miestnosť / forma konzultácie</Label>
                                    <Input
                                        id="counter_location"
                                        value={responseForm.data.location}
                                        onChange={(e) => responseForm.setData('location', e.target.value)}
                                        placeholder="Napr. Online - Zoom"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="counter_note">Poznámka</Label>
                                    <Textarea
                                        id="counter_note"
                                        value={responseForm.data.reschedule_note}
                                        onChange={(e) => responseForm.setData('reschedule_note', e.target.value)}
                                        rows={3}
                                        placeholder="Voliteľne doplňte poznámku k proti-návrhu."
                                    />
                                </div>

                                <Button type="submit" variant="outline" className="border-yellow-500/40 hover:bg-yellow-500/10" disabled={responseForm.processing}>
                                    <RefreshCcw className="h-4 w-4 mr-2" />
                                    {responseForm.processing ? 'Odosiela sa...' : 'Odoslať proti-návrh'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {isSupervisor && waitingForSupervisorDecision && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Rozhodnutie školiteľa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form onSubmit={handleSupervisorReject} className="space-y-3 border border-red-500/30 rounded-lg p-4">
                                <h4 className="font-medium text-red-300 flex items-center gap-2">
                                    <XCircle className="h-4 w-4" />
                                    Zamietnuť návrh konzultácie
                                </h4>
                                <div className="space-y-2">
                                    <Label htmlFor="rejection_reason">Dôvod zamietnutia *</Label>
                                    <Textarea
                                        id="rejection_reason"
                                        value={rejectForm.data.rejection_reason}
                                        onChange={(e) => rejectForm.setData('rejection_reason', e.target.value)}
                                        rows={3}
                                        required
                                        placeholder="Napíšte dôvod, aby študent vedel ako postupovať ďalej."
                                    />
                                    {rejectForm.errors.rejection_reason && (
                                        <p className="text-sm text-destructive">{rejectForm.errors.rejection_reason}</p>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    variant="outline"
                                    className="text-red-300 border-red-500/40 hover:bg-red-500/10"
                                    disabled={rejectForm.processing}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    {rejectForm.processing ? 'Ukladá sa...' : 'Zamietnuť konzultáciu'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {canEdit && !hasRescheduleProposal && !['cancelled', 'completed'].includes(appointment.status) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Navrhnúť nový plán konzultácie
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSupervisorReschedule} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="new_plan_scheduled_at">Nový dátum a čas *</Label>
                                        <Input
                                            id="new_plan_scheduled_at"
                                            type="datetime-local"
                                            value={rescheduleForm.data.scheduled_at}
                                            onChange={(e) => rescheduleForm.setData('scheduled_at', e.target.value)}
                                            required
                                        />
                                        {rescheduleForm.errors.scheduled_at && (
                                            <p className="text-sm text-destructive">{rescheduleForm.errors.scheduled_at}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="new_plan_duration">Trvanie (minúty)</Label>
                                        <Select
                                            value={String(rescheduleForm.data.duration)}
                                            onValueChange={(value) => rescheduleForm.setData('duration', parseInt(value, 10))}
                                        >
                                            <SelectTrigger id="new_plan_duration">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="30">30 minút</SelectItem>
                                                <SelectItem value="45">45 minút</SelectItem>
                                                <SelectItem value="60">60 minút</SelectItem>
                                                <SelectItem value="90">90 minút</SelectItem>
                                                <SelectItem value="120">120 minút</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="new_plan_location">Miestnosť / forma konzultácie</Label>
                                    <Input
                                        id="new_plan_location"
                                        value={rescheduleForm.data.location}
                                        onChange={(e) => rescheduleForm.setData('location', e.target.value)}
                                        placeholder="Napr. Miestnosť 204 alebo Online - Teams"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="new_plan_note">Poznámka k zmenenému plánu</Label>
                                    <Textarea
                                        id="new_plan_note"
                                        value={rescheduleForm.data.reschedule_note}
                                        onChange={(e) => rescheduleForm.setData('reschedule_note', e.target.value)}
                                        rows={3}
                                        placeholder="Voliteľne doplň poznámku k novému návrhu termínu."
                                    />
                                </div>

                                <Button type="submit" variant="outline" disabled={rescheduleForm.processing}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    {rescheduleForm.processing ? 'Odosiela sa...' : 'Odoslať nový návrh plánu'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {appointment.rejection_reason && (
                    <Card className="border-red-500/30 bg-red-500/5">
                        <CardHeader>
                            <CardTitle className="text-red-300">Dôvod zamietnutia</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">{appointment.rejection_reason}</p>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Informácie o stretnutí
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 text-sm font-medium mb-1">
                                    <Calendar className="h-4 w-4" />
                                    Dátum a čas
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {format(asDate(appointment.scheduled_at), 'PPPP', { locale: sk })}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {format(asDate(appointment.scheduled_at), 'HH:mm', { locale: sk })} ({appointment.duration} min)
                                </p>
                            </div>

                            {appointment.location && (
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                                        <MapPin className="h-4 w-4" />
                                        Miesto
                                    </div>
                                    <p className="text-sm text-muted-foreground">{appointment.location}</p>
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-2 text-sm font-medium mb-1">
                                    <User className="h-4 w-4" />
                                    Posledný návrh od
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {(appointment.requested_by_user?.name || appointment.requested_by?.name)} ({appointment.requested_by_user?.email || appointment.requested_by?.email})
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Bakalárska práca
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="font-medium mb-2">{appointment.thesis?.title || 'Bez názvu témy'}</p>
                                {appointment.thesis?.description && (
                                    <p className="text-sm text-muted-foreground">{appointment.thesis.description}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 text-sm">
                                <div>
                                    <span className="font-medium">Študent:</span>{' '}
                                    <span className="text-muted-foreground">{appointment.thesis?.student?.name || 'Nepriradený'}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Vedúci:</span>{' '}
                                    <span className="text-muted-foreground">{appointment.thesis?.supervisor?.name || 'Nepriradený'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {appointment.agenda && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Agenda stretnutia
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{appointment.agenda}</p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Poznámky
                            </CardTitle>
                            {canEdit && !isEditingNotes && (
                                <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(true)}>
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Upraviť
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isEditingNotes ? (
                            <form onSubmit={handleSaveNotes} className="space-y-4">
                                <div>
                                    <Label htmlFor="notes">Poznámky ku konzultácii</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={4}
                                        placeholder="Napíšte poznámky z konzultácie, ďalšie kroky, domáce úlohy..."
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Ukladá sa...' : 'Uložiť'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditingNotes(false);
                                            setData('notes', appointment.notes || '');
                                        }}
                                    >
                                        Zrušiť
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                {appointment.notes ? (
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{appointment.notes}</p>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">Žiadne poznámky zatiaľ nie sú pridané.</p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
