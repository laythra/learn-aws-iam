export function loadLocalImage(imagePath: string, extension: string = 'png'): string | undefined {
  try {
    return new URL(`../assets/images/${imagePath}.${extension}`, import.meta.url).href;
  } catch (e) {
    // TODO: Load placeholder image
    return undefined;
  }
}
