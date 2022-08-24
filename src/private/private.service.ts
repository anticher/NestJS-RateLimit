import { Injectable } from '@nestjs/common';

@Injectable()
export class PrivateService {
  public getFirst(): string {
    return 'this is first endpoint';
  }

  public getSecond(): string {
    return 'this is second endpoint';
  }

  public getThird(): string {
    return 'this is third endpoint';
  }
}
