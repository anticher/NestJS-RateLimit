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

  private getJwt(jwt: string): number[] {
    return this.jwts.get(jwt);
  }

  private setJwt(jwt: string, payload: number[]): Map<string, number[]> {
    return this.jwts.set(jwt, payload);
  }

  private addJwtRecord(jwt: string, requestTimeStamp: number): boolean {
    const newRecord = [];
    newRecord.push(requestTimeStamp);
    this.setJwt(jwt, newRecord);
    return true;
  }

  private getIp(ip: string): number[] {
    return this.ips.get(ip);
  }

  private setIp(ip: string, payload: number[]): Map<string, number[]> {
    return this.ips.set(ip, payload);
  }

  private addIpRecord(ip: string, requestTimeStamp: number): boolean {
    const newRecord = [];
    newRecord.push(requestTimeStamp);
    this.setIp(ip, newRecord);
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

  private getUpdatedRecord(record: number[], timestamp: number): number[] {
    const newRecord = record.filter((timestamp) => {
      return timestamp >= this.getWindowStartTimestamp(timestamp);
    });
    newRecord.push(timestamp);
    return newRecord;
  }

  public jwtRateLimit(jwt: string, requestTimeStamp: number): boolean {
    const record = this.getJwt(jwt);
    if (record === undefined) {
      return this.addJwtRecord(jwt, requestTimeStamp);
    }

    const newRecord = this.getUpdatedRecord(record, requestTimeStamp);
    this.setJwt(jwt, newRecord);
    if (newRecord.length > this.jwtRequestLimit) {
      const remainingTime = this.getRemainingTime(
        requestTimeStamp,
        newRecord,
        this.jwtRequestLimit,
      );
      this.throwError(this.jwtRequestLimit, remainingTime);
    }
    return true;
  }

  public ipRateLimit(ip: string, requestTimeStamp: number): boolean {
    const record = this.getIp(ip);
    if (record === undefined) {
      return this.addIpRecord(ip, requestTimeStamp);
    }

    const newRecord = this.getUpdatedRecord(record, requestTimeStamp);
    this.setIp(ip, newRecord);
    if (newRecord.length > this.ipRequestLimit) {
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
