"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QrCode, CheckCircle, XCircle, Ticket } from 'lucide-react';

type ScanStatus = 'idle' | 'success' | 'error';

export default function ScanPage() {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [ticketId, setTicketId] = useState<string>('');

  const handleScan = () => {
    // Simula uma chance de 50/50 de sucesso ou erro
    const isSuccess = Math.random() > 0.5;
    const newTicketId = `INGRESSO-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(newTicketId);
    setStatus(isSuccess ? 'success' : 'error');
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-md text-center">
        <div className="flex flex-col items-center gap-4 mb-8">
            <QrCode className="h-12 w-12 text-primary" />
            <h1 className="font-headline text-5xl font-bold">Escaner de Ingressos</h1>
            <p className="text-muted-foreground">
            Simule a leitura de um ingresso para verificar sua autenticidade.
            </p>
        </div>

        <Button onClick={handleScan} size="lg" className="w-full text-lg py-6 mb-8">
          <Ticket className="mr-2 h-5 w-5" />
          Escanear Ingresso
        </Button>

        {status === 'success' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle className="text-green-600">Ingresso Válido!</AlertTitle>
            <AlertDescription>
              Acesso concedido para o ID do ingresso: <span className="font-mono">{ticketId}</span>
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Ingresso Inválido!</AlertTitle>
            <AlertDescription>
              Este ingresso ({ticketId}) não é válido ou já foi utilizado.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
