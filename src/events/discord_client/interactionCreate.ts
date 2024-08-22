import { Client, CommandInteraction, Events } from "discord.js";
import { ClientEventHandlerModule } from "../../types";

export default {
  type: Events.InteractionCreate,
  once: false,
  execute: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.callback(client, interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  },
} as ClientEventHandlerModule<Events.InteractionCreate>;
