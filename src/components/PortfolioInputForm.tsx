import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, DollarSign } from 'lucide-react';

interface PortfolioInputFormProps {
  onOptimize: (budget: number, sectors: string[]) => void;
  isLoading: boolean;
}

const SECTOR_OPTIONS = [
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'finance', label: 'Finance', icon: '🏦' },
  { value: 'energy', label: 'Energy', icon: '⚡' },
  { value: 'consumer', label: 'Consumer Goods', icon: '🛍️' },
  { value: 'utilities', label: 'Utilities', icon: '🔧' },
  { value: 'industrials', label: 'Industrials', icon: '🏭' },
  { value: 'materials', label: 'Materials', icon: '⛏️' }
];

export default function PortfolioInputForm({ onOptimize, isLoading }: PortfolioInputFormProps) {
  const [budget, setBudget] = useState<string>('10000');
  const [selectedSectors, setSelectedSectors] = useState<string[]>(['technology', 'healthcare']);

  const handleSectorToggle = (sector: string) => {
    setSelectedSectors(prev => 
      prev.includes(sector) 
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  const handleOptimize = () => {
    const budgetNum = parseFloat(budget);
    if (budgetNum > 0 && selectedSectors.length > 0) {
      onOptimize(budgetNum, selectedSectors);
    }
  };

  return (
    <Card className="shadow-card bg-gradient-card border-border/50">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <TrendingUp className="h-5 w-5 text-financial-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-financial-primary">Portfolio Configuration</CardTitle>
            <CardDescription>
              Set your investment parameters to optimize your portfolio
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Budget Input */}
        <div className="space-y-2">
          <Label htmlFor="budget" className="text-sm font-medium text-foreground">
            Investment Budget
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter your budget"
              className="pl-10 bg-background border-border/60 focus:border-primary transition-colors"
              min="100"
              step="100"
            />
          </div>
        </div>

        {/* Sector Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            Investment Sectors
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {SECTOR_OPTIONS.map((sector) => (
              <button
                key={sector.value}
                onClick={() => handleSectorToggle(sector.value)}
                className={`
                  p-3 rounded-lg border transition-smooth text-left
                  ${selectedSectors.includes(sector.value)
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background hover:bg-muted border-border/60 hover:border-border'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{sector.icon}</span>
                  <span className="text-sm font-medium">{sector.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Optimize Button */}
        <Button 
          onClick={handleOptimize}
          disabled={isLoading || !budget || selectedSectors.length === 0}
          className="w-full bg-gradient-primary hover:opacity-90 text-financial-primary-foreground shadow-financial transition-smooth"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
              Optimizing Portfolio...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Optimize Portfolio
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}