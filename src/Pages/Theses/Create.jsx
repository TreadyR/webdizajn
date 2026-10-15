import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        type: 'bachelor',
        deadline: '',
        requirements: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('theses.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold leading-tight text-card-foreground">
                        Vytvoriť novú tému
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Vytvorte novú tému záverečnej práce pre študentov
                    </p>
                </div>
            }
        >
            <Head title="Vytvoriť tému" />

            <div className="py-6">
                <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
                    
                    {/* Back Button */}
                    <div>
                        <Link href={route('theses.index')}>
                            <Button variant="outline">
                                Späť na zoznam
                            </Button>
                        </Link>
                    </div>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Vytvoriť novú tému</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <Label htmlFor="title">Názov témy *</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 bg-background border-border text-foreground"
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Napríklad: Webový informačný systém pre manažment záverečných prác"
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                {/* Description */}
                                <div>
                                    <Label htmlFor="description">Popis témy *</Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full bg-background border-border text-foreground rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        rows="5"
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Detailný popis témy, cieľov a očakávaných výstupov..."
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Popíšte tému podrobne - čo má študent vytvoriť, aké technológie použiť, aké sú hlavné ciele práce.
                                    </p>
                                </div>

                                {/* Type */}
                                <div>
                                    <div>
                                        <Label htmlFor="type">Typ práce *</Label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={data.type}
                                            className="mt-1 block w-full bg-background border-border text-foreground rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                            onChange={(e) => setData('type', e.target.value)}
                                            required
                                        >
                                            <option value="bachelor">Bakalárska práca</option>
                                            <option value="master">Diplomová práca</option>
                                            <option value="phd">Dizertačná práca</option>
                                        </select>
                                        <InputError message={errors.type} className="mt-2" />
                                    </div>
                                </div>

                                {/* Deadline */}
                                <div>
                                    <Label htmlFor="deadline">Termín dokončenia</Label>
                                    <Input
                                        id="deadline"
                                        type="date"
                                        name="deadline"
                                        value={data.deadline}
                                        className="mt-1 bg-background border-border text-foreground"
                                        onChange={(e) => setData('deadline', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    <InputError message={errors.deadline} className="mt-2" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Orientačný termín dokončenia práce (nepovinné)
                                    </p>
                                </div>

                                {/* Requirements */}
                                <div>
                                    <Label htmlFor="requirements">Požiadavky na študenta</Label>
                                    <textarea
                                        id="requirements"
                                        name="requirements"
                                        value={data.requirements}
                                        className="mt-1 block w-full bg-background border-border text-foreground rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        rows="3"
                                        onChange={(e) => setData('requirements', e.target.value)}
                                        placeholder="Napríklad: Znalosť PHP, Laravel, základy databáz, angličtina..."
                                    />
                                    <InputError message={errors.requirements} className="mt-2" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Aké znalosti, zručnosti alebo predmety by mal študent mať (nepovinné)
                                    </p>
                                </div>

                                {/* Information Box */}
                                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-blue-800">
                                                Informácie o vytvorení témy
                                            </h3>
                                            <div className="mt-2 text-sm text-blue-700">
                                                <ul className="list-disc list-inside space-y-1">
                                                    <li>Téma bude po vytvorení v stave "Dostupná" a študenti si ju budú môcť vybrať</li>
                                                    <li>Na tému je možné priradiť iba jedného študenta (akademické pravidlo)</li>
                                                    <li>Môžete ju kedykoľvek upraviť alebo vymazať, pokiaľ nie je priradená študentovi</li>
                                                    <li>Po priradení študenta sa stav zmení na "Priradená"</li>
                                                    <li>Budete automaticky nastavený ako školiteľ tejto témy</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-4 pt-6 border-t">
                                    <Link href={route('theses.index')}>
                                        <Button variant="outline" type="button" className="w-full sm:w-auto">
                                            Zrušiť
                                        </Button>
                                    </Link>
                                    <Button disabled={processing} className="w-full sm:w-auto">
                                        {processing ? 'Vytvára sa...' : 'Vytvoriť tému'}
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