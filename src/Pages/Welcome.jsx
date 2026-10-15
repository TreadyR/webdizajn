import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { 
    GraduationCap, 
    Calendar, 
    FileText, 
    MessageCircle, 
    ArrowRight,
    Users,
    Clock,
    CheckCircle,
    BarChart3,
    ShieldCheck,
    Search,
    Bell,
    Layers,
    Eye,
    MessageSquareText
} from 'lucide-react';

export default function Welcome({ auth }) {
    const isLoggedIn = !!auth?.user;
    const [scrollY, setScrollY] = useState(0);
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
    const [isCompact, setIsCompact] = useState(false);

    const guestSecondaryHref = route('login');

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY || 0);
        const handleMouseMove = (event) => {
            const x = (event.clientX / window.innerWidth - 0.5) * 14;
            const y = (event.clientY / window.innerHeight - 0.5) * 12;
            setMouseOffset({ x, y });
        };
        const handleResize = () => setIsCompact(window.innerWidth < 640);

        handleScroll();
        handleResize();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const heroMotion = useMemo(() => ({
        cardTransform: `translate3d(${mouseOffset.x * 0.35}px, ${mouseOffset.y * 0.35 + scrollY * -0.06}px, 0) rotateX(${mouseOffset.y * -0.08}deg) rotateY(${mouseOffset.x * 0.08}deg)`,
        imageTransform: `translate3d(${mouseOffset.x * -0.45}px, ${scrollY * -0.14}px, 0) scale(1.05)`,
        orbA: `translate3d(${mouseOffset.x * -0.5}px, ${scrollY * -0.08}px, 0)`,
        orbB: `translate3d(${mouseOffset.x * 0.42}px, ${scrollY * 0.05}px, 0)`,
    }), [mouseOffset.x, mouseOffset.y, scrollY]);

    const quickLinks = [
        {
            title: 'Dashboard',
            description: 'Rýchly vstup do personalizovaného prehľadu',
            icon: BarChart3,
            href: isLoggedIn ? route('dashboard') : guestSecondaryHref,
            cta: 'Otvoriť dashboard',
            tag: 'Prehľad',
            hints: ['Metriky v reálnom čase', 'Roly a notifikácie'],
            tone: 'from-cyan-500/15 via-cyan-500/5 to-card',
        },
        {
            title: 'Témy prác',
            description: 'Zoznam tém, priradenia študentov a stavy riešenia',
            icon: GraduationCap,
            href: isLoggedIn ? route('theses.index') : guestSecondaryHref,
            cta: 'Prejsť na témy',
            tag: 'Zadania',
            hints: ['Filter podľa stavu', 'Prehľad školiteľov'],
            tone: 'from-emerald-500/15 via-emerald-500/5 to-card',
        },
        {
            title: 'Úlohy a hodnotenie',
            description: 'Zadávanie úloh, odovzdania, spätná väzba a prílohy',
            icon: FileText,
            href: isLoggedIn ? route('assignments.index') : guestSecondaryHref,
            cta: 'Prejsť na úlohy',
            tag: 'Hodnotenie',
            hints: ['Schválenie/vrátenie', 'História odovzdaní'],
            tone: 'from-amber-500/15 via-amber-500/5 to-card',
        },
        {
            title: 'Kontrolovanie progresu',
            description: 'Priebeh práce, fázy, termíny a dokončenie etáp',
            icon: Layers,
            href: isLoggedIn ? route('progress.index') : guestSecondaryHref,
            cta: 'Zobraziť progres',
            tag: 'Timeline',
            hints: ['Milníky práce', 'Rizikové termíny'],
            tone: 'from-violet-500/15 via-violet-500/5 to-card',
        },
        {
            title: 'Správy',
            description: 'Komunikácia medzi študentom a školiteľom v kontexte témy',
            icon: MessageCircle,
            href: isLoggedIn ? route('messages.index') : guestSecondaryHref,
            cta: 'Otvoriť komunikáciu',
            tag: 'Komunikácia',
            hints: ['Kontext k téme', 'Rýchla spätná väzba'],
            tone: 'from-blue-500/15 via-blue-500/5 to-card',
        },
        {
            title: 'Konzultácie',
            description: 'Plánovanie stretnutí, agenda a stav konzultácií',
            icon: Calendar,
            href: isLoggedIn ? route('appointments.index') : guestSecondaryHref,
            cta: 'Prejsť na konzultácie',
            tag: 'Plánovanie',
            hints: ['Termíny a agenda', 'Stav stretnutí'],
            tone: 'from-rose-500/15 via-rose-500/5 to-card',
        },
    ];

    const benefitBlocks = [
        {
            title: 'Centralizácia procesu',
            lead: 'Všetky kľúčové kroky vedenia práce sú na jednom mieste.',
            detail: 'Téma, úlohy, hodnotenie, konzultácie aj komunikácia sú naviazané na jednu líniu práce, takže sa nestráca kontext medzi nástrojmi.',
            icon: Layers,
        },
        {
            title: 'Transparentný stav práce',
            lead: 'Každá zmena má jasný stav a zodpovednosť.',
            detail: 'Študent aj školiteľ okamžite vidia, čo je rozpracované, čo čaká na schválenie a čo bolo vrátené na dopracovanie.',
            icon: Eye,
        },
        {
            title: 'Kontrolovanie progresu',
            lead: 'Milníky, termíny a priebežné výsledky sú priehľadne vizualizované.',
            detail: 'Systém pomáha odhaliť oneskorenia včas a znižuje riziko kumulácie problémov pred finálnym odovzdaním.',
            icon: BarChart3,
        },
        {
            title: 'Kontextová komunikácia',
            lead: 'Správy a spätná väzba sú naviazané na konkrétnu prácu.',
            detail: 'Diskusia ostáva prehľadná, pretože každá poznámka či rozhodnutie je uložené tam, kde vzniklo.',
            icon: MessageSquareText,
        },
    ];

    const workflowSteps = [
        {
            step: '01',
            title: 'Pridelenie témy',
            description: 'Študent si vyberie alebo dostane tému a nastaví sa základný rámec riešenia.',
            output: 'Založený pracovný priestor pre konkrétnu tému',
            icon: GraduationCap,
        },
        {
            step: '02',
            title: 'Kontrolovanie progresu',
            description: 'Definujú sa míľniky, plán a pravidelné body kontroly priebehu práce.',
            output: 'Jasná časová os a merateľný progres',
            icon: Clock,
        },
        {
            step: '03',
            title: 'Zadanie úloh',
            description: 'Školiteľ pridáva konkrétne úlohy s termínmi, prioritou a očakávaným výstupom.',
            output: 'Štruktúrovaný plán vykonateľných krokov',
            icon: FileText,
        },
        {
            step: '04',
            title: 'Odovzdanie a feedback',
            description: 'Študent odovzdáva výstupy, školiteľ hodnotí a vracia konkrétnu spätnú väzbu.',
            output: 'Iteračné zlepšovanie kvality práce',
            icon: MessageCircle,
        },
        {
            step: '05',
            title: 'Progres a konzultácie',
            description: 'Priebežné konzultácie uzatvárajú otvorené body a pripravujú ďalšie kroky.',
            output: 'Kontinuálny dohľad až po finálne odovzdanie',
            icon: Calendar,
        },
    ];

    return (
        <>
            <Head title="Thesis Manager - Správa bakalárskych prác" />
            
            <div className="dark bg-background text-foreground">
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-[-12rem] top-[-10rem] h-[26rem] w-[26rem] rounded-full bg-emerald-500/15 blur-3xl" />
                <div className="absolute right-[-10rem] top-[18rem] h-[22rem] w-[22rem] rounded-full bg-cyan-500/15 blur-3xl" />
                <div className="absolute bottom-[-10rem] left-1/3 h-[20rem] w-[20rem] rounded-full bg-amber-500/12 blur-3xl" />
            </div>
            
            {/* Navigation */}
            <nav className="border-b border-border bg-card/50 backdrop-blur">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex justify-between items-center">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base sm:text-lg font-bold text-foreground">
                                        Thesis Manager
                                    </span>
                                    <span className="hidden sm:block text-xs text-muted-foreground">
                                        Správa bakalárskych prác
                                    </span>
                                </div>
                            </Link>

                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
                                <a href="#moduly" className="hidden lg:inline text-sm text-muted-foreground hover:text-foreground transition-colors">Moduly</a>
                                <a href="#workflow" className="hidden lg:inline text-sm text-muted-foreground hover:text-foreground transition-colors">Workflow</a>
                                <a href="#prinosy" className="hidden lg:inline text-sm text-muted-foreground hover:text-foreground transition-colors">Prínosy</a>

                                {isLoggedIn ? (
                                    <Link href={route('dashboard')}>
                                        <Button size="sm" className="sm:size-default bg-primary text-primary-foreground hover:bg-primary/90">
                                            Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2 flex-wrap justify-end">
                                        <Link href={guestSecondaryHref}>
                                            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                                                Prihlásiť sa
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-5 gap-8 items-stretch">
                        <div
                            className="xl:col-span-3 relative rounded-2xl border border-border/70 bg-gradient-to-br from-card/95 via-card/90 to-muted/35 p-5 sm:p-8 md:p-10 shadow-2xl overflow-hidden"
                            style={{
                                transform: isCompact ? 'none' : heroMotion.cardTransform,
                                transition: isCompact ? 'none' : 'transform 280ms ease-out',
                                transformStyle: isCompact ? 'flat' : 'preserve-3d',
                            }}
                        >
                            <div
                                className="pointer-events-none absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: "url('/images/student-hero.svg')",
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right -2rem bottom -1.5rem',
                                    backgroundSize: 'min(65%, 560px)',
                                    transform: isCompact ? 'none' : heroMotion.imageTransform,
                                    transition: isCompact ? 'none' : 'transform 280ms ease-out',
                                }}
                            />
                            <div
                                className="pointer-events-none absolute -left-24 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl"
                                style={{ transform: isCompact ? 'none' : heroMotion.orbA, transition: isCompact ? 'none' : 'transform 260ms ease-out' }}
                            />
                            <div
                                className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
                                style={{ transform: isCompact ? 'none' : heroMotion.orbB, transition: isCompact ? 'none' : 'transform 260ms ease-out' }}
                            />

                            <Badge className="mb-4 bg-primary/15 text-primary border border-primary/30">Informačný systém pre záverečné práce</Badge>
                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
                                Thesis Manager
                                <span className="block text-primary">od témy po hodnotenie</span>
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-5 sm:mt-6 max-w-3xl">
                                Webová platforma, ktorá centralizuje riadenie bakalárskych a diplomových prác.
                                Prepája študenta, školiteľa a administrátora v jednom workflow: téma, kontrolovanie progresu, úlohy,
                                odovzdania, komunikácia, plánovanie konzultácií a notifikácie.
                            </p>

                            <div className="mt-6 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-200">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-base md:text-lg font-semibold text-cyan-100">Plánovanie konzultácií je jadro spolupráce</p>
                                        <p className="text-sm text-cyan-100/85 mt-1">
                                            Systém umožňuje plánovať termíny, pridávať agendu stretnutí, sledovať stav konzultácií
                                            a prepájať ich s konkrétnou témou aj úlohami.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {isLoggedIn ? (
                                    <Link href={route('dashboard')}>
                                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                            Prejsť do systému
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={guestSecondaryHref}>
                                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                                Prihlásiť sa do systému
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        </Link>
                                        <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-accent" disabled>
                                            Účet vytvára administrátor
                                        </Button>
                                    </>
                                )}
                            </div>

                            <div className="relative mt-8 flex flex-wrap gap-3">
                                <Badge className="bg-background/75 text-foreground border-border/60">Parallax hero</Badge>
                                <Badge className="bg-background/75 text-foreground border-border/60">Dynamické vrstvy</Badge>
                                <Badge className="bg-background/75 text-foreground border-border/60">Rýchla orientácia</Badge>
                            </div>
                        </div>

                        <div className="xl:col-span-2 grid grid-cols-1 gap-4">
                            <Card className="border-border/70 bg-card/80">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Bezpečnosť a roly</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    Každý používateľ vidí len to, čo má podľa role. Kontrola prístupov je riešená na úrovni backendu.
                                </CardContent>
                            </Card>

                            <Card className="border-border/70 bg-card/80">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2"><Search className="h-4 w-4 text-primary" /> Prehľad a dohľadateľnosť</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    História úloh, správ a rozhodnutí školiteľa je centralizovaná, čo zjednodušuje kontrolu procesu.
                                </CardContent>
                            </Card>

                            <Card className="border-border/70 bg-card/80">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> Notifikácie a termíny</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    Upozornenia na nové zadania, hodnotenie a zmeny stavu minimalizujú riziko zmeškaných termínov.
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section id="prinosy" className="py-8 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card/85 via-card/65 to-muted/35 p-6 md:p-8">
                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                                <div className="xl:col-span-4">
                                    <Badge className="mb-3 bg-primary/15 text-primary border border-primary/30">Prečo tento systém</Badge>
                                    <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">Jednotné prostredie pre celý životný cyklus práce</h2>
                                    <p className="mt-3 text-muted-foreground leading-relaxed">
                                        Namiesto prepínania medzi viacerými nástrojmi má tím jedno miesto, kde je viditeľný stav práce,
                                        rozhodnutia školiteľa aj plán ďalších krokov. Výsledkom je menej chaosu a viac kontinuity.
                                    </p>
                                </div>

                                <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {benefitBlocks.map((benefit) => {
                                        const Icon = benefit.icon;

                                        return (
                                            <Card key={benefit.title} className="border-border/70 bg-card/75 hover:border-primary/35 transition-colors">
                                                <CardContent className="p-5">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                                                            <Icon className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-foreground">{benefit.title}</p>
                                                            <p className="mt-1 text-sm text-foreground/90">{benefit.lead}</p>
                                                            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{benefit.detail}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Workflow */}
                <section id="workflow" className="py-10 sm:py-12 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8 max-w-3xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Ako systém funguje</h2>
                            <p className="text-muted-foreground mt-2 leading-relaxed">
                                Workflow je navrhnutý ako praktický cyklus spolupráce medzi študentom a školiteľom.
                                Každý krok má jasný cieľ, výstup a nadväznosť na ďalšiu fázu, pričom plánovanie konzultácií
                                slúži ako priebežný koordinačný bod počas celého semestra.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {workflowSteps.map(({ step, title, description, output, icon: Icon }) => (
                                <Card key={step} className="border-border/70 bg-card/75">
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold tracking-wide text-primary">KROK {step}</span>
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <p className="mt-3 font-medium text-sm leading-relaxed text-foreground">{title}</p>
                                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
                                        <div className="mt-3 rounded-md border border-border/70 bg-background/70 px-2.5 py-2 text-[11px] text-muted-foreground">
                                            Výstup: {output}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Modules with deep links */}
                <section id="moduly" className="py-10 sm:py-12 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Moduly systému</h2>
                            <p className="text-lg text-muted-foreground">
                                Preklikni sa na konkrétne časti aplikácie a pokračuj v práci.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {quickLinks.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Card key={item.title} className={`group overflow-hidden border-border/80 bg-gradient-to-br ${item.tone} transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-black/20`}>
                                        <CardHeader className="pb-2 space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/12 text-primary transition-transform duration-300 group-hover:scale-105">
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <Badge variant="secondary" className="mb-1 bg-background/80 text-[11px] uppercase tracking-wide text-muted-foreground border-border/70">
                                                            {item.tag}
                                                        </Badge>
                                                        <CardTitle className="text-foreground text-lg leading-tight">{item.title}</CardTitle>
                                                    </div>
                                                </div>
                                                <ArrowRight className="h-4 w-4 mt-1 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1" />
                                            </div>
                                            <CardDescription className="text-muted-foreground leading-relaxed min-h-[52px]">
                                                {item.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex flex-wrap gap-2">
                                                {item.hints.map((hint) => (
                                                    <span key={hint} className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-[11px] text-muted-foreground">
                                                        {hint}
                                                    </span>
                                                ))}
                                            </div>
                                            <Link href={item.href}>
                                                <Button variant="outline" className="w-full justify-between border-border/80 bg-background/75 group-hover:bg-background/90">
                                                    {item.cta}
                                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {!isLoggedIn && (
                            <div className="mt-8 rounded-xl border border-border/70 bg-card/70 px-4 py-3 text-center text-sm text-muted-foreground">
                                Prihlásiť sa pre využitie funkcií.
                                <Link href={guestSecondaryHref} className="ml-2 text-primary hover:underline font-medium">
                                    Prejsť na prihlásenie
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Roles */}
                <section className="py-10 sm:py-12 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="border-border/70 bg-gradient-to-br from-card to-muted/25">
                                <CardHeader className="text-center pb-4">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <Users className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-foreground">Študent</CardTitle>
                                    <CardDescription className="text-muted-foreground">
                                        Sleduje progres, odovzdáva úlohy, komunikuje a riadi termíny.
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="border-border/70 bg-gradient-to-br from-card to-muted/25">
                                <CardHeader className="text-center pb-4">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <CheckCircle className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-foreground">Školiteľ</CardTitle>
                                    <CardDescription className="text-muted-foreground">
                                        Kontroluje progres, hodnotí úlohy, vracia na prepracovanie a vedie študenta.
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="border-border/70 bg-gradient-to-br from-card to-muted/25">
                                <CardHeader className="text-center pb-4">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <ShieldCheck className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-foreground">Administrátor</CardTitle>
                                    <CardDescription className="text-muted-foreground">
                                        Spravuje používateľov a dohliada na konzistentnosť dát v systéme.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-12 sm:py-20 px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <Card className="border-border bg-card/50 backdrop-blur p-8">
                            <CardHeader className="space-y-4">
                                <CardTitle className="text-3xl md:text-4xl text-foreground">
                                    Pripravený používať systém naplno?
                                </CardTitle>
                                <CardDescription className="text-lg text-muted-foreground">
                                    Thesis Manager je navrhnutý pre praktické vedenie záverečných prác v reálnom školskom prostredí.
                                </CardDescription>
                            </CardHeader>
                            {!isLoggedIn ? (
                                <CardContent>
                                    <Link href={guestSecondaryHref}>
                                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                            Prihlásiť sa
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            ) : (
                                <CardContent>
                                    <Link href={route('dashboard')}>
                                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                            Pokračovať do dashboardu
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            )}
                        </Card>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-border py-8 px-4 sm:px-6 bg-card/30">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-primary" />
                            <span className="text-sm text-muted-foreground">
                                © 2025 Thesis Manager. Všetky práva vyhradené.
                            </span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
