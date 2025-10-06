
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: any[];
  xAxisKey: string;
  barKeys: { key: string; color: string }[];
}

export const BarChartComponent: React.FC<BarChartProps> = ({ data, xAxisKey, barKeys }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {barKeys.map(bar => (
          <Bar key={bar.key} dataKey={bar.key} fill={bar.color} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
