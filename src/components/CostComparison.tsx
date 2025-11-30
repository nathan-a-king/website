import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ChipData {
  label: string;
  cost: number;
}

const CostComparison = () => {
  const { isDarkMode } = useTheme();
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Data for 2023 estimates (N5 process)
  const n5Data: ChipData[] = [
    { label: 'M1\n(N5)', cost: 40 },
    { label: 'M1 Max\n(N5)', cost: 223 },
    { label: 'M1 Ultra\n(2x Max)', cost: 446 },
  ];

  // Data for 2025 estimates (N3 process)
  const n3Data: ChipData[] = [
    { label: 'M3\n(N3B)', cost: 52 },
    { label: 'M4\n(N3E)', cost: 45 },
    { label: 'M2 Ultra\n(2x Max)', cost: 450 },
  ];

  // SVG dimensions
  const width = 1400;
  const height = 600;
  const margin = { top: 80, right: 40, bottom: 120, left: 80 };
  const chartWidth = (width - margin.left - margin.right - 60) / 2; // 60px gap between charts
  const chartHeight = height - margin.top - margin.bottom;

  // Max value for scaling
  const maxValue = 500;

  // Scale function
  const scaleY = (value: number) => {
    return chartHeight - (value / maxValue) * chartHeight;
  };

  // Bar width and spacing
  const barWidth = 120;
  const barSpacing = 80;

  // Colors - using brand colors
  const barColor = '#CC6B4A'; // brand-terracotta (primary accent)
  const barStroke = '#a85538'; // darker shade of brand-terracotta for stroke
  const bgColor = isDarkMode ? '#1f2937' : '#f3f4f6';
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
  const textColor = isDarkMode ? '#f9fafb' : '#111827';
  const labelBgColor = isDarkMode ? '#374151' : '#ffffff';

  const renderChart = (data: ChipData[], startX: number, title: string) => {
    return (
      <g>
        {/* Title */}
        <text
          x={startX + chartWidth / 2}
          y={margin.top - 40}
          textAnchor="middle"
          fill={textColor}
          fontSize={20}
          fontWeight={600}
        >
          {title}
        </text>

        {/* Y-axis */}
        <line
          x1={startX}
          y1={margin.top}
          x2={startX}
          y2={margin.top + chartHeight}
          stroke={textColor}
          strokeWidth={2}
        />

        {/* X-axis */}
        <line
          x1={startX}
          y1={margin.top + chartHeight}
          x2={startX + chartWidth}
          y2={margin.top + chartHeight}
          stroke={textColor}
          strokeWidth={2}
        />

        {/* Y-axis label */}
        <text
          x={startX - 55}
          y={margin.top + chartHeight / 2}
          textAnchor="middle"
          fill={textColor}
          fontSize={16}
          fontWeight={600}
          transform={`rotate(-90, ${startX - 55}, ${margin.top + chartHeight / 2})`}
        >
          Estimated Materials Cost ($)
        </text>

        {/* Grid lines and labels */}
        {[0, 100, 200, 300, 400, 500].map((value) => (
          <g key={value}>
            <line
              x1={startX}
              y1={margin.top + scaleY(value)}
              x2={startX + chartWidth}
              y2={margin.top + scaleY(value)}
              stroke={gridColor}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            <text
              x={startX - 10}
              y={margin.top + scaleY(value) + 5}
              textAnchor="end"
              fill={textColor}
              fontSize={14}
            >
              {value}
            </text>
          </g>
        ))}

        {/* Bars */}
        {data.map((chip, index) => {
          const barX = startX + (chartWidth - (data.length * barWidth + (data.length - 1) * barSpacing)) / 2 + index * (barWidth + barSpacing);
          const barY = margin.top + scaleY(chip.cost);
          const barHeight = chartHeight - scaleY(chip.cost);
          const isHovered = hoveredBar === `${title}-${index}`;

          return (
            <g
              key={index}
              onMouseEnter={() => setHoveredBar(`${title}-${index}`)}
              onMouseLeave={() => setHoveredBar(null)}
              cursor="pointer"
            >
              {/* Bar */}
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={barColor}
                stroke={barStroke}
                strokeWidth={isHovered ? 3 : 2}
                opacity={isHovered ? 0.9 : 0.8}
                rx={4}
              />

              {/* Cost label on top of bar */}
              <text
                x={barX + barWidth / 2}
                y={barY - 10}
                textAnchor="middle"
                fill={textColor}
                fontSize={18}
                fontWeight={isHovered ? 700 : 600}
              >
                ${chip.cost}
              </text>

              {/* Chip label below bar */}
              {chip.label.split('\n').map((line, lineIndex) => (
                <text
                  key={lineIndex}
                  x={barX + barWidth / 2}
                  y={margin.top + chartHeight + 25 + lineIndex * 20}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize={16}
                  fontWeight={isHovered ? 600 : 500}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div className="my-12 w-full">
      <div className="bg-brand-surface rounded-lg p-4 shadow-lg">
        <h3 className="text-xl font-semibold text-brand-text-primary text-center mb-3">
          Silicon Cost Comparison: Process Node Evolution
        </h3>

        {/* Screen reader live region for hover announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {hoveredBar !== null && (
            <span>
              {hoveredBar.includes('2023') ? 'N5 Process - ' : 'N3 Process - '}
              {(() => {
                const index = parseInt(hoveredBar.split('-').pop() || '0');
                const data = hoveredBar.includes('2023') ? n5Data : n3Data;
                return data[index] ? `${data[index].label.replace(/\n/g, ' ')}: $${data[index].cost}` : '';
              })()}
            </span>
          )}
        </div>

        {/* SVG Chart */}
        <div className="overflow-x-auto -mx-2 px-2">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="mx-auto w-full"
            style={{ maxWidth: '100%', height: 'auto', minHeight: '500px' }}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Bar chart comparing estimated silicon materials costs between N5 and N3 process nodes for various Apple M-series chips"
            aria-describedby="cost-comparison-description"
          >
            <desc id="cost-comparison-description">
              Dual bar chart showing estimated materials costs for Apple silicon chips across two manufacturing processes.
              Left chart shows 2023 N5 process costs ranging from $40 to $446. Right chart shows 2025 N3 process costs ranging from $45 to $450.
              Hover over bars to highlight cost information.
            </desc>
            {/* Background */}
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={bgColor}
              rx={8}
            />

            {/* 2023 Estimates (N5 Process) */}
            {renderChart(n5Data, margin.left, '2023 Estimates (N5 Process)')}

            {/* 2025 Estimates (N3 Process) */}
            {renderChart(n3Data, margin.left + chartWidth + 60, '2025 Estimates (N3 Process)')}

            {/* Note at bottom */}
            <text
              x={width / 2}
              y={height - 20}
              textAnchor="middle"
              fill={textColor}
              fontSize={20}
              fontStyle="italic"
              opacity={0.8}
            >
              Note: Estimates based on wafer costs, die size, and defect density. N3E offers better yields than N3B.
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CostComparison;
