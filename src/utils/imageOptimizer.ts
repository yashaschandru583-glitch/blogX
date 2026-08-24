/**
 * Utility to process, resize, and compress user uploaded images cleanly
 * using HTML5 Canvas to WebP / JPEG format.
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 to 1
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Data URL'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export async function optimizeImage(
  fileOrDataUrl: File | string,
  options: ImageOptimizationOptions = {}
): Promise<{ dataUrl: string; sizeBytes: number; width: number; height: number }> {
  const {
    maxWidth = 1600,
    maxHeight = 1200,
    quality = 0.85,
    format = 'image/webp'
  } = options;

  let rawDataUrl: string;
  if (typeof fileOrDataUrl === 'string') {
    rawDataUrl = fileOrDataUrl;
  } else {
    rawDataUrl = await readFileAsDataURL(fileOrDataUrl);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate scaled dimensions keeping aspect ratio
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({
          dataUrl: rawDataUrl,
          sizeBytes: Math.round((rawDataUrl.length * 3) / 4),
          width: img.width,
          height: img.height
        });
        return;
      }

      // Draw background if transparent PNG converted to JPEG
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      try {
        let outputDataUrl = canvas.toDataURL(format, quality);
        
        // If webp is not supported or yielded empty, fallback to jpeg
        if (!outputDataUrl.startsWith(`data:${format}`)) {
          outputDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const sizeBytes = Math.round((outputDataUrl.length * 3) / 4);
        resolve({
          dataUrl: outputDataUrl,
          sizeBytes,
          width,
          height
        });
      } catch (err) {
        // Fallback to original raw
        resolve({
          dataUrl: rawDataUrl,
          sizeBytes: Math.round((rawDataUrl.length * 3) / 4),
          width: img.width,
          height: img.height
        });
      }
    };

    img.onerror = (err) => {
      reject(new Error('Failed to load image for processing'));
    };

    img.src = rawDataUrl;
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
