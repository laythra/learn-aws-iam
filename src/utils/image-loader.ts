const images = import.meta.glob('../assets/images/**/*.{png,jpg,gif}', { eager: true });

export function loadLocalImage(imagePath: string, extension: string = 'png'): string | undefined {
  const key = `../assets/images/${imagePath}.${extension}`;
  return (images as Record<string, { default: string }>)[key]?.default;
}
