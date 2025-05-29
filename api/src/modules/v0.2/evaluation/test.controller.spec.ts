import { of } from "rxjs";
import { TestController } from "./test.controller";
import { TestService } from "./test.service";
import { CreateTestDto } from "./dto/create-test.dto";
import { QueryTestDto } from "./dto/query-test.dto";
import { Request } from "express";

describe("TestController", () => {
  let controller: TestController;
  let testService: Partial<Record<keyof TestService, jest.Mock>>;

  beforeEach(() => {
    testService = {
      createTestWithQuestionsAndAnswers: jest.fn(),
      findById: jest.fn(),
      findAllPaginated: jest.fn(),
      findTestWithStats: jest.fn(),
      hasUserTakenAnyTest: jest.fn(),
    };

    controller = new TestController(testService as any);
  });

  describe("handleCreateTest", () => {
    it("should create a test and return it", (done) => {
      const dto: CreateTestDto = {
        title: "Sample Test",
        description: "Description",
        img: "image.jpg",
        questions: [], // Можно заполнить, если нужно
      };

      const createdTest = { uuid: "test-uuid", ...dto };

      testService.createTestWithQuestionsAndAnswers.mockReturnValue(
        of(createdTest)
      );

      controller.handleCreateTest(dto).subscribe({
        next: (result) => {
          expect(result).toEqual(createdTest);
          expect(
            testService.createTestWithQuestionsAndAnswers
          ).toHaveBeenCalledWith(dto);
          done();
        },
        error: done.fail,
      });
    });
  });

  describe("handleFindTestById", () => {
    it("should return test by id", (done) => {
      const testId = "test-uuid";
      const testEntity = { uuid: testId, title: "Test Title" };

      testService.findById.mockReturnValue(of(testEntity));

      controller.handleFindTestById(testId).subscribe({
        next: (result) => {
          expect(result).toEqual(testEntity);
          expect(testService.findById).toHaveBeenCalledWith(testId, [
            "questions",
            "questions.answers",
          ]);
          done();
        },
        error: done.fail,
      });
    });
  });

  describe("handleFindPaginatedTests", () => {
    it("should return paginated tests", (done) => {
      const query: QueryTestDto = { page: 1, limit: 10, search: "test" };
      const data = [{ uuid: "1" }, { uuid: "2" }];
      const total = 2;

      testService.findAllPaginated.mockReturnValue(of([data, total]));

      controller.handleFindPaginatedTests(query).subscribe({
        next: (result) => {
          expect(result).toEqual({ data, total });
          expect(testService.findAllPaginated).toHaveBeenCalledWith(
            query.page,
            query.limit,
            query.search
          );
          done();
        },
        error: done.fail,
      });
    });
  });

  describe("handleCheckUserHasTests", () => {
    it("should return hasTests status", (done) => {
      const mockUser = { uuid: "user-uuid" };
      const req = { user: Promise.resolve(mockUser) } as unknown as Request;
      const hasTests = true;

      testService.hasUserTakenAnyTest.mockReturnValue(of(hasTests));

      controller.handleCheckUserHasTests(req).subscribe({
        next: (result) => {
          expect(result).toEqual({ hasTests });
          expect(testService.hasUserTakenAnyTest).toHaveBeenCalledWith(
            mockUser.uuid
          );
          done();
        },
        error: done.fail,
      });
    });

    it("should throw error if user is not found", (done) => {
      const req = { user: Promise.resolve(null) } as unknown as Request;

      controller.handleCheckUserHasTests(req).subscribe({
        next: () => done.fail("Expected error, but got success"),
        error: (err) => {
          expect(err.message).toBe("User not found");
          done();
        },
      });
    });
  });
});
