"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  {
    name: "00:00",
    "CPU Usage": 45,
    "Memory Usage": 60,
    "API Requests": 120,
  },
  {
    name: "04:00",
    "CPU Usage": 30,
    "Memory Usage": 55,
    "API Requests": 80,
  },
  {
    name: "08:00",
    "CPU Usage": 65,
    "Memory Usage": 70,
    "API Requests": 250,
  },
  {
    name: "12:00",
    "CPU Usage": 80,
    "Memory Usage": 75,
    "API Requests": 320,
  },
  {
    name: "16:00",
    "CPU Usage": 75,
    "Memory Usage": 80,
    "API Requests": 280,
  },
  {
    name: "20:00",
    "CPU Usage": 60,
    "Memory Usage": 70,
    "API Requests": 210,
  },
  {
    name: "Now",
    "CPU Usage": 55,
    "Memory Usage": 65,
    "API Requests": 180,
  },
]

export function SystemStatus() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-blue-100 p-4 bg-gradient-to-r from-blue-50/30 to-white shadow-md hover:shadow-lg transition-shadow">
          <div className="text-sm font-medium text-blue-700/70">System Uptime</div>
          <div className="text-2xl font-bold text-blue-900">24 days, 5 hours</div>
        </div>
        <div className="rounded-lg border border-blue-100 p-4 bg-gradient-to-r from-blue-50/30 to-white shadow-md hover:shadow-lg transition-shadow">
          <div className="text-sm font-medium text-blue-700/70">Last Backup</div>
          <div className="text-2xl font-bold text-blue-900">Today, 03:00 AM</div>
        </div>
        <div className="rounded-lg border border-blue-100 p-4 bg-gradient-to-r from-blue-50/30 to-white shadow-md hover:shadow-lg transition-shadow">
          <div className="text-sm font-medium text-blue-700/70">Active Sessions</div>
          <div className="text-2xl font-bold text-blue-900">24</div>
        </div>
      </div>
      <div className="rounded-lg border border-blue-100 p-4 bg-gradient-to-r from-blue-50/30 to-white shadow-md">
        <h3 className="mb-4 text-lg font-medium text-blue-900">System Performance (24 hours)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="apiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.2} />
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
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Line
              type="monotone"
              dataKey="CPU Usage"
              stroke="#2563eb"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              dot={{ strokeWidth: 2 }}
              fill="url(#cpuGradient)"
            />
            <Line
              type="monotone"
              dataKey="Memory Usage"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              fill="url(#memoryGradient)"
            />
            <Line
              type="monotone"
              dataKey="API Requests"
              stroke="#93c5fd"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              fill="url(#apiGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

