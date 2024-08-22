"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const colors_1 = require("../constants/colors");
class EmbedGenerator extends discord_js_1.EmbedBuilder {
    static Success(data, options) {
        if (options?.withPrefix && data) {
            data.title = `${typeof options.withPrefix === "string"
                ? options.withPrefix
                : "✅ [Success] -"} ${data?.title}`;
        }
        return EmbedGenerator.create(data).setColor(colors_1.EmbedColor.SUCCESS);
    }
    static Error(data, options) {
        if (options?.withPrefix && data) {
            data.title = `${typeof options.withPrefix === "string"
                ? options.withPrefix
                : "❌ [Error] -"} ${data?.title}`;
        }
        return EmbedGenerator.create(data).setColor(colors_1.EmbedColor.ERROR);
    }
    static Warn(data, options) {
        if (options?.withPrefix && data) {
            data.title = `${typeof options.withPrefix === "string"
                ? options.withPrefix
                : "⚠ [Warnning] -"} ${data?.title}`;
        }
        return EmbedGenerator.create(data).setColor(colors_1.EmbedColor.WARNNING);
    }
    static Info(data, options) {
        if (options?.withPrefix && data) {
            data.title = `${typeof options.withPrefix === "string"
                ? options.withPrefix
                : "🛈 [Info] -"} ${data?.title}`;
        }
        return EmbedGenerator.create(data).setColor(colors_1.EmbedColor.INFO);
    }
    static create(data) {
        return new EmbedGenerator(data);
    }
}
exports.default = EmbedGenerator;
