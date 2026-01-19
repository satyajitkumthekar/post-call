export interface VideoTestimonial {
  filename: string;
  name: string;
  designation: string;
  videoUrl: string;
}

export interface Screenshot {
  filename: string;
  imageUrl: string;
}

export function parseVideoFilename(filename: string): { name: string; designation: string } | null {
  const nameWithoutExt = filename.replace(/\.(mp4|webm|mov)$/i, '');

  const parts = nameWithoutExt.split('__');

  if (parts.length !== 2) {
    console.warn(`Invalid filename format: ${filename}. Expected format: Name__Designation.mp4`);
    return null;
  }

  const name = parts[0].replace(/-/g, ' ').trim();
  const designation = parts[1].replace(/-/g, ' ').trim();

  return { name, designation };
}

export async function loadMainVideo(): Promise<string | null> {
  try {
    const videoExtensions = ['mp4', 'webm', 'mov'];

    for (const ext of videoExtensions) {
      try {
        const videoPath = `/media/main-video/main.${ext}`;
        const response = await fetch(videoPath, { method: 'HEAD' });
        if (response.ok) {
          return videoPath;
        }
      } catch {
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error('Error loading main video:', error);
    return null;
  }
}

export function loadTestimonialVideos(): VideoTestimonial[] {
  const videoFiles = import.meta.glob('/public/media/testimonial-videos/*.{mp4,webm,mov}', {
    eager: false,
    query: '?url',
    import: 'default'
  });

  const testimonials: VideoTestimonial[] = [];

  for (const path in videoFiles) {
    const filename = path.split('/').pop() || '';
    const parsed = parseVideoFilename(filename);

    if (parsed) {
      const videoUrl = path.replace('/public', '');
      testimonials.push({
        filename,
        name: parsed.name,
        designation: parsed.designation,
        videoUrl,
      });
    }
  }

  return testimonials;
}

export function loadScreenshots(): Screenshot[] {
  const imageFiles = import.meta.glob('/public/media/testimonial-screenshots/*.{jpg,jpeg,png,webp}', {
    eager: false,
    query: '?url',
    import: 'default'
  });

  const screenshots: Screenshot[] = [];

  for (const path in imageFiles) {
    const filename = path.split('/').pop() || '';
    const imageUrl = path.replace('/public', '');

    screenshots.push({
      filename,
      imageUrl,
    });
  }

  return screenshots;
}
