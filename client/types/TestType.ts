import { BaseEntityType } from "./BaseEntityType";
import { Question } from "./QuestionType";
import { User } from "./UserType";

export type Test = BaseEntityType & {
    title: string;
    description?: string | null;
    img?: string | null;
    users: User[];
    questions: Question[];
  };