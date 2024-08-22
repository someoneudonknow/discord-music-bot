import { Client, Events } from "discord.js";
import { ClientEventHandlerModule } from "../../types";
import logger from "../../helpers/logger";

export default {
  type: Events.Error,
  once: true,
  execute: async (client: Client, error: Error) => {
    logger("error", error.message);
  },
} as ClientEventHandlerModule<Events.Error>;
