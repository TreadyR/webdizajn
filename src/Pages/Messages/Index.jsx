import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, router } from '@inertiajs/react';
import { ChatBubbleLeftRightIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { MessageCircleMore, Sparkles } from 'lucide-react';

export default function Index({ auth, conversations }) {
    const [mouse, setMouse] = useState({ x: 50, y: 22 });

    // Real-time polling for conversation updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Reload conversations data every 5 seconds
            router.reload({ 
                only: ['conversations'],
                preserveState: true,
                preserveScroll: true
            });
        }, 5000);
        
        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setMouse({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    };

    const handleConversationClick = (thesisId) => {
        router.visit(`/messages?thesis_id=${thesisId}`);
    };

    const getUnreadCount = (thesis) => {
        // Count unread messages for current user
        return thesis.messages?.filter(message => 
            !message.is_read && message.sender_id !== auth.user.id
        ).length || 0;
    };

    const getLastMessage = (thesis) => {
        return thesis.messages?.[0];
    };

    const getConversationPartner = (thesis) => {
        if (auth.user.role === 'student') {
            return thesis.supervisor;
        } else {
            return thesis.student;
        }
    };

    const totalUnread = conversations.reduce((sum, thesis) => sum + getUnreadCount(thesis), 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 min-w-0 w-full">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl font-semibold leading-tight text-foreground truncate">
                            Správy
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">
                            {auth.user.role === 'student' && 'Komunikácia s vedúcim práce'}
                            {auth.user.role === 'supervisor' && 'Komunikácia so študentmi'}
                            {auth.user.role === 'admin' && 'Všetky správy v systéme'}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Správy" />

            <div
                className="ambient-page-shell"
                onMouseMove={handleMouseMove}
                style={{ '--mx': `${mouse.x}%`, '--my': `${mouse.y}%` }}
            >
                <div className="ambient-page-grid" />
                <div className="ambient-page-spotlight" />

                <div className="max-w-7xl mx-auto space-y-6 page-enter-fade ambient-page-content">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 section-lift-in" style={{ animationDelay: '40ms' }}>
                    <Card className="border-border/70 bg-card/70 backdrop-blur-sm md:col-span-2">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Aktívne konverzácie</p>
                                <p className="text-2xl font-semibold text-foreground">{conversations.length}</p>
                            </div>
                            <MessageCircleMore className="h-5 w-5 text-primary" />
                        </CardContent>
                    </Card>
                    <Card className="border-border/70 bg-card/70 backdrop-blur-sm md:col-span-2">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Neprečítané správy</p>
                                <p className="text-2xl font-semibold text-foreground">{totalUnread}</p>
                            </div>
                            <Sparkles className="h-5 w-5 text-sky-300" />
                        </CardContent>
                    </Card>
                </div>

                <Card className="section-lift-in" style={{ animationDelay: '90ms' }}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Inbox konzultácií</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                            {conversations.length === 0 ? (
                                <div className="text-center py-8">
                                    <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-2 text-sm font-medium text-card-foreground">Žiadne konverzácie</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {auth.user.role === 'student' 
                                            ? 'Zatiaľ nemáte žiadne priradené témy s možnosťou komunikácie.'
                                            : 'Zatiaľ nemáte žiadne témy so študentmi.'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-card-foreground mb-4">
                                        Konverzácie ({conversations.length})
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        {conversations.map((thesis, index) => {
                                            const partner = getConversationPartner(thesis);
                                            const lastMessage = getLastMessage(thesis);
                                            const unreadCount = getUnreadCount(thesis);
                                            
                                            return (
                                                <div
                                                    key={thesis.id}
                                                    onClick={() => handleConversationClick(thesis.id)}
                                                    className="bg-gradient-to-br from-card via-card to-muted/20 rounded-xl p-4 border border-border/70 hover:border-primary/30 cursor-pointer transition-all duration-200 stagger-item card-hover-glow"
                                                    style={{ animationDelay: `${140 + index * 45}ms` }}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            {/* Thesis title and partner info */}
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h4 className="text-sm font-medium text-card-foreground truncate">
                                                                    {thesis.title}
                                                                </h4>
                                                                {unreadCount > 0 && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-500/20 text-sky-200 border border-sky-500/30">
                                                                        {unreadCount} nových
                                                                    </span>
                                                                )}
                                                            </div>
                                                            
                                                            {partner && (
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="text-sm text-card-foreground">
                                                                        {partner.name}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        ({auth.user.role === 'student' ? 'Vedúci' : 'Študent'})
                                                                    </span>
                                                                </div>
                                                            )}
                                                            
                                                            {/* Last message preview */}
                                                            {lastMessage ? (
                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                    <span className="truncate">
                                                                        {lastMessage.sender_id === auth.user.id ? 'Vy: ' : ''}
                                                                        {lastMessage.message.length > 60 
                                                                            ? lastMessage.message.substring(0, 60) + '...'
                                                                            : lastMessage.message
                                                                        }
                                                                    </span>
                                                                    {lastMessage.attachments?.length > 0 && (
                                                                        <span className="text-xs bg-muted/60 border border-border/60 px-2 py-1 rounded-md">
                                                                            📎 {lastMessage.attachments.length}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-muted-foreground italic">
                                                                    Zatiaľ žiadne správy
                                                                </p>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Time and status */}
                                                        <div className="flex flex-col items-end ml-4">
                                                            {lastMessage && (
                                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                    <ClockIcon className="h-3 w-3" />
                                                                    {formatDistanceToNow(new Date(lastMessage.created_at), {
                                                                        addSuffix: true
                                                                    })}
                                                                </div>
                                                            )}
                                                            
                                                            {/* Thesis status */}
                                                            <div className="mt-1">
                                                                <Badge variant={
                                                                    thesis.status === 'active' 
                                                                        ? 'default'
                                                                        : thesis.status === 'completed'
                                                                        ? 'secondary'
                                                                        : 'outline'
                                                                }>
                                                                    {thesis.status === 'active' ? 'Aktívna' : 
                                                                     thesis.status === 'completed' ? 'Dokončená' : 
                                                                     'Pripravená'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                    </CardContent>
                </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}