import { cn } from '@/lib/utils';
import ApplicationLogo from '@/components/ApplicationLogo';
import CommandPalette from '@/components/CommandPalette';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Bell,
    Calendar,
    ChevronDown,
    GraduationCap,
    Home,
    FileText,
    MessageCircle,
    Settings,
    LogOut,
    User,
    Users,
    BarChart3,
    Search
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from '@/components/ui/sidebar';

export default function ModernLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const navCounts = usePage().props.navCounts || {};
    const navPreviews = usePage().props.navPreviews || {};
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Keyboard shortcut for search (Ctrl+K or Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Navigation items based on user role
    const getNavigationItems = () => {
        const items = [
            {
                title: 'Dashboard',
                url: route('dashboard'),
                icon: Home,
                isActive: route().current('dashboard'),
                show: true
            },
            {
                title: 'Témy',
                url: route('theses.index'),
                icon: GraduationCap,
                isActive: route().current('theses.*'),
                show: true
            },
            {
                title: 'Progres',
                url: route('progress.index'),
                icon: BarChart3,
                isActive: route().current('progress.*'),
                show: user.role === 'student' || user.role === 'supervisor'
            },
            {
                title: 'Úlohy',
                url: route('assignments.index'),
                icon: FileText,
                isActive: route().current('assignments.*'),
                show: user.role === 'student' || user.role === 'supervisor',
                badge: Number(navCounts.assignments || 0),
                previewKey: 'assignments'
            },
            
            {
                title: 'Správy',
                url: route('messages.index'),
                icon: MessageCircle,
                isActive: route().current('messages.*'),
                show: user.role === 'student' || user.role === 'supervisor',
                badge: Number(navCounts.messages || 0),
                previewKey: 'messages'
            },
            {
                title: 'Konzultácie',
                url: route('appointments.index'),
                icon: Calendar,
                isActive: route().current('appointments.*'),
                show: user.role === 'student' || user.role === 'supervisor',
                badge: Number(navCounts.appointments || 0),
                previewKey: 'appointments'
            },
            {
                title: 'Používatelia',
                url: route('admin.users'),
                icon: Users,
                isActive: route().current('admin.users*'),
                show: user.role === 'admin'
            },
            {
                title: 'Systém',
                url: route('admin.system'),
                icon: Settings,
                isActive: route().current('admin.system'),
                show: user.role === 'admin'
            },
            {
                title: 'Reporty',
                url: route('admin.reports'),
                icon: FileText,
                isActive: route().current('admin.reports'),
                show: user.role === 'admin'
            }
        ];

        return items.filter(item => item.show);
    };

    const getPreviewHref = (item, previewItem) => {
        if (item.previewKey === 'assignments') {
            return route('assignments.show', previewItem.id);
        }

        if (item.previewKey === 'messages') {
            return route('messages.index', { thesis_id: previewItem.thesis_id });
        }

        if (item.previewKey === 'appointments') {
            return route('appointments.show', previewItem.id);
        }

        return item.url;
    };

    const renderPreviewPanel = (item) => {
        if (!item.previewKey) return null;

        const previews = navPreviews[item.previewKey] || [];

        return (
            <div className="pointer-events-none absolute left-full top-0 z-50 hidden w-80 pl-2 group-hover/navitem:block">
                <div className="pointer-events-auto rounded-lg border border-border/80 bg-card/95 p-2 text-card-foreground shadow-xl backdrop-blur-sm">
                    <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">Rýchly náhľad</p>
                    <div className="space-y-1">
                        {previews.length > 0 ? (
                            previews.map((previewItem) => (
                                <Link
                                    key={`${item.previewKey}-${previewItem.id}`}
                                    href={getPreviewHref(item, previewItem)}
                                    className="block rounded-md px-2 py-2 hover:bg-accent/70"
                                >
                                    <p className="truncate text-sm font-medium">{previewItem.title}</p>
                                    {previewItem.subtitle && (
                                        <p className="truncate text-xs text-muted-foreground">{previewItem.subtitle}</p>
                                    )}
                                </Link>
                            ))
                        ) : (
                            <div className="px-2 py-2 text-xs text-muted-foreground">Žiadne položky na rýchly výber.</div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-destructive/20 text-destructive border-destructive/30';
            case 'supervisor':
                return 'bg-chart-2/20 text-chart-2 border-chart-2/30';
            case 'student':
                return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
            default:
                return 'bg-muted/50 text-muted-foreground border-muted-foreground/30';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin':
                return 'Admin';
            case 'supervisor':
                return 'Školiteľ';
            case 'student':
                return 'Študent';
            default:
                return role;
        }
    };

    const getNotificationTone = (type) => {
        if (type === 'appointment_reschedule_proposed' || type === 'appointment_counterproposal') {
            return {
                dot: 'bg-violet-400',
                row: 'hover:bg-violet-500/10',
            };
        }

        if (type === 'appointment_proposed' || type === 'appointment_confirmed') {
            return {
                dot: 'bg-cyan-400',
                row: 'hover:bg-cyan-500/10',
            };
        }

        if (type === 'appointment_rejected') {
            return {
                dot: 'bg-red-400',
                row: 'hover:bg-red-500/10',
            };
        }

        if (type?.startsWith('assignment_')) {
            return {
                dot: 'bg-emerald-400',
                row: 'hover:bg-emerald-500/10',
            };
        }

        return {
            dot: 'bg-primary',
            row: 'hover:bg-accent/70',
        };
    };

    const AppSidebar = () => (
        <Sidebar className="border-r-0">
            <SidebarHeader className="border-b border-sidebar-border bg-sidebar-background/50">
                <Link href="/" className="flex items-center gap-3 px-4 py-4 hover:bg-sidebar-accent/50 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-sidebar-foreground">
                            Thesis Manager
                        </span>
                        <span className="text-xs text-sidebar-foreground/60">
                            Správa bakalárskych prác
                        </span>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-2 overflow-visible">
                <SidebarMenu className="space-y-2 py-4">
                    {getNavigationItems().map((item) => (
                        <SidebarMenuItem key={item.title} className="relative group/navitem">
                            <SidebarMenuButton
                                asChild
                                isActive={item.isActive}
                                className="w-full justify-between px-3 py-3 text-sm font-medium transition-colors"
                            >
                                <Link href={item.url}>
                                    <div className="flex items-center gap-3">
                                        <item.icon className="h-4 w-4" />
                                        {item.title}
                                    </div>
                                    {item.badge > 0 && (
                                        <Badge 
                                            variant="secondary" 
                                            className="ml-auto min-w-5 h-5 px-1.5 justify-center rounded-full bg-primary/10 text-primary text-xs font-medium"
                                        >
                                            {item.badge > 99 ? '99+' : item.badge}
                                        </Badge>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                            {renderPreviewPanel(item)}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton 
                                    size="lg" 
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user.name}</span>
                                        <span className="truncate text-xs">{user.email}</span>
                                    </div>
                                    <ChevronDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border border-border/80 bg-card/95 text-card-foreground backdrop-blur-sm shadow-xl"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user.name}</span>
                                            <Badge className={cn("mt-1 w-fit", getRoleBadgeColor(user.role))}>
                                                {getRoleLabel(user.role)}
                                            </Badge>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="cursor-pointer focus:bg-accent/70 focus:text-accent-foreground">
                                    <Link href={route('profile.edit')} className="cursor-pointer">
                                        <Settings className="h-4 w-4" />
                                        Nastavenia profilu
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="cursor-pointer focus:bg-destructive/20 focus:text-destructive">
                                    <Link 
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full cursor-pointer text-red-300"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Odhlásiť sa
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );

    return (
        <div className="dark">
            <SidebarProvider>
                <div className="flex h-screen w-full overflow-hidden">
                    <AppSidebar />
                    <SidebarInset className="flex-1 flex flex-col min-w-0">
                        {/* Top Navigation Bar */}
                        <header className="flex min-h-16 sm:h-20 shrink-0 items-start sm:items-center justify-between border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-0">
                            <div className="flex items-start sm:items-center gap-2 sm:gap-4 min-w-0 flex-1">
                                <SidebarTrigger className="-ml-1 text-foreground hover:bg-accent flex-shrink-0 p-2" />
                                <Separator orientation="vertical" className="mr-1 sm:mr-3 h-6 flex-shrink-0" />
                                {header && (
                                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                        {header}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-3 pt-0.5 sm:pt-0">
                                {/* Search */}
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsSearchOpen(true)}
                                    className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/70 hover:border-border transition-colors h-10 px-3"
                                >
                                    <Search className="h-4 w-4" />
                                    <span className="text-sm">Vyhľadať...</span>
                                    <kbd className="hidden lg:inline-flex h-5 px-1.5 items-center gap-1 rounded bg-muted font-mono text-xs text-muted-foreground">
                                        <span className="text-xs">Ctrl</span>K
                                    </kbd>
                                </Button>

                                {/* Search icon for mobile */}
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setIsSearchOpen(true)}
                                    className="sm:hidden hover:bg-accent/70 hover:text-foreground text-foreground h-10 w-10 transition-colors"
                                >
                                    <Search className="h-5 w-5" />
                                </Button>

                                {/* Notifications */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="relative hover:bg-accent text-foreground h-10 w-10">
                                            <Bell className="h-5 w-5" />
                                            {user.notifications && user.notifications.length > 0 && (
                                                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-background" />
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[calc(100vw-1rem)] max-w-[22rem] sm:w-80 border border-border/80 bg-card/95 backdrop-blur-sm text-card-foreground shadow-xl">
                                        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                                            <span className="font-semibold text-sm">Notifikácie</span>
                                            {user.notifications && user.notifications.length > 0 && (
                                                <Link
                                                    href={route('notifications.read-all')}
                                                    method="post"
                                                    as="button"
                                                    className="text-xs text-primary hover:text-primary/80 font-medium"
                                                >
                                                    Označiť všetko ako prečítané
                                                </Link>
                                            )}
                                        </div>
                                        <div className="max-h-[70vh] overflow-y-auto">
                                            {!user.notifications || user.notifications.length === 0 ? (
                                                <div className="p-8 text-center text-sm text-muted-foreground">
                                                    Žiadne nové notifikácie
                                                </div>
                                            ) : (
                                                user.notifications.map((notification) => {
                                                    const tone = getNotificationTone(notification.data?.type);

                                                    return (
                                                        <Link
                                                            key={notification.id}
                                                            href={route('notifications.read', notification.id)}
                                                            method="post"
                                                            as="button"
                                                            className={`w-full text-left p-4 transition-colors border-b border-border/70 last:border-0 group ${tone.row}`}
                                                        >
                                                            <div className="flex gap-3">
                                                                <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 group-hover:scale-110 transition-transform ${tone.dot}`} />
                                                                <div className="space-y-1 min-w-0">
                                                                    {notification.data?.title && (
                                                                        <p className="text-sm font-semibold leading-normal truncate">
                                                                            {notification.data.title}
                                                                        </p>
                                                                    )}
                                                                    <p className="text-sm leading-normal text-muted-foreground">
                                                                        {notification.data?.message || 'Máte novú notifikáciu.'}
                                                                    </p>
                                                                    {notification.data?.meta && (
                                                                        <p className="text-xs text-muted-foreground/80 truncate">
                                                                            {notification.data.meta}
                                                                        </p>
                                                                    )}
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {notification.created_at}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </header>

                        {/* Main Content */}
                        <main className="flex-1 overflow-y-auto bg-background">
                            <div className="p-3 sm:p-4 md:p-6">
                                {children}
                            </div>
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>

            {/* Command Palette */}
            <CommandPalette 
                open={isSearchOpen} 
                onClose={() => setIsSearchOpen(false)} 
            />
        </div>
    );
}

