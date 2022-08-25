import { Controller, Get, SetMetadata } from '@nestjs/common';
import { PublicService } from './public.service';

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
