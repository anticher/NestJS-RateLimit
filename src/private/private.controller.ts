import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RateLimitGuard } from 'src/guards/rate-limit.guard';
import { PrivateService } from './private.service';

@UseGuards(JwtAuthGuard)
@UseGuards(RateLimitGuard)
@Controller('private')
export class PrivateController {
  constructor(private readonly privateService: PrivateService) {}

  @UseGuards(JwtAuthGuard)
  @Get('first')
  public getfirst(): string {
    return this.privateService.getFirst();
  }

  @Get('second')
  public getSecond(): string {
    return this.privateService.getSecond();
  }

  @Get('third')
  public getThird(): string {
    return this.privateService.getThird();
  }
}
