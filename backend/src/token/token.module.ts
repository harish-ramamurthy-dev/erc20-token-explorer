import { DynamicModule, ServiceUnavailableException } from '@nestjs/common';
import Moralis from 'moralis';
import { MoralisApiService } from './moralis-api.service';
import { TokenMapperService } from './token-mapper.service';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { CommonModule } from 'src/common/common.module';

export class TokenModule {
  static async register(): Promise<DynamicModule> {
    try {
      await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
    } catch (error) {
      throw new ServiceUnavailableException('Cannot connect to Moralis API.');
    }
    return {
      module: TokenModule,
      imports: [CommonModule],
      controllers: [TokenController],
      providers: [MoralisApiService, TokenService, TokenMapperService],
    };
  }
}
