import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimitService } from './rate-limit.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly rateLimitService: RateLimitService,
    private readonly reflector: Reflector,
  ) {}
  public canActivate(context: ExecutionContext): boolean {
    try {
      const controller = context.getClass().name;
      const request = context.switchToHttp().getRequest();
      const requestTimeStamp = Date.now();
      const rateWeight =
        +this.reflector.get<string>('rateWeight', context.getHandler()) || 1;
      console.log(rateWeight);
      if (controller === 'PrivateController') {
        const jwt = request.headers.authorization;
        return this.rateLimitService.checkRateLimit({
          accessType: 'jwt',
          accessKey: jwt,
          requestTimeStamp,
          rateWeight,
        });
      }
      const ip = request.ip;
      return this.rateLimitService.checkRateLimit({
        accessType: 'ip',
        accessKey: ip,
        requestTimeStamp,
        rateWeight,
      });
    } catch (error) {
      if (error.message.startsWith('You have reached the limit of requests')) {
        throw new HttpException(error.message, 429);
      }
      throw error;
    }
  }
}
