import { Test, TestingModule } from '@nestjs/testing';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { MoralisApiService } from './moralis-api.service';
import {
  MOCK_MORALIS_ERC20_RESPONSE,
  MOCK_MORALIS_ADDRES_NET_WORTH_RESPONSE,
} from '../common/mocks';
import { Wallet } from 'ethers';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('moralis');

describe('MoralisApiService', () => {
  let service: MoralisApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoralisApiService],
    }).compile();

    service = module.get<MoralisApiService>(MoralisApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve ERC20 tokens by address', async () => {
    const mockTokensResponse = MOCK_MORALIS_ERC20_RESPONSE;

    (
      Moralis.EvmApi.wallets.getWalletTokenBalancesPrice as jest.Mock
    ).mockResolvedValueOnce({ result: mockTokensResponse });

    const address = Wallet.createRandom().address;
    const result = await service.getErc20TokensByAddress(address);

    expect(result).toEqual(mockTokensResponse);
    expect(
      Moralis.EvmApi.wallets.getWalletTokenBalancesPrice,
    ).toHaveBeenCalledWith({
      address,
      chain: EvmChain.ETHEREUM,
      excludeSpam: true,
      excludeUnverifiedContracts: true,
    });
  });

  it('should throw an InternalServerErrorException when retrieving ERC20 tokens fails', async () => {
    (
      Moralis.EvmApi.wallets.getWalletTokenBalancesPrice as jest.Mock
    ).mockRejectedValueOnce(new Error('Failed to fetch tokens'));

    const address = Wallet.createRandom().address;
    try {
      await service.getErc20TokensByAddress(address);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toEqual(
        `Failed to fetch ERC20 tokens for the address ${address} from Moralis API`,
      );
    }
  });

  it('should retrieve net worth by address', async () => {
    (
      Moralis.EvmApi.wallets.getWalletNetWorth as jest.Mock
    ).mockResolvedValueOnce(MOCK_MORALIS_ADDRES_NET_WORTH_RESPONSE);

    const address = Wallet.createRandom().address;
    const result = await service.getNetWorthByAddress(address);

    expect(result).toEqual(
      MOCK_MORALIS_ADDRES_NET_WORTH_RESPONSE.result.totalNetworthUsd,
    );
    expect(Moralis.EvmApi.wallets.getWalletNetWorth).toHaveBeenCalledWith({
      address,
      excludeSpam: true,
      excludeUnverifiedContracts: true,
    });
  });

  it('should throw an InternalServerErrorException when retrieving net worth fails', async () => {
    (
      Moralis.EvmApi.wallets.getWalletTokenBalancesPrice as jest.Mock
    ).mockRejectedValueOnce(new Error('Failed to fetch net worth'));

    const address = Wallet.createRandom().address;
    try {
      await service.getNetWorthByAddress(address);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toEqual(
        `Failed to fetch net worth for the address ${address} from Moralis API`,
      );
    }
  });
});
