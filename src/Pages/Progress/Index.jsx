import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, User, BookOpen } from 'lucide-react';
import MilestoneTimeline from '@/components/MilestoneTimeline';
import CurrentPhaseWidget from '@/components/CurrentPhaseWidget';

export default function Index({ auth, thesis, milestones, supervisedTheses, filters }) {
    const isSupervisor = auth.user.role === 'supervisor';

    const backHref = route('progress.index', {
        search: filters?.search || undefined,
        sort: filters?.sort || undefined,
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 min-w-0 w-full">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl font-semibold leading-tight text-foreground truncate">
                            Progres práce
                        </h2>
                        {thesis && (
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                                {thesis.title}
                            </p>
                        )}
                    </div>
                    {isSupervisor && thesis && (
                        <Link href={backHref}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Späť na zoznam študentov
                            </Button>
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Progres práce" />

            <div className="mx-auto max-w-7xl space-y-6">
                
                {!thesis ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="bg-muted p-4 rounded-full mb-4">
                                <BookOpen className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Žiadny detail na zobrazenie</h3>
                            <p className="text-muted-foreground text-center max-w-md">
                                {auth.user.role === 'student' 
                                    ? 'Ešte nemáte priradenú žiadnu tému. Počkajte na priradenie školiteľom.' 
                                    : 'Najprv vyberte študenta zo zoznamu progresu.'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {/* Summary Widget */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                 <CurrentPhaseWidget milestones={milestones} />
                            </div>
                            
                            <Card className="col-span-1 border-l-4 border-l-primary h-full">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Detaily témy
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Študent</p>
                                            <p className="font-medium flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                {thesis.student ? thesis.student.name : 'Nepriradený'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Termín odovzdania</p>
                                            <p className="font-medium">
                                                {thesis.deadline ? new Date(thesis.deadline).toLocaleDateString('sk-SK') : 'Neurčený'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Stav témy</p>
                                             <Badge>{thesis.status}</Badge>
                                        </div>
                                        <div className="pt-2 mt-auto">
                                            <Link href={route('theses.show', thesis.id)} className="w-full block">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    Prejsť na detail témy <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Timeline */}
                        <div>
                            <MilestoneTimeline 
                                thesis={thesis} 
                                milestones={milestones} // Pass assignments inside milestones
                                isSupervisor={auth.user.role === 'supervisor' || auth.user.role === 'admin'}
                            />
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
