import React from "react";
import { View } from "react-native";
import { Svg, G, Rect, Text, Line } from "react-native-svg";
import * as d3 from "d3";
import { NumberReport } from "app/models/Report";

interface BarProp {
  report: NumberReport;
}

const CategoryBarChart = ({ report }: BarProp) => {
  if (!report) return null;

  // Data extraction
  const data = report.dominant_number.map((categoryNumber) => {
    const categoryKey = categoryNumber as string;
    const inliers = report.inliers.get(categoryKey);
    return {
      category: categoryKey,
      count: inliers?.length || 0,
    };
  });

  // Enhanced dimensions and margins
  const width = 300;
  const height = 200;
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Improved scales
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.category))
    .range([0, chartWidth])
    .padding(0.3);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.count) || 0])
    .nice()
    .range([chartHeight, 0]);

  // Colorbrewer palette for better visual appeal
  const colorScale = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.category))
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2"]);

  // Generate y-axis ticks
  const yTicks = yScale.ticks(5);

  return (
    <View>
      <Svg width={width} height={height}>
        <G transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <Line
              key={`grid-${i}`}
              x1={0}
              x2={chartWidth}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="#e0e0e0"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          ))}

          {/* Bars */}
          {data.map((d, i) => (
            <G key={i}>
              <Rect
                x={xScale(d.category)}
                y={yScale(d.count)}
                width={xScale.bandwidth()}
                height={chartHeight - yScale(d.count)}
                fill={colorScale(d.category) as string}
                rx={4}
                ry={4}
              />
              {/* Bar value labels */}
              <Text
                x={xScale(d.category)! + xScale.bandwidth() / 2}
                y={yScale(d.count) - 5}
                fontSize={10}
                fill="#666"
                textAnchor="middle"
              >
                {d.count}
              </Text>
            </G>
          ))}

          {/* X-axis line */}
          <Line
            x1={0}
            y1={chartHeight}
            x2={chartWidth}
            y2={chartHeight}
            stroke="#666"
            strokeWidth={1}
          />

          {/* X-axis labels */}
          {data.map((d, i) => (
            <Text
              key={`x-label-${i}`}
              x={xScale(d.category)! + xScale.bandwidth() / 2}
              y={chartHeight + 20}
              fontSize={12}
              fill="#666"
              textAnchor="middle"
            >
              {d.category}
            </Text>
          ))}

          {/* Y-axis line */}
          <Line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#666" strokeWidth={1} />

          {/* Y-axis labels */}
          {yTicks.map((tick, i) => (
            <G key={`y-label-${i}`}>
              <Text
                x={-10}
                y={yScale(tick)}
                fontSize={10}
                fill="#666"
                textAnchor="end"
                alignmentBaseline="middle"
              >
                {tick}
              </Text>
            </G>
          ))}
        </G>
      </Svg>
    </View>
  );
};

export default CategoryBarChart;