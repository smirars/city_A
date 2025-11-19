import { useState } from "react";
import { Filter, X } from "lucide-react";
import CitizenFilters from "./CitizenFilters";
import "../styles/SearchBar.css"

export default function CitizenSearchBar({ onSearch, onFilterChange }) {
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearch("");
    onSearch("");
  };

  return (
    <div className="searchbar">
      <div className="container">
        <div className="searchbar__input-wrapper floating-label">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            className={`searchbar__input ${search ? "has-value" : ""}`}
            required
          />
          <label className="searchbar__label">Поиск</label>

          {search !== "" && (
            <button className="searchbar__clear" onClick={clearSearch}>
              <X size={16} />
            </button>
          )}
        </div>

        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="searchbar__filter-btn"
        >
          <Filter size={18} />
        </button>
      </div>

      {filtersOpen && (
        <div className="searchbar__filters">
          <CitizenFilters onFilterChange={onFilterChange} />
        </div>
      )}
    </div>
  );
}
