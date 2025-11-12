export async function fetchCitizens() {
  try {
    const res = await fetch("http://localhost:3001/citizens");
    if (!res.ok) throw new Error("Failed to fetch citizens");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
