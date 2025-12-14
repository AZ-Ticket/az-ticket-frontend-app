"use client";

import Image from 'next/image';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {
    Calendar,
    MapPin,
    Download,
    Send,
    QrCode,
    Loader2,
    Twitter,
    Facebook,
    Copy,
} from 'lucide-react';
import {doc} from 'firebase/firestore';
import {useFirestore, useDoc, useMemoFirebase} from '@/src/firebase';
import type {Event} from '@/src/domain/model/Event';
import type {Ticket} from '@/src/domain/model/Ticket';
import {Button} from '@/src/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/src/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/src/components/ui/dialog';
import {useToast} from '@/src/hooks/use-toast';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/src/components/ui/form';
import {Input} from '@/src/components/ui/input';
import {Separator} from '@/src/components/ui/separator';
import {Skeleton} from './ui/skeleton';

type TicketCardProps = {
    ticket: Ticket;
};

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
         className="h-5 w-5">
        <path
            d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.447-4.433-9.886-9.888-9.886-5.448 0-9.887 4.434-9.889 9.885.002 2.024.63 3.965 1.735 5.619l-1.191 4.354 4.443-1.157z"/>
    </svg>
);


const transferFormSchema = z.object({
    email: z.string().email({message: 'Por favor, insira um e-mail válido.'}).optional().or(z.literal('')),
});

