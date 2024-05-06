import { Injectable } from '@nestjs/common';
import { Erc20TokenWithNetWorth } from './interface/erc20.interface';
import { MoralisApiService } from './moralis-api.service';
import { TokenMapperService } from './token-mapper.service';
import { CacheService } from '../common/cache.service';
import { CacheKey } from '../common/cache-key.enum';
import { Erc20LeaderBoard } from './interface/erc20-leaderboard.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly moralisApiService: MoralisApiService,
    private readonly tokenMapperService: TokenMapperService,
    private readonly cacheService: CacheService,
  ) {}

  async getErc20TokensWithNetWorth(
    address: string,
  ): Promise<Erc20TokenWithNetWorth> {
    try {
      const ecr20Tokens =
        await this.moralisApiService.getErc20TokensByAddress(address);
      const netWorth =
        await this.moralisApiService.getNetWorthByAddress(address);
      const tokensWithNetWorth =
        this.tokenMapperService.getErc20TokensWithNetWorth(
          ecr20Tokens,
          netWorth,
        );
      await this.cacheService.setLeaderboardCache(CacheKey.ERC20_LEADERBOARD, {
        address,
        netWorth: tokensWithNetWorth.netWorth,
      });
      return tokensWithNetWorth;
    } catch (error) {
      throw error;
    }
  }

  async getErc20Leaderboard(): Promise<Erc20LeaderBoard[]> {
    return (
      this.cacheService.getCacheByKey<Erc20LeaderBoard[]>(
        CacheKey.ERC20_LEADERBOARD,
      ) ?? []
    );
  }
}
