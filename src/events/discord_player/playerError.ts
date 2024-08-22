import logger from "../../helpers/logger";
import { PlayerEventHandlerModule } from "../../types";

export default {
  type: "playerError",
  once: false,
  execute: (_, error) => {
    logger("error", `Player error: ${error.message}`);
  },
} as PlayerEventHandlerModule<"playerError">;
