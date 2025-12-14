"use client";

import Image from 'next/image';
import {useParams, useRouter} from 'next/navigation';
import type {Event} from '@/src/domain/model/Event';
import {Button} from '@/src/components/ui/button';
import {Calendar, MapPin} from 'lucide-react';
import {Badge} from '@/src/components/ui/badge';
import {Skeleton} from '@/src/components/ui/skeleton';
import {useState, useEffect} from 'react';
import {appModules} from '@/src/di/AppModules';

export default function EventDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvent = async () => {
            if (!id) return;

            setLoading(true);
            await appModules.getEventByIdUseCase.execute(id)
                .then(eventData => {
                    setEvent(eventData);
                })
                .catch((error) => {
                    console.error('Error loading event:', error);
                    setEvent(null);
                }).finally(() => {
                    setLoading(false);
                });
        };

        loadEvent();
    }, [id]);

    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const updateQuantity = (ticketId: string, delta: number) => {
        setQuantities(prev => {
            const current = prev[ticketId] ?? 0;
            const next = Math.max(0, current + delta);
            return {...prev, [ticketId]: next};
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden">
                    <Skeleton className="w-full h-64 md:h-96"/>
                    <div className="p-8 grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                            <Skeleton className="h-8 w-3/4"/>
                            <Skeleton className="h-20 w-full"/>
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-16 w-full"/>
                            <Skeleton className="h-16 w-full"/>
                            <Skeleton className="h-16 w-full"/>
                            <Skeleton className="h-12 w-full"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (event == null) {
        return
    }

    const total = event.eventTickets.reduce((acc, ticket) => {
        const quantity = quantities[ticket.id] ?? 0;
        const price = Number.isFinite(ticket.price) ? Math.max(0, Number(ticket.price)) : 0;
        return acc + (price * quantity);
    }, 0);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden">
                <div className="relative w-full h-64 md:h-96">
                    <Image
                        src={event.imageUrl ?? ''}
                        alt="image event"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                    <div className="absolute bottom-0 left-0 p-8">
                        <Badge variant="secondary" className="mb-2 text-sm">{event.category}</Badge>
                        <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary-foreground shadow-md">
                            {event.title}
                        </h1>
                    </div>
                </div>
                <div className="p-8 flex md:flex-wrap justify-between">
                    <div className="flex items-start gap-2">
                        <Calendar className="h-6 w-6 text-primary mt-1 shrink-0"/>
                        <div>
                            <h3 className="font-semibold">Data e hora</h3>
                            <p className="text-muted-foreground">{event.date.toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                timeZone: 'UTC'
                            })}</p>
                            <p className="text-muted-foreground">{event.date.toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'UTC'
                            })}</p>
                        </div>
                    </div>
                    <div className="flex items-start  gap-3">
                        <MapPin className="h-6 w-6 text-primary mt-1 shrink-0"/>
                        <div className="flex-col justify-end">
                            <h3 className="font-semibold">Localização</h3>
                            <p className="text-muted-foreground">{event.address}</p>
                            <h3 className="font-semibold">{event.venue}</h3>
                        </div>
                    </div>
                </div>
                <div className="p-8 grid md:grid-cols-2 md:justify-between gap-2">
                    <div className="">
                        <h2 className="font-headline text-3xl font-bold mb-4">Descrição do evento</h2>
                        <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                    </div>
                    {event.eventTickets.length > 0 && (
                        <div className="">
                            <h2 className="font-headline text-3xl font-bold mb-2">Ingresso(s)</h2>
                            <div className="space-y-6">
                                {event.eventTickets.map(eventTicket => {
                                    const quantity = quantities[eventTicket.id] ?? 0;
                                    return (
                                        <div
                                            key={eventTicket.id}
                                            className="rounded-lg border border-primary bg-muted/30 p-4 flex flex-row justify-between">
                                            <div className="">
                                                {eventTicket.description &&
                                                    <p className="">{eventTicket.description}</p>}
                                                <h4 className="font-bold">{eventTicket.price > 0
                                                    ? `R$${Number(eventTicket.price).toFixed(2).replace('.', ',')}`
                                                    : 'Grátis'}</h4>
                                                <span className="text-sm text-muted-foreground">
                                            Disponível até {eventTicket.availableUntil.toLocaleDateString('pt-BR', {})}
                                        </span>
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <Button
                                                    className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg"
                                                    onClick={() => updateQuantity(eventTicket.id, -1)}>-</Button>
                                                <p className="mx-2">{quantity}</p>
                                                <Button
                                                    className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg"
                                                    onClick={() => updateQuantity(eventTicket.id, 1)}>+</Button>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="rounded-lg border bg-muted/30 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">Total</span>
                                        <span className="font-bold">
                                        {`R$ ${total.toFixed(2).replace('.', ',')}`}
                                    </span>
                                    </div>
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6"
                                    disabled={total === 0}
                                    onClick={() => {
                                        const selectedTickets = Object.entries(quantities)
                                            .filter(([_, qty]) => qty > 0)
                                            .map(([ticketId, qty]) => `${ticketId}:${qty}`)
                                            .join(',');

                                        if (selectedTickets) {
                                            router.push(`/event/${id}/checkout?tickets=${selectedTickets}`);
                                        }
                                    }}
                                >
                                    Prosseguir para pagamento
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
