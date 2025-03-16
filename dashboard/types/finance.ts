export interface StockData {
  'Meta Data': {
    '2. Symbol': string;
    '3. Last Refreshed': string;
  };
  'Time Series (Daily)': {
    [date: string]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. volume': string;
    };
  };
}

export interface SymbolSearchData {
  bestMatches: {
    '1. symbol': string;
    '2. name': string;
  }[];
}