import { InjectRepository } from "@nestjs/typeorm";
import { DatabaseService } from "src/database/database.service";
import { Conclusion } from "src/database/entities/conclusion.entity";
import { Repository } from "typeorm";

export class EvaluationService extends DatabaseService<Conclusion> {
  constructor(
    @InjectRepository(Conclusion)
    protected readonly repository: Repository<Conclusion>
  ) {
    super(repository);
  }
}
