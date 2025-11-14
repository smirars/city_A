import { useState, useEffect } from "react";

export default function CreateCitizenPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    gender: "male",
    birth_date: "",
    phone: "",
    email: "",
    marital_status: "single",
    company_id: "",
    school_id: "",
    university_id: "",
  });

  const [options, setOptions] = useState({
    companies: [],
    schools: [],
    universities: [],
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    async function loadOptions() {
      const [companies, schools, universities] = await Promise.all([
        fetch("http://localhost:3001/companies").then(r => r.json()),
        fetch("http://localhost:3001/schools").then(r => r.json()),
        fetch("http://localhost:3001/universities").then(r => r.json()),
      ]);

      setOptions({ companies, schools, universities });
    }
    loadOptions();
  }, []);

  const createCitizen = async () => {
    const res = await fetch("http://localhost:3001/citizens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.error) {
      alert("Ошибка: " + data.error);
    } else {
      alert("Житель успешно создан!");
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Создать нового жителя</h2>

      <div className="space-y-3">

        <input
          className="border rounded p-2 w-full"
          placeholder="Имя"
          value={form.first_name}
          onChange={(e) => handleChange("first_name", e.target.value)}
        />

        <input
          className="border rounded p-2 w-full"
          placeholder="Фамилия"
          value={form.last_name}
          onChange={(e) => handleChange("last_name", e.target.value)}
        />

        <input
          className="border rounded p-2 w-full"
          placeholder="Отчество (если есть)"
          value={form.middle_name}
          onChange={(e) => handleChange("middle_name", e.target.value)}
        />

        <input
          type="date"
          className="border rounded p-2 w-full"
          value={form.birth_date}
          onChange={(e) => handleChange("birth_date", e.target.value)}
        />

        <input
          className="border rounded p-2 w-full"
          placeholder="Телефон"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

        <input
          className="border rounded p-2 w-full"
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <div>
          <strong>Пол:</strong>
          <div className="flex gap-4 mt-1">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={form.gender === "male"}
                onChange={() => handleChange("gender", "male")}
              />
              Мужской
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={form.gender === "female"}
                onChange={() => handleChange("gender", "female")}
              />
              Женский
            </label>
          </div>
        </div>

        <div>
          <strong>Семейное положение:</strong>
          <select
            className="border p-2 rounded w-full"
            value={form.marital_status}
            onChange={(e) => handleChange("marital_status", e.target.value)}
          >
            <option value="single">Не женат / Не замужем</option>
            <option value="married">Женат / Замужем</option>
          </select>
        </div>

        <div>
          <strong>Компания:</strong>
          <select
            className="border p-2 rounded w-full"
            value={form.company_id}
            onChange={(e) => handleChange("company_id", e.target.value)}
          >
            <option value="">Нет</option>
            {options.companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <strong>Школа:</strong>
          <select
            className="border p-2 rounded w-full"
            value={form.school_id}
            onChange={(e) => handleChange("school_id", e.target.value)}
          >
            <option value="">Нет</option>
            {options.schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <strong>Вуз:</strong>
          <select
            className="border p-2 rounded w-full"
            value={form.university_id}
            onChange={(e) => handleChange("university_id", e.target.value)}
          >
            <option value="">Нет</option>
            {options.universities.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={createCitizen}
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
        >
          Создать жителя
        </button>
      </div>
    </div>
  );
}