export function TicketCard({ticket}: TicketCardProps) {
    const {toast} = useToast();
    const firestore = useFirestore();

    const eventDocRef = useMemoFirebase(() => {
        if (!firestore || !ticket.eventId) return null;
        return doc(firestore, 'events', ticket.eventId);
    }, [firestore, ticket.eventId]);

    const {data: event, isLoading: loadingEvent} = useDoc<Event>(eventDocRef);

    const [isTransferring, setIsTransferring] = useState(false);
    const [isTransferDialogOpen, setTransferDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof transferFormSchema>>({
        resolver: zodResolver(transferFormSchema),
        defaultValues: {
            email: '',
        },
    });

    if (loadingEvent) {
        return (
            <Card className="flex flex-col md:flex-row overflow-hidden shadow-md">
                <Skeleton className="h-48 md:h-auto md:w-1/3 lg:w-1/4"/>
                <div className="flex-grow p-6 space-y-4">
                    <Skeleton className="h-4 w-1/4"/>
                    <Skeleton className="h-8 w-3/4"/>
                    <Skeleton className="h-4 w-1/2"/>
                    <Skeleton className="h-4 w-1/2"/>
                </div>
            </Card>
        );
    }

    if (!event) return null;

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(ticket.qrCode)}`;
    const ticketUrl = typeof window !== 'undefined' ? `${window.location.origin}/events/${event.id}` : '';
    const shareText = `Confira meu ingresso para ${event.title}! Você pode encontrar mais detalhes aqui: ${ticketUrl}`;


    const handleDownload = () => {
        toast({
            title: 'Simulação de Download',
            description: `O download do seu ingresso para "${event.title}" seria iniciado.`,
        });
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(ticketUrl);
        toast({
            title: 'Link Copiado!',
            description: 'O link do evento foi copiado para a sua área de transferência.',
        });
    };

    async function handleTransferSubmit(values: z.infer<typeof transferFormSchema>) {
        if (!values.email) {
            toast({
                variant: 'destructive',
                title: 'Campo Obrigatório',
                description: 'Por favor, insira um e-mail para transferir o ingresso.',
            });
            return;
        }
        setIsTransferring(true);
        // Simular uma chamada de API para transferência
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTransferring(false);
        setTransferDialogOpen(false);
        form.reset();
        toast({
            title: 'Transferência Simulada!',
            description: `Seu ingresso para "${event?.title}" foi enviado para ${values.email}.`,
        });
    }

    return (
        <Card className="flex flex-col md:flex-row overflow-hidden shadow-md transition-shadow hover:shadow-xl">
            <div className="relative h-48 md:h-auto md:w-1/3 lg:w-1/4">
                <Image
                    src={event.imageUrl ?? ''}
                    alt={`Imagem do evento para ${event.title}`}
                    fill
                    className="object-cover"
                    data-ai-hint={event.title}
                />
            </div>
            <div className="flex-grow">
                <CardHeader>
                    <p className="text-sm text-primary font-semibold">{event.category.toUpperCase()}</p>
                    <h2 className="font-headline text-3xl font-bold">{event.title}</h2>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4"/>
                        <span>{event.date.toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'UTC'
                        })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4"/>
                        <span>{event.venue}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <QrCode className="mr-2 h-4 w-4"/> Ver QR Code
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm p-0">
                            <div className="relative h-40 w-full rounded-t-lg overflow-hidden">
                                <Image
                                    src={event.imageUrl ?? ""}
                                    alt={`Imagem do evento para ${event.title}`}
                                    fill
                                    className="object-cover opacity-30"
                                    data-ai-hint={event.title}
                                />
                                <div className="absolute inset-0 bg-black/20"/>
                            </div>
                            <div className="p-6 space-y-4 -mt-32">
                                <div className="text-center space-y-1 text-white relative">
                                    <DialogTitle
                                        className="font-headline text-3xl drop-shadow-md">{event.title}</DialogTitle>
                                    <DialogDescription className="text-white/90 drop-shadow-sm">Apresente este QR code
                                        na entrada do evento.</DialogDescription>
                                </div>

                                <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-lg">
                                    <Image src={qrCodeUrl} alt={`QR Code para ${ticket.id}`} width={180} height={180}/>
                                </div>

                                <div className="text-center text-sm text-muted-foreground space-y-2">
                                    <div className="flex items-center justify-center gap-2">
                                        <Calendar className="h-4 w-4"/>
                                        <span>{event.date.toLocaleDateString('pt-BR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            timeZone: 'UTC'
                                        })}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <MapPin className="h-4 w-4"/>
                                        <span>{event.venue}</span>
                                    </div>
                                </div>
                                <Separator/>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">ID DO INGRESSO</p>
                                    <p className="font-mono text-sm">{ticket.id}</p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4"/> Download
                    </Button>

                    <Dialog open={isTransferDialogOpen} onOpenChange={setTransferDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Send className="mr-2 h-4 w-4"/> Transferir
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Transferir ou Partilhar Ingresso</DialogTitle>
                                <DialogDescription>
                                    Envie para um amigo por e-mail ou partilhe nas redes sociais.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleTransferSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>E-mail do Destinatário</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="email@exemplo.com" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter
                                        className="flex-col-reverse sm:flex-row sm:justify-between sm:items-center">
                                        <DialogClose asChild>
                                            <Button type="button" variant="ghost">Cancelar</Button>
                                        </DialogClose>
                                        <Button type="submit" disabled={isTransferring}>
                                            {isTransferring ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            ) : (
                                                <Send className="mr-2 h-4 w-4"/>
                                            )}
                                            Transferir por E-mail
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>

                            <Separator className="my-4"/>

                            <div className="space-y-2 text-center">
                                <p className="text-sm text-muted-foreground">Ou partilhe o link do evento</p>
                                <div className="flex justify-center gap-2">
                                    <Button variant="outline" size="icon" asChild>
                                        <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank"
                                           rel="noopener noreferrer">
                                            <WhatsAppIcon/>
                                        </a>
                                    </Button>
                                    <Button variant="outline" size="icon" asChild>
                                        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                                           target="_blank" rel="noopener noreferrer">
                                            <Twitter className="h-5 w-5"/>
                                        </a>
                                    </Button>
                                    <Button variant="outline" size="icon" asChild>
                                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ticketUrl)}`}
                                           target="_blank" rel="noopener noreferrer">
                                            <Facebook className="h-5 w-5"/>
                                        </a>
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={handleCopyLink}>
                                        <Copy className="h-5 w-5"/>
                                    </Button>
                                </div>
                            </div>

                        </DialogContent>
                    </Dialog>

                </CardFooter>
            </div>
        </Card>
    );
}
