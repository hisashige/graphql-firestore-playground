import { Injectable, NotFoundException } from "@nestjs/common";
import { LogInput } from "./dto/log.input";
import { LogsArgs } from "./dto/logs.args";
import { Log } from "./models/log.model";
import { getLogCollection } from "src/utils/firestore";
import { now } from "src/utils/dateUtils";

@Injectable()
export class LogsService {
  async findListByUid(logsArgs: LogsArgs): Promise<Log[]> {
    const logCollection = getLogCollection();
    const logs = await logCollection.where("uid", "==", logsArgs.uid).get();

    if (logs.docs.length > 0) {
      return logs.docs.map((doc) => doc.data()) as Log[];
    }

    return [] as Log[];
  }

  async createLog(logInput: LogInput): Promise<Log> {
    const logCollection = getLogCollection();
    const docRef = logCollection.doc(`${logInput.uid}_${logInput.id}`);
    const log = {
      ...logInput,
      createdAt: now(),
      updatedAt: null,
    };
    await docRef.set(log);
    return log;
  }

  async updateLog(logInput: LogInput): Promise<Log> {
    const logCollection = getLogCollection();

    const exitData = await logCollection
      .where("uid", "==", logInput.uid)
      .where("id", "==", logInput.id)
      .get();

    if (exitData.docs.length === 0) {
      throw new NotFoundException(
        `Log with ID[${logInput.id}] UID[${logInput.uid}] not found`
      );
    }

    const docRef = logCollection.doc(`${logInput.uid}_${logInput.id}`);
    const log = {
      ...logInput,
      updatedAt: now(),
    };
    await docRef.update(log);

    const rtnLog = {
      ...log,
      createdAt: exitData.docs[0].data().createdAt as string,
    };
    return rtnLog;
  }
}
