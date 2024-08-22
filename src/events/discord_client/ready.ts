import { Client, Events } from "discord.js";
import { ClientEventHandlerModule } from "../../types";
import getAllLocalCommands from "../../utils/getAllLocalCommands";
import logger from "../../helpers/logger";

export default {
  type: Events.ClientReady,
  once: true,
  execute: async (client: Client) => {
    logger("info", `Logged in as ${client.user?.tag}`);
    const commandObjects = getAllLocalCommands();

    for (const commandObject of commandObjects) {
      const { command } = commandObject;

      if (command) client.commands.set(command.name, commandObject);
    }
  },
} as ClientEventHandlerModule<Events.ClientReady>;
