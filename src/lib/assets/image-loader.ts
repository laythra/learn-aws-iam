// Lazy load images on-demand to reduce initial bundle size
const images = import.meta.glob('@/assets/images/**/*.{png,jpg,jpeg,webp}');

export async function loadLocalImage(
  imagePath: string,
  extension: string = 'webp'
): Promise<string | undefined> {
  const key = `/src/assets/images/${imagePath}.${extension}`;
  const imageModule = images[key];
  if (!imageModule) return undefined;

  const module = (await imageModule()) as { default: string };
  return module.default;
}
