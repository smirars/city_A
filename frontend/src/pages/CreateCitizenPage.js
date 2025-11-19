import { useState, useEffect } from "react";
import "../styles/CreateCitizenPage.css";
import { PatternFormat } from "react-number-format";
import SuccessModal from "../components/SuccessModal";

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

  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const [options, setOptions] = useState({
    companies: [],
    schools: [],
    universities: [],
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: false }));
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

  const validate = () => {
    const newErrors = {};

    ["first_name", "last_name", "phone", "email"].forEach(f => {
      if (!form[f].trim()) newErrors[f] = "required";
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    if (form.email && !emailRegex.test(form.email)) {
      newErrors.email = "invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createCitizen = async () => {
    if (!validate()) return;

    const res = await fetch("http://localhost:3001/citizens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.error) {
      setModalMessage("Ошибка: " + data.error);
      setModalOpen(true);
    } else {
      setModalMessage("Житель успешно создан!");
      setModalOpen(true);
      setForm({
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
      })
    }
  };

  return (
    <div className="create">
      <h2 className="create__title">Создать нового жителя</h2>

      <div className="create__form">

        <div className={`create__field ${errors.first_name ? "create__field--error" : ""}`}>
          <input
            className="create__input"
            value={form.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
            required
            placeholder=" "
          />
          <label className="create__label-floating">Имя *</label>
        </div>

        <div className={`create__field ${errors.last_name ? "create__field--error" : ""}`}>
          <input
            className="create__input"
            value={form.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
            required
            placeholder=" "
          />
          <label className="create__label-floating">Фамилия *</label>
        </div>

        <div className="create__field">
          <input
            className="create__input"
            value={form.middle_name}
            onChange={(e) => handleChange("middle_name", e.target.value)}
            placeholder=" "
          />
          <label className="create__label-floating">Отчество</label>
        </div>

        <div className="create__field">
          <input
            type="date"
            className="create__input create__input--date"
            value={form.birth_date}
            onChange={(e) => handleChange("birth_date", e.target.value)}
            max={today}
          />
          <label className="create__label-floating create__label-floating--active">Дата рождения</label>
        </div>

       <div className={`create__field ${errors.phone ? "create__field--error" : ""}`}>
          <PatternFormat
            format="+7 (###) ###-##-##"
            mask="_"
            value={form.phone}
            onValueChange={(values) => handleChange("phone", values.value)}
            className={`create__input ${errors.phone ? "create__input--error" : ""}`}
            placeholder=" "
          />
          <label className="create__label-floating">Телефон *</label>
        </div>


        <div className={`create__field ${errors.email ? "create__field--error" : ""}`}>
          <input
            className="create__input"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            placeholder=" "
          />
          <label className="create__label-floating">Email *</label>
        </div>

        <div className="create__field-block">
          <span className="create__label">Пол:</span>
          <div className="create__radio-group">

            <label className="create__radio-item">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={form.gender === "male"}
                onChange={() => handleChange("gender", "male")}
                className="create__radio"
              />
              <span className="create__radio-label">Мужской</span>
            </label>

            <label className="create__radio-item">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={form.gender === "female"}
                onChange={() => handleChange("gender", "female")}
                className="create__radio"
              />
              <span className="create__radio-label">Женский</span>
            </label>

          </div>
        </div>

        {[
          { label: "Семейное положение", field: "marital_status", options: [
            { value: "single", text: "Не женат / Не замужем" },
            { value: "married", text: "Женат / Замужем" }
          ]},
          { label: "Компания", field: "company_id", options: options.companies },
          { label: "Школа", field: "school_id", options: options.schools },
          { label: "Вуз", field: "university_id", options: options.universities },
        ].map(({ label, field, options }) => (
          <div className="create__field-block" key={field}>
            <span className="create__label">{label}:</span>

            <select
              className="create__select"
              value={form[field]}
              onChange={(e) => handleChange(field, e.target.value)}
            >
              <option value="">Нет</option>

              {options.map((o) => (
                <option
                  key={o.id ?? o.value}      
                  value={o.id ?? o.value}   
                >
                  {o.name ?? o.text}          
                </option>
              ))}
            </select>
          </div>
        ))}


        <button onClick={createCitizen} className="create__submit">
          Создать жителя
        </button>
      </div>
      <SuccessModal
        open={modalOpen}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
      />

    </div>
  );
}
