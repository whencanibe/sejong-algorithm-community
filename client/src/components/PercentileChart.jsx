import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ReferenceDot, ResponsiveContainer
} from "recharts";

export default function PercentileChartMini({ percentile }) {
  const myX = 100 - percentile;
  const myY = Math.exp(-((myX - 50) ** 2) / (2 * 15 ** 2));

  const curveData = Array.from({ length: 100 }, (_, i) => {
    const x = i;
    const y = Math.exp(-((x - 50) ** 2) / (2 * 15 ** 2));
    return { x, y };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={curveData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <XAxis dataKey="x" hide />
        <YAxis hide />
        <Tooltip
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <div style={{
                background: '#fff',
                padding: '6px 10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                현재 위치: {100 - label}%
              </div>
            ) : null
          }
        />
        <Line type="monotone" dataKey="y" stroke="#6f728c" dot={false} strokeWidth={2} />
        <ReferenceDot
          x={myX}
          y={myY}
          r={4}
          fill="#00e5ff"
          stroke="none"
          label={{
            value: `상위 ${percentile}%`,
            position: "top",
            fontSize: 12,
            fill: "#00e5ff",
          }}
          style={{ filter: "drop-shadow(0 0 4px #00e5ff)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}