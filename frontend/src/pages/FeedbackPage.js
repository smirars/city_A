import React, { useState } from "react";

export default function FeedbackPage() {
  const [form, setForm] = useState({
    name: "",
    gender: "male",
    topic: "",
    message: "",
    phone: "",
    email: "",
  });

  const topics = [
    "Техническая проблема",
    "Вопрос по жителям",
    "Предложение",
    "Ошибка в данных",
    "Другое"
  ];

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Отправлено:", form);

    alert("Ваше сообщение отправлено!");
    setForm({
      name: "",
      gender: "male",
      topic: "",
      message: "",
      phone: "",
      email: "",
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Форма обратной связи</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        
        <div>
          <label className="block mb-1 font-medium">Ваше имя</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border p-2 rounded-md w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Пол</label>
          <div className="flex gap-4 mt-1">
            <label>
              <input
                type="radio"
                value="male"
                checked={form.gender === "male"}
                onChange={() => handleChange("gender", "male")}
              />{" "}
              Мужской
            </label>
            <label>
              <input
                type="radio"
                value="female"
                checked={form.gender === "female"}
                onChange={() => handleChange("gender", "female")}
              />{" "}
              Женский
            </label>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Тема обращения</label>
          <select
            value={form.topic}
            onChange={(e) => handleChange("topic", e.target.value)}
            className="border p-2 rounded-md w-full"
            required
          >
            <option value="">Выберите тему…</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Ваш вопрос</label>
          <textarea
            value={form.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className="border p-2 rounded-md w-full min-h-[100px]"
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Телефон</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="border p-2 rounded-md w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border p-2 rounded-md w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
