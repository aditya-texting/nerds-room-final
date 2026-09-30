import { useEffect, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';

const PastEvents = () => {
  const { pastEvents, whoWeAreContent, loading } = useAppData();    
  // State for active slide index
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    if (loading || !pastEvents || pastEvents.length === 0) return;

    const carouselEvents = pastEvents.filter(e => e.image_url);
    if (carouselEvents.length <= 1) return;        

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % carouselEvents.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [pastEvents, loading]);

  if (loading) {
    return (
      <section id="who-we-are" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          <Skeleton className="h-[450px] w-full rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-16 w-48" />     
            <Skeleton className="h-24 w-full" />   
            <Skeleton className="h-12 w-64" />     
          </div>
        </div>
      </section>
    );
  }

  // Filter events with images for the carousel    
  const carouselEvents = pastEvents?.filter(e => e.image_url) || [];
  
  // Calculate builders: Use override from admin if set, otherwise sum of past events
  const calculatedBuilders = pastEvents?.reduce((acc, curr) => acc + (curr.attendees_count || 0), 0) || 0;
  const displayBuilders = whoWeAreContent.buildersOverride ?? calculatedBuilders;       

  return (
    <section id="who-we-are" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
        {/* Image Carousel */}
        <div className="order-2 md:order-1 relative">
          <div className="bg-nerdBlue p-1.5 sm:p-2 shadow-hard transform md:-rotate-1 rounded-lg hover:shadow-[8px_8px_0px_0px_#00308F] transition-shadow duration-300">
            <div className="carousel-container h-[250px] xs:h-[280px] sm:h-[320px] md:h-[400px] lg:h-[450px] w-full bg-black relative rounded overflow-hidden">
              {carouselEvents.length > 0 ? carouselEvents.map((event, index) => (
                <img
                  key={event.id}
                  src={event.image_url}
                  className={`slide ${index === activeIndex ? 'active' : ''} absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
                  alt={event.title}
                />
              )) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 font-mono text-xs gap-4 p-8 text-center bg-gray-900/50">
                  <div className="text-4xl">📸</div>
                  <span>NO_PAST_EVENTS_DATA_FOUND</span>
                  <p className="text-[10px] text-gray-600 max-w-[200px]">Add events in the admin panel to see them here.</p>
                </div>
              )}
              {/* Overlay Gradient */}
              {carouselEvents.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 h-24 flex items-end">
                  <div className="text-white">       
                    <h3 className="text-lg font-bold">{carouselEvents[activeIndex]?.title}</h3>
                    <p className="text-xs text-gray-300">{carouselEvents[activeIndex]?.location}</p>    
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="order-1 md:order-2 space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-nerdBlue inline-block border-b-4 sm:border-b-6 md:border-b-8 border-nerdLime leading-[0.85] pb-2 sm:pb-3 uppercase">
              {whoWeAreContent.headingLine1 || 'WHO WE'}<br />
              {whoWeAreContent.headingLine2 || 'ARE'}
            </h2>
          </div>

          <div className="text-base sm:text-lg font-medium text-gray-700 space-y-3 sm:space-y-4">     
            <p className="border-l-4 border-nerdBlue pl-3 sm:pl-4 leading-relaxed font-semibold">
              {whoWeAreContent.description}
            </p>
            <p className="leading-relaxed">        
              {whoWeAreContent.description2}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 sm:gap-6 pt-2">
            <div className="text-center flex-1">   
              <span className="block text-2xl sm:text-3xl md:text-4xl font-black text-nerdBlue">{(pastEvents?.length || 0)}+</span>
              <span className="text-[10px] xs:text-xs font-bold uppercase text-gray-500 tracking-wide">Events Hosted</span>
            </div>
            <div className="w-px bg-gray-300 h-10 sm:h-12"></div>
            <div className="text-center flex-1">   
              <span className="block text-2xl sm:text-3xl md:text-4xl font-black text-nerdBlue">{displayBuilders.toLocaleString()}+</span>
              <span className="text-[10px] xs:text-xs font-bold uppercase text-gray-500 tracking-wide">Builders</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PastEvents;
