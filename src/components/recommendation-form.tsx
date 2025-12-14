"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { getRecommendedEvents } from '@/app/actions';
import { Button } from '@/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Textarea } from '@/src/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert"

const formSchema = z.object({
  purchaseHistory: z.string().min(10, {
    message: "Por favor, descreva suas compras passadas em pelo menos 10 caracteres.",
  }),
  preferences: z.string().min(10, {
    message: "Por favor, descreva suas preferências em pelo menos 10 caracteres.",
  }),
});

export function RecommendationForm() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchaseHistory: "",
      preferences: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations([]);
    setError(null);

    const result = await getRecommendedEvents(values);

    if (result.success) {
      setRecommendations(result.data || []);
    } else {
      setError(result.error || 'Ocorreu um erro desconhecido.');
    }
    setIsLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Conte-nos sobre você</CardTitle>
            <CardDescription>Quanto mais detalhes, melhores as recomendações!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="purchaseHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu Histórico de Compras</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="ex: 'Comprei ingressos para o Festival do Sol no ano passado e assisti a uma peça chamada Ecos do Passado.'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suas Preferências</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="ex: 'Gosto de festivais de música ao ar livre, bandas de indie rock e teatro instigante. Prefiro eventos nos fins de semana.'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Gerar Recomendações
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p>Nossa IA está pensando...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <Bot className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendations.length > 0 && (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Aqui estão suas recomendações!
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
