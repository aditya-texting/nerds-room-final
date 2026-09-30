import { useEffect, useRef, useState } from 'react';
import { useAppData } from '../context/AppDataContext';

const Hero = () => {
  const { maintenanceMode, heroContent, navigate, totalRegs } = useAppData();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [activeCells, setActiveCells] = useState<Set<number>>(new Set());
  const heroRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.05, rootMargin: '50px' } // Pre-trigger slightly
    );

    // Initial check - if we're at the top, just show it
    if (window.scrollY < 100) {
      setIsVisible(true);
    }

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    // Track viewport size for small-screen behaviour
    const updateIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    updateIsDesktop();
    window.addEventListener('resize', updateIsDesktop);

    // Magnetic hover effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Grid animation on mouse move
    const handleGridMouseMove = (e: MouseEvent) => {
      if (!gridRef.current || !isDesktop) return;

      const gridRect = gridRef.current.getBoundingClientRect();
      const mouseX = e.clientX - gridRect.left;
      const mouseY = e.clientY - gridRect.top;

      // Grid dimensions
      const cellSize = 56;
      const cols = 38;
      const rows = 16;
      const radius = 3; // Cells within 3 cells radius will animate

      // Calculate which cell the mouse is over
      const col = Math.floor(mouseX / cellSize);
      const row = Math.floor(mouseY / cellSize);

      // Find all cells within radius
      const newActiveCells = new Set<number>();
      for (let r = Math.max(0, row - radius); r <= Math.min(rows - 1, row + radius); r++) {
        for (let c = Math.max(0, col - radius); c <= Math.min(cols - 1, col + radius); c++) {
          const distance = Math.sqrt((r - row) ** 2 + (c - col) ** 2);
          if (distance <= radius) {
            newActiveCells.add(r * cols + c);
          }
        }
      }

      setActiveCells(newActiveCells);
    };

    const handleGridMouseLeave = () => {
      setActiveCells(new Set());
    };

    if (gridRef.current && isDesktop) {
      gridRef.current.addEventListener('mousemove', handleGridMouseMove);
      gridRef.current.addEventListener('mouseleave', handleGridMouseLeave);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateIsDesktop);
      window.removeEventListener('mousemove', handleMouseMove);
      if (gridRef.current) {
        gridRef.current.removeEventListener('mousemove', handleGridMouseMove);
        gridRef.current.removeEventListener('mouseleave', handleGridMouseLeave);
      }
    };
  }, [isDesktop]);

  // Generate grid cells (38 columns x 16 rows = 608 cells)
  const gridCells = Array.from({ length: 38 * 16 }, (_, i) => i);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative w-full overflow-hidden bg-white min-h-[640px] sm:min-h-screen flex items-center"
    >
      {/* Grid Background Pattern */}
      <div className="hidden md:block absolute inset-0 h-full w-full pointer-events-none">
        <div className="relative h-full w-full overflow-hidden">
          {maintenanceMode && (
            <div className="absolute inset-0 z-[50] bg-white/95 backdrop-blur-md flex items-center justify-center p-6 text-center">
              <div className="max-w-md animate-fade-in">
                <div className="text-6xl mb-6">🛠️</div>
                <h1 className="text-4xl font-black text-nerdBlue mb-4 tracking-tight">UNDER MAINTENANCE</h1>
                <p className="text-gray-600 font-bold mb-8">We're updating our systems to bring you more epic building opportunities. Join our community for live updates!</p>
                <a href="#join" className="bg-nerdBlue text-white px-8 py-3 rounded-xl font-black shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all inline-block">GO TO COMMUNITY</a>
              </div>
            </div>
          )}
          <div className="absolute inset-0 z-[2] h-full w-full overflow-hidden"></div>
          <div
            ref={gridRef}
            className="relative z-[3] opacity-90 mx-auto"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(38, 56px)',
              gridTemplateRows: 'repeat(16, 56px)',
              width: '2128px',
              height: '896px',
              maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 20%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 20%, transparent 70%)',
              pointerEvents: isDesktop ? 'auto' : 'none',
            }}
          >
            {gridCells.map((index) => {
              const isActive = activeCells.has(index);
              return (
                <div
                  key={index}
                  className="cell relative border-[0.5px] transition-all duration-150 will-change-transform"
                  style={{
                    opacity: isActive ? 1 : 0.7,
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)',
                    borderColor: isActive ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.2)',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    transition: 'opacity 0.15s ease, background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-24 w-full">


        <div className="grid gap-12 md:gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
          {/* Left: Content */}
          <div
            className={`space-y-6 sm:space-y-8 text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
          >
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-nerdLime/20 via-nerdLime/10 to-transparent border border-nerdLime/30 backdrop-blur-sm transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nerdLime opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-nerdLime"></span>
              </span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-nerdBlue">
                THINK • CREATE • REPEAT
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-black tracking-tight leading-[0.95]">
              <span
                className={`block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-nerdBlue transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
              >
                {heroContent.headingLine1}
              </span>
              <span
                className={`block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-nerdLime via-nerdLime to-nerdBlue bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                style={{
                  textShadow: '2px 2px 0px rgba(0, 48, 143, 0.3)',
                  filter: 'drop-shadow(0 0 8px rgba(155, 230, 0, 0.3))',
                }}
              >
                {heroContent.headingLine2}
              </span>
              <span
                className={`block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-nerdLime transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
              >
                {heroContent.headingLine3}
              </span>
            </h1>

            {/* Description */}
            <p
              className={`text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
              {heroContent.description}
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
              <a
                href={heroContent.primaryCTALink || "#join"}
                className="group relative z-20 w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border-2 border-nerdLime bg-gradient-to-r from-nerdLime to-nerdLime/90 text-nerdBlue text-sm sm:text-base md:text-lg font-black py-3 sm:py-3 px-6 sm:px-8 shadow-[0_6px_0_#00308F] hover:shadow-[0_4px_0_#00308F] hover:translate-y-0.5 active:translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const link = heroContent.primaryCTALink || "#join";
                  if (link.startsWith('#')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const el = document.getElementById(link.substring(1));
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  } else if (link.startsWith('/')) {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(link);
                  }
                }}
                style={{
                  transform: isDesktop
                    ? `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
                    : 'translate(0, 0)',
                }}
              >
                <span className="relative z-10">{heroContent.primaryCTA}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-nerdLime/80 to-nerdLime opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
              <a
                href={heroContent.secondaryCTALink || "https://docs.google.com/forms/d/e/1FAIpQLSegbpqFbVYJKHiIXdK8tqGzbOntQGNHaW64qvkGpr9k85lE1Q/viewform"}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative z-20 w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border-2 border-nerdBlue bg-white/80 backdrop-blur-sm text-nerdBlue text-sm sm:text-base md:text-lg font-black py-3 sm:py-3 px-6 sm:px-8 hover:bg-nerdBlue hover:text-white hover:border-nerdBlue transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const link = heroContent.secondaryCTALink;
                  if (link && link.startsWith('/')) {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(link);
                  }
                }}
                style={{
                  transform: isDesktop
                    ? `translate(${mousePosition.x * -0.1}px, ${mousePosition.y * -0.1}px)`

                    : 'translate(0, 0)',
                }}
              >
                <span className="relative z-10">{heroContent.secondaryCTA}</span>
                <span className="absolute inset-0 bg-nerdBlue scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>
            </div>
          </div>

          {/* Right: Terminal Card */}
          <div
            ref={terminalRef}
            className={`relative mt-8 lg:mt-0 max-w-sm sm:max-w-md mx-auto lg:mx-0 w-full transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
              }`}
            style={{
              transform: isDesktop
                ? `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px) scale(${isVisible ? 1 : 0.95})`
                : `scale(${isVisible ? 1 : 0.95})`,
            }}
          >
            {/* Glassmorphism Terminal */}
            <div className="relative z-10 bg-gradient-to-br from-nerdDark/95 via-nerdDark to-nerdDark/95 backdrop-blur-xl text-nerdLime rounded-3xl border-2 border-nerdBlue/50 shadow-2xl p-5 sm:p-6 md:p-7 overflow-hidden">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-nerdBlue/50 via-nerdLime/30 to-nerdBlue/50 opacity-0 hover:opacity-100 transition-opacity duration-500 blur-xl" />

              <div className="flex justify-between items-center mb-4 border-b border-gray-700/50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-nerdLime animate-pulse" />
                  <span className="text-[10px] sm:text-xs text-gray-400 font-mono">
                    nerds_room — terminal
                  </span>
                </div>
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                </div>
              </div>

              <div className="font-mono text-[11px] sm:text-xs md:text-sm space-y-2 text-left">
                <div className="flex flex-wrap gap-x-2">
                  <span className="text-blue-400">user@nerdsroom:~$</span>
                  <span className="text-zinc-100">npm install future</span>
                </div>
                <div className="text-gray-400 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Installing packages…
                </div>
                <div className="text-gray-400">Found {5000 + (totalRegs || 0)}+ builders</div>
                <div className="flex flex-wrap gap-x-2">
                  <span className="text-blue-400">user@nerdsroom:~$</span>
                  <span className="text-white">init_innovation.sh</span>
                </div>
                <div className="text-nerdLime flex items-center gap-2">
                  <span>&gt;&gt; Executing limitless potential…</span>
                  <span className="text-nerdLime animate-pulse">_</span>
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-nerdLime animate-scanline" />
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-nerdLime/20 rounded-full blur-3xl -z-1" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-nerdBlue/20 rounded-full blur-3xl -z-1" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
