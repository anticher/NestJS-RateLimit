import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(context.switchToHttp().getRequest().headers);
    const headers = context.switchToHttp().getRequest().headers;
    if (!headers.authorization) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
