// Mock portfolio optimization engine
// In a real application, this would connect to financial APIs and use sophisticated algorithms

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

// Mock stock data for different sectors
const MOCK_STOCKS: Record<string, Array<{
  symbol: string;
  company: string;
  expectedReturn: number;
  risk: number;
  correlation: number;
}>> = {
  technology: [
    { symbol: 'AAPL', company: 'Apple Inc.', expectedReturn: 0.12, risk: 0.22, correlation: 0.7 },
    { symbol: 'GOOGL', company: 'Alphabet Inc.', expectedReturn: 0.14, risk: 0.25, correlation: 0.8 },
    { symbol: 'MSFT', company: 'Microsoft Corporation', expectedReturn: 0.13, risk: 0.20, correlation: 0.75 },
    { symbol: 'NVDA', company: 'NVIDIA Corporation', expectedReturn: 0.18, risk: 0.35, correlation: 0.6 }
  ],
  healthcare: [
    { symbol: 'JNJ', company: 'Johnson & Johnson', expectedReturn: 0.08, risk: 0.15, correlation: 0.3 },
    { symbol: 'PFE', company: 'Pfizer Inc.', expectedReturn: 0.09, risk: 0.18, correlation: 0.4 },
    { symbol: 'UNH', company: 'UnitedHealth Group', expectedReturn: 0.11, risk: 0.16, correlation: 0.35 },
    { symbol: 'ABBV', company: 'AbbVie Inc.', expectedReturn: 0.10, risk: 0.17, correlation: 0.4 }
  ],
  finance: [
    { symbol: 'JPM', company: 'JPMorgan Chase & Co.', expectedReturn: 0.10, risk: 0.25, correlation: 0.6 },
    { symbol: 'BAC', company: 'Bank of America Corp.', expectedReturn: 0.09, risk: 0.28, correlation: 0.65 },
    { symbol: 'WFC', company: 'Wells Fargo & Company', expectedReturn: 0.08, risk: 0.30, correlation: 0.7 },
    { symbol: 'GS', company: 'Goldman Sachs Group', expectedReturn: 0.12, risk: 0.32, correlation: 0.55 }
  ],
  energy: [
    { symbol: 'XOM', company: 'Exxon Mobil Corporation', expectedReturn: 0.07, risk: 0.35, correlation: 0.5 },
    { symbol: 'CVX', company: 'Chevron Corporation', expectedReturn: 0.08, risk: 0.32, correlation: 0.6 },
    { symbol: 'COP', company: 'ConocoPhillips', expectedReturn: 0.09, risk: 0.38, correlation: 0.55 },
    { symbol: 'EOG', company: 'EOG Resources Inc.', expectedReturn: 0.10, risk: 0.40, correlation: 0.5 }
  ],
  consumer: [
    { symbol: 'AMZN', company: 'Amazon.com Inc.', expectedReturn: 0.15, risk: 0.28, correlation: 0.4 },
    { symbol: 'TSLA', company: 'Tesla Inc.', expectedReturn: 0.20, risk: 0.45, correlation: 0.3 },
    { symbol: 'HD', company: 'Home Depot Inc.', expectedReturn: 0.11, risk: 0.18, correlation: 0.5 },
    { symbol: 'MCD', company: 'McDonald\'s Corporation', expectedReturn: 0.09, risk: 0.14, correlation: 0.2 }
  ],
  utilities: [
    { symbol: 'NEE', company: 'NextEra Energy Inc.', expectedReturn: 0.07, risk: 0.12, correlation: 0.2 },
    { symbol: 'DUK', company: 'Duke Energy Corporation', expectedReturn: 0.06, risk: 0.14, correlation: 0.3 },
    { symbol: 'SO', company: 'Southern Company', expectedReturn: 0.05, risk: 0.13, correlation: 0.35 },
    { symbol: 'AEP', company: 'American Electric Power', expectedReturn: 0.06, risk: 0.15, correlation: 0.4 }
  ],
  industrials: [
    { symbol: 'BA', company: 'Boeing Company', expectedReturn: 0.11, risk: 0.30, correlation: 0.5 },
    { symbol: 'CAT', company: 'Caterpillar Inc.', expectedReturn: 0.10, risk: 0.28, correlation: 0.6 },
    { symbol: 'GE', company: 'General Electric Company', expectedReturn: 0.08, risk: 0.25, correlation: 0.55 },
    { symbol: 'MMM', company: '3M Company', expectedReturn: 0.07, risk: 0.16, correlation: 0.4 }
  ],
  materials: [
    { symbol: 'LIN', company: 'Linde plc', expectedReturn: 0.09, risk: 0.20, correlation: 0.4 },
    { symbol: 'SHW', company: 'Sherwin-Williams Company', expectedReturn: 0.10, risk: 0.22, correlation: 0.3 },
    { symbol: 'APD', company: 'Air Products and Chemicals', expectedReturn: 0.08, risk: 0.18, correlation: 0.35 },
    { symbol: 'ECL', company: 'Ecolab Inc.', expectedReturn: 0.09, risk: 0.17, correlation: 0.25 }
  ]
};

