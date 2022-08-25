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
    private reflector: Reflector,
  ) {}
  public canActivate(context: ExecutionContext): boolean {
    const controller = context.getClass().name;
    const request = context.switchToHttp().getRequest();
    const requestTimeStamp = Date.now();
    const rateWeigth =
      +this.reflector.get<string>('rateWeight', context.getHandler()) || 1;
    console.log(rateWeigth);
    try {
      if (controller === 'PrivateController') {
        const jwt = request.headers.authorization;
        return this.rateLimitService.jwtRateLimit(
          jwt,
          requestTimeStamp,
          rateWeigth,
        );
      }
      const ip = request.ip;
      return this.rateLimitService.ipRateLimit(
        ip,
        requestTimeStamp,
        rateWeigth,
      );
    } catch (error) {
      throw new HttpException(error.message, 429);
    }
  }
}
