
import { useAppData } from '../context/AppDataContext';

const CommunitySays = () => {
  const { successStories } = useAppData();

  const testimonials: any[][] = [[], [], []];

  const fallbackColors = [
    'bg-blue-50/50',
    'bg-nerdLime/5',
    'bg-orange-50/50',
    'bg-purple-50/50',
    'bg-emerald-50/50',
    'bg-sky-50/50'
  ];

  if (successStories && successStories.length > 0) {
    successStories.forEach((story, i) => {
      testimonials[i % 3].push({
        name: story.name,
        role: story.role,
        image: story.image_url,
        paragraphs: story.content,
        bgColor: story.bg_color || fallbackColors[i % fallbackColors.length]
      });
    });
  } else {
    return null;
  }


  return (
    <section id="testimonials" className="relative w-full overflow-hidden py-8 sm:py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-5 sm:mb-8 text-center md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-zinc-900 mb-2 sm:mb-4">
            <span className="font-bold">Success Stories</span> that Define Our Community
          </h2>
        </div>
        <div className="max-w-[1400px] mx-auto">
          <div className="scrollbar-hide flex flex-nowrap items-start overflow-x-auto space-x-4 sm:space-x-6 md:space-x-8 pb-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-x-visible lg:space-x-0 lg:items-stretch">
            {testimonials.map((column, colIndex) => (
              <div
                key={colIndex}
                className="flex-none w-[calc(100vw-2rem)] sm:w-96 flex flex-col gap-4 sm:gap-6 md:gap-5 lg:w-auto lg:h-full"
              >
                {column.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`${testimonial.bgColor} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-sm w-full flex flex-col justify-between lg:flex-grow transition-transform hover:scale-[1.02] duration-300`}
                  >
                    <div className="text-sm sm:text-base md:text-base lg:text-base leading-relaxed text-zinc-600">
                      {testimonial.paragraphs.map((para: any, pIndex: number) => {
                        if (typeof para === 'string') {
                          return (
                            <p key={pIndex} className="mb-3 sm:mb-4">
                              {para}
                            </p>
                          );
                        }
                        return (
                          <p key={pIndex} className="mb-3 sm:mb-4">
                            {para.text}
                            {'bold' in para && para.bold && (
                              <strong className="font-semibold text-zinc-900">{para.bold}</strong>
                            )}
                            {'after' in para && para.after}
                            {'bold2' in para && para.bold2 && (
                              <strong className="font-semibold text-zinc-900">{para.bold2}</strong>
                            )}
                            {'after2' in para && para.after2}
                          </p>
                        );
                      })}
                    </div>
                    <div className="flex items-center mt-4 sm:mt-6">
                      <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden mr-2 sm:mr-3 flex-shrink-0">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          loading="lazy"
                          decoding="async"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm md:text-base font-semibold text-zinc-900 truncate">{testimonial.name}</p>
                        <p className="text-[10px] sm:text-xs md:text-sm text-zinc-600 truncate">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySays;
