export interface PriceLevel{
    price:number;
    size:number;
}

export interface orderBookSnapshot{
    bids:PriceLevel[];
    ask:PriceLevel[];
    timestamps:number;
}

export interface ProcessedRow {
  price: number;
  size: number;
  total: number;
  depth: number;
  side: 'bid' | 'ask';
  flash: 'up' | 'down' | 'none';
}

export interface spreadMetrics{
  bestBid:number;
  bestAsk:number;
  spread:number;
  spreadBps:number;
  midPrice:number
}