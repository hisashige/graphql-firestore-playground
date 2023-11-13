import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Quest } from "./models/quest.model";
import { QuestsService } from "./quests.service";
import { BulkUpdateQuestInput } from "./dto/bulk-update-quest.input";
import { AuthGuard } from "src/common/guards/auth.guard";
import { UseGuards } from "@nestjs/common";

const pubSub = new PubSub();

@Resolver((of) => Quest)
export class QuestsResolver {
  constructor(private readonly questsService: QuestsService) {}

  @Query((returns) => [Quest])
  @UseGuards(AuthGuard)
  quests(@Context() context): Promise<Quest[]> {
    const user = context.req.user;
    return this.questsService.findListByUid(user.uid);
  }

  @Mutation((returns) => [Quest])
  @UseGuards(AuthGuard)
  async editQuests(
    @Context() context,
    @Args("bulkUpdateQuestData", { type: () => BulkUpdateQuestInput })
    BulkUpdateQuestInput: BulkUpdateQuestInput
  ): Promise<Quest[]> {
    const user = context.req.user;
    const quests = await this.questsService.updateQuests(
      user.uid,
      BulkUpdateQuestInput
    );
    pubSub.publish("questUpdated", { questAdded: quests });
    return quests;
  }

  @Subscription((returns) => [Quest])
  questUpdated() {
    return pubSub.asyncIterator("questUpdated");
  }
}
