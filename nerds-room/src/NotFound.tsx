import FuzzyText from './components/FuzzyText';

const NotFound = () => {
  return (
    <main className="min-h-screen w-full bg-[#020617] text-white flex items-center justify-center px-4">
      <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-8">
        <div className="relative">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.5}
            enableHover
            fuzzRange={40}
            fontSize="clamp(3.5rem, 20vw, 8rem)"
            fontWeight={900}
            color="#22c55e"
            className="w-full"
          >
            404
          </FuzzyText>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            Page not found
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-xl mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            Double-check the URL, or head back to the home page and continue building.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-nerdLime text-nerdBlue font-semibold text-sm sm:text-base shadow-[0_10px_40px_rgba(190,242,100,0.35)] hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Go home
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-white/20 text-sm sm:text-base text-zinc-200 hover:bg-white/5 transition-colors"
          >
            Contact support
          </a>
        </div>
      </div>
    </main>
  );
};

export default NotFound;

