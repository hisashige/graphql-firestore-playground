import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { QuestsArgs } from "./dto/quests.args";
import { Quest } from "./models/quest.model";
import { QuestsService } from "./quests.service";
import { BulkUpdateQuestInput } from "./dto/bulk-update-quest.input";

const pubSub = new PubSub();

@Resolver((of) => Quest)
export class QuestsResolver {
  constructor(private readonly questsService: QuestsService) {}

  @Query((returns) => [Quest])
  quests(@Args() questsArgs: QuestsArgs): Promise<Quest[]> {
    return this.questsService.findListByUid(questsArgs);
  }

  @Mutation((returns) => [Quest])
  async editQuests(
    @Args("bulkUpdateQuestsData", { type: () => BulkUpdateQuestInput })
    BulkUpdateQuestInput: BulkUpdateQuestInput
  ): Promise<Quest[]> {
    const quests = await this.questsService.updateQuests(BulkUpdateQuestInput);
    pubSub.publish("questUpdated", { questAdded: quests });
    return quests;
  }

  @Subscription((returns) => [Quest])
  questUpdated() {
    return pubSub.asyncIterator("questUpdated");
  }
}
