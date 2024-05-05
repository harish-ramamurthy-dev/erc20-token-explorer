import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const signature =
    '0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a1b';
  const ethAddress = '0xf924e868F24F47804F0c79015DF5571EC98f820F';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should verify valid signature', async () => {
    const address = await service.signUp(signature);
    expect(address).toEqual(ethAddress);
  });

  it('should throw BadRequestException for invalid signature', async () => {
    const invalidSignature = 'invalid';
    await expect(service.signUp(invalidSignature)).rejects.toThrow(
      new BadRequestException('Invalid Signature'),
    );
  });
});
