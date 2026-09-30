import { useState, useEffect, useRef } from 'react';
import { useAppData } from '../context/AppDataContext';

// Helper component for smooth image transitions
const MosaicImage = ({ src, alt, className, onClick }: { src: string, alt: string, className: string, onClick: () => void }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (src !== currentSrc) {
      setIsFading(true);
      const timer = setTimeout(() => {
        setCurrentSrc(src);
        setIsFading(false);
      }, 500); // Wait for fade out
      return () => clearTimeout(timer);
    }
  }, [src]);

  return (
    <div className={`${className} bg-gray-200`}>
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onClick={onClick}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};

const PhotoGallery = () => {
  const { photoGallery } = useAppData();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fixed slots for the layout: 2 + 3 + 4 + 3 + 2 = 14 slots
  const [visibleImages, setVisibleImages] = useState<string[]>([]);

  // Keep track of all available images to rotate
  const allImagesRef = useRef<string[]>([]);

  // Initialize and Update Pool (Handle Adds/Deletes)
  useEffect(() => {
    if (photoGallery) {
      // Flatten all images regardless of category
      const flatImages = photoGallery.map(p => p.image_url);
      allImagesRef.current = flatImages;

      setVisibleImages(prev => {
        // 1. Initial Fill if empty
        if (prev.length === 0 && flatImages.length > 0) {
          const initial = [];
          for (let i = 0; i < 14; i++) {
            initial.push(flatImages[i % flatImages.length]);
          }
          return initial;
        }

        // 2. Live Sync: Remove deleted images immediately
        // If a visible image is NO LONGER in the updated pool, it must be replaced.
        let changed = false;
        const updated = prev.map(img => {
          if (flatImages.includes(img)) return img; // Image still exists, keep it

          // Image was deleted! Swap with a random valid one
          changed = true;
          if (flatImages.length > 0) {
            return flatImages[Math.floor(Math.random() * flatImages.length)];
          }
          return img; // Fallback (e.g. all deleted)
        });

        return changed ? updated : prev;
      });
    }
  }, [photoGallery]);

  // Rotation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const pool = allImagesRef.current;
      if (pool.length === 0) return;

      setVisibleImages(current => {
        const next = [...current];

        // Scenario 1: We have more images than slots (> 14)
        // Swap a visible image with a new one from the pool
        const available = pool.filter(img => !current.includes(img));

        if (available.length > 0) {
          const slotToSwap = Math.floor(Math.random() * 14);
          const randomNew = available[Math.floor(Math.random() * available.length)];
          next[slotToSwap] = randomNew;
          return next;
        }

        // Scenario 2: We have few images (<= 14)
        // To create movement, we simply swap two visible images positions
        if (current.length >= 2) {
          const slotA = Math.floor(Math.random() * current.length);
          let slotB = Math.floor(Math.random() * current.length);
          // Ensure distinct slots
          while (slotA === slotB) {
            slotB = Math.floor(Math.random() * current.length);
          }

          const temp = next[slotA];
          next[slotA] = next[slotB];
          next[slotB] = temp;
          return next;
        }

        return current;
      });
    }, 4000); // Swap every 4 seconds

    return () => clearInterval(interval);
  }, []);


  if (visibleImages.length === 0) {
    return (
      <section id="gallery" className="relative w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white py-12 lg:py-24">
        <div className="text-center px-4">
          <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl text-zinc-900 lg:text-[64px]">Photo Gallery</h2>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-zinc-600">A glimpse into our most memorable moments</p>
          <div className="mt-12 w-full max-w-xl mx-auto flex flex-col items-center justify-center text-gray-500 font-mono text-xs gap-4 p-12 text-center bg-gray-100/50 rounded-3xl border border-gray-200">
            <div className="text-4xl grayscale opacity-50">📸</div>
            <span className="font-bold tracking-widest uppercase">NO_GALLERY_DATA_FOUND</span>
            <p className="text-xs text-gray-400">Add photos in the admin panel to see them here.</p>
          </div>
        </div>
      </section>
    );
  }

  // Slices for layout
  const col1 = visibleImages.slice(0, 2);
  const col2 = visibleImages.slice(2, 5);
  const center = visibleImages.slice(5, 9); // 4 images
  const col3 = visibleImages.slice(9, 12);
  const col4 = visibleImages.slice(12, 14);

  return (
    <section id="gallery" className="relative w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white py-12 lg:py-0">
      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selectedImage}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in duration-300"
            alt="Full view"
          />
        </div>
      )}

      <div className="relative mx-auto max-w-[1920px]">
        {/* Mobile View - Simplified Subset */}
        <div className="lg:hidden px-2 sm:px-4">
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl text-zinc-900">Photo Gallery</h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-zinc-600">A glimpse into our most memorable moments</p>
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-8 max-w-full">
            {/* Left Column (2 items) */}
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 flex-shrink-0">
              {col1.map((img, index) => (
                <div key={`mob-col1-${index}`} className="group relative h-[120px] w-[85px] sm:h-[150px] sm:w-[105px] md:h-[182px] md:w-[134px] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg hover:scale-105 transition-all duration-300">
                  <MosaicImage
                    src={img}
                    alt={`Gallery ${index}`}
                    className="h-full w-full"
                    onClick={() => setSelectedImage(img)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10 pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Center (1 main item) */}
            <div className="flex items-center justify-center flex-shrink-0">
              <div className="group relative h-[200px] w-[140px] sm:h-[250px] sm:w-[175px] md:h-[300px] md:w-[220px] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl hover:scale-105 transition-all duration-300">
                <MosaicImage
                  src={center[0]}
                  alt="Center Gallery"
                  className="h-full w-full"
                  onClick={() => setSelectedImage(center[0])}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10 pointer-events-none"></div>
              </div>
            </div>

            {/* Right Column (2 items) */}
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 flex-shrink-0">
              {col4.map((img, index) => (
                <div key={`mob-col4-${index}`} className="group relative h-[120px] w-[85px] sm:h-[150px] sm:w-[105px] md:h-[182px] md:w-[134px] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg hover:scale-105 transition-all duration-300">
                  <MosaicImage
                    src={img}
                    alt={`Gallery R ${index}`}
                    className="h-full w-full"
                    onClick={() => setSelectedImage(img)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop View - Full 14 Layout */}
        <div className="hidden lg:block relative">
          <div className="relative flex items-start justify-center gap-[30px]">
            {/* Left Columns */}
            <div className="flex gap-[30px]">
              {/* Column 1 (2 items) */}
              <div className="flex flex-col items-center justify-start gap-[30px] pt-[70px]">
                {col1.map((img, index) => (
                  <div key={`d-c1-${index}`} className="group relative h-[182px] w-[134px] overflow-hidden rounded-3xl shadow-lg hover:scale-105 transition-all duration-300 cursor-zoom-in">
                    <MosaicImage src={img} alt="" className="h-full w-full" onClick={() => setSelectedImage(img)} />
                  </div>
                ))}
              </div>
              {/* Column 2 (3 items) */}
              <div className="flex flex-col items-center justify-start gap-[19px]">
                {col2.map((img, index) => (
                  <div key={`d-c2-${index}`} className="group relative h-[146px] w-[134px] overflow-hidden rounded-3xl shadow-lg hover:scale-105 transition-all duration-300 cursor-zoom-in">
                    <MosaicImage src={img} alt="" className="h-full w-full" onClick={() => setSelectedImage(img)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Center Section with Title (4 items) */}
            <div className="relative flex flex-col items-center justify-center">
              <div className="relative flex flex-col items-center justify-center">
                <div className="relative flex items-start justify-center gap-[30px] mt-2 mb-[113px]">
                  {center.map((img, index) => (
                    <div
                      key={`d-center-${index}`}
                      className="group relative h-[250px] w-[135px] overflow-hidden rounded-3xl shadow-lg hover:scale-105 transition-all duration-300 cursor-zoom-in"
                      style={{ marginTop: index === 0 ? '63px' : index === 1 ? '27px' : index === 2 ? '0px' : '63px' }}
                    >
                      <MosaicImage src={img} alt="" className="h-full w-full" onClick={() => setSelectedImage(img)} />
                    </div>
                  ))}
                </div>
                <div className="relative text-center">
                  <h2 className="whitespace-nowrap font-semibold text-5xl text-zinc-900 sm:text-6xl md:text-7xl lg:text-[64px]">
                    Photo Gallery
                  </h2>
                  <p className="mt-4 text-lg text-zinc-600 sm:text-xl md:text-2xl">A glimpse into our most memorable moments</p>
                </div>
              </div>
            </div>

            {/* Right Columns */}
            <div className="flex gap-[30px]">
              {/* Column 3 (3 items) */}
              <div className="flex flex-col items-center justify-start gap-[19px]">
                {col3.map((img, index) => (
                  <div key={`d-c3-${index}`} className="group relative h-[146px] w-[134px] overflow-hidden rounded-3xl shadow-lg hover:scale-105 transition-all duration-300 cursor-zoom-in">
                    <MosaicImage src={img} alt="" className="h-full w-full" onClick={() => setSelectedImage(img)} />
                  </div>
                ))}
              </div>
              {/* Column 4 (2 items) */}
              <div className="flex flex-col items-center justify-start gap-[30px] pt-[70px]">
                {col4.map((img, index) => (
                  <div key={`d-c4-${index}`} className="group relative h-[182px] w-[134px] overflow-hidden rounded-3xl shadow-lg hover:scale-105 transition-all duration-300 cursor-zoom-in">
                    <MosaicImage src={img} alt="" className="h-full w-full" onClick={() => setSelectedImage(img)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
