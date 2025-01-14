import { PartialType } from '@nestjs/swagger';
import { CreateTherapyDto } from './create-therapy.dto';

export class UpdateTherapyDto extends PartialType(CreateTherapyDto) {}
