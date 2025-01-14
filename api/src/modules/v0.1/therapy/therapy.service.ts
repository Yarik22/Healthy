import { Injectable } from '@nestjs/common';
import { CreateTherapyDto } from './dto/create-therapy.dto';
import { UpdateTherapyDto } from './dto/update-therapy.dto';

@Injectable()
export class TherapyService {
  create(createTherapyDto: CreateTherapyDto) {
    return 'This action adds a new therapy';
  }

  findAll() {
    return `This action returns all therapy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} therapy`;
  }

  update(id: number, updateTherapyDto: UpdateTherapyDto) {
    return `This action updates a #${id} therapy`;
  }

  remove(id: number) {
    return `This action removes a #${id} therapy`;
  }
}
