"use client";

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Ticket, Menu, LogOut} from 'lucide-react';
import {useUser, useFirestore, useDoc, useMemoFirebase} from '@/src/firebase';
import {doc} from 'firebase/firestore';
import {cn} from '../utils';
import {appModules} from '@/src/di/AppModules';
import {Button} from '@/src/components/ui/button';
import {Sheet, SheetContent, SheetTrigger} from "@/src/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {Avatar, AvatarFallback, AvatarImage} from "@/src/components/ui/avatar"
import {AuthModal} from '../auth/auth-modal';
import {useState} from 'react';
import {useToast} from '@/src/hooks/use-toast';
import {User} from "@/src/domain/model/User";

const navItems = [
    {href: '/', label: 'Eventos'},
    {href: '/tickets', label: 'Meus Ingressos'},
    {href: '/recommendations', label: 'Para Você'},
];

export function Header() {
    const pathname = usePathname();
    const {toast} = useToast();
    const {user, isUserLoading} = useUser();
    const firestore = useFirestore();
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    const userDocRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);

    const {data: appUser} = useDoc<User>(userDocRef);

    const isOrganizer = appUser?.role === 'admin';

    const navItemsForUser = user && isOrganizer
        ? [
            ...navItems,
            {href: '/my-events', label: 'Meus Eventos'},
            {href: '/create', label: 'Criar Evento'},
            {href: '/scan', label: 'Escanear'}
        ]
        : navItems;

    const handleLogout = async () => {
        try {
            await appModules.signOutUseCase.execute();
            toast({
                title: 'Logout bem-sucedido!',
                description: 'Você foi desconectado.',
            });
        } catch (error) {
            console.error("Error signing out:", error)
            toast({
                variant: 'destructive',
                title: 'Erro no Logout',
                description: 'Não foi possível fazer o logout. Tente novamente.',
            });
        }
    };

    const renderNavLinks = (items: { href: string, label: string }[], isMobile = false) => (
        items.map(item => (
            <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                    "transition-colors",
                    pathname === item.href
                        ? 'text-primary hover:text-primary'
                        : 'text-muted-foreground hover:text-foreground',
                    isMobile && 'w-full justify-start'
                )}
            >
                <Link href={item.href}>{item.label}</Link>
            </Button>
        ))
    );

    return (
        <>
            <header
                className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center">
                    <div className="mr-4 flex">
                        <Link href="/" className="flex items-center space-x-2">
                            <Ticket className="h-6 w-6 text-primary"/>
                            <span className="font-bold font-headline text-lg">azticket</span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center space-x-2 lg:space-x-4 ml-auto mr-4">
                        {renderNavLinks(navItemsForUser)}
                    </nav>

                    <div className="flex flex-1 items-center justify-end space-x-4">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.photoURL || undefined}
                                                         alt={user.displayName || user.email || 'User'}/>
                                            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.displayName || appUser?.name || user.email}</p>
                                            {user.displayName &&
                                                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>}
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4"/>
                                        <span>Sair</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button onClick={() => setAuthModalOpen(true)} disabled={isUserLoading}>
                                {isUserLoading ? '...' : 'Entrar'}
                            </Button>
                        )}
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-6 w-6"/>
                                        <span className="sr-only">Alternar Menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right">
                                    <div className="flex flex-col space-y-4 pt-8">
                                        {renderNavLinks(navItemsForUser, true)}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>
            <AuthModal isOpen={isAuthModalOpen} onOpenChange={setAuthModalOpen}/>
        </>
    );
}
