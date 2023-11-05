import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { LogsArgs } from "./dto/logs.args";
import { Log } from "./models/log.model";
import { LogsService } from "./logs.service";
import { LogInput } from "./dto/log.input";

const pubSub = new PubSub();

@Resolver((of) => Log)
export class LogsResolver {
  constructor(private readonly logsService: LogsService) {}

  @Query((returns) => [Log])
  logs(@Args() logsArgs: LogsArgs): Promise<Log[]> {
    return this.logsService.findListByUid(logsArgs);
  }

  @Mutation((returns) => Log)
  async createLog(
    @Args("logData", { type: () => LogInput })
    logInput: LogInput
  ): Promise<Log> {
    const log = await this.logsService.createLog(logInput);
    pubSub.publish("logUpdated", { logAdded: log });
    return log;
  }

  @Mutation((returns) => Log)
  async updateLog(
    @Args("logData", { type: () => LogInput })
    logInput: LogInput
  ): Promise<Log> {
    const log = await this.logsService.updateLog(logInput);
    pubSub.publish("logUpdated", { logAdded: log });
    return log;
  }

  @Subscription((returns) => [Log])
  logUpdated() {
    return pubSub.asyncIterator("questUpdated");
  }
}
