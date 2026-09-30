import { useAppData } from '../context/AppDataContext';

const PartnersMarquee = () => {
  const { partners, supportedByText } = useAppData();

  return (
    <div className="bg-white py-6 sm:py-8 overflow-hidden">
      <p className="text-center text-gray-500 font-mono text-[10px] sm:text-xs mb-3 sm:mb-4 tracking-[0.2em] sm:tracking-[0.3em] font-bold uppercase px-4">
        {supportedByText || 'Supported by leading tech'}
      </p>
      <div className="marquee-container relative w-full overflow-hidden">
        <div className="flex w-max animate-scroll gap-8 sm:gap-16 items-center text-black font-black text-base sm:text-lg md:text-xl uppercase font-sans whitespace-nowrap">
          {[...partners, ...partners].map((partner, index) => (
            <span key={index} className="flex items-center gap-4 sm:gap-8">
              <span>{partner}</span>
              <span className="text-nerdLime">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersMarquee;
