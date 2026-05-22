/* eslint-disable @next/next/no-img-element */
"use client";

export default function ImageAutoSlider() {
  const images = [
    "/marquee-images/WhatsApp%20Image%202026-05-12%20at%2012.54.56%20PM%20(1).jpeg",
    "/marquee-images/WhatsApp%20Image%202026-05-12%20at%2012.54.57%20PM%20(2).jpeg",
    "/marquee-images/WhatsApp%20Image%202026-05-12%20at%2012.54.58%20PM%20(1).jpeg",
    "/marquee-images/WhatsApp%20Image%202026-05-12%20at%2012.54.58%20PM%20(3).jpeg",
    "/marquee-images/WhatsApp%20Image%202026-05-12%20at%2012.54.58%20PM.jpeg",
    "/marquee-images/WhatsApp%20Image%202026-05-17%20at%206.43.29%20PM%20(2).jpeg",
    "/marquee-images/WhatsApp%20Image%202026-05-17%20at%206.43.29%20PM.jpeg",
    "/marquee-images/WhatsApp%20Image%202026-05-17%20at%206.46.48%20PM%20(1).jpeg",
    "/marquee-images/WhatsApp%20Image%202026-05-17%20at%206.46.49%20PM%20(1).jpeg",
  ];

  const duplicatedImages = [...images, ...images];

  return (
    <section id="gallery" className="w-full relative overflow-hidden flex items-center justify-center py-16 md:py-24 bg-gray-100">
      <style>{`
        @keyframes scroll-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .infinite-scroll {
          animation: scroll-right 30s linear infinite;
        }
        .scroll-container {
          mask: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
        }
        .image-item {
          transition: transform 0.3s ease, filter 0.3s ease;
        }
        .image-item:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
      `}</style>

      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="scroll-container w-full max-w-7xl">
          <div className="infinite-scroll flex gap-6 w-max">
            {duplicatedImages.map((image, index) => (
              <div
                key={index}
                className="image-item flex-shrink-0 w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-xl overflow-hidden shadow-2xl"
              >
                <img
                  src={image}
                  alt={`Gallery image ${(index % images.length) + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
