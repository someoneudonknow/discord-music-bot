"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmbedGenerator_1 = __importDefault(require("../../utils/EmbedGenerator"));
exports.default = {
    type: "playerStart",
    once: false,
    execute: async (queue, track) => {
        const interaction = queue.metadata;
        return await interaction.channel?.send({
            embeds: [
                EmbedGenerator_1.default.Info({
                    title: `${track.title}`,
                    url: track.url,
                    thumbnail: {
                        url: track.thumbnail,
                    },
                    fields: [
                        { name: "Duration", value: track.duration, inline: true },
                        {
                            name: "Position in queue",
                            value: String(queue.node.getTimestamp()?.current.value),
                            inline: true,
                        },
                        {
                            name: "Tracks left",
                            value: String(queue.size),
                            inline: true,
                        },
                    ],
                    ...(track?.requestedBy && {
                        author: {
                            name: track.requestedBy.username,
                            iconURL: track.requestedBy.displayAvatarURL(),
                        },
                    }),
                }, { withPrefix: "▶ [Start playing] - " }),
            ],
        });
    },
};
