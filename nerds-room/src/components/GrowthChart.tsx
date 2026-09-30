import React, { useState, useRef, useEffect } from 'react';

interface GrowthChartProps {
    data: number[];
    labels: string[];
}

const GrowthChart: React.FC<GrowthChartProps> = ({ data, labels }) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);
    const max = Math.max(...data, 10) * 1.2; // Add some padding at the top
    const height = 180;
    const width = 800;
    const padding = 20;

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, [data]);

    // Function to calculate smooth SVG path points using cubic bezier
    const getCurvePath = () => {
        if (data.length < 2) return "";

        const points = data.map((val, i) => ({
            x: (i / (data.length - 1)) * (width - padding * 2) + padding,
            y: height - (val / max) * height
        }));

        let d = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            // Control points for smooth curve
            const cp1x = curr.x + (next.x - curr.x) / 2;
            const cp1y = curr.y;
            const cp2x = curr.x + (next.x - curr.x) / 2;
            const cp2y = next.y;
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
        }

        return d;
    };

    const curvePath = getCurvePath();
    const fillPath = `${curvePath} L ${width - padding} ${height} L ${padding} ${height} Z`;

    return (
        <div className="relative w-full h-64 bg-white rounded-2xl p-4">
            <div className="relative h-full w-full group overflow-visible">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#4f46e5" />
                            <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                        <line
                            key={p}
                            x1={padding}
                            y1={height * p}
                            x2={width - padding}
                            y2={height * p}
                            stroke="#f1f5f9"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Fill Area */}
                    <path
                        d={fillPath}
                        fill="url(#areaGradient)"
                        className="transition-all duration-1000 ease-out"
                    />

                    {/* Main Line */}
                    <path
                        ref={pathRef}
                        d={curvePath}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            strokeDasharray: pathLength,
                            strokeDashoffset: pathLength ? 0 : pathLength,
                            animation: pathLength ? 'draw 2s ease-out forwards' : 'none'
                        }}
                        filter="url(#glow)"
                    />

                    {/* Hover Indicator Line */}
                    {hoverIndex !== null && (
                        <line
                            x1={(hoverIndex / (data.length - 1)) * (width - padding * 2) + padding}
                            y1="0"
                            x2={(hoverIndex / (data.length - 1)) * (width - padding * 2) + padding}
                            y2={height}
                            stroke="#6366f1"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                            className="animate-in fade-in duration-300"
                        />
                    )}

                    {/* Interactive Points */}
                    {data.map((val, i) => {
                        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
                        const y = height - (val / max) * height;

                        return (
                            <g
                                key={i}
                                onMouseEnter={() => setHoverIndex(i)}
                                className="cursor-pointer"
                            >
                                {/* Invisible larger hit area */}
                                <rect
                                    x={x - (width / data.length) / 2}
                                    y="0"
                                    width={width / data.length}
                                    height={height}
                                    fill="transparent"
                                />

                                <circle
                                    cx={x}
                                    cy={y}
                                    r={hoverIndex === i ? 6 : 4}
                                    className={`fill-white stroke-indigo-600 stroke-2 transition-all duration-300 ${hoverIndex === i ? 'r-6' : 'r-4'
                                        }`}
                                />
                                {hoverIndex === i && (
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r="12"
                                        className="fill-indigo-600/20 animate-ping"
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Floating Tooltip Tooltip */}
                {hoverIndex !== null && (
                    <div
                        className="absolute z-10 bg-slate-900 text-white p-3 rounded-xl shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-200 ease-out"
                        style={{
                            left: `${(hoverIndex / (data.length - 1)) * 100}%`,
                            top: `${height - (data[hoverIndex] / max) * height - 10}px`
                        }}
                    >
                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{labels[hoverIndex]}</div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black">{data[hoverIndex]}</span>
                            <span className="text-[10px] text-slate-400 font-bold">REGS</span>
                        </div>
                        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
                    </div>
                )}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between px-2 mt-4">
                {labels.map((label, i) => (
                    <span
                        key={i}
                        className={`text-[10px] font-black transition-colors duration-300 tracking-wider ${hoverIndex === i ? 'text-indigo-600' : 'text-slate-400'
                            }`}
                    >
                        {label}
                    </span>
                ))}
            </div>

            <style>{`
                @keyframes draw {
                    from { stroke-dashoffset: 1000; }
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </div>
    );
};

export default GrowthChart;
