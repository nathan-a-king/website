import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface TimelineEvent {
  year: number;
  label: string;
  type: 'prediction' | 'reality';
  color: string;
}

const ChipletTimeline = () => {
  const { isDarkMode } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Timeline events data
  const events: TimelineEvent[] = [
    // 2023 Predictions (blue - secondary brand color)
    { year: 2023.0, label: 'Original Article\nPublished', type: 'prediction', color: '#2E5A91' },
    { year: 2023.0, label: 'Predicted:\nApple needs N3\nfor Mac Pro', type: 'prediction', color: '#2E5A91' },
    { year: 2023.0, label: 'Predicted:\nAMD chiplets\ngain advantage', type: 'prediction', color: '#2E5A91' },

    // What Actually Happened (terracotta - primary brand color)
    { year: 2023.5, label: 'Mac Pro M2 Ultra\nReleased ($6,999)', type: 'reality', color: '#CC6B4A' },
    { year: 2024.0, label: 'M3 on N3B\n(expensive process)', type: 'reality', color: '#CC6B4A' },
    { year: 2024.5, label: 'M4 on N3E\n(cost-optimized)', type: 'reality', color: '#CC6B4A' },
    { year: 2024.5, label: 'AMD wins IEEE\nInnovation Award', type: 'reality', color: '#CC6B4A' },
    { year: 2025.5, label: 'Mac Studio M3 Ultra\nOutpaces Mac Pro', type: 'reality', color: '#CC6B4A' },
    { year: 2025.5, label: 'M5 SoiC Chiplet\nRumors Surface', type: 'reality', color: '#CC6B4A' },
  ];

  // SVG dimensions and scaling
  const width = 1400;
  const height = 700;
  const margin = { top: 100, right: 120, bottom: 100, left: 120 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Year range
  const minYear = 2023.0;
  const maxYear = 2025.5;

  // Scale function to convert year to x-coordinate
  const yearToX = (year: number) => {
    return margin.left + ((year - minYear) / (maxYear - minYear)) * plotWidth;
  };

  // Group events by type and assign y-positions
  const getYPosition = (event: TimelineEvent, index: number) => {
    const predictionEvents = events.filter(e => e.type === 'prediction');
    const predictionIndex = predictionEvents.findIndex(e => e === event);

    if (event.type === 'prediction') {
      // Stack predictions vertically on the left
      return margin.top + 80 + predictionIndex * 120;
    } else {
      // Reality events - position based on year to avoid overlap
      const sameYearEvents = events.filter(e =>
        e.type === 'reality' && Math.abs(e.year - event.year) < 0.1
      );
      const sameYearIndex = sameYearEvents.findIndex(e => e === event);

      // Alternate between different y-positions for events at same time
      if (sameYearEvents.length > 1) {
        return margin.top + 100 + sameYearIndex * 150;
      }
      return margin.top + 200;
    }
  };

  // Generate tick marks for years
  const yearTicks = [2023.0, 2023.5, 2024.0, 2024.5, 2025.0, 2025.5];

  const bgColor = isDarkMode ? '#1f2937' : '#f3f4f6';
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
  const textColor = isDarkMode ? '#f9fafb' : '#111827';
  const labelBgColor = isDarkMode ? '#374151' : '#ffffff';

  return (
    <div className="my-12 w-full">
      <div className="bg-brand-surface rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-brand-text-primary text-center mb-6">
          Predictions vs Reality: The Chiplet Convergence Timeline
        </h3>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2E5A91' }}></div>
            <span className="text-brand-text-secondary">2023 Predictions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#CC6B4A' }}></div>
            <span className="text-brand-text-secondary">What Actually Happened</span>
          </div>
        </div>

        {/* SVG Timeline */}
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

            {/* Grid lines */}
            {yearTicks.map((year, i) => (
              <line
                key={`grid-${i}`}
                x1={yearToX(year)}
                y1={margin.top}
                x2={yearToX(year)}
                y2={height - margin.bottom}
                stroke={gridColor}
                strokeWidth={1}
                strokeDasharray="4,4"
              />
            ))}

            {/* Events */}
            {events.map((event, index) => {
              const x = yearToX(event.year);
              const y = getYPosition(event, index);
              const isHovered = hoveredIndex === index;

              // Calculate label dimensions - always centered on x
              const labelWidth = 220;
              const lineHeight = 26;
              const labelHeight = event.label.split('\n').length * lineHeight + 20;
              const labelX = x - labelWidth / 2;

              return (
                <g
                  key={`event-${index}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  cursor="pointer"
                >
                  {/* Connection line to timeline */}
                  <line
                    x1={x}
                    y1={y}
                    x2={x}
                    y2={height - margin.bottom}
                    stroke={event.color}
                    strokeWidth={isHovered ? 3 : 2}
                    strokeDasharray="2,2"
                    opacity={isHovered ? 0.7 : 0.4}
                  />

                  {/* Event marker */}
                  {event.type === 'prediction' ? (
                    <rect
                      x={x - (isHovered ? 10 : 8)}
                      y={y - (isHovered ? 10 : 8)}
                      width={isHovered ? 20 : 16}
                      height={isHovered ? 20 : 16}
                      fill={event.color}
                      rx={2}
                    />
                  ) : (
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 10 : 8}
                      fill={event.color}
                    />
                  )}

                  {/* Label background */}
                  <rect
                    x={labelX}
                    y={y - 40}
                    width={labelWidth}
                    height={labelHeight}
                    fill={labelBgColor}
                    stroke={event.color}
                    strokeWidth={isHovered ? 3 : 1}
                    rx={6}
                  />

                  {/* Label text */}
                  {event.label.split('\n').map((line, lineIndex) => {
                    const numLines = event.label.split('\n').length;
                    const totalTextHeight = numLines * lineHeight;
                    const boxCenterY = (y - 40) + labelHeight / 2;
                    const firstLineY = boxCenterY - (totalTextHeight / 2) + (lineHeight / 2);
                    const lineY = firstLineY + lineIndex * lineHeight;

                    return (
                      <text
                        key={`text-${index}-${lineIndex}`}
                        x={labelX + labelWidth / 2}
                        y={lineY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={textColor}
                        fontSize={18}
                        fontWeight={isHovered ? 600 : 500}
                      >
                        {line}
                      </text>
                    );
                  })}
                </g>
              );
            })}

            {/* X-axis */}
            <line
              x1={margin.left}
              y1={height - margin.bottom}
              x2={width - margin.right}
              y2={height - margin.bottom}
              stroke={textColor}
              strokeWidth={2}
            />

            {/* X-axis ticks and labels */}
            {yearTicks.map((year, i) => {
              // Format year labels: "2023", "Q3 2023", "2024", etc.
              let yearLabel;
              if (year % 1 === 0) {
                yearLabel = year.toFixed(0);
              } else {
                const baseYear = Math.floor(year);
                const fraction = year - baseYear;
                const quarter = fraction === 0.5 ? 'Q3' : 'Q1';
                yearLabel = `${quarter} ${baseYear}`;
              }

              return (
                <g key={`tick-${i}`}>
                  <line
                    x1={yearToX(year)}
                    y1={height - margin.bottom}
                    x2={yearToX(year)}
                    y2={height - margin.bottom + 6}
                    stroke={textColor}
                    strokeWidth={2}
                  />
                  <text
                    x={yearToX(year)}
                    y={height - margin.bottom + 24}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize={20}
                    fontWeight={500}
                  >
                    {yearLabel}
                  </text>
                </g>
              );
            })}

            {/* X-axis label */}
            <text
              x={width / 2}
              y={height - 20}
              textAnchor="middle"
              fill={textColor}
              fontSize={20}
              fontWeight={600}
            >
              Year
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ChipletTimeline;
