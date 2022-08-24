import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RateLimitService } from './rate-limit/rate-limit.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly rateLimitService: RateLimitService) {}
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const controller = context.getClass().name;
    const request = context.switchToHttp().getRequest();
    const requestTimeStamp = Date.now();
    try {
      if (controller === 'PrivateController') {
        const jwt = request.headers.authorization;
        return this.rateLimitService.jwtRateLimit(jwt, requestTimeStamp);
      }
      const ip = request.ip;
      return this.rateLimitService.ipRateLimit(ip, requestTimeStamp);
    } catch (error) {
      throw new HttpException(error.message, 429);
    }
  }
}
