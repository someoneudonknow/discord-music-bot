"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.soundCloudPlaylistRegex = exports.soundCloudTrackRegex = exports.youtubePlaylistRegex = exports.youtubeVideoRegex = void 0;
exports.youtubeVideoRegex = new RegExp(/(?:youtube\.com\/(?:[^\\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\\/\s]{11})/);
exports.youtubePlaylistRegex = new RegExp(/(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*/);
exports.soundCloudTrackRegex = new RegExp(/^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/);
exports.soundCloudPlaylistRegex = new RegExp(/^https?:\/\/(soundcloud\.com|snd\.sc)\/([^?])*\/sets\/(.*)$/);
