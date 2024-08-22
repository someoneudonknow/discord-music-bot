import "dotenv/config";
import bot from "./bot/bot.init";

(async () => {
  await bot.setUpAndLogin();
})();
