const StarSpeakers = () => {
  const speakers = [
    {
      name: 'Aditya Pandey',
      role: 'Tech Leader',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya',
      bgColor: '#D2E3FC', // Light Blue
    },
    {
      name: 'Nayansh Jain',
      role: 'Innovation Expert',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nayansh',
      bgColor: '#CEEAD6', // Light Green
    },
    {
      name: 'Dhairya Gupta',
      role: 'Product Strategist',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dhairya',
      bgColor: '#FAD2CF', // Light Pink/Red
    },
    {
      name: 'Rakshita Sharma',
      role: 'Design Leader',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rakshita',
      bgColor: '#FEEFC3', // Light Yellow
    },
    {
      name: 'Hardik Talwar',
      role: 'Engineering Lead',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hardik',
      bgColor: '#E8D5FF', // Light Purple
    },
  ];

  return (
    <section id="speakers" className="relative w-full overflow-hidden py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="text-3xl text-zinc-900 md:text-5xl lg:text-6xl">
            Our Star <span className="font-bold">Speakers</span>
          </h2>
          <p className="mt-4 text-base text-zinc-600 md:text-lg">leaders sharing ideas that shape the future</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
          {speakers.map((speaker, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl w-[156px] h-[187px] sm:w-[196px] sm:h-[235px] md:w-[220px] md:h-[263px] lg:w-[261px] lg:h-[313px]"
              style={{ backgroundColor: speaker.bgColor }}
            >
              <div className="flex h-full w-full items-center justify-center">
                <img
                  alt={speaker.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src={speaker.image}
                />
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                  height: '120px',
                  background: 'linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)',
                }}
              ></div>
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 text-center">
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">{speaker.name}</h3>
                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs md:text-sm lg:text-base text-black">
                  {speaker.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StarSpeakers;
