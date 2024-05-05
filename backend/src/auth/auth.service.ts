import { BadRequestException, Injectable } from '@nestjs/common';
import { verifyMessage } from 'ethers';

@Injectable()
export class AuthService {
  async signUp(signature: string): Promise<string> {
    return this.verifySignature(signature);
  }

  private async verifySignature(signature: string): Promise<string> {
    const message = 'Signup';
    try {
      return verifyMessage(message, signature);
    } catch (error) {
      throw new BadRequestException('Invalid Signature');
    }
  }
}
