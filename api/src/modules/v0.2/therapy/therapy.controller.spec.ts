import { Test, TestingModule } from "@nestjs/testing";
import { TherapyController } from "./therapy.controller";
import { TherapyService } from "./therapy.service";
import { of, throwError } from "rxjs";
import { RolesGuard } from "../guard/role.guard";

describe("TherapyController", () => {
  let controller: TherapyController;
  let therapyService: Partial<Record<keyof TherapyService, jest.Mock>>;

  beforeEach(async () => {
    therapyService = {
      findByIdCached: jest.fn(),
      findByTitleCached: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TherapyController],
      providers: [{ provide: TherapyService, useValue: therapyService }],
    })
      // Override RolesGuard to bypass it
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TherapyController>(TherapyController);
  });

  describe("handleFindOne", () => {
    const mockTherapy = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Test Therapy",
      description: "Description here",
      // Add other required properties if needed
    };

    it("should return therapy by UUID", (done) => {
      therapyService.findByIdCached.mockReturnValue(of(mockTherapy));

      controller.handleFindOne(mockTherapy.id).subscribe({
        next: (result) => {
          expect(result).toEqual(mockTherapy);
          expect(therapyService.findByIdCached).toHaveBeenCalledWith(
            mockTherapy.id
          );
          done();
        },
        error: done.fail,
      });
    });

    it("should return therapy by title", (done) => {
      therapyService.findByTitleCached.mockReturnValue(of(mockTherapy));

      controller.handleFindOne(mockTherapy.title).subscribe({
        next: (result) => {
          expect(result).toEqual(mockTherapy);
          expect(therapyService.findByTitleCached).toHaveBeenCalledWith(
            mockTherapy.title
          );
          done();
        },
        error: done.fail,
      });
    });

    it("should throw 404 error if not found by UUID", (done) => {
      const error = new Error("NotFound");
      therapyService.findByIdCached.mockReturnValue(throwError(() => error));

      controller.handleFindOne(mockTherapy.id).subscribe({
        next: () => done.fail("Expected an error"),
        error: (err) => {
          expect(err).toEqual({ status: 404, message: "Therapy not found" });
          done();
        },
      });
    });

    it("should throw 500 error if service fails by title", (done) => {
      const error = new Error("Some DB error");
      therapyService.findByTitleCached.mockReturnValue(throwError(() => error));

      controller.handleFindOne(mockTherapy.title).subscribe({
        next: () => done.fail("Expected an error"),
        error: (err) => {
          expect(err).toEqual({
            status: 500,
            message: "Internal server error",
          });
          done();
        },
      });
    });
  });
});
