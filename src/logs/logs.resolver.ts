import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { NewLogInput } from "./dto/add-log.input";
import { UpdateLogInput } from "./dto/update-log.input";
import { LogsArgs } from "./dto/logs.args";
import { Log } from "./models/log.model";
import { LogsService } from "./logs.service";
import { LogArgs } from "./dto/log.args";
import { NotFoundException } from "@nestjs/common";

const pubSub = new PubSub();

@Resolver((of) => Log)
export class LogsResolver {
  constructor(private readonly logsService: LogsService) {}

  @Query((returns) => Log)
  async log(@Args() args: LogArgs): Promise<Log> {
    const log = await this.logsService.findOne(args);
    if (!log) {
      throw new NotFoundException(args);
    }
    return log;
  }

  @Query((returns) => [Log])
  logs(@Args() args: LogsArgs): Promise<Log[]> {
    return this.logsService.findListByUid(args);
  }

  @Mutation((returns) => Log)
  async addLog(
    @Args("addLogInput", { type: () => NewLogInput }) logInput: NewLogInput
  ): Promise<Log> {
    const log = await this.logsService.create(logInput);
    pubSub.publish("logAdded", { logAdded: log });
    return log;
  }

  @Mutation((returns) => Log)
  async updateLog(
    @Args("updateLogInput", { type: () => UpdateLogInput })
    logInput: UpdateLogInput
  ): Promise<Log> {
    const log = await this.logsService.update(logInput);
    pubSub.publish("logAdded", { logAdded: log });
    return log;
  }

  @Mutation((returns) => Boolean)
  async removeLog(@Args() args: LogArgs) {
    return this.logsService.remove(args);
  }

  @Subscription((returns) => [Log])
  logAdded() {
    return pubSub.asyncIterator("logAdded");
  }
}
