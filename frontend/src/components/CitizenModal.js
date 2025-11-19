import React, { useState, useEffect } from "react";
import "../styles/modal.css";

export default function CitizenModal({ citizen, onClose, onSelectCitizen }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (citizen) setClosing(false);
  }, [citizen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 250); 
  };

  if (!citizen) return null;

  return (
    <div className={`modal ${closing ? "fade-out" : ""}`} onClick={handleClose}>
      <div
        className={`modal__window ${closing ? "fade-out" : "fade-in"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`modal__avatar ${closing ? "fade-out-avatar" : "fade-in-avatar"}`}>
          
        </div>

        <h2 className="modal__title">
          {citizen.last_name} {citizen.first_name} {citizen.middle_name}
        </h2>

        <div className="modal__content">
          <p className="modal__row"><strong>Пол:</strong> {citizen.gender === "male" ? "Мужской" : "Женский"}</p>
          <p className="modal__row"><strong>Дата рождения:</strong> {new Date(citizen.birth_date).toLocaleDateString()}</p>
          <p className="modal__row"><strong>Телефон:</strong> {citizen.phone}</p>
          <p className="modal__row"><strong>Email:</strong> {citizen.email}</p>
          <p className="modal__row"><strong>Семейное положение:</strong> {citizen.marital_status === "married" ? "Женат / Замужем" : "Не женат / Не замужем"}</p>

          {citizen.company && <p className="modal__row"><strong>Компания:</strong> {citizen.company}</p>}
          {citizen.school && <p className="modal__row"><strong>Школа:</strong> {citizen.school}</p>}
          {citizen.university && <p className="modal__row"><strong>ВУЗ:</strong> {citizen.university}</p>}
          {citizen.district && <p className="modal__row"><strong>Район:</strong> {citizen.district}</p>}

          {citizen.relatives?.length > 0 && (
            <div className="modal__relatives">
              <strong>Родственники:</strong>
              <ul className="modal__relatives-list">
                {citizen.relatives.map((rel) => (
                  <li key={rel.id} className="modal__relatives-item">
                    <button
                      onClick={() => onSelectCitizen(rel.id)}
                      className="modal__relatives-link"
                    >
                      {rel.last_name} {rel.first_name} {rel.middle_name} ({rel.relation})
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button className="modal__close" onClick={handleClose}>Закрыть</button>
      </div>
    </div>
  );
}
