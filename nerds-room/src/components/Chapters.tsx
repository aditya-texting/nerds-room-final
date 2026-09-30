import { useAppData } from '../context/AppDataContext';
import { motion } from 'framer-motion';

const Chapters = () => {
    const { chapters: contextChapters } = useAppData();

    const chapters = (contextChapters || [])
      .filter(c => {
        // City chapters always public; campus chapters only when Live (is_live)
        if (c.chapter_type === 'campus') return c.is_live !== false;
        return true;
      })
      .map(c => c.name) || [];

    if (chapters.length === 0) return null;


    // Duplicate content for seamless loop
    const marqueeContent = [...chapters, ...chapters, ...chapters];

    return (
        <section className="w-full bg-white py-8 md:py-12 border-t border-b border-gray-100 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 mb-6 md:mb-10 text-center">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
                    Our <span className="text-nerdBlue">Chapters</span>
                </h3>
                <p className="text-gray-500 mt-2 text-sm md:text-base">Growing stronger in cities near you</p>
            </div>

            <div className="relative w-full flex overflow-hidden mask-gradient-x">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                <motion.div
                    className="flex whitespace-nowrap gap-8 md:gap-16 items-center"
                    animate={{
                        x: ["0%", "-50%"],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30, // Slower for readability
                            ease: "linear",
                        },
                    }}
                >
                    {marqueeContent.map((chapter, index) => (
                        <div
                            key={`${chapter}-${index}`}
                            className="flex items-center gap-2 group cursor-default"
                        >
                            <span className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 group-hover:from-nerdBlue group-hover:to-nerdLime transition-all duration-300 uppercase tracking-tight">
                                {chapter}.
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Chapters;
