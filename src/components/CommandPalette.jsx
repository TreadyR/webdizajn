import { useState, useEffect, useCallback, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    Search, 
    GraduationCap, 
    FileText, 
    Calendar, 
    User, 
    Loader2,
    ArrowRight,
    Clock,
    MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CommandPalette({ open, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeFilter, setActiveFilter] = useState('all');
    const inputRef = useRef(null);
    const resultsRef = useRef(null);

    // Debounced search or fetch recent
    useEffect(() => {
        if (!open) return;

        setLoading(true);
        const timeoutId = setTimeout(() => {
            // Fetch if query is empty (recent) or >= 2 chars (search)
            if (query.length > 0 && query.length < 2) {
                setLoading(false);
                setResults([]);
                setInitialLoadDone(true);
                return;
            }

            fetch(`/api/search?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    setResults(data.results || []);
                })
                .catch(err => {
                    console.error('Search error:', err);
                    setResults([]);
                })
                .finally(() => {
                    setLoading(false);
                    setInitialLoadDone(true);
                });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, open]);

    // Reset when dialog opens/closes
    useEffect(() => {
        if (open) {
            setQuery('');
            // Do NOT clear results blindly if we want to fetch recent immediately
            // But we do want to clear previous search results.
            // The effect [query, open] will run and fetch recent because open changes to true.
            setResults([]); 
            setInitialLoadDone(false);
            setSelectedIndex(0);
            setActiveFilter('all');
            // Focus input when dialog opens
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [open]);

    // Filter results based on active filter
    const filteredResults = activeFilter === 'all' 
        ? results 
        : results.filter(r => r.type === activeFilter);

    // Reset selectedIndex when filter changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [activeFilter, results]);

    // Get counts for each type
    const getCounts = () => {
        const counts = { all: results.length };
        results.forEach(r => {
            counts[r.type] = (counts[r.type] || 0) + 1;
        });
        return counts;
    };

    const counts = getCounts();

    const filters = [
        { id: 'all', label: 'Všetko', icon: Search },
        { id: 'thesis', label: 'Témy', icon: GraduationCap },
        { id: 'assignment', label: 'Úlohy', icon: FileText },
        { id: 'message', label: 'Správy', icon: MessageCircle },
        { id: 'appointment', label: 'Konzultácie', icon: Calendar },
        { id: 'user', label: 'Používatelia', icon: User },
    ];

    // Keyboard navigation
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < filteredResults.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
            } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
                e.preventDefault();
                handleSelect(filteredResults[selectedIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, filteredResults, selectedIndex]);

    // Scroll selected item into view
    useEffect(() => {
        if (resultsRef.current && selectedIndex >= 0) {
            const selectedElement = resultsRef.current.children[selectedIndex];
            selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [selectedIndex]);

    const handleSelect = (result) => {
        router.visit(result.url);
        onClose();
    };

    const getIcon = (type) => {
        switch (type) {
            case 'thesis':
                return <GraduationCap className="h-4 w-4" />;
            case 'assignment':
                return <FileText className="h-4 w-4" />;
            case 'message':
                return <MessageCircle className="h-4 w-4" />;
            case 'appointment':
                return <Calendar className="h-4 w-4" />;
            case 'user':
                return <User className="h-4 w-4" />;
            case 'action':
                return <ArrowRight className="h-4 w-4" />;
            default:
                return <Search className="h-4 w-4" />;
        }
    };

    const getTypeBadge = (type) => {
        const badges = {
            thesis: { label: 'Téma', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            assignment: { label: 'Úloha', class: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
            message: { label: 'Správa', class: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
            appointment: { label: 'Konzultácia', class: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
            user: { label: 'Používateľ', class: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
            action: { label: 'Akcia', class: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30' },
        };
        return badges[type] || { label: type, class: 'bg-muted/50 text-muted-foreground' };
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 gap-0 border-white/10 bg-zinc-950/95 text-zinc-100 backdrop-blur-xl shadow-2xl [&>button]:text-zinc-300 [&>button:hover]:text-white [&>button:hover]:bg-white/10 [&>button:focus]:ring-emerald-400 [&>button:focus]:ring-offset-zinc-950">
                <DialogHeader className="px-4 pt-4 pb-0 sr-only">
                    <DialogTitle>Rýchle vyhľadávanie</DialogTitle>
                    <DialogDescription>Vyhľadajte témy, úlohy, konzultácie a ďalšie</DialogDescription>
                </DialogHeader>

                {/* Search Input */}
                <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 bg-gradient-to-r from-zinc-950 via-zinc-900/95 to-zinc-900/80">
                    <Search className="h-5 w-5 text-zinc-400 flex-shrink-0" />
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Vyhľadať témy, úlohy, konzultácie..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="border-0 bg-transparent text-zinc-100 focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-0 placeholder:text-zinc-500"
                    />
                    {loading && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 overflow-x-auto bg-zinc-900/70">
                    {filters.map((filter) => {
                        const FilterIcon = filter.icon;
                        const count = counts[filter.id] || 0;
                        
                        return (
                            <button
                                key={filter.id}
                                onClick={() => {
                                    setActiveFilter(filter.id);
                                    setSelectedIndex(0);
                                }}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                                    activeFilter === filter.id
                                        ? "bg-emerald-500/90 text-zinc-950 shadow-sm"
                                        : "bg-zinc-900 text-zinc-300 border border-white/10 hover:bg-zinc-800 hover:text-white"
                                )}
                            >
                                <FilterIcon className="h-3.5 w-3.5" />
                                {filter.label}
                                {count > 0 && (
                                    <Badge 
                                        variant="secondary" 
                                        className={cn(
                                            "h-5 w-5 p-0 flex items-center justify-center text-xs font-semibold",
                                            activeFilter === filter.id
                                                ? "bg-zinc-900/60 text-emerald-100 border-zinc-700"
                                                : "bg-zinc-800 text-zinc-300 border-zinc-700"
                                        )}
                                    >
                                        {count}
                                    </Badge>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Results */}
                <div className="max-h-[400px] overflow-y-auto p-2 bg-zinc-950/95 scrollbar-thin">
                    {loading && !initialLoadDone && query.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Loader2 className="h-10 w-10 text-zinc-500 animate-spin mb-3" />
                            <p className="text-sm text-zinc-100 font-medium">Načítavam rýchly prístup...</p>
                            <p className="text-xs text-zinc-400 mt-1">Pripravujem poslednú aktivitu a výsledky</p>
                        </div>
                    )}

                    {query.length === 0 && filteredResults.length > 0 && (
                        <div className="px-2 py-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            Nedávna aktivita
                        </div>
                    )}

                    {query.length < 2 && filteredResults.length === 0 && !loading && initialLoadDone && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Search className="h-12 w-12 text-zinc-600 mb-3" />
                            <p className="text-sm text-zinc-100 font-medium">
                                Začnite písať pre vyhľadávanie...
                            </p>
                            <p className="text-xs text-zinc-400 mt-1">
                                Minimálne 2 znaky • Skúste príkazy ako "úlohy", "témy", "konzultácie"
                            </p>
                        </div>
                    )}

                    {query.length >= 2 && filteredResults.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Search className="h-12 w-12 text-zinc-600 mb-3" />
                            <p className="text-sm text-zinc-100 font-medium">
                                Nenašli sa žiadne výsledky
                            </p>
                            <p className="text-xs text-zinc-400 mt-1">
                                Skúste iné kľúčové slová alebo iný filter
                            </p>
                        </div>
                    )}

                    {filteredResults.length > 0 && (
                        <div ref={resultsRef} className="space-y-1">
                            {filteredResults.map((result, index) => {
                                const badge = getTypeBadge(result.type);
                                return (
                                    <button
                                        key={`${result.type}-${result.id}`}
                                        onClick={() => handleSelect(result)}
                                        className={cn(
                                            "w-full text-left px-3 py-3 rounded-lg transition-all duration-150 group border",
                                            selectedIndex === index 
                                                ? "bg-zinc-800/90 border-zinc-700 shadow-sm" 
                                                : "bg-zinc-900/60 hover:bg-zinc-800/70 border-transparent hover:border-zinc-700"
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={cn(
                                                "flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                                                selectedIndex === index
                                                    ? "bg-emerald-500/20 text-emerald-300"
                                                    : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-100"
                                            )}>
                                                {getIcon(result.type)}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge 
                                                        variant="outline" 
                                                        className={cn("text-xs font-medium border", badge.class)}
                                                    >
                                                        {badge.label}
                                                    </Badge>
                                                    {result.status && (
                                                        <Badge 
                                                            variant="outline" 
                                                            className="text-xs bg-zinc-800/80 text-zinc-300 border-zinc-700"
                                                        >
                                                            {result.status}
                                                        </Badge>
                                                    )}
                                                </div>
                                                
                                                <h4 className="text-sm font-medium text-zinc-100 mb-1 line-clamp-1">
                                                    {result.title}
                                                </h4>
                                                
                                                {result.description && (
                                                    <p className="text-xs text-zinc-400 line-clamp-1">
                                                        {result.description}
                                                    </p>
                                                )}
                                                
                                                {result.meta && (
                                                    <p className="text-xs text-zinc-500 mt-1">
                                                        {result.meta}
                                                    </p>
                                                )}
                                            </div>

                                            <ArrowRight className={cn(
                                                "h-4 w-4 flex-shrink-0 transition-all",
                                                selectedIndex === index 
                                                    ? "text-emerald-300 opacity-100" 
                                                    : "text-zinc-500 opacity-0 group-hover:opacity-100"
                                            )} />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer with shortcuts */}
                <div className="border-t border-white/10 px-4 py-3 flex items-center justify-between bg-gradient-to-r from-zinc-950 to-zinc-900/80 backdrop-blur">
                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                        <div className="flex items-center gap-1.5">
                            <kbd className="px-2 py-1 rounded bg-zinc-900 border border-white/10 text-zinc-200 font-mono text-xs shadow-sm">↑↓</kbd>
                            <span>Navigácia</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <kbd className="px-2 py-1 rounded bg-zinc-900 border border-white/10 text-zinc-200 font-mono text-xs shadow-sm">Enter</kbd>
                            <span>Otvoriť</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <kbd className="px-2 py-1 rounded bg-zinc-900 border border-white/10 text-zinc-200 font-mono text-xs shadow-sm">Esc</kbd>
                            <span>Zavrieť</span>
                        </div>
                    </div>
                    <div className="text-xs text-zinc-400">
                        <kbd className="px-2 py-1 rounded bg-zinc-900 border border-white/10 text-zinc-200 font-mono text-xs shadow-sm">⌘K</kbd>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

