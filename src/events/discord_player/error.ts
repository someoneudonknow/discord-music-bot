import logger from "../../helpers/logger";
import { PlayerEventHandlerModule } from "../../types";

export default {
  type: "error",
  once: false,
  execute: (_, error) => {
    logger("error", `General error: ${error.message}`);
  },
} as PlayerEventHandlerModule<"error">;
