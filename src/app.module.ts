import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicModule } from './public/public.module';
import { PrivateModule } from './private/private.module';
import { RateLimitModule } from './guards/rate-limit/rate-limit.module';

const envType = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !envType ? '.env' : `.env.${envType}`,
    }),
    PublicModule,
    PrivateModule,
    RateLimitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
