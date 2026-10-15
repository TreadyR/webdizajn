import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function Show({ auth, message }) {
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link 
                        href={`/messages?thesis_id=${message.thesis.id}`}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h2 className="font-semibold text-xl text-card-foreground leading-tight">
                        Detail správy
                    </h2>
                </div>
            }
        >
            <Head title="Detail správy" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardContent className="p-6">
                            {/* Message header */}
                            <div className="border-b border-border pb-4 mb-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {message.thesis.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Od: {message.sender.name}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {format(new Date(message.created_at), 'dd. MMMM yyyy HH:mm')}
                                        </p>
                                    </div>
                                    
                                    {message.is_read ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Prečítané
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Nové
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Message content */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-card-foreground mb-3">Obsah správy:</h4>
                                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                                    <p className="text-card-foreground whitespace-pre-wrap">{message.message}</p>
                                </div>
                            </div>

                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                                        Prílohy ({message.attachments.length}):
                                    </h4>
                                    <div className="space-y-2">
                                        {message.attachments.map((attachment, index) => (
                                            <a
                                                key={index}
                                                href={`/messages/${message.id}/download/${index}`}
                                                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <DocumentIcon className="h-5 w-5 text-gray-500" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {attachment.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatFileSize(attachment.size)} • {attachment.type}
                                                    </p>
                                                </div>
                                                <div className="text-blue-600 hover:text-blue-800">
                                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                <Link
                                    href={`/messages?thesis_id=${message.thesis.id}`}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                >
                                    Pokračovať v konverzácii
                                </Link>
                                
                                <Link
                                    href="/messages"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    ← Späť na konverzáciu
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}