import { REST, Routes } from "discord.js";
import getAllLocalCommands from "../utils/getAllLocalCommands";
import appConfig from "../config/app.config";

export default async () => {
  const {
    discord: { token, app_id },
  } = appConfig;
  const localCommands = getAllLocalCommands();
  const jsonLocalCommands = localCommands.map((lc) => lc.command.toJSON());
  const rest = new REST().setToken(token);

  try {
    console.log(
      `Started refreshing ${jsonLocalCommands.length} application (/) commands.`
    );

    const data: any = await rest.put(Routes.applicationCommands(app_id), {
      body: jsonLocalCommands,
    });

    console.log(
      `Successfully reloaded ${data?.length} application (/) commands.`
    );
  } catch (e) {
    console.error(e);
  }
};
