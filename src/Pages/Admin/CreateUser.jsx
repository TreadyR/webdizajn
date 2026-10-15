import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ArrowLeft, UserPlus } from 'lucide-react';

export default function CreateUser({ auth, roles }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student',
        student_id: '',
        supervisor_code: '',
        department: '',
        phone: '',
        bio: '',
        is_active: true
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('admin.users')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Pridať používateľa</h2>
                        <p className="text-sm text-muted-foreground">
                            Vytvorte nového používateľa systému
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Pridať používateľa" />

            <div className="max-w-4xl mx-auto space-y-6">
                <Card className="border-border/70 bg-gradient-to-r from-card via-card to-muted/40">
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Administrácia používateľov</p>
                        <h3 className="text-lg font-semibold text-foreground mt-1">Vytvorenie nového účtu v systéme</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Najprv nastav rolu a základné údaje, potom doplň identifikátor podľa typu používateľa.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/70">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Nový používateľ
                        </CardTitle>
                        <CardDescription>
                            Vyplňte všetky potrebné informácie pre nového používateľa
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Základné údaje</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Meno */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Meno a priezvisko *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={errors.name ? 'border-destructive' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={errors.email ? 'border-destructive' : ''}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Heslo */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Heslo *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={errors.password ? 'border-destructive' : ''}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password}</p>
                                    )}
                                </div>

                                {/* Potvrdenie hesla */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Potvrdenie hesla *</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={errors.password_confirmation ? 'border-destructive' : ''}
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2 border-t border-border/70" />

                            <div className="space-y-1">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Rola a profil</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Rola */}
                                <div className="space-y-2">
                                    <Label htmlFor="role">Rola *</Label>
                                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                        <SelectTrigger className={errors.role ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Vyberte rolu" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(roles).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>
                                                    {value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role && (
                                        <p className="text-sm text-destructive">{errors.role}</p>
                                    )}
                                </div>

                                {/* Telefón */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefón</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className={errors.phone ? 'border-destructive' : ''}
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-destructive">{errors.phone}</p>
                                    )}
                                </div>
                            </div>

                            {data.role === 'student' && (
                                <div className="space-y-2">
                                    <Label htmlFor="student_id">AIS ID študenta *</Label>
                                    <Input
                                        id="student_id"
                                        type="text"
                                        inputMode="numeric"
                                        value={data.student_id}
                                        onChange={(e) => setData('student_id', e.target.value.replace(/\D/g, '').slice(0, 7))}
                                        className={errors.student_id ? 'border-destructive' : ''}
                                        placeholder="Napr. 2826807"
                                    />
                                    <p className="text-xs text-muted-foreground">Formát: 7 číslic.</p>
                                    {errors.student_id && (
                                        <p className="text-sm text-destructive">{errors.student_id}</p>
                                    )}
                                </div>
                            )}

                            {data.role === 'supervisor' && (
                                <div className="space-y-2">
                                    <Label htmlFor="supervisor_code">ID školiteľa *</Label>
                                    <Input
                                        id="supervisor_code"
                                        type="text"
                                        inputMode="numeric"
                                        value={data.supervisor_code}
                                        onChange={(e) => setData('supervisor_code', e.target.value.replace(/\D/g, '').slice(0, 7))}
                                        className={errors.supervisor_code ? 'border-destructive' : ''}
                                        placeholder="Napr. 9001001"
                                    />
                                    <p className="text-xs text-muted-foreground">Formát: 7 číslic.</p>
                                    {errors.supervisor_code && (
                                        <p className="text-sm text-destructive">{errors.supervisor_code}</p>
                                    )}
                                </div>
                            )}

                            {/* Katedra */}
                            <div className="space-y-2">
                                <Label htmlFor="department">Katedra/Oddelenie</Label>
                                <Input
                                    id="department"
                                    type="text"
                                    value={data.department}
                                    onChange={(e) => setData('department', e.target.value)}
                                    className={errors.department ? 'border-destructive' : ''}
                                    placeholder="Napr. Katedra informatiky"
                                />
                                {errors.department && (
                                    <p className="text-sm text-destructive">{errors.department}</p>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <Label htmlFor="bio">O používateľovi</Label>
                                <Textarea
                                    id="bio"
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    className={errors.bio ? 'border-destructive' : ''}
                                    placeholder="Krátky popis používateľa, jeho záujmy, špecializácia..."
                                    rows={3}
                                />
                                {errors.bio && (
                                    <p className="text-sm text-destructive">{errors.bio}</p>
                                )}
                            </div>

                            {/* Aktívny status */}
                            <div className="flex items-center space-x-2 rounded-lg border border-border/70 p-3">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded border-border"
                                />
                                <Label htmlFor="is_active">Používateľ je aktívny</Label>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Link href={route('admin.users')}>
                                    <Button variant="outline" type="button">
                                        Zrušiť
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Vytváranie...' : 'Vytvoriť používateľa'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}