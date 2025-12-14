import {Ticket, Twitter, Instagram, Facebook} from 'lucide-react';
import Link from 'next/link';
import {Button} from '@/src/components/ui/button';

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <Ticket className="h-6 w-6 text-primary"/>
                        <span className="font-bold font-headline text-lg">azticket</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Azticket. Todos os direitos reservados.
                    </p>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="#"><Twitter className="h-4 w-4"/></Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="#"><Instagram className="h-4 w-4"/></Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="#"><Facebook className="h-4 w-4"/></Link>
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
