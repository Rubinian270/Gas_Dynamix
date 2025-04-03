"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Methane (CH₄)", value: 85.2 },
  { name: "Ethane (C₂H₆)", value: 6.4 },
  { name: "Propane (C₃H₈)", value: 3.1 },
  { name: "Carbon Dioxide (CO₂)", value: 2.7 },
  { name: "Nitrogen (N₂)", value: 1.8 },
  { name: "Other", value: 0.8 },
]

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"]

export function GasCompositionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `${value}%`}
          contentStyle={{
            backgroundColor: "white",
            borderColor: "#bfdbfe",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

