export function loadLocalImage(imagePath: string, extension: string = 'png'): string | undefined {
  try {
    return require(`@/assets/images/${imagePath}.${extension}`);
  } catch (e) {
    // TODO: Load placeholder image
    return undefined;
  }
}
