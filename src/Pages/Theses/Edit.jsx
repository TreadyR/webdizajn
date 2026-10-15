import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ thesis }) {
    const { data, setData, put, processing, errors } = useForm({
        title: thesis.title || '',
        description: thesis.description || '',
        type: thesis.type || 'bachelor',
        deadline: thesis.deadline || '',
        requirements: thesis.requirements || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('theses.update', thesis.id));
    };

    const getTypeText = (type) => {
        const texts = {
            bachelor: 'Bakalárska práca',
            master: 'Diplomová práca',
            phd: 'Dizertačná práca'
        };
        return texts[type] || type;
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold leading-tight text-card-foreground">
                        Upraviť tému
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                        {thesis.title}
                    </p>
                </div>
            }
        >
            <Head title={`Upraviť: ${thesis.title}`} />

            <div className="py-6">
                <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8">
                    
                    {/* Current Status Info */}
                    {thesis.student_id && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        Upozornenie
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>
                                            Táto téma je už priradená študentovi <strong>{thesis.student?.name}</strong>. 
                                            Zmeny môžu ovplyvniť prebiehajúcu prácu.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Upraviť tému</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-card-foreground mb-2">
                                        Názov témy *
                                    </label>
                                    <Input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Stručný a výstižný názov témy"
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-card-foreground mb-2">
                                        Popis témy *
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full border-input rounded-md shadow-sm focus:border-ring focus:ring-ring bg-background text-card-foreground"
                                        rows="6"
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Detailný popis témy, cieľov a očakávaných výstupov..."
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                {/* Type */}
                                <div>
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-card-foreground mb-2">
                                            Typ práce *
                                        </label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={data.type}
                                            className="mt-1 block w-full border-input rounded-md shadow-sm focus:border-ring focus:ring-ring bg-background text-card-foreground"
                                            onChange={(e) => setData('type', e.target.value)}
                                            required
                                        >
                                            <option value="bachelor">Bakalárska práca</option>
                                            <option value="master">Diplomová práca</option>
                                            <option value="phd">Dizertačná práca</option>
                                        </select>
                                        <InputError message={errors.type} className="mt-2" />
                                        {data.type !== thesis.type && (
                                            <p className="mt-2 text-sm text-yellow-300">
                                                Pozor: Menia sa typ práce z "{getTypeText(thesis.type)}" na "{getTypeText(data.type)}"
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Deadline */}
                                <div>
                                    <label htmlFor="deadline" className="block text-sm font-medium text-card-foreground mb-2">
                                        Termín dokončenia
                                    </label>
                                    <Input
                                        id="deadline"
                                        type="date"
                                        name="deadline"
                                        value={data.deadline}
                                        onChange={(e) => setData('deadline', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    <InputError message={errors.deadline} className="mt-2" />
                                </div>

                                {/* Requirements */}
                                <div>
                                    <label htmlFor="requirements" className="block text-sm font-medium text-card-foreground mb-2">
                                        Požiadavky na študenta
                                    </label>
                                    <textarea
                                        id="requirements"
                                        name="requirements"
                                        value={data.requirements}
                                        className="mt-1 block w-full border-input rounded-md shadow-sm focus:border-ring focus:ring-ring bg-background text-card-foreground"
                                        rows="4"
                                        onChange={(e) => setData('requirements', e.target.value)}
                                        placeholder="Napríklad: znalosti programovania v PHP, Laravel, Vue.js, práca s databázami..."
                                    />
                                    <InputError message={errors.requirements} className="mt-2" />
                                </div>

                                {/* Information about editing */}
                                <div className="bg-muted/50 border border-border rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-blue-800">
                                                Informácie o úprave témy
                                            </h3>
                                            <div className="mt-2 text-sm text-blue-700">
                                                <ul className="list-disc list-inside space-y-1">
                                                    <li>Zmeny sa okamžite prejavia v systéme</li>
                                                    <li>Ak je téma priradená študentovi, zmeny môžu ovplyvniť jeho prácu</li>
                                                    <li>Pri významných zmenách odporučujeme kontaktovať študenta</li>
                                                    <li>Stav témy sa automaticky nezmení</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-6 border-t">
                                    <div className="flex flex-wrap gap-3 sm:gap-4">
                                        <Link href={route('theses.show', thesis.id)}>
                                            <Button variant="outline" type="button" className="w-full sm:w-auto">
                                                Zrušiť
                                            </Button>
                                        </Link>
                                    </div>
                                    <Button disabled={processing} className="w-full sm:w-auto">
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