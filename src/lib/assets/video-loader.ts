const tutorialVideos = import.meta.glob('@/assets/tutorial_videos/**/*.webm');

export async function loadLocalVideo(
  videoPath: string,
  extension: string = 'webm'
): Promise<string | undefined> {
  const key = `/src/assets/tutorial_videos/${videoPath}.${extension}`;
  const videoModule = tutorialVideos[key];
  if (!videoModule) return undefined;

  const module = (await videoModule()) as { default: string };
  return module.default;
}
