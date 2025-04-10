import { Answer } from "./AnswerType";
import { Question } from "./QuestionType";
import { User } from "./UserType";

export type Result = {
  user_uuid: string;
  question_uuid: string;
  user: User;
  question: Question;
  answer: Answer;
};
