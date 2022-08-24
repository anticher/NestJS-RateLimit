import { Controller, Get } from '@nestjs/common';
import { PublicService } from './public.service';

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