export function optimizePortfolio(budget: number, selectedSectors: string[]): {
  stocks: Stock[];
  metrics: PortfolioMetrics;
} {
  // Simple portfolio optimization using mean variance optimization principles
  const availableStocks = selectedSectors.flatMap(sector => 
    (MOCK_STOCKS[sector] || []).map(stock => ({ ...stock, sector }))
  );

  if (availableStocks.length === 0) {
    return { stocks: [], metrics: getDefaultMetrics() };
  }

  // Select top stocks from each sector based on risk-adjusted returns
  const selectedStocks = selectedSectors.map(sector => {
    const sectorStocks = MOCK_STOCKS[sector] || [];
    // Sort by Sharpe ratio approximation (return / risk)
    const bestStock = sectorStocks.sort((a, b) => (b.expectedReturn / b.risk) - (a.expectedReturn / a.risk))[0];
    return { ...bestStock, sector };
  }).filter(Boolean);

  // Equal weight allocation with slight optimization
  let totalWeight = selectedStocks.length;
  const baseWeight = 1 / totalWeight;
  
  // Adjust weights based on risk-return profile
  const optimizedStocks: Stock[] = selectedStocks.map((stock, index) => {
    // Better stocks get slightly higher allocation
    const sharpeRatio = stock.expectedReturn / stock.risk;
    const weightAdjustment = (sharpeRatio - 0.5) * 0.1; // Small adjustment
    const finalWeight = Math.max(0.05, Math.min(0.4, baseWeight + weightAdjustment));
    
    return {
      symbol: stock.symbol,
      company: stock.company,
      sector: stock.sector,
      allocation: finalWeight,
      amount: budget * finalWeight,
      expectedReturn: stock.expectedReturn,
      risk: stock.risk
    };
  });

  // Normalize allocations to sum to 1
  const totalAllocation = optimizedStocks.reduce((sum, stock) => sum + stock.allocation, 0);
  optimizedStocks.forEach(stock => {
    stock.allocation = stock.allocation / totalAllocation;
    stock.amount = budget * stock.allocation;
  });

  // Calculate portfolio metrics
  const metrics = calculatePortfolioMetrics(optimizedStocks);

  return { stocks: optimizedStocks, metrics };
}

function calculatePortfolioMetrics(stocks: Stock[]): PortfolioMetrics {
  if (stocks.length === 0) return getDefaultMetrics();

  // Portfolio expected return (weighted average)
  const expectedReturn = stocks.reduce((sum, stock) => 
    sum + (stock.allocation * stock.expectedReturn), 0
  );

  // Simplified volatility calculation (assumes some correlation)
  const portfolioVariance = stocks.reduce((sum, stock) => 
    sum + (stock.allocation ** 2 * stock.risk ** 2), 0
  );
  
  // Add correlation effects (simplified)
  const correlationAdjustment = stocks.length > 1 ? 0.3 * Math.sqrt(portfolioVariance) : 0;
  const volatility = Math.sqrt(portfolioVariance + correlationAdjustment);

  // Sharpe ratio (assuming 3% risk-free rate)
  const riskFreeRate = 0.03;
  const sharpeRatio = (expectedReturn - riskFreeRate) / volatility;

  // Maximum drawdown (estimated based on volatility)
  const maxDrawdown = volatility * 1.5;

  // Diversification score (based on number of sectors and allocation distribution)
  const uniqueSectors = new Set(stocks.map(s => s.sector)).size;
  const allocationVariance = stocks.reduce((sum, stock) => 
    sum + ((stock.allocation - (1/stocks.length)) ** 2), 0
  );
  const diversificationScore = Math.min(1, (uniqueSectors / 8) * (1 - allocationVariance * 5));

  return {
    expectedReturn,
    volatility,
    sharpeRatio,
    maxDrawdown,
    diversificationScore
  };
}

function getDefaultMetrics(): PortfolioMetrics {
  return {
    expectedReturn: 0,
    volatility: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    diversificationScore: 0
  };
}

// Simulate API delay
export function simulateOptimization(budget: number, selectedSectors: string[]): Promise<{
  stocks: Stock[];
  metrics: PortfolioMetrics;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(optimizePortfolio(budget, selectedSectors));
    }, 1500 + Math.random() * 1000); // 1.5-2.5 second delay
  });
}