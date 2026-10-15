import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Users, 
    FileText, 
    Calendar, 
    MessageSquare,
    Server,
    Database,
    Clock,
    Activity,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

export default function AdminSystem({ auth, stats, systemInfo, recentActivity, recentUsers = [] }) {
    const [mouse, setMouse] = useState({ x: 50, y: 22 });
    const safeStats = {
        total_users: stats?.total_users ?? 0,
        new_users_month: stats?.new_users_month ?? 0,
        total_theses: stats?.total_theses ?? 0,
        new_theses_month: stats?.new_theses_month ?? 0,
        total_appointments: stats?.total_appointments ?? 0,
        upcoming_appointments: stats?.upcoming_appointments ?? 0,
        total_messages: stats?.total_messages ?? 0,
        messages_today: stats?.messages_today ?? 0,
    };

    const safeSystemInfo = {
        php_version: systemInfo?.php_version ?? 'N/A',
        laravel_version: systemInfo?.laravel_version ?? 'N/A',
        environment: systemInfo?.environment ?? 'unknown',
        debug_mode: systemInfo?.debug_mode ?? false,
        uptime: systemInfo?.uptime ?? 0,
        database_type: systemInfo?.database_type ?? 'N/A',
        database_size: systemInfo?.database_size ?? 0,
        database_tables: systemInfo?.database_tables ?? 0,
        database_status: systemInfo?.database_status ?? 'warning',
    };

    const safeRecentActivity = Array.isArray(recentActivity) ? recentActivity : [];
    const safeRecentUsers = Array.isArray(recentUsers) ? recentUsers : [];

    const roleLabel = (role) => {
        const labels = {
            admin: 'Admin',
            supervisor: 'Školiteľ',
            student: 'Študent',
        };

        return labels[role] || role;
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatUptime = (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (days > 0) return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy':
                return 'bg-green-500/20 text-green-500 border-green-500/30';
            case 'warning':
                return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
            case 'error':
                return 'bg-red-500/20 text-red-500 border-red-500/30';
            default:
                return 'bg-muted/50 text-muted-foreground border-muted-foreground/30';
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'user_created':
                return <Users className="h-4 w-4" />;
            case 'thesis_created':
                return <FileText className="h-4 w-4" />;
            case 'appointment_scheduled':
                return <Calendar className="h-4 w-4" />;
            case 'message_sent':
                return <MessageSquare className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        setMouse({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Systémový monitoring</h2>
                    <p className="text-sm text-muted-foreground">
                        Prehľad stavu systému a výkonu
                    </p>
                </div>
            }
        >
            <Head title="Systémový monitoring" />

            <div
                className="ambient-page-shell page-enter-fade rounded-2xl border border-border/70 bg-card/55 backdrop-blur-md p-5 md:p-7"
                onMouseMove={handleMouseMove}
                style={{ '--mx': `${mouse.x}%`, '--my': `${mouse.y}%` }}
            >
                <div className="ambient-page-spotlight" />
                <div className="ambient-page-grid" />

                <div className="ambient-page-content space-y-6">
                {/* Systémové štatistiky */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 section-lift-in" style={{ animationDelay: '40ms' }}>
                    <Card className="card-hover-glow">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <div className="text-2xl font-bold text-foreground">
                                        {safeStats.total_users}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Celkom používateľov</div>
                                    <div className="flex items-center mt-1">
                                        <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                                        <span className="text-xs text-green-400">+{safeStats.new_users_month}</span>
                                    </div>
                                </div>
                                <Users className="h-8 w-8 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover-glow">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <div className="text-2xl font-bold text-foreground">
                                        {safeStats.total_theses}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Celkom práce</div>
                                    <div className="flex items-center mt-1">
                                        <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                                        <span className="text-xs text-green-400">+{safeStats.new_theses_month}</span>
                                    </div>
                                </div>
                                <FileText className="h-8 w-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover-glow">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <div className="text-2xl font-bold text-foreground">
                                        {safeStats.total_appointments}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Celkom termínov</div>
                                    <div className="flex items-center mt-1">
                                        <Clock className="h-3 w-3 text-blue-400 mr-1" />
                                        <span className="text-xs text-blue-400">{safeStats.upcoming_appointments} nadchádzajúcich</span>
                                    </div>
                                </div>
                                <Calendar className="h-8 w-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover-glow">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <div className="text-2xl font-bold text-foreground">
                                        {safeStats.total_messages}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Celkom správ</div>
                                    <div className="flex items-center mt-1">
                                        <Activity className="h-3 w-3 text-yellow-400 mr-1" />
                                        <span className="text-xs text-yellow-400">{safeStats.messages_today} dnes</span>
                                    </div>
                                </div>
                                <MessageSquare className="h-8 w-8 text-red-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Systémové informácie */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 section-lift-in" style={{ animationDelay: '90ms' }}>
                    <Card className="card-hover-glow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Server className="h-5 w-5" />
                                Systémové informácie
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">PHP verzia:</span>
                                <Badge variant="outline">{safeSystemInfo.php_version}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Laravel verzia:</span>
                                <Badge variant="outline">{safeSystemInfo.laravel_version}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Prostredie:</span>
                                <Badge className={safeSystemInfo.environment === 'production' ? 
                                    'bg-green-500/20 text-green-500' : 
                                    'bg-yellow-500/20 text-yellow-500'
                                }>
                                    {safeSystemInfo.environment}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Debug režim:</span>
                                <Badge className={safeSystemInfo.debug_mode ? 
                                    'bg-red-500/20 text-red-500' : 
                                    'bg-green-500/20 text-green-500'
                                }>
                                    {safeSystemInfo.debug_mode ? 'Zapnutý' : 'Vypnutý'}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Uptime:</span>
                                <span className="text-sm font-mono">{formatUptime(safeSystemInfo.uptime)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-hover-glow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Databázové informácie
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Typ databázy:</span>
                                <Badge variant="outline">{safeSystemInfo.database_type}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Veľkosť databázy:</span>
                                <span className="text-sm font-mono">{formatBytes(safeSystemInfo.database_size)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Počet tabuliek:</span>
                                <span className="text-sm font-mono">{safeSystemInfo.database_tables}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Stav pripojenia:</span>
                                <Badge className={getStatusColor(safeSystemInfo.database_status)}>
                                    {safeSystemInfo.database_status === 'healthy' ? 'Zdravé' : 
                                     safeSystemInfo.database_status === 'warning' ? 'Varovanie' : 'Chyba'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Nedávna aktivita */}
                <Card className="section-lift-in" style={{ animationDelay: '130ms' }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Nedávna aktivita
                        </CardTitle>
                        <CardDescription>
                            Posledných {safeRecentActivity.length} akcií v systéme
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {safeRecentActivity.length > 0 ? safeRecentActivity.map((activity, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 border border-border rounded-lg stagger-item card-hover-glow" style={{ animationDelay: `${170 + index * 50}ms` }}>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {activity.user_name} • {new Date(activity.created_at).toLocaleString('sk-SK')}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {activity.type.replace('_', ' ')}
                                    </Badge>
                                </div>
                            )) : (
                                <div className="text-center py-6 text-muted-foreground text-sm">
                                    Zatiaľ nie je dostupná žiadna aktivita.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="section-lift-in" style={{ animationDelay: '170ms' }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Nedávno vytvorení používatelia
                        </CardTitle>
                        <CardDescription>
                            Prechod na profil používateľa jedným klikom
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {safeRecentUsers.length > 0 ? safeRecentUsers.map((user, index) => (
                                <Link key={user.id} href={route('admin.users.edit', user.id)} className="block">
                                    <div className="flex items-center justify-between gap-3 p-3 border border-border rounded-lg hover:bg-muted/35 transition-colors stagger-item card-hover-glow" style={{ animationDelay: `${200 + index * 45}ms` }}>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="text-xs">{roleLabel(user.role)}</Badge>
                                            <p className="text-[11px] text-muted-foreground mt-1">{new Date(user.created_at).toLocaleDateString('sk-SK')}</p>
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <p className="text-sm text-muted-foreground text-center py-4">Zatiaľ nie sú dostupní žiadni používatelia.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Systémové upozornenia */}
                <Card className="section-lift-in" style={{ animationDelay: '210ms' }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                            Systémové upozornenia
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {safeSystemInfo.debug_mode && (
                                <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                    <div>
                                        <p className="text-sm font-medium text-red-500">Debug režim je zapnutý</p>
                                        <p className="text-xs text-red-400">V produkčnom prostredí by mal byť vypnutý</p>
                                    </div>
                                </div>
                            )}
                            
                            {safeSystemInfo.database_size > 1000000000 && (
                                <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-500">Veľká databáza</p>
                                        <p className="text-xs text-yellow-400">Databáza je väčšia ako 1GB, zvážte optimalizáciu</p>
                                    </div>
                                </div>
                            )}

                            {safeSystemInfo.uptime < 3600 && (
                                <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <AlertCircle className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-500">Nedávny reštart</p>
                                        <p className="text-xs text-blue-400">Systém bol nedávno reštartovaný</p>
                                    </div>
                                </div>
                            )}

                            {!safeSystemInfo.debug_mode && safeSystemInfo.environment === 'production' && safeSystemInfo.database_status === 'healthy' && safeSystemInfo.uptime > 3600 && (
                                <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <Activity className="h-5 w-5 text-green-500" />
                                    <div>
                                        <p className="text-sm font-medium text-green-500">Systém je v poriadku</p>
                                        <p className="text-xs text-green-400">Všetky systémové kontroly prešli úspešne</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}