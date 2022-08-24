import { Controller, Get } from '@nestjs/common';
import { PrivateService } from './private.service';

@Controller('private')
export class PrivateController {
  constructor(private readonly privateService: PrivateService) {}

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
