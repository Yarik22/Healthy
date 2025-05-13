import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Question } from "src/database/entities/question.entity";
import { DatabaseService } from "src/database/database.service";
import { Result } from "src/database/entities/result.entity";
import { from, map, Observable, switchMap } from "rxjs";
import { SubmitResultDto } from "./dto/result.dto";
import { TestService } from "./test.service";

@Injectable()
export class QuestionService extends DatabaseService<Question> {
  constructor(
    @InjectRepository(Question)
    protected readonly repository: Repository<Question>,
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    private readonly testService: TestService
  ) {
    super(repository);
  }

  submitResults(
    userId: string,
    testId: string,
    results: SubmitResultDto[]
  ): Observable<Result[]> {
    const entities = results.map((r) =>
      this.resultRepository.create({
        user_uuid: userId,
        question_uuid: r.question_uuid,
        answer: { uuid: r.answer_uuid },
      })
    );

    return from(this.resultRepository.save(entities)).pipe(
      switchMap((savedResults) =>
        this.testService
          .addUserToTest(userId, testId)
          .pipe(map(() => savedResults))
      )
    );
  }
}
