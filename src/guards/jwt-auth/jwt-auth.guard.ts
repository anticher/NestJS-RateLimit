import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const headers = context.switchToHttp().getRequest().headers;

    if (!headers.authorization) {
      throw new UnauthorizedException({ description: 'no auth token' });
    }

    if (
      headers.authorization !== `Bearer ${process.env.JWT_TEST_TOKEN_1}` &&
      headers.authorization !== `Bearer ${process.env.JWT_TEST_TOKEN_2}`
    ) {
      throw new UnauthorizedException({ description: 'incorrect auth token' });
    }

    return true;
  }
}
