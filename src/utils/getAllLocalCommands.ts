import { join } from "path";
import getAllFiles from "./getAllFiles";
import { SlashCommandModule } from "../types";
import logger from "../helpers/logger";

export default (exceptions?: string[]): SlashCommandModule[] => {
  const localCommands: SlashCommandModule[] = [];
  const commandCategories: string[] = getAllFiles(
    join(__dirname, "..", "commands"),
    true
  );

  for (const commandCategory of commandCategories) {
    const commandFiles = getAllFiles(commandCategory);

    for (const commandFile of commandFiles) {
      const requiredCommandFile = require(commandFile);
      const commandObject = requiredCommandFile.default;

      if (
        !commandObject ||
        !("command" in commandObject) ||
        !("callback" in commandObject)
      ) {
        logger(
          "warn",
          `The command at ${commandFile} is missing a required "command" or "callback" property.`
        );
        continue;
      }

      if (
        exceptions?.includes((commandObject as SlashCommandModule).command.name)
      )
        continue;

      localCommands.push(commandObject);
    }
  }

  return localCommands;
};
