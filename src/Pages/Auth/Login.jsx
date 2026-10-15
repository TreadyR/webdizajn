import Checkbox from '@/components/Checkbox';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Prihlásiť sa" />

            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground">Prihlásiť sa</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Vstúpte do svojho účtu
                    </p>
                </div>

                {status && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md text-sm text-green-400">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="email" value="Email" className="text-foreground" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full bg-background border-border text-foreground"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Heslo" className="text-foreground" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full bg-background border-border text-foreground"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-4 block">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ms-2 text-sm text-muted-foreground">
                                Zapamätať si ma
                            </span>
                        </label>
                    </div>

                    <div className="mt-6">
                        <PrimaryButton 
                            className="w-full justify-center bg-primary hover:bg-primary/90 text-primary-foreground" 
                            disabled={processing}
                        >
                            Prihlásiť sa
                        </PrimaryButton>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            Potrebujete účet? Kontaktujte administrátora systému.
                        </p>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
