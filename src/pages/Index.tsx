import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, PieChart, BarChart3, Shield } from 'lucide-react';
import { simulateOptimization } from '@/utils/portfolioOptimizer';
import PortfolioInputForm from '@/components/PortfolioInputForm';
import PortfolioAllocation from '@/components/PortfolioAllocation';
import RiskReturnMetrics from '@/components/RiskReturnMetrics';
import PortfolioChart from '@/components/PortfolioChart';

interface Stock {
  symbol: string;
  company: string;
  sector: string;
  allocation: number;
  amount: number;
  expectedReturn: number;
  risk: number;
}

interface PortfolioMetrics {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  diversificationScore: number;
}

const Index = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [portfolioStocks, setPortfolioStocks] = useState<Stock[]>([]);
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics | null>(null);
  const [currentBudget, setCurrentBudget] = useState<number>(0);

  const handleOptimize = async (budget: number, sectors: string[]) => {
    setIsOptimizing(true);
    setCurrentBudget(budget);
    
    try {
      const result = await simulateOptimization(budget, sectors);
      setPortfolioStocks(result.stocks);
      setPortfolioMetrics(result.metrics);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-gradient-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-primary">
              <TrendingUp className="h-6 w-6 text-financial-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-financial-primary">Portfolio Optimizer</h1>
              <p className="text-muted-foreground">
                Intelligent portfolio allocation for optimal risk-adjusted returns
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-1">
            <PortfolioInputForm 
              onOptimize={handleOptimize}
              isLoading={isOptimizing}
            />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Allocation */}
            <PortfolioAllocation 
              stocks={portfolioStocks}
              totalBudget={currentBudget}
            />

            {/* Risk & Return Metrics */}
            <RiskReturnMetrics metrics={portfolioMetrics} />
          </div>
        </div>

        {/* Full Width Chart */}
        <div className="mt-6">
          <PortfolioChart stocks={portfolioStocks} />
        </div>

        {/* Quick Stats */}
        {portfolioStocks.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-success text-success-foreground">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <div>
                    <div className="text-sm opacity-90">Expected Return</div>
                    <div className="text-xl font-bold">
                      {((portfolioMetrics?.expectedReturn || 0) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-primary text-financial-primary-foreground">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <div>
                    <div className="text-sm opacity-90">Portfolio Risk</div>
                    <div className="text-xl font-bold">
                      {((portfolioMetrics?.volatility || 0) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border border-info text-info">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <div>
                    <div className="text-sm opacity-90">Sharpe Ratio</div>
                    <div className="text-xl font-bold">
                      {(portfolioMetrics?.sharpeRatio || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Assets</div>
                    <div className="text-xl font-bold text-foreground">
                      {portfolioStocks.length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
