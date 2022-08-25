import { Module } from '@nestjs/common';
import { PrivateService } from './private.service';
import { PrivateController } from './private.controller';
import { RateLimitModule } from 'src/guards/rate-limit/rate-limit.module';

@Module({
  imports: [RateLimitModule],
  controllers: [PrivateController],
  providers: [PrivateService],
})
export class PrivateModule {}
