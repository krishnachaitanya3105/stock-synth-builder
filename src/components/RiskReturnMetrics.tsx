import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Shield, Target, Activity } from 'lucide-react';

interface PortfolioMetrics {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  diversificationScore: number;
}

interface RiskReturnMetricsProps {
  metrics: PortfolioMetrics | null;
}

export default function RiskReturnMetrics({ metrics }: RiskReturnMetricsProps) {
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatRatio = (value: number) => {
    return value.toFixed(2);
  };

  const getRiskLevel = (volatility: number) => {
    if (volatility < 0.15) return { level: 'Low', color: 'text-success', bg: 'bg-success/10' };
    if (volatility < 0.25) return { level: 'Medium', color: 'text-warning', bg: 'bg-warning/10' };
    return { level: 'High', color: 'text-destructive', bg: 'bg-destructive/10' };
  };

  const getPerformanceGrade = (sharpeRatio: number) => {
    if (sharpeRatio > 2) return { grade: 'Excellent', color: 'text-success' };
    if (sharpeRatio > 1) return { grade: 'Good', color: 'text-info' };
    if (sharpeRatio > 0.5) return { grade: 'Fair', color: 'text-warning' };
    return { grade: 'Poor', color: 'text-destructive' };
  };

  if (!metrics) {
    return (
      <Card className="shadow-card bg-gradient-card border-border/50">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-muted">
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-financial-primary">Risk & Return Analysis</CardTitle>
              <CardDescription>
                Portfolio performance metrics and risk assessment
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Optimize your portfolio to see risk analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const riskLevel = getRiskLevel(metrics.volatility);
  const performanceGrade = getPerformanceGrade(metrics.sharpeRatio);

  return (
    <Card className="shadow-card bg-gradient-card border-border/50">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Activity className="h-5 w-5 text-financial-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-financial-primary">Risk & Return Analysis</CardTitle>
            <CardDescription>
              Portfolio performance metrics and risk assessment
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-background border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-muted-foreground">Expected Return</span>
            </div>
            <div className="text-2xl font-bold text-success">
              {formatPercentage(metrics.expectedReturn)}
            </div>
            <div className="text-xs text-muted-foreground">Annual return</div>
          </div>

          <div className="p-4 rounded-lg bg-background border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium text-muted-foreground">Volatility</span>
            </div>
            <div className="text-2xl font-bold text-warning">
              {formatPercentage(metrics.volatility)}
            </div>
            <div className="text-xs text-muted-foreground">
              <Badge variant="outline" className={`${riskLevel.color} ${riskLevel.bg} border-0`}>
                {riskLevel.level} Risk
              </Badge>
            </div>
          </div>
        </div>

        {/* Sharpe Ratio */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-info" />
              <span className="text-sm font-medium">Sharpe Ratio</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-foreground">{formatRatio(metrics.sharpeRatio)}</span>
              <Badge variant="outline" className={`ml-2 ${performanceGrade.color} border-0`}>
                {performanceGrade.grade}
              </Badge>
            </div>
          </div>
          <Progress 
            value={Math.min(metrics.sharpeRatio * 50, 100)} 
            className="h-2 bg-muted"
          />
          <div className="text-xs text-muted-foreground">
            Risk-adjusted return efficiency
          </div>
        </div>

        {/* Max Drawdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">Maximum Drawdown</span>
            </div>
            <span className="text-lg font-bold text-destructive">
              {formatPercentage(metrics.maxDrawdown)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Worst-case scenario loss from peak
          </div>
        </div>

        {/* Diversification Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-info" />
              <span className="text-sm font-medium">Diversification Score</span>
            </div>
            <span className="text-lg font-bold text-info">
              {(metrics.diversificationScore * 100).toFixed(0)}/100
            </span>
          </div>
          <Progress 
            value={metrics.diversificationScore * 100} 
            className="h-2 bg-muted"
          />
          <div className="text-xs text-muted-foreground">
            Portfolio risk distribution effectiveness
          </div>
        </div>
      </CardContent>
    </Card>
  );
}