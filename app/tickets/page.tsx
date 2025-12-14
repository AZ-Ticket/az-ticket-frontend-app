"use client";

import {useState, useEffect} from 'react';
import {useUser} from '@/src/firebase';
import {TicketCard} from '@/src/components/ticket-card';
import type {Ticket} from '@/src/domain/model/Ticket';
import {Ticket as TicketIcon, CalendarPlus, Loader2} from 'lucide-react';
import {Button} from '@/src/components/ui/button';
import Link from 'next/link';
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/src/components/ui/card';
import {useToast} from '@/src/hooks/use-toast';
import {useRouter, useSearchParams} from 'next/navigation';
import {Skeleton} from '@/src/components/ui/skeleton';
import {appModules} from '@/src/di/AppModules';

export default function TicketsPage() {
    const {user, isUserLoading} = useUser();
    const {toast} = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const eventId = searchParams.get('eventId');
    const qty = parseInt(searchParams.get('qty') || '1', 10);

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loadingTickets, setLoadingTickets] = useState(true);

    const isLoading = isUserLoading || loadingTickets;

    useEffect(() => {
        const loadTickets = async () => {
            if (!user) {
                setTickets([]);
                setLoadingTickets(false);
                return;
            }

            setLoadingTickets(true);

            await appModules.getOrderTicketsUseCase.execute("", user.uid)
                .then(async (tickets) => {
                    setTickets(tickets);
                })
                .catch((error) => {
                    console.error('Error loading tickets:', error);
                    setTickets([]);
                })
                .finally(() => {
                    setLoadingTickets(false);
                });
        };

        loadTickets();
    }, [user]);

    useEffect(() => {
        if (eventId && user && !loadingTickets) {
            // Redirect to event page to select tickets properly
            router.replace(`/event/${eventId}`);
        }
    }, [eventId, user, router, loadingTickets]);

    if (isLoading || (eventId && !loadingTickets)) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center gap-4 mb-8">
                    <Loader2 className="h-8 w-8 animate-spin"/>
                    <p className="text-muted-foreground">{eventId ? "Finalizando sua compra..." : "Carregando seus ingressos..."}</p>
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-48 w-full rounded-lg"/>
                    <Skeleton className="h-48 w-full rounded-lg"/>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Acesso Restrito</CardTitle>
                        <CardDescription>Você precisa estar logado para ver seus ingressos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Por favor, faça o login para continuar.</p>
                        <Button asChild className="mt-4">
                            <Link href="/public">Voltar para a página inicial</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <TicketIcon className="h-10 w-10 text-primary"/>
                <div>
                    <h1 className="font-headline text-5xl font-bold">Meus Ingressos</h1>
                    <p className="text-muted-foreground">Sua carteira digital de experiências.</p>
                </div>
            </div>

            {tickets && tickets.length > 0 ? (
                <div className="space-y-6">
                    {tickets.map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket}/>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg flex flex-col items-center gap-4">
                    <h2 className="font-headline text-3xl">Nenhum Ingresso Ainda</h2>
                    <p className="text-muted-foreground max-w-md">Que tal explorar alguns eventos e encontrar sua
                        próxima aventura?</p>
                    <Button asChild>
                        <Link href="/public">
                            <CalendarPlus className="mr-2 h-4 w-4"/>
                            Explorar Eventos
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
