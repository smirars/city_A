import { useEffect, useState } from "react";
import CitizenModal from "./CitizenModal";
import CitizenSearchBar from "./CitizenSearchBar";
import "../styles/residents.css";

export default function CitizenList() {
  const [allCitizens, setAllCitizens] = useState([]); 
  const [citizens, setCitizens] = useState([]);       
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/citizens?limit=1000000`);
        const data = await res.json();
        if (!mounted) return;

        const prepared = data.map((c) => ({
          ...c,
          _fullNameLower: `${(c.first_name || "")} ${(c.last_name || "")}`.toLowerCase(),
        }));

        setAllCitizens(prepared);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch citizens", err);
        setLoading(false);
      }
    }
    fetchAll();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const s = (search || "").toLowerCase().trim();

    const filtered = allCitizens.filter((c) => {
      if (s) {
        if (!c._fullNameLower.includes(s)) return false;
      }

      if (filters.gender && filters.gender !== "all") {
        if ((c.gender || "") !== filters.gender) return false;
      }

      if (filters.marital_status && filters.marital_status !== "all") {
        if ((c.marital_status || "") !== filters.marital_status) return false;
      }

      if (filters.minAge) {
        const birthYear = c.birth_date ? new Date(c.birth_date).getFullYear() : null;
        if (birthYear) {
          const age = new Date().getFullYear() - birthYear;
          if (age < Number(filters.minAge)) return false;
        }
      }
      if (filters.maxAge) {
        const birthYear = c.birth_date ? new Date(c.birth_date).getFullYear() : null;
        if (birthYear) {
          const age = new Date().getFullYear() - birthYear;
          if (age > Number(filters.maxAge)) return false;
        }
      }

      if (filters.company) {
        if (c.company_id && String(c.company_id) === String(filters.company)) {
          // ok
        } else if (c.company && c.company !== filters.company) {
          return false;
        } else if (!c.company_id && !c.company) {
          return false;
        }
      }

      if (filters.school) {
        if (c.school_id && String(c.school_id) === String(filters.school)) {
        } else if (c.school && c.school !== filters.school) {
          return false;
        } else if (!c.school_id && !c.school) {
          return false;
        }
      }

      if (filters.university) {
        if (c.university_id && String(c.university_id) === String(filters.university)) {
        } else if (c.university && c.university !== filters.university) {
          return false;
        } else if (!c.university_id && !c.university) {
          return false;
        }
      }

      return true;
    });

    setCitizens(filtered);
  }, [allCitizens, search, filters]);

  const openCitizen = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/citizens/${id}`);
      const data = await res.json();
      setSelectedCitizen(data);
    } catch (err) {
      console.error("Failed to load citizen details", err);
    }
  };

  return (
    <div className="residents">
      <h2 className="residents__title">Жители города</h2>

      <CitizenSearchBar onSearch={setSearch} onFilterChange={setFilters} />

      <ul className="residents__list">
        {citizens.map((c) => (
          <li
            key={`citizen-${c.id}`}
            onClick={() => openCitizen(c.id)}
            className="residents__item"
          >
            {c.last_name} {c.first_name}
          </li>
        ))}
      </ul>

      {loading && <p className="residents__status">Загрузка...</p>}
      {!loading && citizens.length === 0 && <p className="residents__status">Ничего не найдено</p>}

      <CitizenModal
        citizen={selectedCitizen}
        onClose={() => setSelectedCitizen(null)}
        onSelectCitizen={openCitizen}
      />
    </div>
  );
}
