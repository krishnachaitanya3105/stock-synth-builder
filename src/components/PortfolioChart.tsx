import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Stock {
  symbol: string;
  company: string;
  sector: string;
  allocation: number;
  amount: number;
  expectedReturn: number;
  risk: number;
}

interface PortfolioChartProps {
  stocks: Stock[];
}

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#14B8A6', // Teal
];

export default function PortfolioChart({ stocks }: PortfolioChartProps) {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

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

  const pieData = stocks.map((stock, index) => ({
    name: stock.symbol,
    value: stock.allocation * 100,
    amount: stock.amount,
    color: COLORS[index % COLORS.length]
  }));

  const barData = stocks.map((stock, index) => ({
    symbol: stock.symbol,
    allocation: stock.allocation * 100,
    expectedReturn: stock.expectedReturn * 100,
    risk: stock.risk * 100,
    color: COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      if (chartType === 'pie') {
        const data = payload[0].payload;
        return (
          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
            <p className="font-semibold">{data.name}</p>
            <p className="text-primary">{`Allocation: ${data.value.toFixed(1)}%`}</p>
            <p className="text-muted-foreground">{`Amount: ${formatCurrency(data.amount)}`}</p>
          </div>
        );
      } else {
        return (
          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
            <p className="font-semibold">{label}</p>
            {payload.map((entry: any, index: number) => (
              <p key={index} style={{ color: entry.color }}>
                {`${entry.dataKey}: ${entry.value.toFixed(1)}%`}
              </p>
            ))}
          </div>
        );
      }
    }
    return null;
  };

  if (stocks.length === 0) {
    return (
      <Card className="shadow-card bg-gradient-card border-border/50">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-muted">
              <PieChartIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-financial-primary">Portfolio Visualization</CardTitle>
              <CardDescription>
                Interactive charts showing your portfolio distribution
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            <PieChartIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Optimize your portfolio to see visualization</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card bg-gradient-card border-border/50">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <PieChartIcon className="h-5 w-5 text-financial-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-financial-primary">Portfolio Visualization</CardTitle>
              <CardDescription>
                Interactive charts showing your portfolio distribution
              </CardDescription>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={chartType === 'pie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('pie')}
              className="transition-smooth"
            >
              <PieChartIcon className="h-4 w-4 mr-1" />
              Pie
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="transition-smooth"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Bar
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ symbol, value }) => `${symbol}: ${value.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            ) : (
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="symbol" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="allocation" 
                  fill="#3B82F6" 
                  name="Allocation %" 
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="expectedReturn" 
                  fill="#10B981" 
                  name="Expected Return %" 
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="risk" 
                  fill="#F59E0B" 
                  name="Risk %" 
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend for Pie Chart */}
        {chartType === 'pie' && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-foreground">{item.name}</span>
                <span className="text-sm text-muted-foreground">
                  ({item.value.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}