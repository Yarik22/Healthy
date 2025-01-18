import { Question } from "src/database/entities/question.entity";
import { DatabaseService } from "src/database/database.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class QuestionService extends DatabaseService<Question> {
  constructor(
    @InjectRepository(Question)
    protected readonly repository: Repository<Question>
  ) {
    super(repository);
  }
}
