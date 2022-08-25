import { Injectable } from '@nestjs/common';

const secondsInMinute = 60;
const millisecondsInSecond = 1000;

@Injectable()
export class RateLimitService {
  private jwts: Map<string, number[]> = new Map();
  private ips: Map<string, number[]> = new Map();
  private jwtRequestLimit = Number(process.env.JWT_REQUEST_LIMIT);
  private ipRequestLimit = Number(process.env.IP_REQUEST_LIMIT);
  private requestLimitMinutes = Number(process.env.REQUEST_LIMIT_MINUTES);

  private addJwtRecord(
    jwt: string,
    requestTimeStamp: number,
    rateWeight: number,
  ): boolean {
    const newRecord = [];
    while (rateWeight > 0) {
      newRecord.push(requestTimeStamp);
      rateWeight -= 1;
    }
    this.jwts.set(jwt, newRecord);
    return true;
  }

  private addIpRecord(
    ip: string,
    requestTimeStamp: number,
    rateWeight: number,
  ): boolean {
    const newRecord = [];
    while (rateWeight > 0) {
      newRecord.push(requestTimeStamp);
      rateWeight -= 1;
    }
    this.ips.set(ip, newRecord);
    return true;
  }

  private getRemainingTime(
    timestamp: number,
    data: number[],
    limit: number,
  ): number {
    return (
      this.requestLimitMinutes -
      Math.floor(
        (timestamp - data[data.length - limit]) / 60 / millisecondsInSecond,
      )
    );
  }

  private throwError(limit: number, remainingTime: number): void {
    throw new Error(
      'You have reached the limit of requests. Current limit for you ' +
        limit +
        ' requests / hour. You can make the next request in ' +
        remainingTime +
        ' minutes',
    );
  }

  private getWindowStartTimestamp(timestamp: number): number {
    return (
      timestamp -
      this.requestLimitMinutes * secondsInMinute * millisecondsInSecond
    );
  }

  private getUpdatedRecord(
    record: number[],
    timestamp: number,
    rateWeight: number,
  ): number[] {
    const newRecord = record.filter((timestamp) => {
      return timestamp >= this.getWindowStartTimestamp(timestamp);
    });
    while (rateWeight > 0) {
      newRecord.push(timestamp);
      rateWeight -= 1;
    }
    return newRecord;
  }

  public jwtRateLimit(
    jwt: string,
    requestTimeStamp: number,
    rateWeight: number,
  ): boolean {
    console.log(this.jwts.get(jwt));
    const record = this.jwts.get(jwt);
    if (record === undefined) {
      return this.addJwtRecord(jwt, requestTimeStamp, rateWeight);
    }

    const newRecord = this.getUpdatedRecord(
      record,
      requestTimeStamp,
      rateWeight,
    );
    this.jwts.set(jwt, newRecord);
    if (newRecord.length > this.jwtRequestLimit) {
      newRecord.splice(0, newRecord.length - this.jwtRequestLimit);
      const remainingTime = this.getRemainingTime(
        requestTimeStamp,
        newRecord,
        this.jwtRequestLimit,
      );
      this.throwError(this.jwtRequestLimit, remainingTime);
    }
    return true;
  }

  public ipRateLimit(
    ip: string,
    requestTimeStamp: number,
    rateWeight: number,
  ): boolean {
    console.log(this.ips.get(ip));
    const record = this.ips.get(ip);
    if (record === undefined) {
      return this.addIpRecord(ip, requestTimeStamp, rateWeight);
    }

    const newRecord = this.getUpdatedRecord(
      record,
      requestTimeStamp,
      rateWeight,
    );
    this.ips.set(ip, newRecord);
    if (newRecord.length > this.ipRequestLimit) {
      newRecord.splice(0, newRecord.length - this.ipRequestLimit);
      const remainingTime = this.getRemainingTime(
        requestTimeStamp,
        newRecord,
        this.ipRequestLimit,
      );
      this.throwError(this.ipRequestLimit, remainingTime);
    }
    return true;
  }
}
