import { Int, Field, InputType, ID } from "@nestjs/graphql";
import { IsOptional, Length } from "class-validator";

@InputType()
export class UpdateLogInput {
  @Field((type) => Int)
  id: number;

  @Field((type) => ID)
  uid: string;

  @Field((type) => Int, { nullable: true })
  questId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @Length(0, 30)
  enemy?: string;

  @Field((type) => Int, { nullable: true })
  minutes?: number;

  @Field({ nullable: true })
  done?: boolean;

  @Field({ nullable: true })
  startTime?: string;
}
