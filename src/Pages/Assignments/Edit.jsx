import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ assignment }) {
    const { data, setData, put, processing, errors } = useForm({
        title: assignment.title || '',
        description: assignment.description || '',
        due_date: assignment.due_date || '',
        order: assignment.order || 1
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('assignments.update', assignment.id));
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
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

    const hasSubmissions = assignment.status === 'submitted' || assignment.status === 'approved';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 min-w-0 w-full">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl font-semibold leading-tight text-card-foreground truncate">
                            Upraviť úlohu
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                            {assignment.title}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <Link href={route('assignments.show', assignment.id)}>
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                Späť na detail
                            </Button>
                        </Link>
                        <Link href={route('assignments.index')} className="hidden sm:inline-flex">
                            <Button variant="outline" size="sm">
                                Späť na zoznam úloh
                            </Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Upraviť: ${assignment.title}`} />

            <div className="py-6">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    
                    {/* Current Status Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    Aktuálny stav úlohy
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p>
                                        <strong>Stav:</strong> {getStatusText(assignment.status)} |{' '}
                                        <strong>Téma:</strong> {assignment.thesis.title} |{' '}
                                        <strong>Študent:</strong> {assignment.thesis.student?.name || 'Nepriradený'}
                                    </p>
                                    {hasSubmissions && (
                                        <p className="mt-1">
                                            <strong>Upozornenie:</strong> Úloha už má odovzdania. Zmeny môžu ovplyvniť hodnotenie.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Upraviť úlohu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-card-foreground mb-2">
                                        Názov úlohy *
                                    </label>
                                    <Input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Napríklad: Analýza požiadaviek systému"
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-card-foreground mb-2">
                                        Popis úlohy *
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full border border-input rounded-md shadow-sm focus:border-ring focus:ring-ring bg-background text-card-foreground p-3"
                                        rows="6"
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Podrobný popis úlohy, čo má študent urobiť, aké sú očakávané výstupy..."
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                {/* Due Date and Order */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="due_date" className="block text-sm font-medium text-card-foreground mb-2">
                                            Termín odovzdania *
                                        </label>
                                        <Input
                                            id="due_date"
                                            type="date"
                                            name="due_date"
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            min={getMinDate()}
                                            required
                                        />
                                    <InputError message={errors.due_date} className="mt-2" />
                                    {hasSubmissions && data.due_date !== assignment.due_date && (
                                        <p className="mt-2 text-sm text-yellow-500">
                                            Pozor: Menia sa termín úlohy, ktorá už má odovzdania
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="order" className="block text-sm font-medium text-card-foreground mb-2">
                                        Poradie úlohy *
                                    </label>
                                    <select
                                        id="order"
                                        name="order"
                                        value={data.order}
                                        className="mt-1 block w-full border border-input rounded-md shadow-sm focus:border-ring focus:ring-ring bg-background text-card-foreground p-2.5"
                                        onChange={(e) => setData('order', parseInt(e.target.value))}
                                        required
                                    >
                                        {[...Array(20)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}. úloha
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.order} className="mt-2" />
                                </div>
                                </div>



                                {/* Information about editing */}
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-blue-300">
                                                Informácie o úprave úlohy
                                            </h3>
                                            <div className="mt-2 text-sm text-blue-200">
                                                <ul className="list-disc list-inside space-y-1">
                                                    <li>Zmeny sa okamžite prejavia v systéme</li>
                                                    <li>Študent dostane notifikáciu o úprave úlohy</li>
                                                    <li>Ak úloha už má odovzdania, zmeny môžu ovplyvniť hodnotenie</li>
                                                    <li>Pri zmene termínu odporúčame kontaktovať študenta</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-6 border-t border-border">
                                    <div className="flex space-x-4">
                                        <Link href={route('assignments.show', assignment.id)}>
                                            <Button type="button" variant="outline">
                                                Zrušiť
                                            </Button>
                                        </Link>
                                    </div>
                                    <Button disabled={processing}>
                                        {processing ? 'Ukladá sa...' : 'Uložiť zmeny'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}