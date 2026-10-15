import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, Circle, Clock, Rocket, Flag, Sparkles } from 'lucide-react';

export default function CurrentPhaseWidget({ milestones }) {
    if (!milestones || milestones.length === 0) {
        return (
            <Card className="col-span-1 md:col-span-2 shadow-sm border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                    <div className="rounded-full bg-muted p-3 mb-3">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Žiadne fázy</h3>
                    <p className="text-sm text-muted-foreground">
                        Školiteľ zatiaľ nenastavil žiadne míľniky pre túto prácu.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const currentMilestoneIndex = milestones.findIndex((m) => m.status === 'in_progress');
    const allCompleted = milestones.every((m) => m.status === 'completed');
    const displayIndex = currentMilestoneIndex !== -1 ? currentMilestoneIndex : (allCompleted ? milestones.length - 1 : 0);
    const completedCount = milestones.filter((m) => m.status === 'completed').length;
    const overallProgress = Math.round((completedCount / milestones.length) * 100);

    const activeMilestone = milestones[displayIndex];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <Check className="h-5 w-5 text-white" />;
            case 'in_progress': return <Clock className="h-5 w-5 text-white" />;
            default: return <Circle className="h-5 w-5 text-muted-foreground/30" />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-500 border-green-500 shadow-green-500/20';
            case 'in_progress': return 'bg-blue-500 border-blue-500 shadow-blue-500/20 ring-4 ring-blue-500/10';
            default: return 'bg-muted border-muted-foreground/20';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'completed': return 'Dokončené';
            case 'in_progress': return 'Aktuálne prebieha';
            case 'review': return 'Na kontrole';
            default: return 'Plánované';
        }
    };

    const currentPhaseHint = allCompleted
        ? 'Všetky fázy sú dokončené. Môžete uzavrieť výstupy práce alebo doplniť finálne úlohy.'
        : activeMilestone?.status === 'in_progress'
          ? 'Sústredenie je na aktuálnu fázu. Sledujte termín a dokončite úlohy priradené k tejto etape.'
          : 'Najbližšia plánovaná fáza čaká na spustenie. Pripravte podklady a nastavte úlohy v predstihu.';

    return (
        <Card className="col-span-1 md:col-span-3 overflow-hidden border-border/70 bg-gradient-to-br from-card/90 via-card/75 to-muted/30 section-lift-in card-hover-glow">
            <CardHeader className="pb-4 border-b border-border/60 bg-card/55 backdrop-blur-sm">
                <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="space-y-2">
                        <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                            <span className="bg-primary/15 p-2 rounded-lg text-primary">
                                <Rocket className="h-4 w-4" />
                            </span>
                            Aktuálna fáza projektu
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground max-w-2xl">
                            {currentPhaseHint}
                        </CardDescription>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="font-normal">
                            Fáza {displayIndex + 1} z {milestones.length}
                        </Badge>
                        <Badge className="bg-primary/15 text-primary border-primary/25">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Celkový progres {overallProgress}%
                        </Badge>
                    </div>
                </div>

                <div className="pt-3">
                    <Progress value={overallProgress} className="h-2" />
                </div>
            </CardHeader>

            <CardContent className="p-6 overflow-x-auto">
                <div className="relative min-w-[600px] md:min-w-0">
                    {/* Connecting Line (Desktop) */}
                    <div className="absolute top-6 left-0 right-0 h-0.5 bg-border/70 hidden md:block" />
                    
                    {/* Milestones Desktop Grid */}
                    <div className="hidden md:flex justify-between items-start gap-4 relative z-10 w-full">
                        {milestones.map((milestone, idx) => {
                             const isCurrent = milestone.status === 'in_progress';
                             
                             return (
                                <div key={milestone.id} className={`flex flex-col items-center text-center group flex-1 min-w-[120px] stagger-item ${isCurrent ? 'scale-105 transition-transform' : 'opacity-70 hover:opacity-100 transition-opacity'}`} style={{ animationDelay: `${90 + idx * 70}ms` }}>
                                    <div className={`
                                        w-12 h-12 rounded-full border-2 flex items-center justify-center mb-4 shadow-lg transition-all z-20 bg-background
                                        ${getStatusClass(milestone.status)}
                                    `}>
                                        {getStatusIcon(milestone.status)}
                                    </div>
                                    
                                    <h4 className={`font-semibold text-sm mb-1 ${isCurrent ? 'text-primary' : 'text-card-foreground'}`}>
                                        {milestone.title}
                                    </h4>
                                    
                                    <p className="text-xs text-muted-foreground line-clamp-2 max-w-[200px] min-h-[34px]">
                                        {milestone.description}
                                    </p>

                                    <Badge variant="outline" className="mt-2 text-[10px] text-muted-foreground border-border/60">
                                        {getStatusLabel(milestone.status)}
                                    </Badge>

                                    {milestone.status === 'in_progress' && milestone.due_date && (
                                        <Badge variant="secondary" className="mt-3 text-[10px] h-5">
                                            Termín: {new Date(milestone.due_date).toLocaleDateString('sk-SK')}
                                        </Badge>
                                    )}
                                </div>
                             );
                        })}
                    </div>

                    {/* Mobile Vertical View */}
                    <div className="md:hidden space-y-6 relative border-l-2 border-muted ml-4 pl-6 py-2">
                        {milestones.map((milestone, idx) => (
                            <div key={milestone.id} className="relative">
                                <div className={`
                                    absolute -left-[35px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-md
                                    ${getStatusClass(milestone.status)}
                                `}>
                                    {milestone.status === 'completed' ? <Check className="h-4 w-4 text-white" /> : 
                                     milestone.status === 'in_progress' ? <Clock className="h-4 w-4 text-white" /> : 
                                     <span className="text-xs font-bold text-muted-foreground">{idx + 1}</span>}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-card-foreground">{milestone.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                                    <Badge variant="outline" className="mt-2 text-[10px] border-border/60">
                                        {getStatusLabel(milestone.status)}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
