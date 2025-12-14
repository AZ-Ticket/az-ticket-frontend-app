"use client";

import {useParams, useSearchParams, useRouter} from 'next/navigation';
import {useState, useEffect} from 'react';
import {appModules} from '@/src/di/AppModules';
import {Event} from '@/src/domain/model/Event';
import {Button} from '@/src/components/ui/button';
import {Input} from '@/src/components/ui/input';
import {Label} from '@/src/components/ui/label';
import {
    Card, CardContent, CardHeader, CardTitle
} from '@/src/components/ui/card';
import {Separator} from '@/src/components/ui/separator';
import {useToast} from '@/src/hooks/use-toast';
import {Loader2} from 'lucide-react';

export default function CheckoutPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const {toast} = useToast();
    const id = params.id as string;

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [items, setItems] = useState<{ eventTicketId: string; quantity: number }[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cpf: '',
    });

    useEffect(() => {
        if (!id) return;

        const loadEvent = async () => {
            try {
                const eventData = await appModules.getEventByIdUseCase.execute(id);
                setEvent(eventData);
            } catch (error) {
                console.error('Error loading event:', error);
                toast({
                    title: "Erro",
                    description: "Erro ao carregar evento.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        loadEvent();
    }, [id, toast]);

    useEffect(() => {
        const ticketsParam = searchParams.get('tickets'); // format: id:qty,id:qty
        if (ticketsParam) {
            const parsedItems = ticketsParam.split(',').map(part => {
                const [ticketId, qtyStr] = part.split(':');
                return {
                    eventTicketId: ticketId,
                    quantity: parseInt(qtyStr, 10) || 0
                };
            }).filter(item => item.quantity > 0);
            setItems(parsedItems);
        }
    }, [searchParams]);

    const calculateTotal = () => {
        if (!event) return 0;
        return items.reduce((acc, item) => {
            const ticket = event.eventTickets.find(t => t.id === item.eventTicketId);
            return acc + (ticket ? ticket.price * item.quantity : 0);
        }, 0);
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!event) return;

        setProcessing(true);
        try {
            const currentUser = await appModules.getCurrentUserUseCase.execute()
            if (!currentUser) {
                return;
            }

            await appModules.createOrderUseCase.execute(
                currentUser.id,
                event.id,
                items,
                'credit_card' // Mock payment method
            );

            toast({
                title: "Sucesso!",
                description: "Pedido realizado com sucesso.",
            });

            // Redirect to success page or orders list
            // For now, redirect back to event page or a success page
            router.push(`/event/${id}`);
        } catch (error: any) {
            console.error('Checkout error:', error);
            toast({
                title: "Erro no checkout",
                description: error.message || "Não foi possível concluir a compra.",
                variant: "destructive",
            });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8"/></div>;
    }

    if (!event) {
        return <div className="p-8 text-center">Evento não encontrado.</div>;
    }

    const total = calculateTotal();

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resumo do Pedido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <div className="space-y-2">
                            {items.map(item => {
                                const ticket = event.eventTickets.find(t => t.id === item.eventTicketId);
                                if (!ticket) return null;
                                return (
                                    <div key={item.eventTicketId} className="flex justify-between text-sm">
                                        <span>{item.quantity}x {ticket.description || 'Ingresso'}</span>
                                        <span>R$ {(ticket.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <Separator/>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dados de Pagamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input
                                    id="cpf"
                                    required
                                    value={formData.cpf}
                                    onChange={e => setFormData({...formData, cpf: e.target.value})}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-4"
                                disabled={processing || items.length === 0}
                            >
                                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                {processing ? 'Processando...' : 'Finalizar Compra'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
