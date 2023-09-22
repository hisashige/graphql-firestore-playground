import { Injectable } from "@nestjs/common";
import { NewQuestInput } from "./dto/new-quest.input";
import { QuestsArgs } from "./dto/quests.args";
import { Quest } from "./models/quest.model";
import { getQuestCollection } from "src/utils/firestore";

@Injectable()
export class QuestsService {
  /**
   * MOCK
   * Put some real business logic here
   * Left for demonstration purposes
   */

  async create(data: NewQuestInput): Promise<Quest> {
    try {
      const questCollection = getQuestCollection();
      if (questCollection === null)
        throw new Error("Firestore is not initialized");
      const docRef = await questCollection.add(data);
      const doc = await questCollection.doc(docRef.id).get();
      return doc.data() as Quest;
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async createQuests(data: NewQuestInput[]): Promise<Quest> {
    return {} as any;
  }

  async findOneById(id: number): Promise<Quest> {
    return {} as any;
  }

  async findAll(questsArgs: QuestsArgs): Promise<Quest[]> {
    return [] as Quest[];
  }

  async remove(id: number): Promise<boolean> {
    return true;
  }
}
