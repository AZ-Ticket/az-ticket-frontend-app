import Image from 'next/image';
import Link from 'next/link';
import {Calendar, MapPin} from 'lucide-react';
import type {Event} from '@/src/domain/model/Event';
import {Card, CardContent} from '@/src/components/ui/card';
import {Badge} from '@/src/components/ui/badge';
import {EventTicket} from "@/src/domain/model/EventTicket";

type EventCardProps = {
    event: Event;
};

export function EventCard({event}: EventCardProps) {
    const ticketEvent: EventTicket = (event.eventTickets.length > 0) ? event.eventTickets[0] : null;
    const price = (ticketEvent) ? ticketEvent.price : 0;
    const imageSrc = event.imageUrl ?? '';

    return (
        <Link href={`/app/event/${event.id}`} className="group block">
            <Card
                className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-48 w-full">
                    <Image
                        src={imageSrc}
                        alt="image event"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    <Badge variant="secondary"
                           className="absolute top-2 right-2">{price > 0 ? `R$${price.toFixed(2).replace('.', ',')}` : 'Grátis'}</Badge>
                </div>
                <CardContent className="p-4">
                    <p className="text-sm text-primary font-semibold mb-1">{(event.category as any)?.toString().toUpperCase?.() ?? ''}</p>
                    <h3 className="font-headline text-xl font-bold mb-2 leading-tight truncate"
                        title={(event as any).name ?? (event as any).title}>{(event as any).name ?? (event as any).title}</h3>
                    <div className="text-sm text-muted-foreground space-y-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 shrink-0"/>
                            <span>{event.date.toLocaleDateString('pt-BR', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                timeZone: 'UTC'
                            })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 shrink-0"/>
                            <span className="truncate">{event.venue}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
