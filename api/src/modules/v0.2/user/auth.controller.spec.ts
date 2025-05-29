import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { ConfigService } from "@nestjs/config";
import { GoogleAuthGuard } from "../guard/google.guard";
import { ExecutionContext } from "@nestjs/common";
import { Response } from "express";

describe("AuthController", () => {
  let controller: AuthController;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue("3000"),
          },
        },
      ],
    })
      .overrideGuard(GoogleAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe("handleLogin", () => {
    it("should not throw and can be called", () => {
      expect(() => controller.handleLogin()).not.toThrow();
    });
  });

  describe("handleRedirect", () => {
    it("should redirect to client home url", () => {
      const mockRes = {
        redirect: jest.fn(),
      } as unknown as Response;

      controller.handleRedirect(mockRes);

      expect(configService.get).toHaveBeenCalledWith("CLIENT_PORT");
      expect(mockRes.redirect).toHaveBeenCalledWith(
        "http://localhost:3000/home"
      );
    });
  });
});
