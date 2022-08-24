import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { RateLimitModule } from 'src/guards/rate-limit/rate-limit.module';

@Module({
  imports: [RateLimitModule],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
