import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PrivateService } from './private.service';

@Controller('private')
export class PrivateController {
  constructor(private readonly privateService: PrivateService) {}

  @UseGuards(JwtAuthGuard)
  @Get('first')
  public getfirst(): string {
    return this.privateService.getFirst();
  }

  @UseGuards(JwtAuthGuard)
  @Get('second')
  public getSecond(): string {
    return this.privateService.getSecond();
  }

  @UseGuards(JwtAuthGuard)
  @Get('third')
  public getThird(): string {
    return this.privateService.getThird();
  }
}
