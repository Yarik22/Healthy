import { DatabaseService } from "src/database/database.service";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Test } from "src/database/entities/test.entity";
import { Observable, defer } from "rxjs";
import { User } from "src/database/entities/user.entity";
import { CreateTestDto } from "./dto/create-test.dto";
import { Answer } from "src/database/entities/answer.entity";
import { Question } from "src/database/entities/question.entity";

export class TestService extends DatabaseService<Test> {
  constructor(
    @InjectRepository(Test)
    protected readonly repository: Repository<Test>,

    @InjectRepository(Question)
    protected readonly questionRepository: Repository<Question>,

    @InjectRepository(Answer)
    protected readonly answerRepository: Repository<Answer>
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

  hasUserTakenAnyTest(userId: string): Observable<boolean> {
    return defer(async () => {
      const count = await this.repository
        .createQueryBuilder("test")
        .innerJoin("test.users", "user")
        .where("user.uuid = :userId", { userId })
        .getCount();

      return count > 0;
    });
  }

  createTestWithQuestionsAndAnswers(dto: CreateTestDto): Observable<Test> {
    return defer(async () => {
      const queryRunner =
        this.repository.manager.connection.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Use queryRunner.manager to access repositories in the transaction
        const test = queryRunner.manager.getRepository(Test).create({
          title: dto.title,
          description: dto.description,
          img: dto.img,
        });

        const savedTest = await queryRunner.manager
          .getRepository(Test)
          .save(test);

        for (const questionDto of dto.questions) {
          const question = queryRunner.manager.getRepository(Question).create({
            title: questionDto.title,
            description: questionDto.description,
            img: questionDto.img,
            tests: [savedTest],
          });

          const savedQuestion = await queryRunner.manager
            .getRepository(Question)
            .save(question);

          const answers = questionDto.answers.map((answerDto) =>
            queryRunner.manager.getRepository(Answer).create({
              text: answerDto.text,
              mentalState: answerDto.mentalState,
              influence: answerDto.influence,
              img: answerDto.img,
              question: savedQuestion,
            })
          );

          await queryRunner.manager.getRepository(Answer).save(answers);
        }

        await queryRunner.commitTransaction();
        return savedTest;
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    });
  }
}
