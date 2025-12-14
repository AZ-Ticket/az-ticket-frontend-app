"use client";

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Loader2} from 'lucide-react';
import {Button} from '@/src/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/src/components/ui/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/src/components/ui/tabs';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/src/components/ui/form';
import {Input} from '@/src/components/ui/input';
import {useToast} from '@/src/hooks/use-toast';
import {appModules} from "@/src/di/AppModules";

const loginSchema = z.object({
    email: z.string().email({message: 'Por favor, insira um e-mail válido.'}),
    password: z.string().min(1, {message: 'A senha é obrigatória.'}),
});

const registerSchema = z.object({
    name: z.string().min(3, {message: 'O nome deve ter pelo menos 3 caracteres.'}),
    email: z.string().email({message: 'Por favor, insira um e-mail válido.'}),
    password: z.string().min(8, {message: 'A senha deve ter pelo menos 8 caracteres.'}),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não correspondem.",
    path: ["confirmPassword"],
});

const GoogleIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"/>
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"/>
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"/>
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"/>
            <path d="M1 1h22v22H1z" fill="none"/>
        </svg>
    );

type AuthModalProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
};

type LoadingState = null | 'email' | 'google';

export function AuthModal({isOpen, onOpenChange}: AuthModalProps) {
    const {toast} = useToast();
    const [activeTab, setActiveTab] = useState('login');
    const [loading, setLoading] = useState<LoadingState>(null);

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {email: '', password: ''},
    });

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {name: '', email: '', password: '', confirmPassword: ''},
    });

    const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
        setLoading('email');
        appModules.signInUseCase.execute(values.email, values.password)
            .then(user => {
                console.log('User authed: ', user);
                toast({
                    title: 'Login bem-sucedido!',
                    description: `Bem-vindo de volta!`,
                });
                onOpenChange(false);
            })
            .catch(error => {
                console.error('Erro ao fazer login:', error);
                toast({
                    variant: 'destructive',
                    title: 'Erro de Login',
                    description: error.description
                });
            })
            .finally(() => {
                setLoading(null);
            });
    };

    const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
        setLoading('email');
        await appModules.signUpUseCase.execute(
            values.email, values.password, values.name, ""
        ).then(user => {
            console.log('User created: ', user);
            toast({
                title: 'Registro bem-sucedido!',
                description: 'Sua conta foi criada. Você já está logado.',
            });
            onOpenChange(false);
            registerForm.reset();
        }).catch(error => {
            console.error('Erro ao fazer login:', error);
            toast({
                variant: 'destructive',
                title: 'Erro de Registro',
                description: error.description
            });
        }).finally(() => {
            setLoading(null);
        })
    };

    const handleGoogleAuth = async () => {
        setLoading('google');
        appModules.signWithProviderUseCase.execute()
            .then(user => {
                console.log('User authed: ', user);
                toast({
                    title: 'Autenticação bem-sucedida!',
                    description: 'Você está conectado com sua conta do Google.',
                });
                onOpenChange(false);
            })
            .catch(error => {
                toast({
                    variant: 'destructive',
                    title: 'Erro na Autenticação com Google',
                    description: error.message
                });
            })
            .finally(() => {
                setLoading(null);
            })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline text-3xl text-center">
                        {activeTab === 'login' ? 'Bem-vindo de Volta!' : 'Crie sua Conta'}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {activeTab === 'login' ? 'Faça login para continuar.' : 'É rápido e fácil.'}
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Entrar</TabsTrigger>
                        <TabsTrigger value="register">Criar Conta</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 pt-4">
                                <FormField
                                    control={loginForm.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="seu@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={loginForm.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Senha</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Sua senha" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={!!loading}>
                                    {loading === 'email' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                    Entrar
                                </Button>
                            </form>
                        </Form>
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t"/>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                    </span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" type="button" disabled={!!loading}
                                onClick={handleGoogleAuth}>
                            {loading === 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <GoogleIcon/>}
                            Google
                        </Button>
                    </TabsContent>

                    <TabsContent value="register">
                        <Form {...registerForm}>
                            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 pt-4">
                                <FormField
                                    control={registerForm.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Nome Completo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Seu nome" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="seu@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Senha</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Crie uma senha forte" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="confirmPassword"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Confirmar Senha</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Confirme sua senha" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={!!loading}>
                                    {loading === 'email' && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                    Criar Conta
                                </Button>
                            </form>
                        </Form>
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t"/>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                    </span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" type="button" disabled={!!loading}
                                onClick={handleGoogleAuth}>
                            {loading === 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <GoogleIcon/>}
                            Google
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
