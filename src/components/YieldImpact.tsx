import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface DieData {
  label: string;
  size: string;
  yieldPercent: number;
  goodDies: number;
}

const YieldImpact = () => {
  const { isDarkMode } = useTheme();
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Data showing how yield decreases with die size
  const data: DieData[] = [
    { label: 'M1', size: '(119mm²)', yieldPercent: 89.1, goodDies: 425 },
    { label: 'Mid-size', size: '(250mm²)', yieldPercent: 79.0, goodDies: 173 },
    { label: 'M1 Max', size: '(440mm²)', yieldPercent: 67.2, goodDies: 78 },
    { label: 'Hypothetical\nLarge SoC', size: '(600mm²)', yieldPercent: 59.2, goodDies: 44 },
  ];

  // SVG dimensions
  const width = 1400;
  const height = 660;
  const margin = { top: 60, right: 60, bottom: 135, left: 80 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Max values for scaling
  const maxYield = 100;
  const maxDies = 450;

  // Scale functions
  const scaleYield = (value: number) => {
    return chartHeight - (value / maxYield) * chartHeight;
  };

  const scaleDies = (value: number) => {
    return chartHeight - (value / maxDies) * chartHeight;
  };

  // Bar width and spacing
  const barWidth = 100;
  const barSpacing = 80;
  const groupWidth = barWidth * 2 + 20; // Two bars plus gap between them

  // Colors - using brand colors
  const yieldColor = '#2E5A91'; // brand-blue (secondary accent)
  const yieldStroke = '#234570'; // darker shade of brand-blue for stroke
  const diesColor = '#CC6B4A'; // brand-terracotta (primary accent)
  const diesStroke = '#a85538'; // darker shade of brand-terracotta for stroke
  const bgColor = isDarkMode ? '#1f2937' : '#f3f4f6';
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
  const textColor = isDarkMode ? '#f9fafb' : '#111827';
  const calloutBgColor = isDarkMode ? '#8b5a4a' : '#d9a89a';
  const calloutTextColor = isDarkMode ? '#fef2f2' : '#1f2937';

  return (
    <div className="my-12 w-full">
      <div className="bg-brand-surface rounded-lg p-4 shadow-lg">
        <h3 className="text-xl font-semibold text-brand-text-primary text-center mb-3">
          Why Smaller Dies Win: Yield vs Die Size
        </h3>

        {/* SVG Chart */}
        <div className="overflow-x-auto -mx-2 px-2">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="mx-auto w-full"
            style={{ maxWidth: '100%', height: 'auto', minHeight: '500px' }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background */}
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={bgColor}
              rx={8}
            />

            {/* Callout box */}
            <rect
              x={width / 2 - 200}
              y={margin.top - 50}
              width={400}
              height={40}
              fill={calloutBgColor}
              rx={6}
            />
            <text
              x={width / 2}
              y={margin.top - 25}
              textAnchor="middle"
              fill={calloutTextColor}
              fontSize={18}
              fontWeight={600}
            >
              Doubling die size cuts good dies by &gt;5x
            </text>

            {/* Y-axis (left) */}
            <line
              x1={margin.left}
              y1={margin.top}
              x2={margin.left}
              y2={margin.top + chartHeight}
              stroke={textColor}
              strokeWidth={2}
            />

            {/* X-axis */}
            <line
              x1={margin.left}
              y1={margin.top + chartHeight}
              x2={width - margin.right}
              y2={margin.top + chartHeight}
              stroke={textColor}
              strokeWidth={2}
            />

            {/* Y-axis label (left) */}
            <text
              x={margin.left - 55}
              y={margin.top + chartHeight / 2}
              textAnchor="middle"
              fill={textColor}
              fontSize={16}
              fontWeight={600}
              transform={`rotate(-90, ${margin.left - 55}, ${margin.top + chartHeight / 2})`}
            >
              Value
            </text>

            {/* X-axis label */}
            <text
              x={width / 2}
              y={height - 30}
              textAnchor="middle"
              fill={textColor}
              fontSize={18}
              fontWeight={600}
            >
              Die Size
            </text>

            {/* Grid lines - left axis (yield percentages) */}
            {[0, 100, 200, 300, 400].map((value) => (
              <g key={value}>
                <line
                  x1={margin.left}
                  y1={margin.top + scaleDies(value)}
                  x2={width - margin.right}
                  y2={margin.top + scaleDies(value)}
                  stroke={gridColor}
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
                <text
                  x={margin.left - 10}
                  y={margin.top + scaleDies(value) + 5}
                  textAnchor="end"
                  fill={textColor}
                  fontSize={14}
                >
                  {value}
                </text>
              </g>
            ))}

            {/* Legend - centered at bottom */}
            <g transform={`translate(${width / 2 - 180}, ${height - 25})`}>
              {/* Yield legend */}
              <rect
                x={0}
                y={0}
                width={30}
                height={20}
                fill={yieldColor}
                rx={2}
              />
              <text
                x={35}
                y={15}
                fill={textColor}
                fontSize={14}
                fontWeight={500}
              >
                Yield (%)
              </text>

              {/* Good Dies legend */}
              <rect
                x={180}
                y={0}
                width={30}
                height={20}
                fill={diesColor}
                rx={2}
              />
              <text
                x={215}
                y={15}
                fill={textColor}
                fontSize={14}
                fontWeight={500}
              >
                Good Dies per Wafer
              </text>
            </g>

            {/* Bars */}
            {data.map((die, index) => {
              const groupX = margin.left + (chartWidth - (data.length * groupWidth + (data.length - 1) * barSpacing)) / 2 + index * (groupWidth + barSpacing);

              // Yield bar (blue)
              const yieldBarX = groupX;
              const yieldBarY = margin.top + scaleYield(die.yieldPercent);
              const yieldBarHeight = chartHeight - scaleYield(die.yieldPercent);
              const isYieldHovered = hoveredBar === `yield-${index}`;

              // Good dies bar (red)
              const diesBarX = groupX + barWidth + 20;
              const diesBarY = margin.top + scaleDies(die.goodDies);
              const diesBarHeight = chartHeight - scaleDies(die.goodDies);
              const isDiesHovered = hoveredBar === `dies-${index}`;

              return (
                <g key={index}>
                  {/* Yield bar */}
                  <g
                    onMouseEnter={() => setHoveredBar(`yield-${index}`)}
                    onMouseLeave={() => setHoveredBar(null)}
                    cursor="pointer"
                  >
                    <rect
                      x={yieldBarX}
                      y={yieldBarY}
                      width={barWidth}
                      height={yieldBarHeight}
                      fill={yieldColor}
                      stroke={yieldStroke}
                      strokeWidth={isYieldHovered ? 3 : 2}
                      opacity={isYieldHovered ? 0.9 : 0.8}
                      rx={4}
                    />
                    <text
                      x={yieldBarX + barWidth / 2}
                      y={yieldBarY - 10}
                      textAnchor="middle"
                      fill={textColor}
                      fontSize={16}
                      fontWeight={isYieldHovered ? 700 : 600}
                    >
                      {die.yieldPercent}%
                    </text>
                  </g>

                  {/* Good dies bar */}
                  <g
                    onMouseEnter={() => setHoveredBar(`dies-${index}`)}
                    onMouseLeave={() => setHoveredBar(null)}
                    cursor="pointer"
                  >
                    <rect
                      x={diesBarX}
                      y={diesBarY}
                      width={barWidth}
                      height={diesBarHeight}
                      fill={diesColor}
                      stroke={diesStroke}
                      strokeWidth={isDiesHovered ? 3 : 2}
                      opacity={isDiesHovered ? 0.9 : 0.8}
                      rx={4}
                    />
                    <text
                      x={diesBarX + barWidth / 2}
                      y={diesBarY - 10}
                      textAnchor="middle"
                      fill={textColor}
                      fontSize={16}
                      fontWeight={isDiesHovered ? 700 : 600}
                    >
                      {die.goodDies}
                    </text>
                  </g>

                  {/* Die label below bars */}
                  {die.label.split('\n').map((line, lineIndex) => (
                    <text
                      key={lineIndex}
                      x={groupX + groupWidth / 2}
                      y={margin.top + chartHeight + 30 + lineIndex * 22}
                      textAnchor="middle"
                      fill={textColor}
                      fontSize={16}
                      fontWeight={600}
                    >
                      {line}
                    </text>
                  ))}

                  {/* Die size label */}
                  <text
                    x={groupX + groupWidth / 2}
                    y={margin.top + chartHeight + 74}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize={14}
                    fontWeight={400}
                    opacity={0.8}
                  >
                    {die.size}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default YieldImpact;
