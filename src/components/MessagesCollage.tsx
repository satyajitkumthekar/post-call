import { useState, useEffect } from 'react';
import { loadScreenshots, Screenshot } from '../utils/mediaLoader';
import ImageLightbox from './ImageLightbox';

export default function MessagesCollage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const images = loadScreenshots();
    setScreenshots(images);
  }, []);

  if (screenshots.length === 0) {
    return null;
  }

  return (
    <section className="relative py-24 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Client Testimonials
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {screenshots.map((screenshot, index) => (
            <div
              key={screenshot.filename}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={screenshot.imageUrl}
                alt={`Screenshot ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <ImageLightbox
          isOpen={selectedIndex !== null}
          onClose={() => setSelectedIndex(null)}
          imageUrl={screenshots[selectedIndex].imageUrl}
          onNext={() => setSelectedIndex((selectedIndex + 1) % screenshots.length)}
          onPrevious={() =>
            setSelectedIndex((selectedIndex - 1 + screenshots.length) % screenshots.length)
          }
          hasNext={selectedIndex < screenshots.length - 1}
          hasPrevious={selectedIndex > 0}
        />
      )}
    </section>
  );
}
