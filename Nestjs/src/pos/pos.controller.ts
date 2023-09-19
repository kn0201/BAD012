import { Body, Controller, Post, Req } from '@nestjs/common';
import { object, string } from 'cast.ts';
import { PosService } from './pos.service';
import { Request } from 'express';

let posParser = object({
  pos: string(),
});

@Controller('pos')
export class PosController {
  constructor(private posService: PosService) {}
  @Post()
  async posCheck(@Body() body: Body, @Req() req: Request) {
    let input = posParser.parse(body);
    return this.posService.posCheck(input, req);
  }
}
