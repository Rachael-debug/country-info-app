import { useState, useEffect } from 'react'
import './App.css'
import { ModeToggle } from './components/mode-toggle'
import {
  Card,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  
  
  const totalPages = Math.ceil(countriesToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCountries = countriesToDisplay.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


  if (loading) return <p>Loading countries...</p>;

  return (
    <>
      <div className='flex items-center justify-between mx-auto'>
        <h1 className='text-4xl font-extrabold tracking-tight text-balance'>
          Country Info App
        </h1>
        <ModeToggle/>
      </div>
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
            <CardTitle className="text-2xl font-bold text-center mx-1 text-purple-900 dark:text-purple-300">{country.name.official}</CardTitle>
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
            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.max(p - 1, 1));
                }}
              />
            </PaginationItem>

            {/* Always show first page */}
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={currentPage === 1}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>

            {/* Show ellipsis if currentPage > 3 */}
            {currentPage > 3 && (
              <PaginationItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <PaginationEllipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => page < currentPage - 1 && page !== 1) // only hidden left-side pages
                      .map((page) => (
                        <DropdownMenuItem
                          key={page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </PaginationItem>
            )}

            {/* Show pages around currentPage */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page !== 1 &&
                  page !== totalPages &&
                  Math.abs(page - currentPage) <= 1 // show one before & after current
              )
              .map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

            {/* Show ellipsis if currentPage < totalPages - 2 */}
            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <PaginationEllipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => page > currentPage + 1 && page !== totalPages) // only hidden right-side pages
                      .map((page) => (
                        <DropdownMenuItem
                          key={page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </PaginationItem>
            )}

            {/* Always show last page (if more than 1 page) */}
            {totalPages > 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={currentPage === totalPages}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(totalPages);
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Next */}
            <PaginationItem>
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
