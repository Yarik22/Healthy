import { MentalState } from '../../shared/enums/therapy.enum';
import { BaseEntityType } from './BaseEntityType';
import { Question } from './QuestionType';
import { Result } from './ResultType';

export type Answer = BaseEntityType & {
  question: Question;
  results: Result[];
  mentalState: MentalState;
  influence: number;
  text?: string | null;
  img?: Buffer | null;
};
