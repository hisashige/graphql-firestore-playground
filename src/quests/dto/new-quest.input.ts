import { Int, Field, InputType, ID } from "@nestjs/graphql";
import { MaxLength } from "class-validator";

@InputType()
export class NewQuestInput {
  @Field((type) => Int)
  id: number;

  @Field((type) => ID)
  uid: string;

  @Field()
  @MaxLength(30)
  name: string;

  @Field()
  totalMinutes: number;

  @Field()
  delete: boolean;
}
