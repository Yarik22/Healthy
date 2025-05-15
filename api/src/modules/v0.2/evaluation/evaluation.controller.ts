import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { ApiVersion } from "src/modules/versions";
import { ApiHeader } from "@nestjs/swagger";
import { RoleName } from "../../../../shared/enums/user.enum";
import { Roles } from "../decorator/role.decorator";
import { RolesGuard } from "../guard/role.guard";
import { EvaluationService } from "./evaluation.service";
import { AIService } from "../ai/ai.service";
import { from, switchMap } from "rxjs";
import { Conclusion } from "src/database/entities/conclusion.entity";
import { User } from "src/database/entities/user.entity";
import { TranslationService } from "./translation.service";

@Controller({ path: "evaluations", version: ApiVersion.Version02 })
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
@UseGuards(RolesGuard)
export class EvaluationController {
  constructor(
    private readonly evaluationService: EvaluationService,
    private readonly translationService: TranslationService,
    private readonly aiService: AIService
  ) {}

  @Get("recommendation")
  @Roles(RoleName.User, RoleName.Moderator, RoleName.Admin)
  getArtTherapyRecommendation(@Req() req: Request) {
    return from(req.user as Promise<User>).pipe(
      switchMap((user: User) => {
        if (!user || !user.uuid) {
          throw new Error("User not found");
        }
        return this.evaluationService.findByProperty("user", user).pipe(
          switchMap((conclusions: Conclusion[]) => {
            const stateValues = conclusions
              .map((c) => `${c.mentalState}(${c.value})`)
              .join(", ");

            const availableTherapies = [
              "Music Therapy",
              "Cinema Therapy",
              "Sand Therapy",
              "Mandala Therapy",
              "Drama Therapy",
              "Dance Movement Therapy",
              "Collage Therapy",
              "Photography Therapy",
              "Clay Therapy",
              "Poetry Therapy",
              "Puppet Therapy",
              "Nature Art Therapy",
            ];

            const prompt = `My name is ${user.nickname}, I need suggestion (3 art therapies) what art therapies should I pass. Here is the options: ${availableTherapies.join(", ")}. I have the following parameters of my psychological state from 0 (the lowest) to 100 (the highest) level. ${stateValues}. To answer you should say hello to me and give art therapy recomendations with short description, thats all. Do not mention my parameters in your answer or that I provided you the list of art therapies. Give therapies listed.`;
            return from(this.aiService.prompt(prompt)).pipe(
              switchMap((res: any) => {
                return from(
                  this.translationService.translateToUkrainian(res.aiResponse)
                );
              })
            );
          })
        );
      })
    );
  }
}
