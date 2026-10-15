import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    FileText, 
    Calendar,
    PieChart,
    Activity,
    Download
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function AdminReports({ 
    auth, 
    monthlyStats = [], 
    roleDistribution = [], 
    recentMetrics = [], 
    popularTopics = [],
    recentUsers = [] 
}) {
    const [mouse, setMouse] = useState({ x: 50, y: 22 });

    const months = [
        'Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún',
        'Júl', 'August', 'September', 'Október', 'November', 'December'
    ];

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin':
                return 'text-red-400';
            case 'supervisor':
                return 'text-purple-400';
            case 'student':
                return 'text-green-400';
            default:
                return 'text-blue-400';
        }
    };

    const getMetricIcon = (type) => {
        switch (type) {
            case 'users':
                return <Users className="h-5 w-5" />;
            case 'theses':
                return <FileText className="h-5 w-5" />;
            case 'appointments':
                return <Calendar className="h-5 w-5" />;
            default:
                return <Activity className="h-5 w-5" />;
        }
    };

    const getMaxValue = (data, key) => {
        return Math.max(...data.map(item => item[key] || 0));
    };

    const getPercentage = (value, max) => {
        return max > 0 ? (value / max) * 100 : 0;
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
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Reporty a analytika</h2>
                        <p className="text-sm text-muted-foreground">
                            Analýza používania systému a trendy
                        </p>
                    </div>
                    <div className="flex gap-2" />
                </div>
            }
        >
            <Head title="Reporty a analytika" />

            <div
                className="ambient-page-shell page-enter-fade rounded-2xl border border-border/70 bg-card/55 backdrop-blur-md p-5 md:p-7"
                onMouseMove={handleMouseMove}
                style={{ '--mx': `${mouse.x}%`, '--my': `${mouse.y}%` }}
            >
                <div className="ambient-page-spotlight" />
                <div className="ambient-page-grid" />

                <div className="ambient-page-content space-y-6">
                {/* Analytika používateľov */}
                <Card className="section-lift-in card-hover-glow" style={{ animationDelay: '20ms' }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Analytika používateľov
                        </CardTitle>
                        <CardDescription>
                            Mesačný prírastok a trend registrácií
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {monthlyStats && monthlyStats.length > 0 ? (
                        <div className="h-[28rem]">
                            <Bar
                                data={{
                                    labels: monthlyStats.map(month => `${months[month.month - 1]} ${month.year}`),
                                    datasets: [
                                        {
                                            label: 'Noví používatelia',
                                            data: monthlyStats.map(month => month.users || 0),
                                            backgroundColor: 'rgba(59, 130, 246, 0.65)',
                                            borderColor: 'rgba(59, 130, 246, 0.9)',
                                            borderWidth: 1,
                                            borderRadius: 8,
                                            maxBarThickness: 36,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => ` ${context.parsed.y} používateľov`,
                                            },
                                        },
                                    },
                                    scales: {
                                        x: {
                                            ticks: {
                                                color: 'rgba(255, 255, 255, 0.85)',
                                                maxRotation: 30,
                                                minRotation: 0,
                                            },
                                            grid: {
                                                color: 'rgba(255, 255, 255, 0.08)',
                                            },
                                        },
                                        y: {
                                            ticks: {
                                                color: 'rgba(255, 255, 255, 0.85)',
                                            },
                                            grid: {
                                                color: 'rgba(255, 255, 255, 0.08)',
                                            },
                                            beginAtZero: true,
                                        },
                                    },
                                }}
                            />
                        </div>
                        ) : (
                        <div className="h-[28rem] flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>Žiadne dáta pre zobrazenie grafu používateľov</p>
                            </div>
                        </div>
                        )}
                    </CardContent>
                </Card>

                {/* Aktuálne metriky */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 section-lift-in" style={{ animationDelay: '40ms' }}>
                    {recentMetrics && recentMetrics.length > 0 ? recentMetrics.map((metric, index) => (
                        <Card key={index} className="stagger-item card-hover-glow" style={{ animationDelay: `${80 + index * 45}ms` }}>
                            <CardContent className="pt-6">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <div className="text-2xl font-bold text-foreground">
                                            {metric.current_value}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {metric.type === 'theses' ? 'Záverečné práce' : metric.label}
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <TrendingUp className={`h-3 w-3 mr-1 ${
                                                metric.change >= 0 ? 'text-green-400' : 'text-red-400'
                                            }`} />
                                            <span className={`text-xs ${
                                                metric.change >= 0 ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                {metric.change >= 0 ? '+' : ''}{metric.change}% tento mesiac
                                            </span>
                                        </div>
                                    </div>
                                    <div className={getRoleColor(metric.type)}>
                                        {getMetricIcon(metric.type)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )) : (
                        <Card className="col-span-3 card-hover-glow">
                            <CardContent className="pt-6">
                                <div className="text-center text-muted-foreground">
                                    Načítavajú sa metriky...
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 section-lift-in" style={{ animationDelay: '140ms' }}>
                    {/* Rozloženie rolí */}
                    <Card className="card-hover-glow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5" />
                                Rozloženie používateľov
                            </CardTitle>
                            <CardDescription>
                                Rozdelenie podľa rolí v systéme
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {roleDistribution && roleDistribution.length > 0 ? (
                            <>
                                <div className="h-96 flex items-center justify-center">
                                    <div className="w-full max-w-md">
                                        <Doughnut 
                                            data={{
                                                labels: roleDistribution.map(role => 
                                                    role.role === 'admin' ? 'Administrátori' :
                                                    role.role === 'supervisor' ? 'Školiteľia' : 'Študenti'
                                                ),
                                                datasets: [{
                                                    data: roleDistribution.map(role => role.count),
                                                    backgroundColor: [
                                                        'rgba(248, 113, 113, 0.8)', // red for admin
                                                        'rgba(196, 181, 253, 0.8)', // purple for supervisor  
                                                        'rgba(74, 222, 128, 0.8)'   // green for student
                                                    ],
                                                    borderColor: [
                                                        'rgb(248, 113, 113)',
                                                        'rgb(196, 181, 253)', 
                                                        'rgb(74, 222, 128)'
                                                    ],
                                                    borderWidth: 2
                                                }]
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                cutout: '62%',
                                                plugins: {
                                                    legend: {
                                                        position: 'bottom',
                                                        labels: {
                                                            color: 'rgba(255, 255, 255, 0.9)',
                                                            usePointStyle: true,
                                                            padding: 16
                                                        }
                                                    },
                                                    tooltip: {
                                                        callbacks: {
                                                            label: (context) => {
                                                                const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
                                                                const value = context.raw || 0;
                                                                const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                                                return `${context.label}: ${value} (${percent}%)`;
                                                            }
                                                        }
                                                    },
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                {/* Statistics below chart */}
                                <div className="mt-4 space-y-2">
                                    {roleDistribution.map((role, index) => {
                                        const total = roleDistribution.reduce((sum, r) => sum + r.count, 0);
                                        const percentage = total > 0 ? ((role.count / total) * 100).toFixed(1) : 0;

                                        return (
                                            <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted/20">
                                                <span className="text-sm font-medium text-foreground">
                                                    {role.role === 'admin' ? 'Administrátori' :
                                                     role.role === 'supervisor' ? 'Školiteľia' : 'Študenti'}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-foreground">{role.count}</span>
                                                    <Badge variant="secondary" className="text-xs">{percentage}%</Badge>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                            ) : (
                            <div className="h-80 flex items-center justify-center">
                                <div className="text-center text-muted-foreground">
                                    <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>Žiadne dáta pre graf rolí</p>
                                </div>
                            </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Populárne témy */}
                    <Card className="card-hover-glow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Populárne témy prác
                            </CardTitle>
                            <CardDescription>
                                Najčastejšie témy diplomových prác
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {popularTopics && popularTopics.length > 0 ? popularTopics.map((topic, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg stagger-item card-hover-glow" style={{ animationDelay: `${180 + index * 45}ms` }}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {topic.topic}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {topic.supervisor_name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="secondary" className="text-xs">
                                                {topic.count} prác
                                            </Badge>
                                        </div>
                                    </div>
                                )) : (
                                <div className="text-center text-muted-foreground py-8">
                                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>Žiadne populárne témy</p>
                                </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="section-lift-in" style={{ animationDelay: '180ms' }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Nedávno vytvorení používatelia
                        </CardTitle>
                        <CardDescription>
                            Nové účty a rýchle otvorenie profilu
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                            {recentUsers && recentUsers.length > 0 ? recentUsers.map((user, index) => (
                                <Link key={user.id} href={route('admin.users.edit', user.id)} className="block">
                                    <div className="rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors stagger-item card-hover-glow" style={{ animationDelay: `${220 + index * 45}ms` }}>
                                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate mt-1">{user.email}</p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <Badge variant="outline" className="text-xs">
                                                {user.role === 'admin' ? 'Admin' : user.role === 'supervisor' ? 'Školiteľ' : 'Študent'}
                                            </Badge>
                                            <span className="text-[11px] text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString('sk-SK')}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <div className="md:col-span-2 xl:col-span-3 text-center text-muted-foreground text-sm py-6">
                                    Zatiaľ neboli vytvorení žiadni noví používatelia.
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