import { Int, Field, InputType, ID } from "@nestjs/graphql";
import { MaxLength } from "class-validator";

@InputType()
export class NewLogInput {
  @Field((type) => Int)
  id: number;

  @Field((type) => ID)
  uid: string;

  @Field((type) => Int)
  questId: number;

  @Field()
  @MaxLength(30)
  enemy: string;

  @Field()
  done: boolean;

  @Field()
  startTime: string;
}
