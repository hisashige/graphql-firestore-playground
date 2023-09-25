import { Field, InputType, ID } from "@nestjs/graphql";
import { QuestInput } from "./quest.input";

@InputType()
export class BulkUpdateQuestInput {
  @Field((type) => ID)
  uid: string;

  @Field((type) => [QuestInput])
  quests: QuestInput[];
}
