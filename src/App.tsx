import { useState, useEffect } from 'react'
import './App.css'
import {
  Card,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"

type Country = {
  name: {official: string};
  languages: Record<string, string>;
  capital: string[];
  area: number;
  population: number;
  continents: string[];
  currencies?: Record<string, { name: string; symbol: string }>;
}

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?status=true&fields=languages,capital,area,population,continents,currencies,name');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCountries();
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.official.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const countriesToDisplay = searchTerm ? filteredCountries : countries;
  
  
  const totalPages = Math.ceil(countries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCountries = countriesToDisplay.slice(startIndex, startIndex + itemsPerPage);


  if (loading) return <p>Loading countries...</p>;

  return (
    <>
      <h1 className='text-center text-4xl font-extrabold tracking-tight text-balance'>Country Info App</h1>
      <div className='my-8 max-w-md mx-auto'>
        <Input
          type="search"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {currentCountries.map((country, index) => (
          <Card key={index}>
            <CardTitle className="text-2xl font-bold text-center mx-1 text-purple-900">{country.name.official}</CardTitle>
            <CardContent>
              <p><strong>Capital:</strong> {country.capital ? country.capital.join(', ') : 'N/A'}</p>
              <p><strong>Area Size:</strong> {country.area ? `${country.area.toLocaleString()} km²` : 'N/A'}</p>
              <p><strong>Population:</strong> {country.population ? country.population.toLocaleString() : 'N/A'}</p>
              <p><strong>Continent:</strong> {country.continents ? country.continents.join(', ') : 'N/A'}</p>
              <p><strong>Languages:</strong> {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
              <p><strong>Currencies:</strong> {country.currencies ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ') : 'N/A'}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem className='hover:bg-purple-100 rounded-md'>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.max(p - 1, 1));
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i} className='hover:bg-purple-100 rounded-md'>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem className='hover:bg-purple-100 rounded-md'>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.min(p + 1, totalPages));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  )
}

export default App
