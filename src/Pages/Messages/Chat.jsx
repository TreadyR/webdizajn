import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    ArrowLeftIcon, 
    PaperAirplaneIcon, 
    PaperClipIcon,
    DocumentIcon,
    XMarkIcon,
    EllipsisVerticalIcon 
} from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow, format } from 'date-fns';

export default function Chat({ auth, thesis, messages }) {
    const [attachments, setAttachments] = useState([]);
    const [showOptions, setShowOptions] = useState({});
    const [isPollingEnabled, setIsPollingEnabled] = useState(true);
    const [lastMessageCount, setLastMessageCount] = useState(messages.length);
    const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);
    const [userScrolledUp, setUserScrolledUp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const pollingIntervalRef = useRef(null);
    const messagesContainerRef = useRef(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        thesis_id: thesis.id,
        message: '',
        attachments: []
    });

    // Scroll to bottom when new messages arrive and detect new messages
    useEffect(() => {
        if (messages.length > lastMessageCount) {
            // New message detected
            setShowNewMessageAlert(true);
            setTimeout(() => setShowNewMessageAlert(false), 3000);
            
            // Only auto-scroll if user hasn't manually scrolled up
            if (!userScrolledUp) {
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
        setLastMessageCount(messages.length);
    }, [messages, lastMessageCount, userScrolledUp]);

    // Real-time polling for new messages
    useEffect(() => {
        if (isPollingEnabled) {
            pollingIntervalRef.current = setInterval(() => {
                // Reload only messages data every 3 seconds
                router.reload({ 
                    only: ['messages'],
                    preserveState: true,
                    preserveScroll: false  // Don't preserve scroll to avoid jumping
                });
            }, 3000);
        } else {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        }
        
        // Cleanup interval on component unmount or when polling is disabled
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [thesis.id, isPollingEnabled]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Prevent spam submission
        if (isSubmitting || processing || !data.message.trim()) {
            return;
        }
        
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('thesis_id', data.thesis_id);
        formData.append('message', data.message);
        
        attachments.forEach((file, index) => {
            formData.append(`attachments[${index}]`, file);
        });

        router.post('/messages', formData, {
            onSuccess: () => {
                reset('message');
                setAttachments([]);
                setUserScrolledUp(false); // Reset scroll state after sending
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setAttachments([...attachments, ...files]);
    };

    const removeAttachment = (index) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    // Track scroll position to detect if user scrolled up
    const handleScroll = (e) => {
        const container = e.target;
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
        setUserScrolledUp(!isAtBottom);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getConversationPartner = () => {
        return auth.user.role === 'student' ? thesis.supervisor : thesis.student;
    };

    const toggleMessageOptions = (messageId) => {
        setShowOptions(prev => ({
            ...prev,
            [messageId]: !prev[messageId]
        }));
    };

    const deleteMessage = (messageId) => {
        if (confirm('Naozaj chcete vymazať túto správu?')) {
            router.delete(`/messages/${messageId}`, {
                onSuccess: () => {
                    setShowOptions({});
                }
            });
        }
    };

    const canEditDelete = (message) => {
        const now = new Date();
        const messageTime = new Date(message.created_at);
        const diffMinutes = (now - messageTime) / (1000 * 60);
        return message.sender_id === auth.user.id && diffMinutes <= 15;
    };

    const partner = getConversationPartner();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-wrap items-start sm:items-center gap-3 sm:gap-4 w-full min-w-0">
                    <Link 
                        href="/messages"
                        className="text-muted-foreground hover:text-foreground flex-shrink-0"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-base sm:text-xl text-card-foreground leading-tight truncate">
                                {thesis.title}
                            </h2>
                            <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${
                                    isPollingEnabled 
                                        ? 'bg-green-500 animate-pulse' 
                                        : 'bg-gray-400'
                                }`}></div>
                                <span className="text-xs text-muted-foreground">
                                    {isPollingEnabled ? 'Live' : 'Offline'}
                                </span>
                            </div>
                        </div>
                        {partner && (
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                Konverzácia s {partner.name} ({auth.user.role === 'student' ? 'Vedúci' : 'Študent'})
                            </p>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPollingEnabled(!isPollingEnabled)}
                        className="w-full sm:w-auto sm:ml-auto"
                    >
                        {isPollingEnabled ? 'Zastaviť Live' : 'Zapnúť Live'}
                    </Button>
                </div>
            }
        >
            <Head title={`Správy - ${thesis.title}`} />

            <div className="py-6">
                <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
                    {/* New message notification */}
                    {showNewMessageAlert && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg text-green-800 text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Nová správa príala!
                        </div>
                    )}
                    <Card className="relative">
                        <CardContent className="p-0">
                            {/* Scroll to bottom button */}
                            {userScrolledUp && (
                                <div className="absolute bottom-20 right-6 z-10">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                                            setUserScrolledUp(false);
                                        }}
                                        className="rounded-full shadow-lg"
                                    >
                                        ↓ Najnovšie správy
                                    </Button>
                                </div>
                            )}
                            {/* Messages container */}
                            <div 
                                ref={messagesContainerRef}
                                className="h-[54vh] sm:h-[60vh] min-h-[320px] sm:min-h-[460px] max-h-[72vh] overflow-y-auto p-3 sm:p-6 space-y-4 border-b border-border"
                                onScroll={handleScroll}
                            >
                            {messages.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">Zatiaľ žiadne správy. Začnite konverzáciu!</p>
                                </div>
                            ) : (
                                messages.map((message, index) => {
                                    const isOwn = message.sender_id === auth.user.id;
                                    const showDate = index === 0 || 
                                        format(new Date(message.created_at), 'yyyy-MM-dd') !== 
                                        format(new Date(messages[index - 1].created_at), 'yyyy-MM-dd');
                                    
                                    return (
                                        <div key={message.id}>
                                            {/* Date separator */}
                                            {showDate && (
                                                <div className="text-center my-4">
                                                    <span className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                                                        {format(new Date(message.created_at), 'dd. MMMM yyyy')}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {/* Message */}
                                            <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] sm:max-w-xs lg:max-w-md relative group ${
                                                    isOwn 
                                                        ? 'bg-primary text-primary-foreground' 
                                                        : 'bg-muted text-card-foreground'
                                                } rounded-lg px-4 py-2`}>
                                                    {/* Message options */}
                                                    {isOwn && canEditDelete(message) && (
                                                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => toggleMessageOptions(message.id)}
                                                                    className="bg-muted hover:bg-muted/80 rounded-full p-1"
                                                                >
                                                                    <EllipsisVerticalIcon className="h-4 w-4 text-muted-foreground" />
                                                                </button>
                                                                
                                                                {showOptions[message.id] && (
                                                                    <div className="absolute right-0 mt-1 w-24 bg-background rounded-md shadow-lg z-10 border border-border">
                                                                        <button
                                                                            onClick={() => deleteMessage(message.id)}
                                                                            className="block w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                                                                        >
                                                                            Vymazať
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Message content */}
                                                    <p className="break-words">{message.message}</p>
                                                    
                                                    {/* Attachments */}
                                                    {message.attachments && message.attachments.length > 0 && (
                                                        <div className="mt-2 space-y-1">
                                                            {message.attachments.map((attachment, attachIndex) => (
                                                                <a
                                                                    key={attachIndex}
                                                                    href={`/messages/${message.id}/download/${attachIndex}`}
                                                                    className={`flex items-center gap-2 p-2 rounded ${
                                                                        isOwn 
                                                                            ? 'bg-primary/80 hover:bg-primary' 
                                                                            : 'bg-muted/50 hover:bg-muted'
                                                                    } transition-colors`}
                                                                >
                                                                    <DocumentIcon className="h-4 w-4" />
                                                                    <span className="text-xs truncate flex-1">
                                                                        {attachment.name}
                                                                    </span>
                                                                    <span className="text-xs opacity-75">
                                                                        {formatFileSize(attachment.size)}
                                                                    </span>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                    
                                                    {/* Timestamp */}
                                                    <p className={`text-xs mt-1 ${
                                                        isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                                    }`}>
                                                        {format(new Date(message.created_at), 'HH:mm')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message input */}
                        <div className="p-3 sm:p-4">
                            {/* Attachment preview */}
                            {attachments.length > 0 && (
                                <div className="mb-3 space-y-2">
                                    <p className="text-sm text-muted-foreground">Prílohy:</p>
                                    {attachments.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded border border-border gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <DocumentIcon className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm text-card-foreground truncate">{file.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({formatFileSize(file.size)})
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    multiple
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                                />
                                
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-shrink-0 p-2"
                                >
                                    <PaperClipIcon className="h-5 w-5" />
                                </Button>
                                
                                <input
                                    type="text"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Napíšte správu..."
                                    className="min-w-0 flex-1 basis-[180px] border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                    disabled={processing || isSubmitting}
                                />
                                
                                <Button
                                    type="submit"
                                    disabled={processing || isSubmitting || !data.message.trim()}
                                    className="flex-shrink-0"
                                >
                                    {(processing || isSubmitting) ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <PaperAirplaneIcon className="h-5 w-5" />
                                    )}
                                </Button>
                            </form>
                            
                            {errors.message && (
                                <p className="mt-1 text-sm text-destructive">{errors.message}</p>
                            )}
                        </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}