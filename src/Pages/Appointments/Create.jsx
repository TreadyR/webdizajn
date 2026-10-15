import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { fromDatetimeLocalValue } from '@/utils/datetime';

export default function Create({ auth, theses }) {
    const { data, setData, post, processing, errors } = useForm({
        thesis_id: '',
        scheduled_at: '',
        duration: 60,
        location: '',
        agenda: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Convert local datetime to ISO8601 to keep timezone handling stable.
        const formData = {
            ...data,
            scheduled_at: fromDatetimeLocalValue(data.scheduled_at),
        };
        
        post(route('appointments.store'), {
            data: formData
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link 
                        href={route('appointments.index')}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h2 className="font-semibold text-xl text-card-foreground leading-tight">
                            Navrhnúť konzultáciu
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Vytvorte návrh stretnutia pre konzultáciu
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Navrhnúť konzultáciu" />

            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Nová konzultácia
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Thesis Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="thesis_id">Téma bakalárskej práce *</Label>
                                <Select 
                                    value={data.thesis_id} 
                                    onValueChange={(value) => setData('thesis_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Vyberte tému..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {theses.map((thesis) => (
                                            <SelectItem key={thesis.id} value={thesis.id.toString()}>
                                                {thesis.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.thesis_id && (
                                    <p className="text-sm text-destructive">{errors.thesis_id}</p>
                                )}
                            </div>

                            {/* Date and Time */}
                            <div className="space-y-2">
                                <Label htmlFor="scheduled_at" className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Dátum a čas *
                                </Label>
                                <Input
                                    id="scheduled_at"
                                    type="datetime-local"
                                    value={data.scheduled_at}
                                    onChange={(e) => setData('scheduled_at', e.target.value)}
                                    min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                                    className="w-full cursor-pointer bg-background text-foreground [color-scheme:dark]"
                                    required
                                />
                                {errors.scheduled_at && (
                                    <p className="text-sm text-destructive">{errors.scheduled_at}</p>
                                )}
                            </div>

                            {/* Duration */}
                            <div className="space-y-2">
                                <Label htmlFor="duration">Trvanie (minúty)</Label>
                                <Select 
                                    value={data.duration.toString()} 
                                    onValueChange={(value) => setData('duration', parseInt(value))}
                                >
                                    <SelectTrigger>
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
                                {errors.duration && (
                                    <p className="text-sm text-destructive">{errors.duration}</p>
                                )}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location" className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Miesto stretnutia
                                </Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="napr. Miestnosť 204, Online - Zoom, Kancelária..."
                                />
                                {errors.location && (
                                    <p className="text-sm text-destructive">{errors.location}</p>
                                )}
                            </div>

                            {/* Agenda */}
                            <div className="space-y-2">
                                <Label htmlFor="agenda">Agenda stretnutia</Label>
                                <Textarea
                                    id="agenda"
                                    value={data.agenda}
                                    onChange={(e) => setData('agenda', e.target.value)}
                                    rows={4}
                                    placeholder="Čo sa má prebrať na stretnutí? (voliteľné)"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Napíšte témy alebo body, ktoré chcete prebrať počas konzultácie.
                                </p>
                                {errors.agenda && (
                                    <p className="text-sm text-destructive">{errors.agenda}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-6">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Vytvára sa...' : 'Navrhnúť konzultáciu'}
                                </Button>
                                
                                <Link href={route('appointments.index')}>
                                    <Button variant="outline">
                                        Zrušiť
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}