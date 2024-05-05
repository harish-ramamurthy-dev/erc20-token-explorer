import { Test, TestingModule } from '@nestjs/testing';
import { CacheKey } from '../common/cache-key.enum';
import { CacheService } from '../common/cache.service';
import { Erc20TokenWithNetWorth } from './interface/erc20.interface';
import { MoralisApiService } from './moralis-api.service';
import { TokenMapperService } from './token-mapper.service';
import { TokenService } from './token.service';
import { MOCK_MORALIS_ERC20_RESPONSE } from '../common/mocks';
import { Wallet } from 'ethers';

jest.mock('./moralis-api.service');
jest.mock('./token-mapper.service');
jest.mock('../common/cache.service');

describe('TokenService', () => {
  let service: TokenService;
  let moralisApiService: MoralisApiService;
  let tokenMapperService: TokenMapperService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        MoralisApiService,
        TokenMapperService,
        CacheService,
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    moralisApiService = module.get<MoralisApiService>(MoralisApiService);
    tokenMapperService = module.get<TokenMapperService>(TokenMapperService);
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return Erc20TokenWithNetWorth', async () => {
    const address = Wallet.createRandom().address;
    const mockErc20Tokens = MOCK_MORALIS_ERC20_RESPONSE;
    const mockNetWorth = '1000.1234';
    const tokensWithNetWorth: Erc20TokenWithNetWorth = {
      netWorth: Number(parseFloat(mockNetWorth).toFixed(2)),
      tokens: [
        {
          symbol: 'ETH',
          name: 'Ether',
          balance: '0.009169138217756822',
        },
        {
          symbol: 'USDT',
          name: 'Tether USD',
          balance: '52.035',
        },
      ],
    };

    (moralisApiService.getErc20TokensByAddress as jest.Mock).mockResolvedValue(
      mockErc20Tokens,
    );
    (moralisApiService.getNetWorthByAddress as jest.Mock).mockResolvedValue(
      mockNetWorth,
    );
    (
      tokenMapperService.getErc20TokensWithNetWorth as jest.Mock
    ).mockReturnValue(tokensWithNetWorth);

    (cacheService.setCacheByKey as jest.Mock).mockResolvedValue(undefined);

    const result = await service.getErc20TokensWithNetWorth(address);
    expect(result).toEqual(tokensWithNetWorth);

    expect(moralisApiService.getErc20TokensByAddress).toHaveBeenCalledWith(
      address,
    );
    expect(moralisApiService.getNetWorthByAddress).toHaveBeenCalledWith(
      address,
    );
    expect(tokenMapperService.getErc20TokensWithNetWorth).toHaveBeenCalledWith(
      mockErc20Tokens,
      mockNetWorth,
    );
    expect(cacheService.setCacheByKey).toHaveBeenCalledWith(
      CacheKey.ERC20_LEADERBOARD,
      [{ address, netWorth: result.netWorth }],
    );
  });

  it('should throw an error if MoralisApiService throws an error', async () => {
    const address = Wallet.createRandom().address;
    const errorMessage = `Failed to fetch ERC20 tokens for the address ${address} from Moralis API`;

    (moralisApiService.getErc20TokensByAddress as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    await expect(service.getErc20TokensWithNetWorth(address)).rejects.toThrow(
      errorMessage,
    );
  });

  it('should return Erc20LeaderBoard from cache', async () => {
    const mockCachedLeaderboard = [
      {
        address: Wallet.createRandom().address,
        netWorth: 1000.1234,
      },
      {
        address: Wallet.createRandom().address,
        netWorth: 2000.1234,
      },
    ];

    (cacheService.getCacheByKey as jest.Mock).mockReturnValue(
      mockCachedLeaderboard,
    );

    const result = await service.getErc20Leaderboard();

    expect(result).toEqual(mockCachedLeaderboard);

    expect(cacheService.getCacheByKey).toHaveBeenCalledWith(
      CacheKey.ERC20_LEADERBOARD,
    );
  });

  it('should return an empty array if leaderboard is not cached', async () => {
    (cacheService.getCacheByKey as jest.Mock).mockReturnValue(null);

    const result = await service.getErc20Leaderboard();

    expect(result).toEqual([]);

    expect(cacheService.getCacheByKey).toHaveBeenCalledWith(
      CacheKey.ERC20_LEADERBOARD,
    );
  });
});
