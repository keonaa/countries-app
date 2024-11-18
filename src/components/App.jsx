import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import Countries from "./Countries";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [continent, setContinent] = useState("All");
  const [subregion, setSubregion] = useState("All");
  const [sortAlpha, setSortAlpha] = useState(false);
  const [top10Selection, setTop10Selection] = useState("");
  const [subregions, setSubregions] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        setCountries(response.data);
        setFilteredCountries(response.data);

        const uniqueSubregions = [
          ...new Set(
            response.data
              .map((country) => country.subregion)
              .filter((subregion) => subregion)
          ),
        ];
        setSubregions(uniqueSubregions.sort());
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  const filterAndSort = () => {
    let filtered = [...countries];

    if (continent !== "All") {
      filtered = filtered.filter(
        (country) =>
          country.continents && country.continents.includes(continent)
      );
    }

    if (subregion !== "All") {
      filtered = filtered.filter(
        (country) => country.subregion && country.subregion === subregion
      );
    }

    if (top10Selection) {
      filtered.sort((a, b) => {
        if (top10Selection === "population") return b.population - a.population;
        if (top10Selection === "area") return b.area - a.area;
        return 0;
      });
      filtered = filtered.slice(0, 10);
    }

    if (sortAlpha) {
      filtered.sort((a, b) => a.name.common.localeCompare(b.name.common));
    }

    setFilteredCountries(filtered);
  };

  useEffect(() => {
    filterAndSort();
  }, [continent, subregion, sortAlpha, top10Selection]);

  return (
    <div className="app-container">
      <h1>Countries of the World</h1>
      <div className="filter-sort">
        <div className="filter-box">
          <label>
            Alphabetical (A-Z):
            <input
              type="checkbox"
              checked={sortAlpha}
              onChange={() => setSortAlpha(!sortAlpha)}
            />
          </label>
        </div>
        <div className="filter-box">
          <label>
            <span>Top 10:</span>
            <select
              onChange={(e) => setTop10Selection(e.target.value)}
              value={top10Selection}
            >
              <option value="">None</option>
              <option value="population">By Population</option>
              <option value="area">By Area</option>
            </select>
          </label>
        </div>
        <div className="filter-box">
          <label>
            <span>By continent:</span>
            <select onChange={(e) => setContinent(e.target.value)}>
              <option value="All">All</option>
              <option value="Africa">Africa</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
              <option value="Americas">Americas</option>
            </select>
          </label>
        </div>
        <div className="filter-box">
          <label>
            <span>By subregion:</span>
            <select onChange={(e) => setSubregion(e.target.value)}>
              <option value="All">Choose region</option>
              {subregions.map((subregion) => (
                <option key={subregion} value={subregion}>
                  {subregion}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <Countries countries={filteredCountries} />
    </div>
  );
};

export default App;
