/* src/components/starlink/UsageBarChart.tsx */
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";

interface UsageBarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  color?: string;
  height?: number;
  unit?: string;
}

export default function UsageBarChart({
  data,
  dataKey,
  xAxisKey,
  color = "#06B6D4",
  height = 250,
  unit = "",
}: UsageBarChartProps) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
        >
          {/* Líneas verticales sutiles como en la imagen 1 */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
            vertical={true}
            horizontal={false}
            opacity={0.3}
          />

          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={20}
          />

          <YAxis
            tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value} ${unit}`}
          />

          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            contentStyle={{
              backgroundColor: "#1e293b",
              borderColor: "#475569",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
            }}
            itemStyle={{ color: color, fontWeight: "bold" }}
            formatter={(value: any) => [
              `${parseFloat(value).toFixed(2)} ${unit}`,
              "Global priority",
            ]}
            labelStyle={{ color: "#94a3b8", marginBottom: "0.25rem" }}
          />

          {/* Barras delgadas y redondeadas */}
          <Bar
            dataKey={dataKey}
            fill={color}
            barSize={6}
            radius={[4, 4, 0, 0]}
          />

          <Brush
            dataKey={xAxisKey}
            height={20}
            stroke={color}
            fill="#0f172a"
            tickFormatter={() => ""}
            alwaysShowText={false}
            className="opacity-50"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
