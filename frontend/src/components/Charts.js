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
  LineChart,
  Line,
} from "recharts";
import { fetchStatistics } from "../api/citizens";
import "../styles/Charts.css";

const COLORS = ["#6b8bfa", "#4fd4bc", "#ffce73", "#ff8b6a", "#b38aff", "#ff6fae"];

export default function Charts() {
  const [stats, setStats] = useState({
    districts: [],
    companies: [],
    schools: [],
    universities: [],
    ages: [],
    birthYears: [],
  });

  useEffect(() => {
    async function loadStats() {
      const data = await fetchStatistics();
      setStats(data);
    }
    loadStats();
  }, []);

  const renderCard = (title, content) => (
    <div className="chart-card">
      <h3 className="chart-card__title">{title}</h3>
      <div className="chart-card__content">{content}</div>
    </div>
  );

  const renderPie = (data, title) =>
    renderCard(
      title,
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={110}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#2a2f4a", border: "none", color: "#e9ecf5" }}
            labelStyle={{ color: "#e9ecf5" }}
            itemStyle={{ color: "#e9ecf5" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );

  return (
    <div className="charts-page">
      <h2 className="charts-page__title">Статистика жителей города A</h2>

      {renderPie(stats.districts, "Распределение по районам")}
      {renderPie(stats.companies, "Распределение по компаниям")}
      {renderPie(stats.schools, "Распределение по школам")}
      {renderPie(stats.universities, "Распределение по вузам")}

      {renderCard(
        "Возрастные группы",
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.ages}>
            <XAxis dataKey="range" name="Количество" stroke="#d0d3e0" />
            <YAxis stroke="#d0d3e0" />
            <Tooltip contentStyle={{ background: "#2a2f4a", border: "none" }} />
            <Legend />
            <Bar dataKey="count" name="Количество" fill="#6b8bfa" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {renderCard(
        "Распределение по годам рождения",
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.birthYears}>
            <XAxis dataKey="year" name="Количество" stroke="#d0d3e0" />
            <YAxis stroke="#d0d3e0" />
            <Tooltip contentStyle={{ background: "#2a2f4a", border: "none" }} />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              name="Количество"
              stroke="#6b8bfa"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
