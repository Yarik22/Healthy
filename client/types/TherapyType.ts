import { MentalState } from '../../shared/enums/therapy.enum';
import { BaseEntityType } from './BaseEntityType';

export type Therapy = BaseEntityType & {
  title: string;
  description?: string | null;
  url?: string | null;
  img?: Buffer | null;
  mentalStates: MentalState[];
};
