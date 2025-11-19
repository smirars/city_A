import React, { useState } from "react";
import "../styles/FeedbackPage.css";
import { PatternFormat } from "react-number-format";
import SuccessModal from "../components/SuccessModal";

export default function FeedbackPage() {
  const [form, setForm] = useState({
    name: "",
    gender: "male",
    topic: "",
    message: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const topics = [
    "Техническая проблема",
    "Вопрос по жителям",
    "Предложение",
    "Ошибка в данных",
    "Другое"
  ];

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: null }); 
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Введите имя";
    if (!form.message.trim()) newErrors.message = "Введите сообщение";

    if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Введите корректный телефон";
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailValid) newErrors.email = "Введите корректный email";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Отправлено:", form);
    setModalMessage("Ваше сообщение отправлено!");
    setModalOpen(true);

    setForm({
      name: "",
      gender: "male",
      topic: "",
      message: "",
      phone: "",
      email: "",
    });

    setErrors({});
  };

  return (
    <div className="feedback">
      <h2 className="feedback__title">Форма обратной связи</h2>

      <form className="feedback__form" onSubmit={handleSubmit}>
        
        <div className="feedback__field feedback__field--float">
          <input
            type="text"
            className={`feedback__input ${errors.name ? "feedback__input--error" : ""}`}
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder=" "
          />
          <label className="feedback__label-floating">Ваше имя</label>
        </div>

        <div className="feedback__field">
          <label className="feedback__label">Пол</label>

          <div className="feedback__radio-group">
            <label className="feedback__radio-item">
              <input
                type="radio"
                value="male"
                checked={form.gender === "male"}
                onChange={() => handleChange("gender", "male")}
              />
              Мужской
            </label>

            <label className="feedback__radio-item">
              <input
                type="radio"
                value="female"
                checked={form.gender === "female"}
                onChange={() => handleChange("gender", "female")}
              />
              Женский
            </label>
          </div>
        </div>

        <div className="feedback__field">
          <label className="feedback__label">Тема обращения</label>
          <select
            value={form.topic}
            onChange={(e) => handleChange("topic", e.target.value)}
            className="feedback__select"
            required
          >
            <option value="">Выберите тему…</option>
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="feedback__field feedback__field--float">
          <textarea
            className={`feedback__textarea ${errors.message ? "feedback__input--error" : ""}`}
            value={form.message}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder=" "
          ></textarea>
          <label className="feedback__label-floating">Ваш вопрос</label>
        </div>

        <div className="feedback__field feedback__field--float">
          <PatternFormat
            format="+7 (###) ###-##-##"
            mask="_"
            value={form.phone}
            onValueChange={(values) => handleChange("phone", values.value)}
            className={`feedback__input ${errors.phone ? "feedback__input--error" : ""}`}
            placeholder=" "
          />
          <label className="feedback__label-floating">Телефон</label>
        </div>

        <div className="feedback__field feedback__field--float">
          <input
            type="email"
            className={`feedback__input ${errors.email ? "feedback__input--error" : ""}`}
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder=" "
          />
          <label className="feedback__label-floating">Email</label>
        </div>

        <button type="submit" className="feedback__button">
          Отправить
        </button>
      </form>
      <SuccessModal
        open={modalOpen}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
