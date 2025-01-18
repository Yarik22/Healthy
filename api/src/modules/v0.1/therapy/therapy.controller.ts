import {
  Controller,
} from "@nestjs/common";
import { TherapyService } from "./therapy.service";
import { ApiHeader } from "@nestjs/swagger";
import { ApiVersion } from "src/modules/versions";

@Controller({ path: "therapy", version: ApiVersion.Version01 })
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
export class TherapyController {
  constructor(private readonly therapyService: TherapyService) {}
}
