import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, BarChart3, TrendingUp } from 'lucide-react';

interface Stock {
  symbol: string;
  company: string;
  sector: string;
  allocation: number;
  amount: number;
  expectedReturn: number;
  risk: number;
}

interface PortfolioAllocationProps {
  stocks: Stock[];
  totalBudget: number;
}

export default function PortfolioAllocation({ stocks, totalBudget }: PortfolioAllocationProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      'technology': 'bg-blue-500',
      'healthcare': 'bg-green-500',
      'finance': 'bg-purple-500',
      'energy': 'bg-yellow-500',
      'consumer': 'bg-pink-500',
      'utilities': 'bg-orange-500',
      'industrials': 'bg-indigo-500',
      'materials': 'bg-teal-500'
    };
    return colors[sector] || 'bg-gray-500';
  };

  return (
    <Card className="shadow-card bg-gradient-card border-border/50">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-success">
            <BarChart3 className="h-5 w-5 text-success-foreground" />
          </div>
          <div>
            <CardTitle className="text-financial-primary">Optimized Portfolio Allocation</CardTitle>
            <CardDescription>
              Suggested distribution for {formatCurrency(totalBudget)} investment
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {stocks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <PieChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Configure your portfolio to see allocations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stocks.map((stock, index) => (
              <div key={index} className="space-y-3 p-4 rounded-lg bg-background border border-border/30 hover:border-border/60 transition-smooth">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getSectorColor(stock.sector)}`} />
                    <div>
                      <div className="font-semibold text-foreground">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">{stock.company}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{formatCurrency(stock.amount)}</div>
                    <div className="text-sm text-muted-foreground">{formatPercentage(stock.allocation)}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Allocation</span>
                    <span className="font-medium">{formatPercentage(stock.allocation)}</span>
                  </div>
                  <Progress 
                    value={stock.allocation * 100} 
                    className="h-2 bg-muted"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs">
                    {stock.sector}
                  </Badge>
                  <div className="flex gap-4 text-xs">
                    <span className="text-success">
                      Return: {formatPercentage(stock.expectedReturn)}
                    </span>
                    <span className="text-warning">
                      Risk: {formatPercentage(stock.risk)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}