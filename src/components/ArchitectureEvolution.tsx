import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ArchitectureEvolution = () => {
  const { isDarkMode } = useTheme();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // SVG dimensions
  const width = 1400;
  const height = 650;
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
    { id: 'm1ultra', x: 150, y: 180, width: 420, title: '2022: Apple M1 Ultra', subtitle: '(UltraFusion - Two Complete SoCs)' },
    { id: 'amd', x: 600, y: 180, width: 320, title: '2024: AMD EPYC', subtitle: '(True Chiplet Architecture)' },
    { id: 'm5', x: 1000, y: 180, width: 340, title: '2026?: Apple M5 (Rumored)', subtitle: '(SoIC - True Chiplet)' },
  ];

  const renderM1Ultra = (x: number, y: number, isHovered: boolean) => {
    const chipWidth = 170;
    const chipHeight = 120;
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
        <text x={x + chipWidth / 2} y={y + 45} textAnchor="middle" fill="#ffffff" fontSize={14} fontWeight={600}>
          M1 Max
        </text>
        <text x={x + chipWidth / 2} y={y + 65} textAnchor="middle" fill="#ffffff" fontSize={11}>
          CPU+GPU+
        </text>
        <text x={x + chipWidth / 2} y={y + 80} textAnchor="middle" fill="#ffffff" fontSize={11}>
          Memory+I/O
        </text>

        {/* Interposer connection */}
        <g>
          <line x1={x + chipWidth + 5} y1={y + 50} x2={x + chipWidth + gap - 5} y2={y + 50} stroke="#ef4444" strokeWidth={2} />
          <polygon points={`${x + chipWidth + gap - 5},${y + 50} ${x + chipWidth + gap - 12},${y + 46} ${x + chipWidth + gap - 12},${y + 54}`} fill="#ef4444" />

          <line x1={x + chipWidth + gap - 5} y1={y + 70} x2={x + chipWidth + 5} y2={y + 70} stroke="#ef4444" strokeWidth={2} />
          <polygon points={`${x + chipWidth + 5},${y + 70} ${x + chipWidth + 12},${y + 66} ${x + chipWidth + 12},${y + 74}`} fill="#ef4444" />

          <text x={x + chipWidth + gap / 2} y={y + 45} textAnchor="middle" fill={textColor} fontSize={9} fontStyle="italic">
            Interposer
          </text>
          <text x={x + chipWidth + gap / 2} y={y + 56} textAnchor="middle" fill={textColor} fontSize={9} fontStyle="italic">
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
        <text x={x + chipWidth + gap + chipWidth / 2} y={y + 45} textAnchor="middle" fill="#ffffff" fontSize={14} fontWeight={600}>
          M1 Max
        </text>
        <text x={x + chipWidth + gap + chipWidth / 2} y={y + 65} textAnchor="middle" fill="#ffffff" fontSize={11}>
          CPU+GPU+
        </text>
        <text x={x + chipWidth + gap + chipWidth / 2} y={y + 80} textAnchor="middle" fill="#ffffff" fontSize={11}>
          Memory+I/O
        </text>
      </g>
    );
  };

  const renderAMDEPYC = (x: number, y: number, isHovered: boolean) => {
    const cpuSize = 65;
    const ioWidth = 90;
    const ioHeight = 140;
    const gap = 10;

    return (
      <g>
        {/* Four CPU chiplets */}
        <rect x={x} y={y} width={cpuSize} height={cpuSize} fill={amdTerracotta} stroke={amdTerracotta} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + cpuSize / 2} y={y + cpuSize / 2 + 5} textAnchor="middle" fill="#ffffff" fontSize={13} fontWeight={600}>CPU</text>

        <rect x={x + cpuSize + gap} y={y} width={cpuSize} height={cpuSize} fill={amdTerracotta} stroke={amdTerracotta} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + cpuSize + gap + cpuSize / 2} y={y + cpuSize / 2 + 5} textAnchor="middle" fill="#ffffff" fontSize={13} fontWeight={600}>CPU</text>

        <rect x={x} y={y + cpuSize + gap} width={cpuSize} height={cpuSize} fill={amdTerracotta} stroke={amdTerracotta} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + cpuSize / 2} y={y + cpuSize + gap + cpuSize / 2 + 5} textAnchor="middle" fill="#ffffff" fontSize={13} fontWeight={600}>CPU</text>

        <rect x={x + cpuSize + gap} y={y + cpuSize + gap} width={cpuSize} height={cpuSize} fill={amdTerracotta} stroke={amdTerracotta} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + cpuSize + gap + cpuSize / 2} y={y + cpuSize + gap + cpuSize / 2 + 5} textAnchor="middle" fill="#ffffff" fontSize={13} fontWeight={600}>CPU</text>

        {/* I/O Die */}
        <rect x={x + cpuSize * 2 + gap * 2 + 15} y={y} width={ioWidth} height={ioHeight} fill={amdTerracotta} stroke={amdTerracotta} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + cpuSize * 2 + gap * 2 + 15 + ioWidth / 2} y={y + ioHeight / 2 - 5} textAnchor="middle" fill="#ffffff" fontSize={14} fontWeight={600}>I/O</text>
        <text x={x + cpuSize * 2 + gap * 2 + 15 + ioWidth / 2} y={y + ioHeight / 2 + 10} textAnchor="middle" fill="#ffffff" fontSize={14} fontWeight={600}>Die</text>
      </g>
    );
  };

  const renderAppleM5 = (x: number, y: number, isHovered: boolean) => {
    const tileWidth = 130;
    const tileHeight = 80;
    const controllerWidth = 150;
    const controllerHeight = 50;
    const gap = 20;

    return (
      <g>
        {/* CPU Tile */}
        <rect x={x} y={y} width={tileWidth} height={tileHeight} fill={appleBlue} stroke={appleBlue} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + tileWidth / 2} y={y + tileHeight / 2 - 5} textAnchor="middle" fill="#ffffff" fontSize={14} fontWeight={600}>CPU</text>
        <text x={x + tileWidth / 2} y={y + tileHeight / 2 + 10} textAnchor="middle" fill="#ffffff" fontSize={14} fontWeight={600}>Tile</text>

        {/* GPU Tile */}
        <rect x={x + tileWidth + gap} y={y} width={tileWidth} height={tileHeight} fill={appleBlue} stroke={appleBlue} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + tileWidth + gap + tileWidth / 2} y={y + tileHeight / 2 - 5} textAnchor="middle" fill="#ffffff" fontSize={14} fontWeight={600}>GPU</text>
        <text x={x + tileWidth + gap + tileWidth / 2} y={y + tileHeight / 2 + 10} textAnchor="middle" fill="#ffffff" fontSize={14} fontWeight={600}>Tile</text>

        {/* Controllers */}
        <rect x={x + (tileWidth * 2 + gap - controllerWidth) / 2} y={y + tileHeight + gap} width={controllerWidth} height={controllerHeight} fill={appleBlue} stroke={appleBlue} strokeWidth={isHovered ? 3 : 2} opacity={isHovered ? 0.9 : 0.8} rx={6} />
        <text x={x + (tileWidth * 2 + gap) / 2} y={y + tileHeight + gap + controllerHeight / 2 + 5} textAnchor="middle" fill="#ffffff" fontSize={13} fontWeight={600}>Controllers</text>
      </g>
    );
  };

  return (
    <div className="my-12 w-full">
      <div className="bg-brand-surface rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-brand-text-primary text-center mb-6">
          The Architecture Evolution: From Monolithic to Modular
        </h3>

        <div className="overflow-x-auto -mx-2 px-2">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="mx-auto w-full"
            style={{ maxWidth: '100%', height: 'auto', minHeight: '500px' }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background */}
            <rect x={0} y={0} width={width} height={height} fill={bgColor} rx={8} />

            {/* Main Title */}
            <text x={width / 2} y={50} textAnchor="middle" fill={textColor} fontSize={24} fontWeight={700}>
              The Architecture Evolution: From Monolithic to Modular
            </text>

            {/* Evolution arrow */}
            <g opacity={0.7}>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill={evolutionPurple} />
                </marker>
              </defs>
              <line x1={920} y1={260} x2={990} y2={260} stroke={evolutionPurple} strokeWidth={4} markerEnd="url(#arrowhead)" />
            </g>

            {/* Section 1: M1 Ultra */}
            <g
              onMouseEnter={() => setHoveredSection('m1ultra')}
              onMouseLeave={() => setHoveredSection(null)}
              cursor="pointer"
            >
              <text x={sections[0].x + sections[0].width / 2} y={130} textAnchor="middle" fill={textColor} fontSize={18} fontWeight={600}>
                {sections[0].title}
              </text>
              <text x={sections[0].x + sections[0].width / 2} y={150} textAnchor="middle" fill={noteColor} fontSize={13} fontStyle="italic">
                {sections[0].subtitle}
              </text>

              {renderM1Ultra(sections[0].x, sections[0].y, hoveredSection === 'm1ultra')}

              <rect x={sections[0].x + 30} y={340} width={360} height={60} fill={labelBgColor} stroke={hoveredSection === 'm1ultra' ? appleBlue : noteColor} strokeWidth={hoveredSection === 'm1ultra' ? 2 : 1} rx={6} />
              <text x={sections[0].x + sections[0].width / 2} y={362} textAnchor="middle" fill={textColor} fontSize={13} fontWeight={600}>
                Advantage: Complete integration
              </text>
              <text x={sections[0].x + sections[0].width / 2} y={380} textAnchor="middle" fill={textColor} fontSize={13} fontWeight={600}>
                Challenge: Yield drops with size
              </text>
            </g>

            {/* Section 2: AMD EPYC */}
            <g
              onMouseEnter={() => setHoveredSection('amd')}
              onMouseLeave={() => setHoveredSection(null)}
              cursor="pointer"
            >
              <text x={sections[1].x + sections[1].width / 2} y={130} textAnchor="middle" fill={textColor} fontSize={18} fontWeight={600}>
                {sections[1].title}
              </text>
              <text x={sections[1].x + sections[1].width / 2} y={150} textAnchor="middle" fill={noteColor} fontSize={13} fontStyle="italic">
                {sections[1].subtitle}
              </text>

              {renderAMDEPYC(sections[1].x + 40, sections[1].y, hoveredSection === 'amd')}

              <rect x={sections[1].x - 10} y={340} width={340} height={60} fill={labelBgColor} stroke={hoveredSection === 'amd' ? amdTerracotta : noteColor} strokeWidth={hoveredSection === 'amd' ? 2 : 1} rx={6} />
              <text x={sections[1].x + sections[1].width / 2} y={362} textAnchor="middle" fill={textColor} fontSize={13} fontWeight={600}>
                Advantage: Mix process nodes
              </text>
              <text x={sections[1].x + sections[1].width / 2} y={380} textAnchor="middle" fill={textColor} fontSize={13} fontWeight={600}>
                Challenge: Interconnect latency
              </text>
            </g>

            {/* Section 3: Apple M5 */}
            <g
              onMouseEnter={() => setHoveredSection('m5')}
              onMouseLeave={() => setHoveredSection(null)}
              cursor="pointer"
            >
              <text x={sections[2].x + sections[2].width / 2} y={130} textAnchor="middle" fill={textColor} fontSize={18} fontWeight={600}>
                {sections[2].title}
              </text>
              <text x={sections[2].x + sections[2].width / 2} y={150} textAnchor="middle" fill={noteColor} fontSize={13} fontStyle="italic">
                {sections[2].subtitle}
              </text>

              {renderAppleM5(sections[2].x + 30, sections[2].y, hoveredSection === 'm5')}

              <rect x={sections[2].x + 20} y={340} width={300} height={60} fill={labelBgColor} stroke={hoveredSection === 'm5' ? appleBlue : noteColor} strokeWidth={hoveredSection === 'm5' ? 2 : 1} rx={6} />
              <text x={sections[2].x + sections[2].width / 2} y={362} textAnchor="middle" fill={textColor} fontSize={13} fontWeight={600}>
                Advantage: Best of both?
              </text>
              <text x={sections[2].x + sections[2].width / 2} y={380} textAnchor="middle" fill={textColor} fontSize={13} fontWeight={600}>
                Challenge: Complexity
              </text>
            </g>

            {/* Bottom note */}
            <rect x={220} y={530} width={960} height={45} fill="#fef3c7" stroke="#f59e0b" strokeWidth={1.5} rx={6} />
            <text x={width / 2} y={558} textAnchor="middle" fill="#92400e" fontSize={16} fontWeight={600} fontStyle="italic">
              The industry converges: Even Apple appears to be moving toward modular chiplet designs
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureEvolution;
