import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchStatistics } from "../api/citizens";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF", "#FF6F91"];

export default function Charts() {
  const [stats, setStats] = useState({
    districts: [],
    companies: [],
    schools: [],
    universities: [],
    ages: [],
  });

  useEffect(() => {
    async function loadStats() {
      const data = await fetchStatistics();
      setStats(data);
    }
    loadStats();
  }, []);

  const renderPieChart = (data = [], title) => (
    <div style={{ marginBottom: "40px" }}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Статистика жителей города A</h2>

      {renderPieChart(stats.districts, "Распределение по районам")}
      {renderPieChart(stats.companies, "Распределение по компаниям")}
      {renderPieChart(stats.schools, "Распределение по школам")}
      {renderPieChart(stats.universities, "Распределение по вузам")}

      <div>
        <h3>Возрастные группы</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.ages}>
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
