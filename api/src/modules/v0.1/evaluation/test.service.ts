import { DatabaseService } from "src/database/database.service";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Test } from "src/database/entities/test.entity";
import { Observable, defer } from "rxjs";

export class TestService extends DatabaseService<Test> {
  constructor(
    @InjectRepository(Test)
    protected readonly repository: Repository<Test>
  ) {
    super(repository);
  }

  findAllPaginated(
    page = 1,
    limit = 10,
    search?: string
  ): Observable<[Test[], number]> {
    const skip = (page - 1) * limit;

    const where = search
      ? [{ title: ILike(`%${search}%`) }, { description: ILike(`%${search}%`) }]
      : {};

    return defer(() =>
      this.repository.findAndCount({
        where,
        take: limit,
        skip,
        order: { createdAt: "DESC" },
      })
    );
  }

  findTestWithStats(id: string): Observable<Test> {
    return defer(() =>
      this.repository.findOneOrFail({
        where: { uuid: id },
        relations: ["questions", "users"],
      })
    );
  }
}
