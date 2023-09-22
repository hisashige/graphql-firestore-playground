import { NotFoundException } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { NewQuestInput } from "./dto/new-quest.input";
import { QuestsArgs } from "./dto/quests.args";
import { Quest } from "./models/quest.model";
import { QuestsService } from "./quests.service";

const pubSub = new PubSub();

@Resolver((of) => Quest)
export class QuestsResolver {
  constructor(private readonly questsService: QuestsService) {}

  @Query((returns) => Quest)
  async quest(@Args("id") id: number): Promise<Quest> {
    const recipe = await this.questsService.findOneById(id);
    if (!recipe) {
      throw new NotFoundException(id);
    }
    return recipe;
  }

  @Query((returns) => [Quest])
  quests(@Args() questsArgs: QuestsArgs): Promise<Quest[]> {
    return this.questsService.findAll(questsArgs);
  }

  @Mutation((returns) => Quest)
  async addQuest(
    @Args("newQuestData") newQuestData: NewQuestInput
  ): Promise<Quest> {
    const quest = await this.questsService.create(newQuestData);
    pubSub.publish("questAdded", { questAdded: quest });
    return quest;
  }

  @Mutation((returns) => [Quest])
  async addQuests(
    @Args("newQuestsData", { type: () => [NewQuestInput] })
    newQuestsData: NewQuestInput[]
  ): Promise<Quest> {
    const quests = await this.questsService.createQuests(newQuestsData);
    pubSub.publish("questAdded", { questAdded: quests });
    return quests;
  }

  @Mutation((returns) => Boolean)
  async removeQuest(@Args("id") id: number) {
    return this.questsService.remove(id);
  }

  @Subscription((returns) => [Quest])
  questAdded() {
    return pubSub.asyncIterator("questAdded");
  }
}
