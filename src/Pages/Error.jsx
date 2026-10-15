import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Error({ status, message }) {
    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[status] || `${status}: Error`;

    const description = {
        503: 'Prepáčte, práve vykonávame údržbu. Skúste to prosím neskôr.',
        500: 'Whoops, niečo sa pokazilo na našom serveri.',
        404: 'Prepáčte, stránka ktorú hľadáte sa nenašla.',
        403: message || 'Prepáčte, nemáte oprávnenie na prístup k tejto stránke.',
    }[status] || message || 'Nastala chyba.';

    return (
        <GuestLayout>
            <Head title={title} />

            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="text-center">
                    <div className="mb-4">
                        <div className="text-6xl font-bold text-gray-300">
                            {status}
                        </div>
                    </div>
                    
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                            {title.split(': ')[1]}
                        </h1>
                        <p className="text-gray-600 max-w-md">
                            {description}
                        </p>
                    </div>

                    <div className="space-x-4">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Späť
                        </button>
                        
                        <a
                            href="/"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Domov
                        </a>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}