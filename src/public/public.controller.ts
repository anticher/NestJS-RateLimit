import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { RateLimitGuard } from 'src/guards/rate-limit/rate-limit.guard';
import { PublicService } from './public.service';

@UseGuards(RateLimitGuard)
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('first')
  @SetMetadata('rateWeight', '1')
  public getfirst(): string {
    return this.publicService.getFirst();
  }

  @Get('second')
  @SetMetadata('rateWeight', '2')
  public getSecond(): string {
    return this.publicService.getSecond();
  }

  @Get('third')
  @SetMetadata('rateWeight', '5')
  public getThird(): string {
    return this.publicService.getThird();
  }
}
