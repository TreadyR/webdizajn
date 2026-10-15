import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        student_id: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registrácia" />

            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground">Vytvoriť účet</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Zaregistrujte sa a začnite používať systém
                    </p>
                </div>

                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="name" value="Meno" className="text-foreground" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full bg-background border-border text-foreground"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email" className="text-foreground" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full bg-background border-border text-foreground"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="student_id" value="AIS ID (voliteľné)" className="text-foreground" />
                        <TextInput
                            id="student_id"
                            name="student_id"
                            value={data.student_id}
                            className="mt-1 block w-full bg-background border-border text-foreground"
                            autoComplete="off"
                            onChange={(e) => setData('student_id', e.target.value.replace(/\D/g, '').slice(0, 7))}
                            placeholder="napr. 1234567"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">Pomôže to pri rýchlom vyhľadaní a priradení k téme.</p>
                        <InputError message={errors.student_id} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Heslo" className="text-foreground" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full bg-background border-border text-foreground"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel 
                            htmlFor="password_confirmation" 
                            value="Potvrdiť heslo" 
                            className="text-foreground" 
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full bg-background border-border text-foreground"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />
                        <InputError 
                            message={errors.password_confirmation} 
                            className="mt-2" 
                        />
                    </div>

                    <div className="mt-6">
                        <PrimaryButton 
                            className="w-full justify-center bg-primary hover:bg-primary/90 text-primary-foreground"
                            disabled={processing}
                        >
                            Registrovať sa
                        </PrimaryButton>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            Už máte účet?{' '}
                            <Link
                                href={route('login')}
                                className="text-primary hover:text-primary/80 underline"
                            >
                                Prihlásiť sa
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
