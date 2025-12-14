"use client";

import {useState, useMemo, useEffect} from 'react';
import {EventCard} from '@/src/components/event-card';
import {EventFilters} from '@/src/components/event-filters';
import type {Event} from '@/src/domain/model/Event';
import {Skeleton} from '@/src/components/ui/skeleton';
import {appModules} from "@/src/di/AppModules";

export default function Home() {
    const [filters, setFilters] = useState({
        search: '',
        category: 'all',
        date: '',
        price: 'all',
    });
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            await appModules.listEventsUseCase.execute()
                .then(events => {
                    setAllEvents(events);
                    setLoading(false);
                }).catch((error) => {
                    console.error("Error loading events:", error);
                    setLoading(false);
                });
        };

        loadEvents();
    }, []);

    const filteredEvents = useMemo(() => {
        if (!allEvents) return [];
        return allEvents.filter(event => {
            const searchLower = filters.search.toLowerCase();
            const titleMatch = event.title?.toLowerCase().includes(searchLower) ?? false;
            const descriptionMatch = event.description?.toLowerCase().includes(searchLower) ?? false;
            const venueMatch = event.venue?.toLowerCase().includes(searchLower) ?? false;

            const categoryMatch = filters.category === 'all' || event.category?.toLowerCase() === filters.category;

            const dateMatch = !filters.date || event.date?.toISOString().startsWith(filters.date);

            const priceMatch = filters.price === 'all' ||
                (filters.price === 'free' && event.eventTickets[0].price === 0) ||
                (filters.price === 'paid' && event.eventTickets[0].price > 0);

            return (titleMatch || descriptionMatch || venueMatch) && categoryMatch && dateMatch && priceMatch;
        });
    }, [allEvents, filters]);

    return (
        <div className="container mx-auto px-4 py-8">
            <section className="text-center mb-12">
                <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary mb-4 tracking-tight">
                    Encontre Sua Próxima Experiência
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    Descubra shows, festivais, workshops e muito mais. Sua próxima aventura está a apenas um clique de
                    distância.
                </p>
            </section>

            <EventFilters onFilterChange={setFilters}/>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {Array.from({length: 8}).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-48 w-full"/>
                            <Skeleton className="h-4 w-2/4"/>
                            <Skeleton className="h-6 w-full"/>
                            <Skeleton className="h-4 w-3/4"/>
                            <Skeleton className="h-4 w-3/4"/>
                        </div>
                    ))}
                </div>
            ) : filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredEvents.map(event => (
                        <EventCard key={event.id} event={event}/>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h2 className="font-headline text-3xl mb-2">Nenhum Evento Encontrado</h2>
                    <p className="text-muted-foreground">Tente ajustar sua busca ou critérios de filtro.</p>
                </div>
            )}
        </div>
    );
}
