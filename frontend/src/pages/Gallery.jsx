// frontend/src/pages/Gallery.jsx
import { useState } from "react";

const galleryImages = [
  {
    src: "/images/gallery/interior1.jpg",
    alt: "Warm café interior with cozy seating",
  },
  {
    src: "/images/gallery/interior2.jpg",
    alt: "Café counter with coffee and pastries",
  },
  {
    src: "/images/gallery/interior3.jpg",
    alt: "Corner table with plants and soft lighting",
  },
  {
    src: "/images/gallery/interior4.jpg",
    alt: "High stools by the window",
  },
  {
    src: "/images/gallery/barista1.jpg",
    alt: "Barista preparing coffee",
  },
  {
    src: "/images/gallery/friends1.jpg",
    alt: "Friends enjoying coffee together",
  },
  {
    src: "/images/gallery/people1.jpg",
    alt: "Guests chatting inside the café",
  },
];

function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null);

  const openLightbox = (index) => {
    setActiveIndex(index);
  };

  const closeLightbox = () => {
    setActiveIndex(null);
  };

  const showNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const showPrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) =>
      (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const activeImage =
    activeIndex !== null ? galleryImages[activeIndex] : null;

  return (
    <main className="page gallery-page">
      <section className="gallery-header">
        <h1>Gallery</h1>
        <p>
          A glimpse inside Café Fausse – cozy corners, friendly faces, and
          freshly brewed coffee.
        </p>
      </section>

      {/* Grid */}
      <section className="gallery-grid">
        {galleryImages.map((img, index) => (
          <button
            key={img.src}
            className="gallery-item"
            onClick={() => openLightbox(index)}
          >
            <img src={img.src} alt={img.alt} />
          </button>
        ))}
      </section>

      {/* Lightbox */}
      {activeImage && (
        <div className="lightbox-backdrop" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              ✕
            </button>
            <button className="lightbox-nav lightbox-prev" onClick={showPrev}>
              ‹
            </button>
            <img src={activeImage.src} alt={activeImage.alt} />
            <button className="lightbox-nav lightbox-next" onClick={showNext}>
              ›
            </button>
            <p className="lightbox-caption">{activeImage.alt}</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default Gallery;
