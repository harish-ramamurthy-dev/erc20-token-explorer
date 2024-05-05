import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CacheKey } from './cache-key.enum';

@Injectable()
export class CacheService {
  private readonly CACHE_TTL = 3600 * 1000;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getCacheByKey<T>(key: CacheKey): Promise<T> {
    return this.cacheManager.get(key);
  }

  async setCacheByKey<T>(key: CacheKey, value: T): Promise<T> {
    const currentValue = await this.getCacheByKey(key);
    let newValue;
    if (currentValue && Array.isArray(currentValue)) {
      if (Array.isArray(value)) {
        newValue = await this.cacheManager.set(
          key,
          [...currentValue, ...value],
          this.CACHE_TTL,
        );
      } else {
        newValue = await this.cacheManager.set(
          key,
          [...currentValue, value],
          this.CACHE_TTL,
        );
      }
    } else {
      newValue = await this.cacheManager.set(key, value, this.CACHE_TTL);
    }
    return newValue;
  }
}
