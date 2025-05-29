import { of } from "rxjs";
import { QuestionController } from "./question.controller";
import { QuestionService } from "./question.service";
import { SubmitResultsDto, SubmitResultDto } from "./dto/result.dto";

describe("QuestionController", () => {
  let controller: QuestionController;
  let questionService: Partial<Record<keyof QuestionService, jest.Mock>>;

  beforeEach(() => {
    questionService = {
      submitResults: jest.fn(),
    };

    controller = new QuestionController(questionService as any);
  });

  describe("handleSubmitResults", () => {
    it("should call submitResults and return results", (done) => {
      const mockUser = { uuid: "user-uuid-1" };

      const mockResults: SubmitResultDto[] = [
        { question_uuid: "question-uuid-1", answer_uuid: "answer-uuid-1" },
        { question_uuid: "question-uuid-2", answer_uuid: "answer-uuid-2" },
      ];

      const mockBody: SubmitResultsDto = {
        test_uuid: "test-uuid-1",
        results: mockResults,
      };

      const returnedResults = [
        {
          user_uuid: "user-uuid-1",
          question_uuid: "question-uuid-1",
          answer_uuid: "answer-uuid-1",
        },
        {
          user_uuid: "user-uuid-1",
          question_uuid: "question-uuid-2",
          answer_uuid: "answer-uuid-2",
        },
      ];

      questionService.submitResults.mockReturnValue(of(returnedResults));

      const req = {
        user: Promise.resolve(mockUser),
      } as any;

      const result$ = controller.handleSubmitResults(req, mockBody);

      result$.subscribe({
        next: (results) => {
          expect(results).toEqual(returnedResults);
          expect(questionService.submitResults).toHaveBeenCalledWith(
            mockUser.uuid,
            mockBody.test_uuid,
            mockBody.results
          );
          done();
        },
        error: done.fail,
      });
    });
  });
});
