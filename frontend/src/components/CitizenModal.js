import React from "react";

export default function CitizenModal({ citizen, onClose, onSelectCitizen }) {
  if (!citizen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          {citizen.last_name} {citizen.first_name} {citizen.middle_name}
        </h2>

        <div className="space-y-2 text-gray-700">
          <p><strong>Пол:</strong> {citizen.gender === "male" ? "Мужской" : "Женский"}</p>
          <p><strong>Дата рождения:</strong> {new Date(citizen.birth_date).toLocaleDateString()}</p>
          <p><strong>Телефон:</strong> {citizen.phone}</p>
          <p><strong>Email:</strong> {citizen.email}</p>
          <p><strong>Семейное положение:</strong> {citizen.marital_status === "married" ? "Женат / Замужем" : "Не женат / Не замужем"}</p>

          {citizen.company && <p><strong>Компания:</strong> {citizen.company}</p>}
          {citizen.school && <p><strong>Школа:</strong> {citizen.school}</p>}
          {citizen.university && <p><strong>ВУЗ:</strong> {citizen.university}</p>}
          {citizen.district && <p><strong>Район:</strong> {citizen.district}</p>}

          {citizen.relatives && citizen.relatives.length > 0 && (
            <div className="mt-4">
              <strong>Родственники:</strong>
              <ul className="mt-2 space-y-1">
                {citizen.relatives.map((rel) => (
                  <li key={rel.id}>
                    <button
                      onClick={() => onSelectCitizen(rel.id)}
                      className="text-blue-600 hover:underline"
                    >
                      {rel.last_name} {rel.first_name} {rel.middle_name} ({rel.relation})
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
