import { InjectRepository } from "@nestjs/typeorm";
import { DatabaseService } from "src/database/database.service";
import { Answer } from "src/database/entities/answer.entity";
import { Repository } from "typeorm";

export class AnswerService extends DatabaseService<Answer> {
  constructor(
    @InjectRepository(Answer)
    protected readonly repository: Repository<Answer>
  ) {
    super(repository);
  }
}
