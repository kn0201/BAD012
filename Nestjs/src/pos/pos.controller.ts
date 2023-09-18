import { Body, Controller, Post } from '@nestjs/common';
import { object, string } from 'cast.ts';
import { PosService } from './pos.service';

let posParser = object({
  pos: string(),
});

@Controller('pos')
export class PosController {
  constructor(private posService: PosService) {}
  @Post()
  async posCheck(@Body() body: Body) {
    let input = posParser.parse(body);
    return this.posService.posCheck(input);
  }
}
