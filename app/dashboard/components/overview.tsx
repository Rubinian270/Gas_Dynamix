"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    "Natural Gas": 20,
    Biogas: 12,
    Hydrogen: 5,
  },
  {
    name: "Feb",
    "Natural Gas": 18,
    Biogas: 15,
    Hydrogen: 8,
  },
  {
    name: "Mar",
    "Natural Gas": 25,
    Biogas: 18,
    Hydrogen: 12,
  },
  {
    name: "Apr",
    "Natural Gas": 22,
    Biogas: 20,
    Hydrogen: 15,
  },
  {
    name: "May",
    "Natural Gas": 30,
    Biogas: 22,
    Hydrogen: 18,
  },
  {
    name: "Jun",
    "Natural Gas": 28,
    Biogas: 25,
    Hydrogen: 20,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} className="group">
        <defs>
          <linearGradient id="naturalGas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="naturalGasHover" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.5} />
          </linearGradient>
          <linearGradient id="biogas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="biogasHover" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.5} />
          </linearGradient>
          <linearGradient id="hydrogen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="hydrogenHover" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
        <XAxis dataKey="name" tick={{ fill: "#3b82f6" }} axisLine={{ stroke: "#bfdbfe" }} />
        <YAxis tick={{ fill: "#3b82f6" }} axisLine={{ stroke: "#bfdbfe" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            borderColor: "#bfdbfe",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
          cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
          animationDuration={300}
        />
        <Legend wrapperStyle={{ paddingTop: "10px" }} />
        <Bar
          dataKey="Natural Gas"
          fill="url(#naturalGas)"
          radius={[4, 4, 0, 0]}
          className="transition-all duration-300"
          onMouseOver={() => {
            document.documentElement.style.setProperty("--bar-fill-natural-gas", "url(#naturalGasHover)")
          }}
          onMouseOut={() => {
            document.documentElement.style.setProperty("--bar-fill-natural-gas", "url(#naturalGas)")
          }}
        />
        <Bar
          dataKey="Biogas"
          fill="url(#biogas)"
          radius={[4, 4, 0, 0]}
          className="transition-all duration-300"
          onMouseOver={() => {
            document.documentElement.style.setProperty("--bar-fill-biogas", "url(#biogasHover)")
          }}
          onMouseOut={() => {
            document.documentElement.style.setProperty("--bar-fill-biogas", "url(#biogas)")
          }}
        />
        <Bar
          dataKey="Hydrogen"
          fill="url(#hydrogen)"
          radius={[4, 4, 0, 0]}
          className="transition-all duration-300"
          onMouseOver={() => {
            document.documentElement.style.setProperty("--bar-fill-hydrogen", "url(#hydrogenHover)")
          }}
          onMouseOut={() => {
            document.documentElement.style.setProperty("--bar-fill-hydrogen", "url(#hydrogen)")
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

