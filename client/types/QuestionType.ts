import { Answer } from "./AnswerType";
import { BaseEntityType } from "./BaseEntityType";
import { Result } from "./ResultType";
import { Test } from "./TestType";

export type Question = BaseEntityType & {
  tests: Test[];
  answers: Answer[];
  results: Result[];
  title: string;
  description?: string | null;
  img?: string | null;
};
