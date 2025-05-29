import { Test, TestingModule } from "@nestjs/testing";
import { AnswerController } from "./answer.controller";
import { AnswerService } from "./answer.service";
import { RolesGuard } from "../guard/role.guard";
import { Reflector } from "@nestjs/core";
import { of } from "rxjs";
import { Answer } from "src/database/entities/answer.entity";
import { MentalState } from "shared/enums/therapy.enum";
import { UserService } from "../user/user.service";

describe("AnswerController", () => {
  let controller: AnswerController;

  const answerServiceMock = {
    findById: jest.fn().mockReturnValue(
      of({
        uuid: "1234-5678-9012-3456",
        mentalState: MentalState.Anxiety,
        influence: 5,
        text: "Sample Answer",
        img: null,
        question: null,
        results: [],
      } as Answer)
    ),
  };

  const userServiceMock = {}; // mock what your RolesGuard actually needs

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerController],
      providers: [
        { provide: AnswerService, useValue: answerServiceMock },
        { provide: UserService, useValue: userServiceMock }, // <-- important!
        Reflector,
        RolesGuard,
      ],
    }).compile();

    controller = module.get<AnswerController>(AnswerController);
  });

  it("should return answer by UUID", (done) => {
    controller
      .handleFindAnswerById("1234-5678-9012-3456")
      .subscribe((result) => {
        expect(result).toBeDefined();
        expect(result.uuid).toBe("1234-5678-9012-3456");
        done();
      });
  });
});
