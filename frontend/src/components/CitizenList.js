import { useEffect, useState, useRef, useCallback } from "react";
import CitizenModal from "./CitizenModal";
import CitizenSearchBar from "./CitizenSearchBar";

export default function CitizenList() {
  const [citizens, setCitizens] = useState([]);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const loader = useRef(null);
  const pageRef = useRef(0);

  // 👇 Формируем query string для фильтров
  const buildQuery = () => {
    const params = new URLSearchParams({
      limit: 100,
      offset: pageRef.current * 100,
    });

    if (search) params.append("search", search);

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") params.append(key, value);
    });

    return params.toString();
  };

  const loadCitizens = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3001/citizens?${buildQuery()}`);
      const data = await res.json();

      if (data.length < 100) setHasMore(false);

      setCitizens((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newUnique = data.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newUnique];
      });

      pageRef.current += 1;
    } catch (err) {
      console.error("Failed to fetch citizens", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, search, filters]);

  // 👇 При изменении фильтров или строки поиска — сбрасываем пагинацию
  useEffect(() => {
    pageRef.current = 0;
    setCitizens([]);
    setHasMore(true);
    loadCitizens();
  }, [search, filters]);

  useEffect(() => {
    loadCitizens();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) loadCitizens();
    });
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loadCitizens]);

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
    <div className="p-4 overflow-y-auto h-[80vh]">
      <h2 className="text-2xl font-bold mb-4">Жители города</h2>

      <CitizenSearchBar
        onSearch={setSearch}
        onFilterChange={setFilters}
      />

      <ul className="space-y-1">
        {citizens.map((c) => (
          <li
            key={`citizen-${c.id}`}
            onClick={() => openCitizen(c.id)}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
          >
            {c.last_name} {c.first_name}
          </li>
        ))}
      </ul>

      {loading && <p>Загрузка...</p>}
      {!hasMore && !loading && citizens.length > 0 && <p>Все жители загружены</p>}
      {!loading && citizens.length === 0 && <p>Ничего не найдено</p>}
      <div ref={loader} style={{ height: "20px" }}></div>

      <CitizenModal
        citizen={selectedCitizen}
        onClose={() => setSelectedCitizen(null)}
        onSelectCitizen={openCitizen}
      />
    </div>
  );
}
