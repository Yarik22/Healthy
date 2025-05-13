import { DatabaseService } from "src/database/database.service";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Test } from "src/database/entities/test.entity";
import { Observable, defer } from "rxjs";
import { User } from "src/database/entities/user.entity";

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

  addUserToTest(userId: string, testId: string): Observable<void> {
    return defer(async () => {
      const test = await this.repository.findOneOrFail({
        where: { uuid: testId },
        relations: ["users"],
      });

      const user = new User();
      user.uuid = userId;

      if (!test.users.some((u) => u.uuid === userId)) {
        test.users.push(user);
        await this.repository.save(test);
      }
    });
  }
}
