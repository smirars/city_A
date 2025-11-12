export async function fetchCitizens(offset = 0, limit = 100) {
  try {
    const res = await fetch(`http://localhost:3001/citizens?offset=${offset}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch citizens");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchStatistics() {
  try {
    const res = await fetch("http://localhost:3001/statistics");
    if (!res.ok) throw new Error("Failed to fetch statistics");
    return await res.json();
  } catch (err) {
    console.error(err);
    return {};
  }
}
