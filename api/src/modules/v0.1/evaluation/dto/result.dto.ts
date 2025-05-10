import { IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class SubmitResultDto {
  @IsUUID()
  question_uuid: string;

  @IsUUID()
  answer_uuid: string;
}

export class SubmitResultsDto {
  @IsUUID()
  test_uuid: string;

  @ValidateNested({ each: true })
  @Type(() => SubmitResultDto)
  results: SubmitResultDto[];
}
