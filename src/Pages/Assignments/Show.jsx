import ModernLayout from '@/Layouts/ModernLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    CalendarIcon,
    CheckCircleIcon,
    DownloadIcon,
    EditIcon,
    FileTextIcon,
    Trash2Icon,
    UploadIcon,
    XCircleIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';

export default function Show({ auth, assignment, canEdit, canSubmit }) {
    const commentTemplates = {
        initial: 'Odovzdávam prvú verziu riešenia úlohy.',
        update: 'Posielam aktualizovanú verziu riešenia.',
        fix: 'Posielam opravenú verziu podľa spätnej väzby.',
    };

    const defaultComment = assignment.status === 'rejected'
        ? commentTemplates.fix
        : commentTemplates.initial;

    const hasBrokenEncoding = (value) => {
        if (!value || typeof value !== 'string') {
            return false;
        }

        return /�|Ã|Â|Ä|Å/.test(value);
    };

    const initialStudentComment = hasBrokenEncoding(assignment.student_comment)
        ? defaultComment
        : (assignment.student_comment || defaultComment);

    const {
        data: submitData,
        setData: setSubmitData,
        post: postSubmit,
        processing: submitting,
        errors: submitErrors,
        reset: resetSubmit,
    } = useForm({
        student_comment: initialStudentComment,
        files: [],
    });

    const {
        data: reviewData,
        setData: setReviewData,
        post: postReview,
        processing: reviewing,
        errors: reviewErrors,
    } = useForm({
        feedback: assignment.feedback || '',
        cancellation_note: assignment.cancellation_note || assignment.feedback || '',
        files: [],
    });

    const handleFileChange = (e) => {
        setSubmitData('files', Array.from(e.target.files));
    };

    const removeFile = (index) => {
        const nextFiles = [...submitData.files];
        nextFiles.splice(index, 1);
        setSubmitData('files', nextFiles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        postSubmit(route('assignments.submit', assignment.id), {
            preserveScroll: true,
            onSuccess: () => resetSubmit('files'),
        });
    };

    const handleApprove = () => {
        postReview(route('assignments.approve', assignment.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => setReviewData('files', []),
        });
    };

    const handleReturnForRework = () => {
        postReview(route('assignments.return-for-rework', assignment.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => setReviewData('files', []),
        });
    };

    const handleCancel = () => {
        postReview(route('assignments.cancel', assignment.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => setReviewData('files', []),
        });
    };

    const handleFeedbackOnly = () => {
        postReview(route('assignments.feedback', assignment.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => setReviewData('files', []),
        });
    };

    const handleReviewFileChange = (e) => {
        setReviewData('files', Array.from(e.target.files));
    };

    const removeReviewFile = (index) => {
        const nextFiles = [...reviewData.files];
        nextFiles.splice(index, 1);
        setReviewData('files', nextFiles);
    };

    const statusText = {
        pending: 'Neodovzdané',
        submitted: 'Odovzdané',
        approved: 'Schválené',
        rejected: 'Vrátené na prepracovanie',
        cancelled: 'Zrušené',
    };

    const statusVariant = {
        pending: 'secondary',
        submitted: 'default',
        approved: 'default',
        rejected: 'destructive',
        cancelled: 'secondary',
    };

    return (
        <ModernLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-foreground leading-tight">Detail úlohy</h2>}
        >
            <Head title={`Úloha: ${assignment.title}`} />

            <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 space-y-6">
                <div>
                    <Link
                        href={route('theses.show', assignment.thesis.id)}
                        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Späť na tému
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="pb-3 border-b">
                                <CardTitle className="text-2xl">{assignment.title}</CardTitle>
                                <CardDescription className="mt-1 text-base">
                                    K téme:{' '}
                                    <Link
                                        href={route('theses.show', assignment.thesis.id)}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {assignment.thesis.title}
                                    </Link>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="py-6">
                                <h3 className="text-lg font-medium mb-2">Zadanie</h3>
                                <div className="whitespace-pre-line text-muted-foreground bg-muted p-4 rounded-md">
                                    {assignment.description}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="bg-muted/50 border-b pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <UploadIcon className="h-5 w-5 text-primary" />
                                    Odovzdanie riešenia
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="pt-6 space-y-6">
                                {canSubmit && assignment.status === 'rejected' && (
                                    <div className="rounded-md border border-red-500/40 bg-red-500/10 p-4">
                                        <p className="text-sm font-medium text-red-300">Úloha bola vrátená na prepracovanie.</p>
                                        <p className="text-sm text-red-200/90 mt-1">
                                            Zapracuj pripomienky školiteľa v spätnej väzbe a odovzdaj opravenú verziu.
                                        </p>
                                    </div>
                                )}

                                {assignment.status !== 'pending' && (
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Odovzdané súbory</h4>
                                            {assignment.student_file_paths && assignment.student_file_paths.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {assignment.student_file_paths.map((fileInfo, idx) => (
                                                        <li key={idx} className="flex items-center justify-between p-3 border rounded-md">
                                                            <div className="flex items-center">
                                                                <FileTextIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                                                                <span className="font-medium">{fileInfo.original_name}</span>
                                                                <span className="ml-2 text-xs text-muted-foreground">
                                                                    ({(fileInfo.size / 1024 / 1024).toFixed(2)} MB)
                                                                </span>
                                                            </div>
                                                            <Button variant="outline" size="sm" asChild>
                                                                <a href={route('assignments.download', [assignment.id, idx])}>
                                                                    <DownloadIcon className="mr-2 h-4 w-4" />
                                                                    Stiahnuť
                                                                </a>
                                                            </Button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic bg-muted p-3 rounded-md">
                                                    Žiadne súbory neboli nahrané.
                                                </p>
                                            )}
                                        </div>

                                        {assignment.student_comment && (
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Komentár študenta</h4>
                                                <p className="text-sm bg-muted p-3 rounded-md border">{assignment.student_comment}</p>
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Dátum odovzdania</h4>
                                            <p className="text-sm">
                                                {assignment.submitted_at
                                                    ? format(new Date(assignment.submitted_at), 'd. MMMM yyyy HH:mm', { locale: sk })
                                                    : '-'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {assignment.status === 'pending' && !canSubmit && (
                                    <p className="text-muted-foreground text-center py-6 border-2 border-dashed rounded-md">
                                        Práca ešte nebola odovzdaná.
                                    </p>
                                )}

                                {canSubmit && (assignment.status === 'pending' || assignment.status === 'rejected' || assignment.status === 'submitted') && (
                                    <div className="mt-6 pt-6 border-t">
                                        <h3 className="font-medium mb-4">
                                            {assignment.status === 'rejected' ? 'Odovzdať znova (opravené)' : 'Nové odovzdanie alebo oprava'}
                                        </h3>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Prílohy k odovzdaniu</label>
                                                <div className="border border-dashed border-border rounded-lg p-4 bg-muted/30">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        onChange={handleFileChange}
                                                        className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
                                                    />
                                                    <p className="mt-2 text-xs text-muted-foreground">
                                                        Podporované sú bežné formáty dokumentov. Maximum 5 súborov, 10 MB na súbor.
                                                    </p>
                                                </div>
                                                {submitErrors.files && <p className="text-red-500 text-xs mt-1">{submitErrors.files}</p>}

                                                {submitData.files.length > 0 && (
                                                    <div className="mt-3 space-y-2">
                                                        {submitData.files.map((file, idx) => (
                                                            <div key={`${file.name}-${idx}`} className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm">
                                                                <div className="min-w-0">
                                                                    <p className="truncate font-medium">{file.name}</p>
                                                                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                                </div>
                                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(idx)}>
                                                                    <Trash2Icon className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between gap-3 mb-1">
                                                    <label className="block text-sm font-medium">Komentár (nepovinné)</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Button type="button" variant="outline" size="sm" onClick={() => setSubmitData('student_comment', commentTemplates.initial)}>
                                                            Prvá verzia
                                                        </Button>
                                                        <Button type="button" variant="outline" size="sm" onClick={() => setSubmitData('student_comment', commentTemplates.update)}>
                                                            Aktualizácia
                                                        </Button>
                                                        <Button type="button" variant="outline" size="sm" onClick={() => setSubmitData('student_comment', commentTemplates.fix)}>
                                                            Oprava
                                                        </Button>
                                                    </div>
                                                </div>
                                                <Textarea
                                                    value={submitData.student_comment}
                                                    onChange={(e) => setSubmitData('student_comment', e.target.value)}
                                                    placeholder="Napr.: Odovzdávam prvú verziu. V prílohe sú analýza a implementácia."
                                                />
                                            </div>

                                            <Button type="submit" disabled={submitting} className="w-full">
                                                {assignment.status === 'submitted' ? 'Nahradiť aktuálne odovzdanie' : 'Odovzdať vypracovanú úlohu'}
                                            </Button>
                                        </form>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Stav</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Termín:</span>
                                    <span className="text-sm font-medium flex items-center">
                                        <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                                        {format(new Date(assignment.due_date), 'd.M.yyyy')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Aktuálny stav:</span>
                                    <Badge variant={statusVariant[assignment.status] || 'secondary'}>
                                        {statusText[assignment.status] || assignment.status}
                                    </Badge>
                                </div>

                                {canEdit && (
                                    <div className="pt-4 mt-4 border-t">
                                        <Button asChild variant="outline" className="w-full">
                                            <Link href={route('assignments.edit', assignment.id)}>
                                                <EditIcon className="mr-2 h-4 w-4" />
                                                Upraviť zadanie
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {(assignment.status !== 'pending' || assignment.feedback) && (
                            <Card className={assignment.status === 'rejected' ? 'border-destructive/50' : assignment.status === 'approved' ? 'border-green-500/50' : assignment.status === 'cancelled' ? 'border-slate-500/40' : ''}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Hodnotenie a spätná väzba</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-line">
                                        {assignment.feedback || <span className="italic text-muted-foreground">Zatiaľ bez hodnotenia.</span>}
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Prílohy od školiteľa</h4>
                                        {assignment.supervisor_file_paths && assignment.supervisor_file_paths.length > 0 ? (
                                            <ul className="space-y-2">
                                                {assignment.supervisor_file_paths.map((fileInfo, idx) => (
                                                    <li key={idx} className="flex items-center justify-between p-3 border rounded-md">
                                                        <div className="flex items-center">
                                                            <FileTextIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                                                            <span className="font-medium">{fileInfo.original_name}</span>
                                                            <span className="ml-2 text-xs text-muted-foreground">
                                                                ({(fileInfo.size / 1024 / 1024).toFixed(2)} MB)
                                                            </span>
                                                        </div>
                                                        <Button variant="outline" size="sm" asChild>
                                                            <a href={route('assignments.download-feedback', [assignment.id, idx])}>
                                                                <DownloadIcon className="mr-2 h-4 w-4" />
                                                                Stiahnuť
                                                            </a>
                                                        </Button>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic bg-muted p-3 rounded-md">
                                                Zatiaľ bez príloh od školiteľa.
                                            </p>
                                        )}
                                    </div>

                                    {assignment.status === 'cancelled' && assignment.cancellation_note && (
                                        <div className="rounded-md border border-slate-500/40 bg-slate-500/10 p-3 text-sm whitespace-pre-line">
                                            <p className="font-medium mb-1">Poznámka k zrušeniu úlohy</p>
                                            <p>{assignment.cancellation_note}</p>
                                        </div>
                                    )}

                                    {canEdit && (assignment.status === 'submitted' || assignment.status === 'rejected' || assignment.status === 'approved') && (
                                        <div className="pt-4 border-t space-y-4">
                                            <h4 className="text-sm font-medium">Aktualizovať hodnotenie</h4>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">Prílohy pre študenta (nepovinné)</label>
                                                <div className="border border-dashed border-border rounded-lg p-4 bg-muted/30">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        onChange={handleReviewFileChange}
                                                        className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
                                                    />
                                                    <p className="mt-2 text-xs text-muted-foreground">
                                                        Maximum 5 súborov, 10 MB na súbor.
                                                    </p>
                                                </div>
                                                {reviewErrors.files && <p className="text-red-500 text-xs mt-1">{reviewErrors.files}</p>}

                                                {reviewData.files.length > 0 && (
                                                    <div className="mt-3 space-y-2">
                                                        {reviewData.files.map((file, idx) => (
                                                            <div key={`${file.name}-${idx}`} className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm">
                                                                <div className="min-w-0">
                                                                    <p className="truncate font-medium">{file.name}</p>
                                                                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                                </div>
                                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeReviewFile(idx)}>
                                                                    <Trash2Icon className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <Textarea
                                                value={reviewData.feedback}
                                                onChange={(e) => {
                                                    setReviewData('feedback', e.target.value);
                                                    setReviewData('cancellation_note', e.target.value);
                                                }}
                                                placeholder="Napíš spätnú väzbu, dôvod vrátenia alebo dôvod zrušenia"
                                                className="min-h-[100px]"
                                            />
                                            {reviewErrors.feedback && <p className="text-red-500 text-xs">{reviewErrors.feedback}</p>}
                                            {reviewErrors.cancellation_note && <p className="text-red-500 text-xs">{reviewErrors.cancellation_note}</p>}

                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={handleApprove}
                                                    disabled={reviewing}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    <CheckCircleIcon className="mr-2 h-4 w-4" />
                                                    Schváliť
                                                </Button>
                                                <Button
                                                    onClick={handleReturnForRework}
                                                    disabled={reviewing || !reviewData.feedback}
                                                    variant="destructive"
                                                    className="flex-1"
                                                >
                                                    <XCircleIcon className="mr-2 h-4 w-4" />
                                                    Vrátiť na prepracovanie
                                                </Button>
                                            </div>
                                            <Button
                                                onClick={handleCancel}
                                                disabled={reviewing || !reviewData.feedback}
                                                variant="outline"
                                                className="w-full"
                                            >
                                                Zrušiť úlohu
                                            </Button>
                                            {(assignment.status === 'approved' || assignment.status === 'rejected') && (
                                                <Button
                                                    onClick={handleFeedbackOnly}
                                                    disabled={reviewing}
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    Iba uložiť text
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </ModernLayout>
    );
}

