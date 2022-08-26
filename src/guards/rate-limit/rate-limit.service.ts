import { Injectable } from '@nestjs/common';

const secondsInMinute = 60;
const millisecondsInSecond = 1000;

@Injectable()
export class RateLimitService {
  private storage = { jwt: new Map(), ip: new Map() };
  private limits = {
    jwt: Number(process.env.JWT_REQUEST_LIMIT),
    ip: Number(process.env.IP_REQUEST_LIMIT),
    minutes: Number(process.env.REQUEST_LIMIT_MINUTES),
  };

  private createNewRecord(
    requestTimeStamp: number,
    rateWeight: number,
  ): number[] {
    const newRecord = [];
    while (rateWeight > 0) {
      newRecord.push(requestTimeStamp);
      rateWeight -= 1;
    }
    return newRecord;
  }

  private getRemainingTime(
    timestamp: number,
    data: number[],
    limit: number,
  ): number {
    return (
      this.limits.minutes -
      Math.floor(
        (timestamp - data[data.length - limit]) /
          secondsInMinute /
          millisecondsInSecond,
      )
    );
  }

  private throwError(limit: number, remainingTime: number): void {
    throw new Error(
      "You have reached the API's hourly request limit - " +
        limit +
        ' requests. You can make the next request in ' +
        remainingTime +
        ' minutes.',
    );
  }

  private getWindowStartTimestamp(timestamp: number): number {
    return (
      timestamp - this.limits.minutes * secondsInMinute * millisecondsInSecond
    );
  }

  private getUpdatedRecord(
    record: number[],
    requestTimeStamp: number,
    rateWeight: number,
  ): number[] {
    const windowStartTimestamp = this.getWindowStartTimestamp(requestTimeStamp);
    const newRecord = record.filter((timestamp) => {
      return timestamp >= windowStartTimestamp;
    });
    while (rateWeight > 0) {
      newRecord.push(requestTimeStamp);
      rateWeight -= 1;
    }
    return newRecord;
  }

  public checkRateLimit(params: {
    accessType: string;
    accessKey: object;
    requestTimeStamp: number;
    rateWeight: number;
  }): boolean {
    const { accessType, accessKey, requestTimeStamp, rateWeight } = params;
    const record = this.storage[accessType].get(accessKey);
    if (record === undefined) {
      const newRecord = this.createNewRecord(requestTimeStamp, rateWeight);
      this.storage[accessType].set(accessKey, newRecord);
      return true;
    }
    const newRecord = this.getUpdatedRecord(
      record,
      requestTimeStamp,
      rateWeight,
    );
    this.storage[accessType].set(accessKey, newRecord);
    if (newRecord.length > this.limits[accessType]) {
      newRecord.splice(0, newRecord.length - this.limits[accessType]);
      const remainingTime = this.getRemainingTime(
        requestTimeStamp,
        newRecord,
        this.limits[accessType],
      );
      this.throwError(this.limits[accessType], remainingTime);
    }
    return true;
  }
}
