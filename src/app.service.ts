import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    throw new Error('error');
  }
}
