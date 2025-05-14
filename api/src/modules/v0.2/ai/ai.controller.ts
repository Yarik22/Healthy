import { Controller, Post, Body } from "@nestjs/common";
import { AIService } from "./ai.service";

@Controller("ai")
export class AIController {
  constructor(private readonly rabbitService: AIService) {}

  @Post("generate")
  async generate(@Body("prompt") prompt: string) {
    if (!prompt) return { error: "'prompt' is required" };
    const res = await this.rabbitService.sendMessage(prompt);
    return await res;
  }
}
