import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CacheKey } from './cache-key.enum';
import { Erc20LeaderBoard } from '../token/interface/erc20-leaderboard.interface';

@Injectable()
export class CacheService {
  private readonly CACHE_TTL = 3600 * 1000;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getCacheByKey<T>(key: CacheKey): Promise<T> {
    return this.cacheManager.get(key);
  }

  async setLeaderboardCache(
    key: CacheKey,
    value: Erc20LeaderBoard,
  ): Promise<void> {
    const currentValue = await this.getCacheByKey(key);
    if (currentValue && Array.isArray(currentValue)) {
      const cache = currentValue.find((item) => item.address === value.address);
      if (cache) {
        cache.netWorth = value.netWorth;
        await this.cacheManager.set(key, currentValue, this.CACHE_TTL);
      } else {
        await this.cacheManager.set(
          key,
          [...currentValue, value],
          this.CACHE_TTL,
        );
      }
    } else {
      await this.cacheManager.set(key, [value], this.CACHE_TTL);
    }
  }
}
