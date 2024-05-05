import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Wallet } from 'ethers';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should verify valid signature', async () => {
    const wallet = Wallet.createRandom();
    const message = 'Signup';
    const signature = await wallet.signMessage(message);
    const address = await service.signUp(signature);
    expect(address).toEqual(wallet.address);
  });

  it('should throw BadRequestException for invalid signature', async () => {
    const invalidSignature = 'invalid';
    await expect(service.signUp(invalidSignature)).rejects.toThrow(
      new BadRequestException('Invalid Signature'),
    );
  });
});
