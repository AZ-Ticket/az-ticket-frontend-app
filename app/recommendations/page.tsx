import { RecommendationForm } from '@/components/recommendation-form';
import { Bot } from 'lucide-react';

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center gap-4 mb-8">
        <Bot className="h-12 w-12 text-primary" />
        <h1 className="font-headline text-5xl font-bold">Recomendações de IA</h1>
        <p className="max-w-2xl text-muted-foreground">
          Deixe nossa IA sugerir eventos que você vai adorar. Conte-nos sobre os eventos que você gostou e o que está procurando, e nós geraremos uma lista personalizada para você.
        </p>
      </div>
      
      <RecommendationForm />
    </div>
  );
}
