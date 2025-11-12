import { useEffect, useState, useRef, useCallback } from "react";

export default function CitizenList() {
  const [citizens, setCitizens] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  const loadCitizens = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const limit = 100;
    const offset = page * limit;

    try {
      const res = await fetch(`http://localhost:3001/citizens?limit=${limit}&offset=${offset}`);
      const data = await res.json();

      if (data.length < limit) setHasMore(false); // больше нечего грузить
      setCitizens((prev) => [...prev, ...data]); // добавляем, не перезаписываем
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to fetch citizens", err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // первый запрос
  useEffect(() => {
    loadCitizens();
  }, []);

  // IntersectionObserver для ленивой подгрузки
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) loadCitizens();
    });

    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loadCitizens]);

  return (
    <div style={{ height: "80vh", overflow: "auto", padding: "1rem" }}>
      <h2>Жители города</h2>
      <ul>
        {citizens.map((c) => (
          <li key={c.id}>
            {c.last_name} {c.first_name}
          </li>
        ))}
      </ul>

      {loading && <p>Загрузка...</p>}
      {!hasMore && <p>Все жители загружены</p>}

      {/* элемент-ловушка для подгрузки */}
      <div ref={loader} style={{ height: "20px" }}></div>
    </div>
  );
}
