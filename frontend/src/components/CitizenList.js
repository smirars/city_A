import React, { useEffect, useState } from "react";
import { fetchCitizens } from "../api/citizens";

export default function CitizenList() {
  const [citizens, setCitizens] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await fetchCitizens();
      setCitizens(data);
    }
    load();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Список жителей города A</h1>
      <ul>
        {citizens.map((c) => (
          <li key={c.id}>
            {c.first_name} {c.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
