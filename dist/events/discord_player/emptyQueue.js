"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmbedGenerator_1 = __importDefault(require("../../utils/EmbedGenerator"));
exports.default = {
    type: "emptyQueue",
    once: false,
    execute: async (queue) => {
        const interaction = queue.metadata;
        if (interaction) {
            await interaction.channel?.send({
                embeds: [
                    EmbedGenerator_1.default.Info({
                        title: "All tracks has been played!",
                    }, { withPrefix: true }),
                ],
            });
        }
    },
};
