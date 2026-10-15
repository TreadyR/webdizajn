import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const roleLabels = {
        student: 'Študent',
        supervisor: 'Školiteľ',
        admin: 'Administrátor',
    };

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            department: user.department || '',
            title: user.title || '',
            student_id: user.student_id || '',
            supervisor_code: user.supervisor_code || '',
            bio: user.bio || '',
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-foreground">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Update your account's profile information and email address.
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                    Rola: {roleLabels[user.role] || user.role}
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="phone" value="Telefón" />

                    <TextInput
                        id="phone"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        autoComplete="tel"
                        placeholder="napr. +421 900 123 456"
                    />

                    <InputError className="mt-2" message={errors.phone} />
                </div>

                <div>
                    <InputLabel htmlFor="department" value="Katedra / Oddelenie" />

                    <TextInput
                        id="department"
                        className="mt-1 block w-full"
                        value={data.department}
                        onChange={(e) => setData('department', e.target.value)}
                        autoComplete="organization"
                    />

                    <InputError className="mt-2" message={errors.department} />
                </div>

                <div>
                    <InputLabel htmlFor="title" value="Titul" />

                    <TextInput
                        id="title"
                        className="mt-1 block w-full"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        autoComplete="honorific-prefix"
                        placeholder="napr. Ing., Mgr., PhD."
                    />

                    <InputError className="mt-2" message={errors.title} />
                </div>

                {user.role === 'student' && (
                    <div>
                        <InputLabel htmlFor="student_id" value="AIS ID (7 číslic)" />

                        <TextInput
                            id="student_id"
                            className="mt-1 block w-full"
                            value={data.student_id}
                            onChange={(e) => setData('student_id', e.target.value.replace(/\D/g, '').slice(0, 7))}
                            autoComplete="off"
                            placeholder="napr. 1234567"
                        />

                        <p className="mt-1 text-xs text-muted-foreground">
                            Ak AIS ID nemáte, pole môžete nechať prázdne.
                        </p>

                        <InputError className="mt-2" message={errors.student_id} />
                    </div>
                )}

                {user.role === 'supervisor' && (
                    <div>
                        <InputLabel htmlFor="supervisor_code" value="ID školiteľa (7 číslic)" />

                        <TextInput
                            id="supervisor_code"
                            className="mt-1 block w-full"
                            value={data.supervisor_code}
                            onChange={(e) => setData('supervisor_code', e.target.value.replace(/\D/g, '').slice(0, 7))}
                            autoComplete="off"
                            placeholder="napr. 1234567"
                        />

                        <InputError className="mt-2" message={errors.supervisor_code} />
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="bio" value="Bio / Poznámka o používateľovi" />

                    <textarea
                        id="bio"
                        className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary/50 focus:ring-primary/30"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        rows={4}
                        placeholder="Krátke predstavenie, zameranie alebo poznámka"
                    />

                    <InputError className="mt-2" message={errors.bio} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-foreground">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-muted-foreground underline hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-muted-foreground">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
