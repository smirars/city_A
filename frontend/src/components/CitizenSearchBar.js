import { useState } from "react";
import { Filter } from "lucide-react";
import CitizenFilters from "./CitizenFilters";

export default function CitizenSearchBar({ onSearch, onFilterChange }) {
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  return (
    <div className="relative mb-4 flex items-center gap-2">
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Поиск по имени или фамилии..."
        className="border border-gray-300 rounded-md p-2 w-full"
      />
      <button
        onClick={() => setFiltersOpen((v) => !v)}
        className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
      >
        <Filter size={18} />
      </button>

      {filtersOpen && (
        <div className="absolute top-full right-0 bg-white shadow-lg rounded-md p-4 mt-2 w-[350px] z-10">
          <CitizenFilters onFilterChange={onFilterChange} />
        </div>
      )}
    </div>
  );
}
