import { useState, useEffect } from "react";

export default function CitizenFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    gender: "all",
    marital_status: "all",
    minAge: "",
    maxAge: "",
    company: "",
    school: "",
    university: "",
  });

  const [options, setOptions] = useState({
    companies: [],
    schools: [],
    universities: [],
  });

  useEffect(() => {
    async function loadOptions() {
      const [companies, schools, universities] = await Promise.all([
        fetch("http://localhost:3001/companies").then((r) => r.json()),
        fetch("http://localhost:3001/schools").then((r) => r.json()),
        fetch("http://localhost:3001/universities").then((r) => r.json()),
      ]);
      setOptions({ companies, schools, universities });
    }
    loadOptions();
  }, []);

  const handleChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="space-y-3 text-sm text-gray-700">
      <div>
        <strong>Пол:</strong>
        <div className="flex gap-2 mt-1">
          {["all", "male", "female"].map((g) => (
            <label key={g}>
              <input
                type="radio"
                name="gender"
                value={g}
                checked={filters.gender === g}
                onChange={(e) => handleChange("gender", e.target.value)}
              />
              {" "}{g === "all" ? "Все" : g === "male" ? "Мужчины" : "Женщины"}
            </label>
          ))}
        </div>
      </div>

      <div>
        <strong>Семейное положение:</strong>
        <div className="flex gap-2 mt-1">
          {["all", "single", "married"].map((m) => (
            <label key={m}>
              <input
                type="radio"
                name="marital"
                value={m}
                checked={filters.marital_status === m}
                onChange={(e) => handleChange("marital_status", e.target.value)}
              />
              {" "}{m === "all" ? "Все" : m === "single" ? "Не женаты" : "Женаты"}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Мин. возраст"
          className="border rounded-md p-1 w-1/2"
          value={filters.minAge}
          onChange={(e) => handleChange("minAge", e.target.value)}
        />
        <input
          type="number"
          placeholder="Макс. возраст"
          className="border rounded-md p-1 w-1/2"
          value={filters.maxAge}
          onChange={(e) => handleChange("maxAge", e.target.value)}
        />
      </div>

      {["company", "school", "university"].map((field) => {
        const keyMap = {
            company: "companies",
            school: "schools",
            university: "universities",
        };
        const list = options[keyMap[field]] || [];

        return (
            <div key={field}>
            <select
                className="border rounded-md p-1 w-full"
                value={filters[field]}
                onChange={(e) => handleChange(field, e.target.value)}
            >
                <option value="">
                Все {field === "company" ? "компании" : field === "school" ? "школы" : "вузы"}
                </option>
                {list.map((o) => (
                <option key={o.id} value={o.name}>
                    {o.name}
                </option>
                ))}
            </select>
            </div>
        );
        })}

    </div>
  );
}
