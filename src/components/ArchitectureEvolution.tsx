import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ArchitectureEvolution = () => {
  const { isDarkMode } = useTheme();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // SVG dimensions
  const width = 1600;
  const height = 700;
  const margin = { top: 80, right: 40, bottom: 100, left: 40 };

  // Brand colors
  const appleBlue = '#2E5A91';
  const amdTerracotta = '#CC6B4A';
  const evolutionPurple = '#9B8FD6';

  const bgColor = isDarkMode ? '#1f2937' : '#f3f4f6';
  const textColor = isDarkMode ? '#f9fafb' : '#111827';
  const labelBgColor = isDarkMode ? '#374151' : '#ffffff';
  const noteColor = isDarkMode ? '#d1d5db' : '#6b7280';

  // Section positions
  const sections = [
    { id: 'm1ultra', x: 80, y: 200, width: 530, title: '2022: Apple M1 Ultra', subtitle: '(UltraFusion - Two Complete SoCs)' },
    { id: 'amd', x: 650, y: 200, width: 430, title: '2024: AMD EPYC', subtitle: '(True Chiplet Architecture)' },
    { id: 'm5', x: 1120, y: 200, width: 450, title: '2026?: Apple M5 (Rumored)', subtitle: '(SoIC - True Chiplet)' },
  ];

  const renderM1Ultra = (x: number, y: number, isHovered: boolean) => {
    const chipWidth = 220;
    const chipHeight = 150;
    const gap = 80;

    return (
      <g>
        {/* Left M1 Max */}
        <rect
          x={x}
          y={y}
          width={chipWidth}
          height={chipHeight}
          fill={appleBlue}
          stroke={appleBlue}
          strokeWidth={isHovered ? 3 : 2}
          opacity={isHovered ? 0.9 : 0.8}
          rx={8}
        />
        <text x={x + chipWidth / 2} y={y + 55} textAnchor="middle" fill="#ffffff" fontSize={20} fontWeight={600}>
          M1 Max
        </text>
        <text x={x + chipWidth / 2} y={y + 80} textAnchor="middle" fill="#ffffff" fontSize={15}>
          CPU+GPU+
        </text>
        <text x={x + chipWidth / 2} y={y + 100} textAnchor="middle" fill="#ffffff" fontSize={15}>
          Memory+I/O
        </text>

        {/* Interposer connection */}
        <g>
          <line x1={x + chipWidth + 5} y1={y + 50} x2={x + chipWidth + gap - 5} y2={y + 50} stroke="#ef4444" strokeWidth={2} />
          <polygon points={`${x + chipWidth + gap - 5},${y + 50} ${x + chipWidth + gap - 12},${y + 46} ${x + chipWidth + gap - 12},${y + 54}`} fill="#ef4444" />

          <line x1={x + chipWidth + gap - 5} y1={y + 70} x2={x + chipWidth + 5} y2={y + 70} stroke="#ef4444" strokeWidth={2} />
          <polygon points={`${x + chipWidth + 5},${y + 70} ${x + chipWidth + 12},${y + 66} ${x + chipWidth + 12},${y + 74}`} fill="#ef4444" />

          <text x={x + chipWidth + gap / 2} y={y + 45} textAnchor="middle" fill={textColor} fontSize={12} fontStyle="italic">
            Interposer
          </text>
          <text x={x + chipWidth + gap / 2} y={y + 62} textAnchor="middle" fill={textColor} fontSize={12} fontStyle="italic">
            (10K Signals)
          </text>
        </g>

        {/* Right M1 Max */}
        <rect
          x={x + chipWidth + gap}
          y={y}
          width={chipWidth}
          height={chipHeight}
          fill={appleBlue}
          stroke={appleBlue}
          strokeWidth={isHovered ? 3 : 2}
          opacity={isHovered ? 0.9 : 0.8}
          rx={8}
        />
        <text x={x + chipWidth + gap + chipWidth / 2} y={y + 55} textAnchor="middle" fill="#ffffff" fontSize={20} fontWeight={600}>
          M1 Max
        </text>
        <text x={x + chipWidth + gap + chipWidth / 2} y={y + 80} textAnchor="middle" fill="#ffffff" fontSize={15}>
          CPU+GPU+
        </text>
        <text x={x + chipWidth + gap + chipWidth / 2} y={y + 100} textAnchor="middle" fill="#ffffff" fontSize={15}>
          Memory+I/O
        </text>
      </g>
    );
  };

  const renderAMDEPYC = (x: number, y: number, isHovered: boolean) => {
    const cpuSize = 90;
    const ioWidth = 125;
    const ioHeight = 190;
    const gap = 15;

    return (
      <g>
        {/* Four CPU chiplets */}
        <rect x={x} y={y} width={cpuSize} height={cpuSize} fill={amdTerracotta} stroke={amdTerracotta} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + cpuSize / 2} y={y + cpuSize / 2 + 7} textAnchor="middle" fill="#ffffff" fontSize={18} fontWeight={600}>CPU</text>

        <rect x={x + cpuSize + gap} y={y} width={cpuSize} height={cpuSize} fill={amdTerracotta} stroke={amdTerracotta} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + cpuSize + gap + cpuSize / 2} y={y + cpuSize / 2 + 7} textAnchor="middle" fill="#ffffff" fontSize={18} fontWeight={600}>CPU</text>

        <rect x={x} y={y + cpuSize + gap} width={cpuSize} height={cpuSize} fill={amdTerracotta} stroke={amdTerracotta} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + cpuSize / 2} y={y + cpuSize + gap + cpuSize / 2 + 7} textAnchor="middle" fill="#ffffff" fontSize={18} fontWeight={600}>CPU</text>

        <rect x={x + cpuSize + gap} y={y + cpuSize + gap} width={cpuSize} height={cpuSize} fill={amdTerracotta} stroke={amdTerracotta} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + cpuSize + gap + cpuSize / 2} y={y + cpuSize + gap + cpuSize / 2 + 7} textAnchor="middle" fill="#ffffff" fontSize={18} fontWeight={600}>CPU</text>

        {/* I/O Die */}
        <rect x={x + cpuSize * 2 + gap * 2 + 15} y={y} width={ioWidth} height={ioHeight} fill={amdTerracotta} stroke={amdTerracotta} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + cpuSize * 2 + gap * 2 + 15 + ioWidth / 2} y={y + ioHeight / 2 - 8} textAnchor="middle" fill="#ffffff" fontSize={19} fontWeight={600}>I/O</text>
        <text x={x + cpuSize * 2 + gap * 2 + 15 + ioWidth / 2} y={y + ioHeight / 2 + 17} textAnchor="middle" fill="#ffffff" fontSize={19} fontWeight={600}>Die</text>
      </g>
    );
  };

  const renderAppleM5 = (x: number, y: number, isHovered: boolean) => {
    const tileWidth = 180;
    const tileHeight = 110;
    const controllerWidth = 200;
    const controllerHeight = 65;
    const gap = 30;

    return (
      <g>
        {/* CPU Tile */}
        <rect x={x} y={y} width={tileWidth} height={tileHeight} fill={appleBlue} stroke={appleBlue} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + tileWidth / 2} y={y + tileHeight / 2 - 5} textAnchor="middle" fill="#ffffff" fontSize={19} fontWeight={600}>CPU</text>
        <text x={x + tileWidth / 2} y={y + tileHeight / 2 + 18} textAnchor="middle" fill="#ffffff" fontSize={19} fontWeight={600}>Tile</text>

        {/* GPU Tile */}
        <rect x={x + tileWidth + gap} y={y} width={tileWidth} height={tileHeight} fill={appleBlue} stroke={appleBlue} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + tileWidth + gap + tileWidth / 2} y={y + tileHeight / 2 - 5} textAnchor="middle" fill="#ffffff" fontSize={19} fontWeight={600}>GPU</text>
        <text x={x + tileWidth + gap + tileWidth / 2} y={y + tileHeight / 2 + 18} textAnchor="middle" fill="#ffffff" fontSize={19} fontWeight={600}>Tile</text>

        {/* Controllers */}
        <rect x={x + (tileWidth * 2 + gap - controllerWidth) / 2} y={y + tileHeight + gap} width={controllerWidth} height={controllerHeight} fill={appleBlue} stroke={appleBlue} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + (tileWidth * 2 + gap) / 2} y={y + tileHeight + gap + controllerHeight / 2 + 7} textAnchor="middle" fill="#ffffff" fontSize={18} fontWeight={600}>Controllers</text>
      </g>
    );
  };

  return (
    <div className="my-12 w-full">
      <div className="bg-brand-surface rounded-lg p-4 shadow-lg">
        <h3 className="text-xl font-semibold text-brand-text-primary text-center mb-3">
          The Architecture Evolution: From Monolithic to Modular
        </h3>

        {/* Screen reader live region for hover announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {hoveredSection !== null && (
            <span>
              {hoveredSection === 'm1ultra' && 'Apple M1 Ultra - Two complete SoCs connected via interposer with 10,000 signals'}
              {hoveredSection === 'amd' && 'AMD EPYC - True chiplet architecture with separate CPU and I/O dies'}
              {hoveredSection === 'm5' && 'Apple M5 rumored - True chiplet design with separate CPU, GPU, and controller tiles'}
            </span>
          )}
        </div>

        <div className="overflow-x-auto -mx-2 px-2">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="mx-auto w-full"
            style={{ maxWidth: '100%', height: 'auto', minHeight: '500px' }}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Architecture diagram comparing chip designs from monolithic M1 Ultra to modular chiplet approaches in AMD EPYC and rumored Apple M5"
            aria-describedby="architecture-evolution-description"
          >
            <desc id="architecture-evolution-description">
              Three-panel comparison showing evolution from Apple's M1 Ultra using two complete SoCs on an interposer,
              to AMD's true chiplet architecture with separate CPU and I/O dies, to Apple's rumored M5 chiplet design
              with modular CPU, GPU, and controller tiles. Hover over each architecture to see details.
            </desc>
            {/* Background */}
            <rect x={0} y={0} width={width} height={height} fill={bgColor} rx={8} />

            {/* Section 1: M1 Ultra */}
            <g
              onMouseEnter={() => setHoveredSection('m1ultra')}
              onMouseLeave={() => setHoveredSection(null)}
              cursor="pointer"
            >
              <text x={sections[0].x + sections[0].width / 2} y={130} textAnchor="middle" fill={textColor} fontSize={22} fontWeight={600}>
                {sections[0].title}
              </text>
              <text x={sections[0].x + sections[0].width / 2} y={155} textAnchor="middle" fill={noteColor} fontSize={15} fontStyle="italic">
                {sections[0].subtitle}
              </text>

              {renderM1Ultra(sections[0].x, sections[0].y, hoveredSection === 'm1ultra')}

              <rect x={sections[0].x + 30} y={440} width={440} height={70} fill={labelBgColor} stroke={hoveredSection === 'm1ultra' ? appleBlue : noteColor} strokeWidth={hoveredSection === 'm1ultra' ? 2 : 1} rx={6} />
              <text x={sections[0].x + sections[0].width / 2} y={468} textAnchor="middle" fill={textColor} fontSize={15} fontWeight={600}>
                Advantage: Complete integration
              </text>
              <text x={sections[0].x + sections[0].width / 2} y={490} textAnchor="middle" fill={textColor} fontSize={15} fontWeight={600}>
                Challenge: Yield drops with size
              </text>
            </g>

            {/* Section 2: AMD EPYC */}
            <g
              onMouseEnter={() => setHoveredSection('amd')}
              onMouseLeave={() => setHoveredSection(null)}
              cursor="pointer"
            >
              <text x={sections[1].x + sections[1].width / 2} y={130} textAnchor="middle" fill={textColor} fontSize={22} fontWeight={600}>
                {sections[1].title}
              </text>
              <text x={sections[1].x + sections[1].width / 2} y={155} textAnchor="middle" fill={noteColor} fontSize={15} fontStyle="italic">
                {sections[1].subtitle}
              </text>

              {renderAMDEPYC(sections[1].x + 40, sections[1].y, hoveredSection === 'amd')}

              <rect x={sections[1].x - 10} y={440} width={420} height={70} fill={labelBgColor} stroke={hoveredSection === 'amd' ? amdTerracotta : noteColor} strokeWidth={hoveredSection === 'amd' ? 2 : 1} rx={6} />
              <text x={sections[1].x + sections[1].width / 2} y={468} textAnchor="middle" fill={textColor} fontSize={15} fontWeight={600}>
                Advantage: Mix process nodes
              </text>
              <text x={sections[1].x + sections[1].width / 2} y={490} textAnchor="middle" fill={textColor} fontSize={15} fontWeight={600}>
                Challenge: Interconnect latency
              </text>
            </g>

            {/* Section 3: Apple M5 */}
            <g
              onMouseEnter={() => setHoveredSection('m5')}
              onMouseLeave={() => setHoveredSection(null)}
              cursor="pointer"
            >
              <text x={sections[2].x + sections[2].width / 2} y={130} textAnchor="middle" fill={textColor} fontSize={22} fontWeight={600}>
                {sections[2].title}
              </text>
              <text x={sections[2].x + sections[2].width / 2} y={155} textAnchor="middle" fill={noteColor} fontSize={15} fontStyle="italic">
                {sections[2].subtitle}
              </text>

              {renderAppleM5(sections[2].x + 30, sections[2].y, hoveredSection === 'm5')}

              <rect x={sections[2].x + 20} y={440} width={380} height={70} fill={labelBgColor} stroke={hoveredSection === 'm5' ? appleBlue : noteColor} strokeWidth={hoveredSection === 'm5' ? 2 : 1} rx={6} />
              <text x={sections[2].x + sections[2].width / 2} y={468} textAnchor="middle" fill={textColor} fontSize={15} fontWeight={600}>
                Advantage: Best of both?
              </text>
              <text x={sections[2].x + sections[2].width / 2} y={490} textAnchor="middle" fill={textColor} fontSize={15} fontWeight={600}>
                Challenge: Complexity
              </text>
            </g>

            {/* Bottom note */}
            <rect x={180} y={580} width={1240} height={55} fill="#fef3c7" stroke="#f59e0b" strokeWidth={1.5} rx={6} />
            <text x={width / 2} y={613} textAnchor="middle" fill="#92400e" fontSize={18} fontWeight={600} fontStyle="italic">
              The industry converges: Even Apple appears to be moving toward modular chiplet designs
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureEvolution;
