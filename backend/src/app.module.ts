import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({ isGlobal: true }),
    AuthModule,
    TokenModule.register(),
    CommonModule,
  ],
})
export class AppModule {}
