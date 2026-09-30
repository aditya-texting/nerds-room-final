import { useState, useMemo, useEffect, useRef } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';
import { MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventData {
  id?: string | number;
  title: string;
  logo?: string;
  image: string;
  stats: { label: string; value: number }[];
  description: string;
  location: string;
  bgColor: string;
}

const toStatValue = (value: string | number) => {
  if (typeof value === 'number') return value;
  const parsed = Number(value.replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const CARD_COLORS = [
  'bg-[#E8F5E9]',
  'bg-[#FCE4EC]',
  'bg-[#ECEFF1]',
  'bg-[#FFF7E0]',
  'bg-[#EAF2FF]',
  'bg-[#E6F6EB]',
];
const COUNT_DURATION_MS = 4500;

const CountUp = ({ value, duration = COUNT_DURATION_MS }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime: number | null = null;
          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(value);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const EventCard = ({
  event,
  index,
  isDesktop = false,
}: {
  event: EventData;
  index: number;
  isDesktop?: boolean;
}) => {
  const lowerOnDesktop = index % 2 !== 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-80px' }}
      className={`rounded-[20px] shadow-xl flex flex-col items-center w-full max-w-[clamp(280px,90vw,372px)] h-[clamp(360px,118vw,493px)] mx-auto lg:mx-0 border border-black/5 ${event.bgColor} ${
        isDesktop ? (lowerOnDesktop ? 'lg:mt-[90px]' : 'lg:mt-[39px]') : ''
      }`}
    >
      <div className="mt-4 md:mt-5 lg:mt-6 mb-3 md:mb-3.5 lg:mb-4 flex items-center justify-center w-full px-4 md:px-5 lg:px-6">
        {event.logo ? (
          <div className="relative w-full h-[clamp(40px,11vw,60px)]">
            <img src={event.logo} alt={`${event.title} Logo`} className="w-full h-full object-contain" />
          </div>
        ) : (
          <h3 className="text-[clamp(20px,5.5vw,30px)] font-bold text-black leading-tight text-center">
            {event.title}
          </h3>
        )}
      </div>

      <div className="relative w-[clamp(230px,72vw,334px)] aspect-[250/240] shrink-0">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <img src={event.image} alt={event.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        </div>

        <div className="absolute bottom-2 md:bottom-2.5 lg:bottom-3 left-[24%] sm:left-[28%] md:left-[32%] lg:left-[35%] space-y-1.5 md:space-y-2 lg:space-y-2.5 max-w-[74%]">
          {event.stats.map((stat, statIndex) => (
            <div
              key={`${stat.label}-${statIndex}`}
              className="bg-white rounded-[12px] md:rounded-[15px] lg:rounded-[17px] px-2 md:px-2.5 py-1.5 md:py-2 flex items-center gap-1.5 md:gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-fit max-w-full"
            >
              <span className="text-[clamp(18px,5.5vw,33px)] font-normal text-[#34A853] leading-none">
                <CountUp value={stat.value} />
                <span className="text-current">+</span>
              </span>
              <span className="text-[clamp(12px,3.6vw,22px)] font-normal text-black leading-tight break-words">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 md:gap-2 text-black mt-auto pt-1.5 md:pt-2 pb-4 md:pb-5 lg:pb-6 px-4">
        <MapPin className="w-4 h-4 md:w-[18px] md:h-[18px] lg:w-5 lg:h-5 shrink-0" />
        <span className="text-[clamp(13px,3.4vw,20px)] font-medium text-center leading-tight">
          {event.location}
        </span>
      </div>
    </motion.article>
  );
};

const MOBILE_STACK_GAP_CLASS = ['mt-0 z-10', 'mt-[10vh] z-20', 'mt-[10vh] z-30'];
const EVENTS_PER_PAGE = 3;

const FlagshipEvents = () => {
  const { flagshipEvents: contextEvents, loading } = useAppData();
  const [page, setPage] = useState(0);

  const events: EventData[] = useMemo(() => {
    if (!contextEvents) return [];
    return contextEvents.map((event: any, index: number) => ({
      ...event,
      bgColor: event.bgColor && event.bgColor !== 'bg-white'
        ? event.bgColor
        : CARD_COLORS[index % CARD_COLORS.length],
      stats: Array.isArray(event.stats)
        ? event.stats.map((stat: any) => ({ ...stat, value: toStatValue(stat.value) }))
        : [],
    }));
  }, [contextEvents]);

  const pages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const pageEvents = useMemo(() => {
    const start = page * EVENTS_PER_PAGE;
    return events.slice(start, start + EVENTS_PER_PAGE);
  }, [events, page]);

  useEffect(() => {
    if (page >= pages && pages > 0) setPage(0);
  }, [page, pages]);

  useEffect(() => {
    if (pages <= 1) return;
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    if (!desktopQuery.matches) return;

    const interval = window.setInterval(() => {
      setPage((currentPage) => (currentPage + 1) % pages);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [pages]);

  const goToPage = (nextPage: number) => {
    if (pages <= 0) return;
    setPage((nextPage + pages) % pages);
  };

  if (loading) return <Skeleton />;
  if (!events.length) return null;

  return (
    <section id="flagship-events" className="py-10 md:py-20 px-4 md:px-8 lg:px-16 bg-white transition-all duration-700">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-7 md:mb-12">
          <h2 className="text-[clamp(28px,8vw,60px)] text-black">
            Our <span className="font-bold">Flagship Events</span>
          </h2>
          <p className="text-[clamp(14px,3.8vw,24px)] text-gray-600 mt-3">
            Our signature experiences that define excellence
          </p>
        </div>

        <div className="relative lg:overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              className="block lg:flex lg:flex-row lg:items-start lg:justify-center lg:gap-[80px] xl:gap-[120px]"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              drag={pages > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) goToPage(page + 1);
                if (info.offset.x > 70) goToPage(page - 1);
              }}
              draggable={false}
              style={{
                WebkitTouchCallout: 'none',
                userSelect: 'none',
                touchAction: 'pan-y',
                cursor: pages > 1 ? 'grab' : 'default',
              }}
            >
              {pageEvents.map((event, index) => (
                <div
                  key={event.id ?? `${page}-${index}`}
                  className={`${MOBILE_STACK_GAP_CLASS[index] || 'mt-[25vh] z-30'} sticky top-[20vh] lg:static lg:mt-0 lg:z-auto`}
                >
                  <EventCard event={event} index={index} isDesktop />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {pages > 1 && (
            <div className="flex items-center justify-center mt-8 lg:mt-16">
              <div className="flex justify-center gap-3">
                {Array.from({ length: pages }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToPage(index)}
                    aria-label={`Go to event set ${index + 1}`}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      index === page
                        ? 'w-12 bg-gradient-to-r from-[#4285F4] to-[#34A853]'
                        : 'w-3 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlagshipEvents;
