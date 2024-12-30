import React from "react";
import { View } from "react-native";
import { Svg, G, Rect, Text, Path } from "react-native-svg";

interface StackedBarProps {
  misplacementRate: number;
}

const StackedBarChart = ({ misplacementRate }: StackedBarProps) => {
  // Convert to percentage and ensure it's between 0 and 100
  const misplacedPercentage = Math.min(Math.max(misplacementRate * 100, 0), 100);
  const correctPercentage = 100 - misplacedPercentage;

  // Chart dimensions
  const width = 300;
  const height = 120; // Increased height to accommodate labels
  const margin = { top: 30, right: 30, bottom: 20, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const barHeight = 30;

  // Colors
  const colors = {
    misplaced: "#ff7f0e",    // Orange for misplaced
    correct: "#2ca02c",      // Green for correct placement
  };

  // Calculate widths for both segments
  const misplacedWidth = (misplacedPercentage / 100) * chartWidth;
  const correctWidth = (correctPercentage / 100) * chartWidth;

  // Helper function to create leader line path
  const createLeaderLine = (x: number, isTop: boolean) => {
    const startY = barHeight / 2;
    const endY = isTop ? -15 : barHeight + 15;
    const middleY = isTop ? startY - 10 : startY + 10;

    return `M ${x} ${startY} 
            L ${x} ${middleY} 
            L ${x} ${endY}`;
  };

  return (
    <View>
      <Svg width={width} height={height}>
        <G transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Background bar (100%) */}
          <Rect
            x={0}
            y={0}
            width={chartWidth}
            height={barHeight}
            fill="#f0f0f0"
            rx={4}
            ry={4}
          />

          {/* Correct rate bar (on the left) */}
          <Rect
            x={0}
            y={0}
            width={correctWidth}
            height={barHeight}
            fill={colors.correct}
            rx={4}
            ry={4}
          />

          {/* Misplacement rate bar (on the right) */}
          <Rect
            x={correctWidth}
            y={0}
            width={misplacedWidth}
            height={barHeight}
            fill={colors.misplaced}
            rx={4}
            ry={4}
          />

          {/* Leader lines and labels for correct percentage */}
          {correctPercentage !== 0 && (
            <>
              <Path
                d={createLeaderLine(correctWidth / 2, correctPercentage < misplacedPercentage)}
                stroke="#666"
                strokeWidth={1}
                fill="none"
              />
              <Text
                x={correctWidth / 2}
                y={correctPercentage < misplacedPercentage ? -20 : barHeight + 25}
                fontSize={11}
                fill="#666"
                textAnchor="middle"
              >
                {`${correctPercentage.toFixed(1)}% Correct`}
              </Text>
            </>
          )}

          {/* Leader lines and labels for misplaced percentage */}
          {misplacedPercentage !== 0 && (
            <>
              <Path
                d={createLeaderLine(correctWidth + misplacedWidth / 2, correctPercentage > misplacedPercentage)}
                stroke="#666"
                strokeWidth={1}
                fill="none"
              />
              <Text
                x={correctWidth + misplacedWidth / 2 - 10}
                y={correctPercentage > misplacedPercentage ? -20 : barHeight + 25}
                fontSize={11}
                fill="#666"
                textAnchor="middle"
              >
                {`${misplacedPercentage.toFixed(1)}% Misplaced`}
              </Text>
            </>
          )}

          {/* Legend */}
          <G transform={`translate(0, ${barHeight + 40})`}>
            {/* Correct indicator */}
            <Rect x={0} y={0} width={12} height={12} fill={colors.correct} rx={2} />
            <Text x={16} y={10} fontSize={10} fill="#666">
              Correct
            </Text>

            {/* Misplaced indicator */}
            <Rect x={80} y={0} width={12} height={12} fill={colors.misplaced} rx={2} />
            <Text x={96} y={10} fontSize={10} fill="#666">
              Misplaced
            </Text>
          </G>
        </G>
      </Svg>
    </View>
  );
};

export default StackedBarChart;