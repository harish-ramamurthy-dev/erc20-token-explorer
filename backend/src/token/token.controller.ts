import { Controller, Get, Param } from '@nestjs/common';
import { Erc20LeaderBoard } from './interface/erc20-leaderboard.interface';
import { Erc20TokenWithNetWorth } from './interface/erc20.interface';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('/erc20/leaderboard')
  async getErc20Leaderboard(): Promise<Erc20LeaderBoard[]> {
    return this.tokenService.getErc20Leaderboard();
  }

  @Get('/erc20/:address')
  async getErc20TokensWithNetWorth(
    @Param('address') address: string,
  ): Promise<Erc20TokenWithNetWorth> {
    return this.tokenService.getErc20TokensWithNetWorth(address);
  }
}
