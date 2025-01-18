import { Injectable } from "@nestjs/common";
import { Therapy } from "src/database/entities/therapy.entity";
import { DatabaseService } from "src/database/database.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TherapyService extends DatabaseService<Therapy> {
  constructor(
    @InjectRepository(Therapy)
    protected readonly repository: Repository<Therapy>
  ) {
    super(repository);
  }
}
