import { Controller, Get, UseGuards } from '@nestjs/common';
import { RateLimitGuard } from 'src/guards/rate-limit/rate-limit.guard';
import { PublicService } from './public.service';

@UseGuards(RateLimitGuard)
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('first')
  public getfirst(): string {
    return this.publicService.getFirst();
  }

  @Get('second')
  public getSecond(): string {
    return this.publicService.getSecond();
  }

  @Get('third')
  public getThird(): string {
    return this.publicService.getThird();
  }
}
