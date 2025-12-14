"use client";

import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Frown, Loader2, PlusCircle} from "lucide-react";
import Link from "next/link";
import {User} from "@/domain/model/User";
import {appModules} from "@/di/AppModules";
import {EventTicket} from "@/domain/model/EventTicket";
import {Event} from "@/domain/model/Event";

const eventSchema = z.object({
    title: z.string().min(3, {message: "O nome do evento deve ter pelo menos 3 caracteres."}),
    description: z.string().min(10, {message: "A descrição deve ter pelo menos 10 caracteres."}),
    eventTime: z.string().refine((val) => !isNaN(Date.parse(val)), {message: "Data inválida."}),
    time: z.string().min(1, {message: "A hora é obrigatória."}),
    venue: z.string().min(3, {message: "O local deve ter pelo menos 3 caracteres."}),
    address: z.string().min(3, {message: "A localização deve ter pelo menos 3 caracteres."}),
    category: z.enum(['Música', 'Teatro', 'Conferência', 'Esportes', 'Festival', 'Oficina']),
    ticketPrice: z.coerce.number().min(0, {message: "O preço não pode ser negativo."}),
    totalTickets: z.coerce.number().min(1, {message: "O número de ingressos deve ser maior que 0."}),
});

export default function CreateEventPage() {
    const router = useRouter();
    const {toast} = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            await appModules.getCurrentUserUseCase.execute()
                .then((user) => {
                    setCurrentUser(user);
                    setPageLoading(false);
                    console.log(user);

                    if (!user) {
                        toast({
                            variant: "destructive",
                            title: "Acesso Negado",
                            description: "Você precisa fazer login para criar eventos.",
                        });
                        router.push('/');
                        return;
                    }

                    if (user.role !== 'admin') {
                        toast({
                            variant: "destructive",
                            title: "Acesso Negado",
                            description: "Apenas administradores podem criar eventos.",
                        });
                        router.push('/');
                    }
                })
                .catch((_) => {
                    setPageLoading(false);
                    toast({
                        variant: "destructive",
                        title: "Erro",
                        description: "Não foi possível carregar as informações do usuário.",
                    });
                    router.push('/');
                });
        };

        loadUser();
    }, [router, toast]);

    const form = useForm<z.infer<typeof eventSchema>>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: "",
            description: "",
            eventTime: "",
            time: "",
            venue: "",
            address: "",
            ticketPrice: 0,
            totalTickets: 100,
        },
    });

    async function onSubmit(values: z.infer<typeof eventSchema>) {
        if (!currentUser || currentUser.role !== 'admin') {
            toast({
                variant: "destructive",
                title: "Não autenticado ou não autorizado",
                description: "Você precisa ser um administrador para criar um evento.",
            });
            return;
        }

        setIsLoading(true);

        const eventData: Omit<Event, "id" | "createdAt" | "updatedAt"> = {
            title: values.title,
            description: values.description,
            venue: values.venue,
            address: values.address,
            date: new Date(`${values.eventTime}T${values.time}`),
            time: values.time,
            imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
            category: values.category,
            eventTickets: [
                {
                    description: "Ingresso para o evento",
                    price: values.ticketPrice,
                    quantity: values.totalTickets,
                    available: values.totalTickets,
                    availableUntil: new Date(`${values.eventTime}T${values.time}`)
                } as EventTicket
            ],
            organizerId: currentUser.id,
            status: 'published' as const,
        };

        await appModules.createEventUseCase.execute(eventData)
            .then((_) => {
                toast({
                    title: "Evento Criado!",
                    description: `"${values.title}" foi adicionado com sucesso.`,
                });
                router.push(`/my-events`);
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Erro ao Criar Evento",
                    description: error instanceof Error ? error.message : "Ocorreu um problema ao salvar o evento.",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    if (pageLoading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin"/>
            </div>
        )
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
                        <p className="text-sm text-muted-foreground">Sua conta não tem
                            permissão para criar eventos.</p>
                        <Button asChild className="mt-4">
                            <Link href="/public">Voltar para a página inicial</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <PlusCircle className="h-10 w-10 text-primary"/>
                            <div>
                                <CardTitle className="font-headline text-4xl">Criar Novo Evento</CardTitle>
                                <CardDescription>Preencha os detalhes abaixo para adicionar seu evento à
                                    plataforma.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Nome do Evento</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ex: Festival de Verão" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Descrição</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Descreva seu evento em detalhes..."
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="eventTime"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Data</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="time"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Hora</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="venue"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Local (Nome do Estabelecimento)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ex: Estádio Municipal" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Localização (Cidade, Estado)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ex: São Paulo, SP" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Categoria</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione uma categoria"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Música">Música</SelectItem>
                                                        <SelectItem value="Teatro">Teatro</SelectItem>
                                                        <SelectItem value="Conferência">Conferência</SelectItem>
                                                        <SelectItem value="Esportes">Esportes</SelectItem>
                                                        <SelectItem value="Festival">Festival</SelectItem>
                                                        <SelectItem value="Oficina">Oficina</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="totalTickets"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Total de Ingressos</FormLabel>
                                                <FormControl>
                                                    <Input type="number"
                                                           placeholder="100" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="ticketPrice"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Preço (R$)</FormLabel>
                                                <FormControl>
                                                    <Input type="number"
                                                           placeholder="Deixe 0 para evento grátis" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    ) : (
                                        <PlusCircle className="mr-2 h-5 w-5"/>
                                    )}
                                    Criar Evento
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
