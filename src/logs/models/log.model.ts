import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "log " })
export class Log {
  @Field((type) => Int)
  id: number;

  @Field((type) => Int)
  questId: number;

  @Field()
  enemy: string;

  @Field()
  done: boolean;

  @Field()
  startTime: string;

  @Field()
  createdAt: string;

  @Field({ nullable: true })
  updatedAt: string;
}
