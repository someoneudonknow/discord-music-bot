import { Client, ColorResolvable, EmbedBuilder, User } from "discord.js";
import { EmbedColor } from "../constants/colors";

type EmbedInit = ConstructorParameters<typeof EmbedBuilder>[0];
type EmbedGeneratorOptions = {
  withPrefix?: boolean | string;
};

export default class EmbedGenerator extends EmbedBuilder {
  public static Success(data: EmbedInit, options?: EmbedGeneratorOptions) {
    if (options?.withPrefix && data) {
      data.title = `${
        typeof options.withPrefix === "string"
          ? options.withPrefix
          : "✅ [Success] -"
      } ${data?.title}`;
    }

    return EmbedGenerator.create(data).setColor(EmbedColor.SUCCESS);
  }

  public static Error(data: EmbedInit, options?: EmbedGeneratorOptions) {
    if (options?.withPrefix && data) {
      data.title = `${
        typeof options.withPrefix === "string"
          ? options.withPrefix
          : "❌ [Error] -"
      } ${data?.title}`;
    }

    return EmbedGenerator.create(data).setColor(EmbedColor.ERROR);
  }

  public static Warn(data: EmbedInit, options?: EmbedGeneratorOptions) {
    if (options?.withPrefix && data) {
      data.title = `${
        typeof options.withPrefix === "string"
          ? options.withPrefix
          : "⚠ [Warnning] -"
      } ${data?.title}`;
    }

    return EmbedGenerator.create(data).setColor(EmbedColor.WARNNING);
  }

  public static Info(data: EmbedInit, options?: EmbedGeneratorOptions) {
    if (options?.withPrefix && data) {
      data.title = `${
        typeof options.withPrefix === "string"
          ? options.withPrefix
          : "🛈 [Info] -"
      } ${data?.title}`;
    }

    return EmbedGenerator.create(data).setColor(EmbedColor.INFO);
  }

  public static create(data: EmbedInit) {
    return new EmbedGenerator(data);
  }
}
