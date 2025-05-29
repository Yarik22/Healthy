import { Test, TestingModule } from "@nestjs/testing";
import { ImageService } from "./image.service";
import * as sharp from "sharp";

describe("ImageService", () => {
  let service: ImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageService],
    }).compile();

    service = module.get<ImageService>(ImageService);
  });

  describe("compressImage", () => {
    it("should throw error on unsupported image format", async () => {
      const fakeBuffer = Buffer.from("fakedata");
      const fakeBase64 =
        "data:image/png;base64," + fakeBuffer.toString("base64");

      jest
        .spyOn(sharp.prototype, "metadata")
        .mockResolvedValue({ format: "gif" } as any);

      await expect(service.compressImage(fakeBase64)).rejects.toThrow(
        "Unsupported image format: gif"
      );
    });
  });
});
