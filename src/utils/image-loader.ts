const images = import.meta.glob('../assets/images/**/*.{png,jpg,gif}', { eager: true });
const tutorialGifs = import.meta.glob('../assets/tutorial_gifs/**/*.{png,jpg,gif}', {
  eager: true,
});

export function loadLocalImage(imagePath: string, extension: string = 'png'): string | undefined {
  const key = `../assets/images/${imagePath}.${extension}`;
  return (images as Record<string, { default: string }>)[key]?.default;
}

export function loadTutorialGif(imagePath: string, extension: string = 'png'): string | undefined {
  const key = `../assets/tutorial_gifs/${imagePath}.${extension}`;
  return (tutorialGifs as Record<string, { default: string }>)[key]?.default;
}
