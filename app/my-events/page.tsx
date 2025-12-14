"use client";

import {useState, useEffect} from 'react';
import {EventCard} from '@/components/event-card';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import Link from 'next/link';
import {CalendarPlus, ListVideo, Loader2, Frown} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useToast} from '@/hooks/use-toast';
import {User} from "@/domain/model/User";
import {Event} from "@/domain/model/Event";
import {appModules} from "@/di/AppModules";

export default function MyEventsPage() {
    const router = useRouter();
    const {toast} = useToast();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [myEvents, setMyEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            await appModules.getCurrentUserUseCase.execute()
                .then(async (user) => {
                    if (!user) {
                        toast({
                            variant: "destructive",
                            title: "Acesso Negado",
                            description: "Você precisa fazer login para ver esta página.",
                        });
                        router.push('/');
                        return;
                    }

                    setCurrentUser(user);

                    if (user.role !== 'admin') {
                        toast({
                            variant: "destructive",
                            title: "Acesso Negado",
                            description: "Apenas administradores podem acessar esta página.",
                        });
                        router.push('/');
                        return;
                    }

                    const events = await appModules.listEventsUseCase.execute({
                        organizerId: user.id
                    });
                    setMyEvents(events);
                    setIsLoading(false);
                })
                .catch((_) => {
                    setIsLoading(false);
                    toast({
                        variant: "destructive",
                        title: "Erro",
                        description: "Não foi possível carregar os dados.",
                    });
                    router.push('/');
                });
        };

        loadData();
    }, [router, toast]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin"/>
            </div>
        );
    }

    if (!currentUser || currentUser.role !== 'admin') {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2"><Frown/> Acesso
                            Restrito</CardTitle>
                        <CardDescription>Apenas administradores podem acessar esta página.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Sua conta não tem permissão para ver esta
                            página.</p>
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
            <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <ListVideo className="h-10 w-10 text-primary"/>
                    <div>
                        <h1 className="font-headline text-5xl font-bold">Meus Eventos</h1>
                        <p className="text-muted-foreground">Aqui estão os eventos que você criou.</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href="/create">
                        <CalendarPlus className="mr-2 h-4 w-4"/>
                        Criar Novo Evento
                    </Link>
                </Button>
            </div>

            {myEvents && myEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {myEvents.map(event => (
                        <EventCard key={event.id} event={event}/>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg flex flex-col items-center gap-4">
                    <h2 className="font-headline text-3xl">Você ainda não criou nenhum evento</h2>
                    <p className="text-muted-foreground max-w-md">Que tal começar agora? Compartilhe sua paixão com o
                        mundo!</p>
                    <Button asChild>
                        <Link href="/create">
                            <CalendarPlus className="mr-2 h-4 w-4"/>
                            Criar meu primeiro evento
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
