/**
 * Compresses an image file using the browser's Canvas API.
 * Converts images to WebP format for optimal compression and transparency support.
 * 
 * @param file - The original image file
 * @param maxWidth - The maximum width of the output image (default: 1200px)
 * @param quality - The WebP quality from 0 to 1 (default: 0.8)
 * @returns A promise that resolves to the compressed File object
 */
export const compressImage = async (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
    // If not an image, return original
    if (!file.type.startsWith('image/')) return file;

    // Skip SVGs as they are vector
    if (file.type === 'image/svg+xml') return file;

    // Skip GIFs to preserve animation
    if (file.type === 'image/gif') return file;

    // If already small (e.g. < 500KB), return original (unless we want to force WebP conversion?)
    // Better to force optimization if it's large, but let's stick to size check to avoid processing tiny icons.
    if (file.size < 500 * 1024) return file;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(file); // Fallback
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to WebP
                const outputType = 'image/webp';

                canvas.toBlob((blob) => {
                    if (!blob) {
                        resolve(file);
                        return;
                    }

                    // Construct new filename with .webp extension
                    const nameParts = file.name.split('.');
                    if (nameParts.length > 1) nameParts.pop(); // Remove old extension
                    const newName = nameParts.join('.') + '.webp';

                    const newFile = new File([blob], newName, {
                        type: outputType,
                        lastModified: Date.now(),
                    });
                    resolve(newFile);
                }, outputType, quality);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};
