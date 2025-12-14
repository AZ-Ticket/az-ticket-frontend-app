"use client";

import React from 'react';
import { Input } from '@/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Card } from '@/src/components/ui/card';
import { Search } from 'lucide-react';

type Filters = {
  search: string;
  category: string;
  date: string;
  price: string;
};

type EventFiltersProps = {
  onFilterChange: (filters: Filters) => void;
};

export function EventFilters({ onFilterChange }: EventFiltersProps) {
  const [filters, setFilters] = React.useState<Filters>({
    search: '',
    category: 'all',
    date: '',
    price: 'all',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSelectChange = (name: keyof Filters) => (value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Card className="p-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
            type="text"
            name="search"
            placeholder="Buscar eventos..."
            value={filters.search}
            onChange={handleInputChange}
            className="pl-10"
            />
        </div>
        <Select name="category" onValueChange={handleSelectChange('category')} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Todas as Categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Categorias</SelectItem>
            <SelectItem value="music">Música</SelectItem>
            <SelectItem value="festival">Festival</SelectItem>
            <SelectItem value="conference">Conferência</SelectItem>
            <SelectItem value="theater">Teatro</SelectItem>
            <SelectItem value="sports">Esportes</SelectItem>
            <SelectItem value="workshop">Oficina</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleInputChange}
        />
        <Select name="price" onValueChange={handleSelectChange('price')} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Todos os Preços" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Preços</SelectItem>
            <SelectItem value="free">Grátis</SelectItem>
            <SelectItem value="paid">Pago</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
