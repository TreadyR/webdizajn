import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export default function Create({ 
    availableTheses = [], 
    selectedThesis = null, 
    milestones = [], 
    selectedMilestoneId = null 
}) {
    const { url } = usePage();
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const thesisId = urlParams.get('thesis_id') || selectedThesis?.id || '';
    
    const { data, setData, post, processing, errors, reset } = useForm({
        thesis_id: thesisId,
        milestone_id: selectedMilestoneId || '',
        title: '',
        description: '',
        due_date: '',
        order: 1,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('assignments.store'), {
            onSuccess: () => reset(),
        });
    };

    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold leading-tight text-card-foreground truncate">
                        Vytvoriť novú úlohu
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Vytvorte novú úlohu pre študenta
                    </p>
                </div>
            }
        >
            <Head title="Vytvoriť úlohu" />

            <div className="py-6">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Back Button */}
                    <div>
                        <Link href={route('assignments.index')}>
                            <Button variant="outline">
                                Späť na zoznam
                            </Button>
                        </Link>
                    </div>
                    
                    {!selectedThesis && availableTheses.length === 0 ? (
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="text-muted-foreground text-6xl mb-4">📋</div>
                                <h3 className="text-lg font-medium text-card-foreground mb-2">
                                    Žiadne vhodné témy
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Na vytvorenie úlohy potrebujete tému, ktorá má priradeného študenta.
                                </p>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>Pre vytvorenie úlohy musíte:</p>
                                    <ul className="list-disc list-inside text-left max-w-md mx-auto space-y-1">
                                        <li>Mať vytvorenú tému</li>
                                        <li>Priradiť študenta k téme</li>
                                        <li>Potom môžete vytvoriť úlohy pre študenta</li>
                                    </ul>
                                </div>
                                <div className="mt-6 space-x-4">
                                    <Link href={route('theses.create')}>
                                        <Button>
                                            Vytvoriť novú tému
                                        </Button>
                                    </Link>
                                    <Link href={route('theses.index')}>
                                        <Button variant="outline">
                                            Zobraziť moje témy
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Vytvoriť novú úlohu</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-6">
                                {/* Thesis Selection */}
                                <div>
                                    <label htmlFor="thesis_id" className="block text-sm font-medium text-card-foreground mb-2">
                                        Téma *
                                    </label>
                                    {selectedThesis ? (
                                        <div className="mt-1">
                                            <div className="block w-full px-3 py-2 border border-input rounded-md shadow-sm bg-muted text-card-foreground">
                                                {selectedThesis.title} ({selectedThesis.student?.name || 'Bez študenta'})
                                            </div>
                                            <input type="hidden" name="thesis_id" value={selectedThesis.id} />
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Téma je predvybraná
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <select
                                                id="thesis_id"
                                                name="thesis_id"
                                                value={data.thesis_id}
                                                className="mt-1 block w-full border-input rounded-md shadow-sm focus:border-ring focus:ring-ring bg-background text-card-foreground"
                                                onChange={(e) => setData('thesis_id', e.target.value)}
                                                required
                                            >
                                                <option value="">-- Vyberte tému --</option>
                                                {availableTheses.map((thesis) => (
                                                    <option key={thesis.id} value={thesis.id}>
                                                        {thesis.title} ({thesis.student?.name || 'Bez študenta'})
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Zobrazujú sa len témy, ktoré vedieme a majú priradeného študenta
                                            </p>
                                        </>
                                    )}
                                    <InputError message={errors.thesis_id} className="mt-2" />
                                </div>

                                {/* Milestone Selection */}
                                {((selectedThesis || data.thesis_id) && milestones.length > 0) && (
                                    <div>
                                        <label htmlFor="milestone_id" className="block text-sm font-medium text-card-foreground mb-2">
                                            Priradiť k míľniku (voliteľné)
                                        </label>
                                        <select
                                            id="milestone_id"
                                            name="milestone_id"
                                            value={data.milestone_id}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            onChange={(e) => setData('milestone_id', e.target.value)}
                                        >
                                            <option value="">-- Samostatná úloha (bez míľnika) --</option>
                                            {milestones.map((milestone) => (
                                                <option key={milestone.id} value={milestone.id}>
                                                    {milestone.title} ({milestone.status})
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.milestone_id} className="mt-2" />
                                    </div>
                                )}

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
                                        className="mt-1 block w-full border-input rounded-md shadow-sm focus:border-ring focus:ring-ring bg-background text-card-foreground"
                                        rows="6"
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Podrobný popis úlohy, čo má študent urobiť, aké sú očakávané výstupy..."
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Popíšte úlohu podrobne - čo má študent spraviť, aké materiály odovzdať, kritériá hodnotenia.
                                    </p>
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
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Termín musí byť aspoň zajtra
                                        </p>
                                    </div>

                                    <div>
                                        <label htmlFor="order" className="block text-sm font-medium text-card-foreground mb-2">
                                            Poradie úlohy *
                                        </label>
                                        <select
                                            id="order"
                                            name="order"
                                            value={data.order}
                                            className="mt-1 block w-full border-input rounded-md shadow-sm focus:border-ring focus:ring-ring bg-background text-card-foreground"
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
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Poradie určuje, v akom poradí sa úlohy zobrazujú
                                        </p>
                                    </div>
                                </div>



                                {/* Information Box */}
                                <div className="bg-muted/50 border border-border rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-card-foreground">
                                                Informácie o vytvorení úlohy
                                            </h3>
                                            <div className="mt-2 text-sm text-muted-foreground">
                                                <ul className="list-disc list-inside space-y-1">
                                                    <li>Úloha bude po vytvorení v stave "Čaká na riešenie"</li>
                                                    <li>Študent dostane notifikáciu o novej úlohe</li>
                                                    <li>Môžete úlohu kedykoľvek upraviť alebo vymazať</li>
                                                    <li>Po odovzdaní študentom môžete úlohu schváliť, vrátiť na prepracovanie alebo zrušiť</li>
                                                    <li>Schválené úlohy sú označené ako dokončené</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                    <Link href={route('assignments.index')}>
                                        <Button variant="outline" type="button">
                                            Zrušiť
                                        </Button>
                                    </Link>
                                    <Button disabled={processing}>
                                        {processing ? 'Vytvára sa...' : 'Vytvoriť úlohu'}
                                    </Button>
                                </div>
                            </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}