// Validate Youtube video URL
export const youtubeVideoRegex = new RegExp(
  /(?:youtube\.com\/(?:[^\\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\\/\s]{11})/
);

// Validate Youtube playlist URL
export const youtubePlaylistRegex = new RegExp(
  /(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*/
);

// Validate SoundCloud track URL
export const soundCloudTrackRegex = new RegExp(
  /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/
);

// Validate SoundCloud playlist/album URL
export const soundCloudPlaylistRegex = new RegExp(
  /^https?:\/\/(soundcloud\.com|snd\.sc)\/([^?])*\/sets\/(.*)$/
);
