import type {Metadata} from 'next';
import './globals.css';
import {Header} from '@/src/components/layout/header';
import {Footer} from '@/src/components/layout/footer';
import {Toaster} from '@/src/components/ui/toaster';
import {FirebaseClientProvider} from '@/src/firebase/client-provider';

export const metadata: Metadata = {
    title: 'Azticket',
    description: 'Seu balcão único para ingressos de eventos.',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
            <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet"/>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap"
                  rel="stylesheet"/>
        </head>
        <body className="font-body bg-background text-foreground antialiased min-h-screen flex flex-col"
              suppressHydrationWarning>
        <FirebaseClientProvider>
            <Header/>
            <main className="flex-grow">
                {children}
            </main>
            <Footer/>
            <Toaster/>
        </FirebaseClientProvider>
        </body>
        </html>
    );
}
