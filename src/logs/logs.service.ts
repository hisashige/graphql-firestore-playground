import { Injectable } from "@nestjs/common";
import { NewLogInput } from "./dto/add-log.input";
import { UpdateLogInput } from "./dto/update-log.input";
import { LogsArgs } from "./dto/logs.args";
import { LogArgs } from "./dto/log.args";
import { Log } from "./models/log.model";
import { getLogCollection } from "src/utils/firestore";
import { now } from "src/utils/dateUtils";
import { LogItem } from "./types";

@Injectable()
export class LogsService {
  async create(data: NewLogInput): Promise<Log> {
    try {
      const logCollection = getLogCollection();

      // 存在チェック
      const exitData = await logCollection
        .where("uid", "==", data.uid)
        .where("id", "==", data.id)
        .get();
      if (exitData.docs.length > 0) {
        throw new Error(`uid: ${data.uid}, id: ${data.id} is already exist.`);
      }

      // 新規登録
      const addData = { ...data, createdAt: now(), updatedAt: null };
      const docRef = logCollection.doc(`${data.uid}_${data.id}`);
      await docRef.set(addData);

      // 登録したデータを返却
      const doc = await logCollection.doc(docRef.id).get();
      return doc.data() as Log;
    } catch (e) {
      console.error("Error adding log: ", e);
      throw new Error(`ログの登録に失敗しました。(${e})`);
    }
  }

  async update(data: UpdateLogInput): Promise<Log> {
    try {
      const logCollection = getLogCollection();

      // 存在チェック
      const exitData = await logCollection
        .where("uid", "==", data.uid)
        .where("id", "==", data.id)
        .get();
      if (exitData.docs.length === 0) {
        throw new Error(`uid: ${data.uid}, id: ${data.id} is not exist.`);
      }

      // 更新
      const updateData = {
        ...exitData.docs[0].data(),
        updatedAt: now(),
      } as LogItem;
      const updateKeys = ["questId", "enemy", "minutes", "done", "startTime"];
      updateKeys.forEach((key) => {
        if (data[key] !== undefined) {
          updateData[key] = data[key];
        }
      });
      const docRef = exitData.docs[0].ref;
      await docRef.update(updateData);

      // 更新したデータを返却
      const doc = await logCollection.doc(docRef.id).get();
      return doc.data() as Log;
    } catch (e) {
      console.error("Error updating log: ", e);
      throw new Error(`ログの更新に失敗しました。: ${e}`);
    }
  }

  async findOne(args: LogArgs): Promise<Log> {
    try {
      const logCollection = getLogCollection();
      const exitData = await logCollection
        .where("uid", "==", args.uid)
        .where("id", "==", args.id)
        .get();
      if (exitData.docs.length === 0) {
        return null;
      }
      return exitData.docs[0].data() as Log;
    } catch (e) {
      console.error("Error finding log: ", e);
      throw new Error(`ログの取得に失敗しました。(${e})`);
    }
  }

  async findListByUid(args: LogsArgs): Promise<Log[]> {
    try {
      const logCollection = getLogCollection();
      const logs = await logCollection.where("uid", "==", args.uid).get();

      if (logs.docs.length > 0) {
        return logs.docs.map((doc) => doc.data()) as Log[];
      }

      return [] as Log[];
    } catch (e) {
      console.error("Error finding loglist: ", e);
      throw new Error(`ログリストの取得に失敗しました。(${e})`);
    }
  }

  async remove(args: LogArgs): Promise<boolean> {
    try {
      const logCollection = getLogCollection();

      // 存在チェック
      const exitData = await logCollection
        .where("uid", "==", args.uid)
        .where("id", "==", args.id)
        .get();
      if (exitData.docs.length === 0) {
        throw new Error(`uid: ${args.uid}, id: ${args.id} is not exist.`);
      }

      // 削除
      const docRef = exitData.docs[0].ref;
      await docRef.delete();
      return true;
    } catch (e) {
      console.error("Error removing log: ", e);
      throw new Error(`ログの削除に失敗しました。(${e})`);
    }
  }
}
