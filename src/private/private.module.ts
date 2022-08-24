import { Module } from '@nestjs/common';
import { PrivateService } from './private.service';
import { PrivateController } from './private.controller';

@Module({
  controllers: [PrivateController],
  providers: [PrivateService],
})
export class PrivateModule {}
