import { Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RoleName } from "../../../../shared/enums/user.enum";
import { Roles } from "../decorator/role.decorator";
import { RolesGuard } from "../guard/role.guard";
import { EvaluationService } from "./evaluation.service";
import { AIService } from "../ai/ai.service";
import { from, map, switchMap } from "rxjs";
import { Conclusion } from "src/database/entities/conclusion.entity";
import { User } from "src/database/entities/user.entity";
import { TranslationService } from "./translation.service";
import { ApiVersion } from "src/modules/versions";

@ApiTags("Evaluations")
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

  @Get("stats")
  @Roles(RoleName.User, RoleName.Moderator, RoleName.Admin)
  @ApiOperation({
    summary: "Get mental state conclusions",
    description:
      "Returns each mental state conclusion value for the authenticated user or by UUID query param.",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved mental state conclusions.",
    schema: {
      example: [
        { mentalState: "Anxiety", value: 85 },
        { mentalState: "Anger", value: 95 },
      ],
    },
  })
  @ApiResponse({ status: 404, description: "User not found" })
  getStats(@Req() req: Request, @Query("uuid") uuid?: string) {
    if (uuid) {
      return this.evaluationService.findConclusionsByUserUuid(uuid);
    } else {
      return from(req.user as Promise<User>).pipe(
        switchMap((user: User) => {
          if (!user || !user.uuid) {
            throw new Error("User not found");
          }
          return this.evaluationService.findConclusionsByUserUuid(user.uuid);
        })
      );
    }
  }

  @Get("recommendation")
  @Roles(RoleName.User, RoleName.Moderator, RoleName.Admin)
  @ApiOperation({
    summary: "Get personalized art therapy recommendation",
    description:
      "Uses AI to recommend 3 art therapies based on user's mental health conclusions.",
  })
  @ApiResponse({
    status: 200,
    description: "Personalized art therapy recommendation returned.",
    schema: {
      example: {
        recommendation:
          "Привіт, ось 3 терапії: Music Therapy — допоможе розслабитися, Mandala Therapy — покращить концентрацію, і Dance Movement Therapy — підвищить рівень енергії.",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "User not found or no conclusions available",
  })
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
                ).pipe(
                  switchMap((translated: string) => {
                    return from(
                      Promise.resolve({ recommendation: translated })
                    );
                  })
                );
              })
            );
          })
        );
      })
    );
  }
}
