import { EvmErc20TokenBalanceWithPrice } from '@moralisweb3/common-evm-utils';
import { Injectable } from '@nestjs/common';
import { Erc20TokenWithNetWorth } from './interface/erc20.interface';

@Injectable()
export class TokenMapperService {
  getErc20TokensWithNetWorth(
    moralisErc20Response: EvmErc20TokenBalanceWithPrice[],
    netWorth: string,
  ): Erc20TokenWithNetWorth {
    const tokens = moralisErc20Response.map((token) => ({
      symbol: token.symbol,
      name: token.name,
      balance: token.balanceFormatted,
    }));

    return {
      netWorth: Number(parseFloat(netWorth).toFixed(2)),
      tokens,
    };
  }
}
