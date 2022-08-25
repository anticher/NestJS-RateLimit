import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { RateLimitGuard } from 'src/guards/rate-limit/rate-limit.guard';
import { PrivateService } from './private.service';

@UseGuards(JwtAuthGuard)
@UseGuards(RateLimitGuard)
@Controller('private')
export class PrivateController {
  constructor(private readonly privateService: PrivateService) {}

  @Get('first')
  @SetMetadata('rateWeight', '1')
  public getfirst(): string {
    return this.privateService.getFirst();
  }

  @Get('second')
  @SetMetadata('rateWeight', '2')
  public getSecond(): string {
    return this.privateService.getSecond();
  }

  @Get('third')
  @SetMetadata('rateWeight', '18')
  public getThird(): string {
    return this.privateService.getThird();
  }
}
