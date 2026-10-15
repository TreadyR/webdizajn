import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Modal from '@/components/Modal';
import MilestoneTimeline from '@/components/MilestoneTimeline';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Show({ 
    auth, 
    thesis, 
    canEdit, 
    canAssignStudent, 
    canRemoveStudent, 
    availableStudents = []
}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [studentSearch, setStudentSearch] = useState('');
    const [studentResults, setStudentResults] = useState(availableStudents);
    const [searchingStudents, setSearchingStudents] = useState(false);
    const [searchError, setSearchError] = useState('');

    const { delete: destroy, processing: deleteProcessing } = useForm();
    const { data: assignData, setData: setAssignData, post: assignPost, processing: assignProcessing } = useForm({
        student_id: '',
    });
    const { delete: removeStudent, processing: removeProcessing } = useForm();
    const { post: markCompletedPost, processing: markCompletedProcessing } = useForm();

    const formatDate = (date) => {
        if (!date) return 'Nezadané';
        return new Date(date).toLocaleDateString('sk-SK');
    };

    const getStatusVariant = (status) => {
        const variants = {
            draft: 'secondary',
            available: 'default', 
            assigned: 'default',
            in_progress: 'secondary',
            completed: 'default',
            defended: 'default'
        };
        return variants[status] || 'secondary';
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

    const getTypeText = (type) => {
        const texts = {
            bachelor: 'Bakalárska práca',
            master: 'Diplomová práca',
            phd: 'Dizertačná práca'
        };
        return texts[type] || type;
    };

    const handleDelete = () => {
        destroy(route('theses.destroy', thesis.id), {
            onSuccess: () => setShowDeleteModal(false),
        });
    };

    const handleAssignStudent = (e) => {
        e.preventDefault();
        assignPost(route('theses.assign-student', thesis.id), {
            onSuccess: () => {
                setShowAssignModal(false);
                setAssignData('student_id', '');
            },
        });
    };

    const handleRemoveStudent = () => {
        removeStudent(route('theses.remove-student', thesis.id), {
            onSuccess: () => setShowRemoveModal(false),
        });
    };

    const handleMarkCompleted = () => {
        if (!confirm('Označiť túto tému ako dokončenú a pripravenú na obhajobu/AIS?')) {
            return;
        }

        markCompletedPost(route('theses.mark-completed', thesis.id));
    };

    useEffect(() => {
        if (!showAssignModal) {
            return;
        }

        const timeout = setTimeout(async () => {
            setSearchingStudents(true);
            setSearchError('');

            try {
                const response = await fetch(`${route('theses.available-students', thesis.id)}?q=${encodeURIComponent(studentSearch)}`, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (!response.ok) {
                    throw new Error('Nepodarilo sa načítať študentov.');
                }

                const payload = await response.json();
                setStudentResults(payload.students || []);
            } catch (error) {
                setSearchError('Vyhľadávanie zlyhalo. Skúste to prosím znova.');
            } finally {
                setSearchingStudents(false);
            }
        }, 250);

        return () => clearTimeout(timeout);
    }, [showAssignModal, studentSearch, thesis.id]);

    const selectedStudent = studentResults.find((student) => String(student.id) === String(assignData.student_id));

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-card-foreground">
                        Detail témy
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {thesis.title}
                    </p>
                </div>
            }
        >
            <Head title={`Téma: ${thesis.title}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                        <Link href={route('theses.index')}>
                            <Button variant="outline">
                                Späť na zoznam
                            </Button>
                        </Link>
                        {canEdit && (
                            <Link href={route('theses.edit', thesis.id)}>
                                <Button>
                                    Upraviť
                                </Button>
                            </Link>
                        )}
                    </div>
                    
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">
                                    {thesis.title}
                                </CardTitle>
                                <div className="flex space-x-2">
                                    <Badge variant={getStatusVariant(thesis.status)}>
                                        {getStatusText(thesis.status)}
                                    </Badge>
                                    <Badge variant="outline">
                                        {getTypeText(thesis.type)}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Typ práce</dt>
                                    <dd className="mt-1 text-sm text-card-foreground">{getTypeText(thesis.type)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Školiteľ</dt>
                                    <dd className="mt-1 text-sm text-card-foreground">
                                        {thesis.supervisor ? thesis.supervisor.name : 'Nezadané'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Termín dokončenia</dt>
                                    <dd className="mt-1 text-sm text-card-foreground">{formatDate(thesis.deadline)}</dd>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <dt className="text-sm font-medium text-muted-foreground mb-2">Popis témy</dt>
                                <dd className="text-sm text-card-foreground whitespace-pre-wrap">{thesis.description}</dd>
                            </div>
                            
                            {thesis.requirements && (
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground mb-2">Požiadavky na študenta</dt>
                                    <dd className="text-sm text-card-foreground whitespace-pre-wrap">{thesis.requirements}</dd>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Student Assignment */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">
                                    Priradenie študenta
                                </CardTitle>
                                {canAssignStudent && (
                                    <Button onClick={() => setShowAssignModal(true)}>
                                        Priradiť študenta
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        
                        <CardContent>
                            {thesis.student ? (
                                <div className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-card-foreground">{thesis.student.name}</h4>
                                            <p className="text-sm text-muted-foreground">ID: {thesis.student.student_id}</p>
                                            <p className="text-sm text-muted-foreground">{thesis.student.email}</p>
                                            {thesis.student.phone && (
                                                <p className="text-sm text-muted-foreground">{thesis.student.phone}</p>
                                            )}
                                        </div>
                                        {canRemoveStudent && (
                                            <Button variant="destructive" onClick={() => setShowRemoveModal(true)}>
                                                Odstrániť
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-muted-foreground text-4xl mb-2">👤</div>
                                    <p className="text-muted-foreground">Žiadny študent nie je priradený k tejto téme</p>
                                    {canAssignStudent && (
                                        <Button 
                                            className="mt-4"
                                            onClick={() => setShowAssignModal(true)}
                                        >
                                            Priradiť študenta
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Milestones Timeline */}
                    {(thesis.student || canEdit) && (
                        <div className="mt-8">
                             <MilestoneTimeline 
                                thesis={thesis} 
                                milestones={thesis.milestones || []} 
                                isSupervisor={canEdit || auth.user.role === 'admin'} 
                             />
                        </div>
                    )}

                    {/* Actions for supervisor */}
                    {canEdit && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Akcie
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    <Link href={route('theses.edit', thesis.id)}>
                                        <Button variant="outline">
                                            Upraviť tému
                                        </Button>
                                    </Link>
                                    {thesis.student_id && (
                                        <Link href={route('assignments.create', { thesis_id: thesis.id })}>
                                            <Button>
                                                Vytvoriť úlohu
                                            </Button>
                                        </Link>
                                    )}
                                    {thesis.student_id && !['completed', 'defended'].includes(thesis.status) && (
                                        <Button
                                            onClick={handleMarkCompleted}
                                            disabled={markCompletedProcessing}
                                        >
                                            {markCompletedProcessing ? 'Ukončuje sa...' : 'Ukončiť tému (pripravená na obhajobu/AIS)'}
                                        </Button>
                                    )}
                                    {!thesis.student_id && (
                                        <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
                                            Vymazať tému
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-card-foreground">
                        Vymazať tému?
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Naozaj chcete vymazať túto tému? Táto akcia sa nedá vrátiť späť.
                    </p>
                    <div className="mt-6 flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                            Zrušiť
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleteProcessing}>
                            {deleteProcessing ? 'Maže sa...' : 'Vymazať'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Assign Student Modal */}
            <Modal show={showAssignModal} onClose={() => setShowAssignModal(false)}>
                <div className="p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 border border-zinc-800/80 rounded-lg">
                    <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                        Priradiť študenta
                    </h2>
                    <form onSubmit={handleAssignStudent}>
                        <div className="mb-4 space-y-3">
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Vyhľadajte študenta podľa mena, emailu alebo AIS ID (funguje aj bez diakritiky)
                            </label>
                            <p className="text-xs text-zinc-400 -mt-1">
                                Zobrazujú sa iba študenti, ktorí ešte nemajú priradenú tému.
                            </p>

                            <input
                                type="text"
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                                className="w-full rounded-md border border-zinc-700 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                placeholder="Napr. Peter Študent alebo 2826807"
                            />

                            <div className="max-h-56 overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900/65">
                                {searchingStudents ? (
                                    <div className="p-3 text-sm text-zinc-400">Vyhľadávam študentov...</div>
                                ) : studentResults.length > 0 ? (
                                    studentResults.map((student) => (
                                        <button
                                            type="button"
                                            key={student.id}
                                            onClick={() => setAssignData('student_id', String(student.id))}
                                            className={`w-full text-left px-3 py-2 border-b border-zinc-800/80 last:border-b-0 transition-colors hover:bg-zinc-800/80 ${String(assignData.student_id) === String(student.id) ? 'bg-emerald-500/15' : ''}`}
                                        >
                                            <div className="font-medium text-sm text-zinc-100">{student.name}</div>
                                            <div className="text-xs text-zinc-400">AIS ID: {student.student_id || 'bez AIS ID'} • {student.email}</div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-3 text-sm text-zinc-400">Nenašli sa žiadni študenti.</div>
                                )}
                            </div>

                            {selectedStudent && (
                                <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                                    Vybraný študent: <span className="font-medium">{selectedStudent.name}</span> ({selectedStudent.student_id || 'bez AIS ID'})
                                </div>
                            )}

                            {searchError && <p className="text-sm text-destructive">{searchError}</p>}
                        </div>
                        <div className="flex justify-end space-x-3">
                            <Button variant="outline" type="button" onClick={() => setShowAssignModal(false)} className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-zinc-100">
                                Zrušiť
                            </Button>
                            <Button disabled={assignProcessing || !assignData.student_id} className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400">
                                {assignProcessing ? 'Priraďuje sa...' : 'Priradiť'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Remove Student Modal */}
            <Modal show={showRemoveModal} onClose={() => setShowRemoveModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-card-foreground">
                        Odstrániť študenta?
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Naozaj chcete odstrániť študenta {thesis.student?.name} z tejto témy?
                        Téma sa zmení späť na dostupnú.
                    </p>
                    <div className="mt-6 flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setShowRemoveModal(false)}>
                            Zrušiť
                        </Button>
                        <Button variant="destructive" onClick={handleRemoveStudent} disabled={removeProcessing}>
                            {removeProcessing ? 'Odstraňuje sa...' : 'Odstrániť'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}