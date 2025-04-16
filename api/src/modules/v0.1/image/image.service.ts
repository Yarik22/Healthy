import { Injectable } from "@nestjs/common";
import * as sharp from "sharp";

@Injectable()
export class ImageService {
  async compressImage(base64Image: string): Promise<string | null> {
    if (!base64Image) return null;

    try {
      const isValidBase64 = /^data:image\/(jpeg|png);base64,/.test(base64Image);
      if (!isValidBase64) {
        throw new Error("Invalid base64 image format");
      }

      const imageBase64 = base64Image.replace(
        /^data:image\/(jpeg|png);base64,/,
        ""
      );
      const imageBuffer = Buffer.from(imageBase64, "base64");

      console.log("Original Image Size:", imageBuffer.length, "bytes");
      console.log(
        "Original Image Size:",
        (imageBuffer.length / 1024).toFixed(2),
        "KB"
      );

      const imageMetadata = await sharp(imageBuffer).metadata();
      console.log("Original Image Format:", imageMetadata.format);

      let compressedImageBuffer: Buffer;

      if (imageMetadata.format === "jpeg" || imageMetadata.format === "jpg") {
        compressedImageBuffer = await sharp(imageBuffer)
          .resize(800)
          .jpeg({ quality: 80 })
          .toBuffer();
      } else if (imageMetadata.format === "png") {
        compressedImageBuffer = await sharp(imageBuffer)
          .resize(800)
          .png({ quality: 80 })
          .toBuffer();
      } else {
        throw new Error(`Unsupported image format: ${imageMetadata.format}`);
      }

      console.log(
        "Compressed Image Size:",
        compressedImageBuffer.length,
        "bytes"
      );
      console.log(
        "Compressed Image Size:",
        (compressedImageBuffer.length / 1024).toFixed(2),
        "KB"
      );

      return compressedImageBuffer.toString("base64");
    } catch (error) {
      console.error("Error compressing image:", error);
      throw new Error("Error compressing image: " + error.message);
    }
  }
}
