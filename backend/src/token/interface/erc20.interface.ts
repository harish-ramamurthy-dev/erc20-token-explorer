export interface Erc20Token {
  symbol: string;
  name: string;
  balance: string;
}

export interface Erc20TokenWithNetWorth {
  netWorth: number;
  tokens: Erc20Token[];
}
