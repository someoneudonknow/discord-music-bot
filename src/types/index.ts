import { GuildQueueEvents } from "discord-player";
import {
  Client,
  ClientEvents,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

type MainConfig = {
  discord: {
    token: string;
    client_id: string;
    app_id: string;
  };
};

export type AppConfig = {
  dev: MainConfig;
  prod: MainConfig;
};

export type EventHandlerFunction<
  Event extends keyof ClientEvents | string | symbol
> = (
  client: Client,
  ...args: Event extends keyof ClientEvents ? ClientEvents[Event] : any[]
) => Promise<void>;

export type SlashCommandModule = {
  command: SlashCommandBuilder;
  callback: (client: Client, interaction: CommandInteraction) => Promise<void>;
};

export type ClientEventHandlerModule<Event extends keyof ClientEvents> = {
  type: Event;
  once?: boolean;
  execute: (client: Client, ...args: ClientEvents[Event]) => Promise<void>;
};

export type PlayerEventHandlerModule<
  Event extends keyof GuildQueueEvents<any>
> = {
  type: Event;
  once: boolean;
  execute: GuildQueueEvents<any>[Event];
};
