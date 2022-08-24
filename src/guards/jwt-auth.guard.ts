import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const headers = context.switchToHttp().getRequest().headers;

    if (!headers.authorization) {
      throw new UnauthorizedException({ description: 'no auth token' });
    }

    if (headers.authorization !== `Bearer ${process.env.JWT_TEST_TOKEN}`) {
      throw new UnauthorizedException({ description: 'incorrect auth token' });
    }

    return true;
  }
}
