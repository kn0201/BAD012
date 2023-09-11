import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(msg) {
    let result = msg.msgName;
    console.log('AppService : ' + result);
    return { result };
  }
}
