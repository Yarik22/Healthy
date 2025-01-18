import { DatabaseService } from "src/database/database.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Test } from "src/database/entities/test.entity";

export class TestService extends DatabaseService<Test> {
  constructor(
    @InjectRepository(Test)
    protected readonly repository: Repository<Test>
  ) {
    super(repository);
  }
}
