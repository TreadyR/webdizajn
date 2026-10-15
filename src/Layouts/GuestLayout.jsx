import { Link } from '@inertiajs/react';
import { GraduationCap } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="dark">
            <div className="min-h-screen bg-background flex items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-3 mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <GraduationCap className="h-8 w-8" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-2xl font-bold text-foreground">
                                    Thesis Manager
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    Správa bakalárskych prác
                                </span>
                            </div>
                        </Link>
                    </div>
                    
                    <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
