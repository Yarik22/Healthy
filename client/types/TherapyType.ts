import { MentalState } from '../shared/enums/therapy.enum';
import { BaseEntityType } from './BaseEntityType';

export type Therapy = BaseEntityType & {
  title: string;
  description?: string | null;
  url?: null | string[];
  img?: string | null;
  mentalStates: MentalState[];
};
