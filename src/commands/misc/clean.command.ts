import {
  ApplicationCommandType,
  Client,
  CommandInteraction,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { SlashCommandModule } from "../../types";
import EmbedGenerator from "../../utils/EmbedGenerator";

export default {
  command: new SlashCommandBuilder()
    .setName("clean")
    .setDescription("Clean all the bot messages"),
  callback: async (client: Client, interaction: CommandInteraction) => {
    const channel = interaction.channel as TextChannel;

    try {
      const messages = await channel.messages.fetch();

      const botMessages = messages.filter(
        (msg) => msg.author.id === client?.user?.id && msg.author.bot
      );

      await interaction.deferReply();

      await Promise.allSettled(
        Array.from(botMessages.values()).map(async (m) => {
          return await m.delete();
        })
      );

      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Success(
            {
              title: "Messages has successfully been cleaned!",
            },
            { withPrefix: true }
          ),
        ],
      }));
    } catch (e: any) {
      return void (await interaction.editReply({
        embeds: [
          EmbedGenerator.Error(
            {
              title: `Error occur ${e.message}!`,
            },
            { withPrefix: true }
          ),
        ],
      }));
    }
  },
} as SlashCommandModule;
