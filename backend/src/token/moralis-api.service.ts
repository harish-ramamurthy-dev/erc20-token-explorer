import {
  EvmChain,
  EvmErc20TokenBalanceWithPrice,
} from '@moralisweb3/common-evm-utils';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Moralis from 'moralis';

@Injectable()
export class MoralisApiService {
  async getErc20TokensByAddress(
    address: string,
  ): Promise<EvmErc20TokenBalanceWithPrice[]> {
    try {
      const tokensResponse =
        await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
          address,
          chain: EvmChain.ETHEREUM,
          excludeSpam: true,
          excludeUnverifiedContracts: true,
        });
      return tokensResponse.result;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch ERC20 tokens for the address ${address} from Moralis API`,
      );
    }
  }

  async getNetWorthByAddress(address: string): Promise<string> {
    try {
      const netWorthResponse = await Moralis.EvmApi.wallets.getWalletNetWorth({
        address,
        excludeSpam: true,
        excludeUnverifiedContracts: true,
      });
      return netWorthResponse.result.totalNetworthUsd;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch net worth for the address ${address} from Moralis API`,
      );
    }
  }
}
