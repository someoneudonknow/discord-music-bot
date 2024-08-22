import { Client, Collection, GatewayIntentBits } from "discord.js";
import deployCommands from "../helpers/deployCommands";
import appConfig from "../config/app.config";
import { Player } from "discord-player";
import { ClientEventHandlerModule, PlayerEventHandlerModule } from "../types";
import getAllFiles from "../utils/getAllFiles";
import { join } from "path";
import { YoutubeiExtractor } from "discord-player-youtubei";
import logger from "../helpers/logger";
import { SlashCommandModule } from "../types";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, SlashCommandModule>;
  }
}

const {
  discord: { token },
} = appConfig;

class Bot {
  private static _instance: Bot | null = null;

  public static get instance() {
    if (Bot._instance === null) {
      Bot._instance = new Bot();
    }
    return Bot._instance;
  }

  private readonly client: Client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMembers,
    ],
  });
  private readonly player: Player = new Player(this.client);

  constructor() {
    this.client.commands = new Collection();
  }

  public async setUp(): Promise<void> {
    this.handleDiscordClientEvents();
    this.handlePlayerEvents();
    await deployCommands();
    await this.player.extractors.register(YoutubeiExtractor, {});
    await this.player.extractors.loadDefault();
  }

  public async setUpAndLogin(): Promise<void> {
    await this.setUp();
    await this.client.login(token);
  }

  private handlePlayerEvents(): void {
    const eventFiles: string[] = getAllFiles(
      join(__dirname, "..", "events", "discord_player")
    );

    for (const eventFile of eventFiles) {
      const requiredFile = require(eventFile);
      const eventObject = requiredFile.default as PlayerEventHandlerModule<
        typeof requiredFile.default.type
      >;

      if (eventObject) {
        const { execute, type, once } = eventObject;

        if (once) {
          this.player.events.once(type, execute);
        } else {
          this.player.events.on(type, execute);
        }
      }
    }
  }

  private handleDiscordClientEvents(): void {
    const eventFiles: string[] = getAllFiles(
      join(__dirname, "..", "events", "discord_client")
    );

    for (const eventFile of eventFiles) {
      const requiredFile = require(eventFile);
      const eventObject = requiredFile.default as ClientEventHandlerModule<
        typeof requiredFile.default.type
      >;

      if (eventObject) {
        const { execute, type, once } = eventObject;

        if (once) {
          this.client.once(type, async (...args) => {
            try {
              await execute(this.client, ...args);
            } catch (e: any) {
              logger("error", e.message);
            }
          });
        } else {
          this.client.on(type, async (...args) => {
            try {
              await execute(this.client, ...args);
            } catch (e: any) {
              logger("error", e.message);
            }
          });
        }
      }
    }
  }
}

const bot: Bot = Bot.instance;

export default bot;
