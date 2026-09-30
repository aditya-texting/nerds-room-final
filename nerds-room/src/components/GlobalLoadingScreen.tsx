const GlobalLoadingScreen = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
            {/* Background Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nerdLime/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nerdBlue/5 rounded-full blur-[120px]" />

            <div className="relative flex flex-col items-center w-full max-w-[260px] xs:max-w-[280px] sm:max-w-xs md:max-w-sm transition-all duration-500">
                {/* Branding Section */}
                <div className="flex flex-col items-center gap-4 sm:gap-6 mb-8 sm:mb-12 animate-in fade-in zoom-in duration-700">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-nerdLime rounded-3xl blur-2xl opacity-20 animate-pulse group-hover:opacity-40 transition-opacity"></div>
                        <img
                            src="/logo.png"
                            alt="Nerds Room"
                            width={112}
                            height={112}
                            decoding="async"
                            className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain relative z-10 rounded-2xl shadow-2xl transition-transform hover:scale-110 duration-500"
                        />
                    </div>

                    <div className="text-center">
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-nerdBlue tracking-tight leading-tight">
                            nerds room<span className="text-nerdLime">.</span>
                        </h1>
                        <p className="text-[9px] sm:text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
                            Innovation Hub
                        </p>
                    </div>
                </div>

                {/* Loading Indicator */}
                <div className="w-full space-y-4 px-2 sm:px-0">
                    <div className="w-full h-1 sm:h-2 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-r from-nerdBlue via-indigo-500 to-nerdLime animate-loading-bar shadow-[0_0_15px_rgba(79,70,229,0.3)]"></div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <p className="text-[8px] sm:text-[10px] md:text-[11px] font-black text-nerdBlue/30 uppercase tracking-[0.4em] animate-pulse">
                            Launching Workspace
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Footer Credit */}
            <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 opacity-20 flex items-center gap-3 w-max">
                <div className="h-px w-6 sm:w-8 bg-nerdBlue"></div>
                <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-nerdBlue">Nerds Protocol 2026</span>
                <div className="h-px w-6 sm:w-8 bg-nerdBlue"></div>
            </div>
        </div>
    );
};

export default GlobalLoadingScreen;
