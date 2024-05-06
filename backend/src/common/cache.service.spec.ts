import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { Cache } from 'cache-manager';
import { CacheKey } from './cache-key.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Wallet } from 'ethers';

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('CacheService', () => {
  let service: CacheService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return cached value', async () => {
    const key = CacheKey.ERC20_LEADERBOARD;
    const cachedValue = 'cachedValue';

    mockCacheManager.get.mockResolvedValueOnce(cachedValue);

    const result = await service.getCacheByKey<string>(key);

    expect(result).toEqual(cachedValue);
    expect(cacheManager.get).toHaveBeenCalledWith(key);
  });

  it('should return null if value is not cached', async () => {
    const key = CacheKey.ERC20_LEADERBOARD;

    mockCacheManager.get.mockResolvedValueOnce(null);

    const result = await service.getCacheByKey<string>(key);

    expect(result).toBeNull();
    expect(cacheManager.get).toHaveBeenCalledWith(key);
  });

  it('should set cache with single value', async () => {
    const key = CacheKey.ERC20_LEADERBOARD;
    const value = { address: Wallet.createRandom().address, netWorth: 1000.1234 };
    const expectedNewValue = { ...value };

    mockCacheManager.get.mockResolvedValueOnce(null);
    mockCacheManager.set.mockResolvedValueOnce(expectedNewValue);

    await service.setLeaderboardCache(key, value);

    expect(cacheManager.get).toHaveBeenCalledWith(key);
    expect(cacheManager.set).toHaveBeenCalledWith(
      key,
      [value],
      expect.any(Number),
    );
  });

  it('should set cache with array value', async () => {
    const key = CacheKey.ERC20_LEADERBOARD;
    const address = Wallet.createRandom().address;
    const value = { address, netWorth: 1000.1234 };
    const currentValue = [{ address, netWorth: 2000.1234 }];
    const expectedNewValue = [value];

    mockCacheManager.get.mockResolvedValueOnce(currentValue);
    mockCacheManager.set.mockResolvedValueOnce(expectedNewValue);

    await service.setLeaderboardCache(key, value);

    expect(cacheManager.get).toHaveBeenCalledWith(key);
    expect(cacheManager.set).toHaveBeenCalledWith(
      key,
      expectedNewValue,
      expect.any(Number),
    );
  });
});
