import React, { useState, useEffect, useMemo } from 'react';
import { getProducts } from '../services/productService';
import PerfumeCard from '../components/PerfumeCard';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import PerfumeDetailModal from '../components/PerfumeDetailModal';

const sortOptions = [
  { name: 'Relevancia', value: 'relevance' },
  { name: 'Precio: Bajo a Alto', value: 'price-asc' },
  { name: 'Precio: Alto a Bajo', value: 'price-desc' },
  { name: 'Alfabéticamente, A-Z', value: 'alpha-asc' },
  { name: 'Alfabéticamente, Z-A', value: 'alpha-desc' },
];

const CatalogoPage = ({ gender, title }) => {
  const [allPerfumes, setAllPerfumes] = useState([]);
  const [availableFamilies, setAvailableFamilies] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedPerfume, setSelectedPerfume] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getProducts({
            gender,
            page: 1,
            limit: 1000,
            search: searchTerm,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
          });
          setAllPerfumes(data.products || []);

          if (!searchTerm) {
            const allTags = (data.products || []).flatMap(perfume => perfume.tags || []).filter(tag => tag && typeof tag === 'string');
            const uniqueTags = [...new Set(allTags)].sort((a, b) => a.localeCompare(b));
            setAvailableFamilies(uniqueTags);
          }
        } catch (err) {
          console.error(`Error fetching ${gender} products:`, err);
          setError(`No se pudieron cargar los productos. Inténtalo de nuevo más tarde.`);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProducts();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [gender, searchTerm]);

  const handleFamilyChange = (family) => {
    setSelectedFamilies(prev =>
      prev.includes(family) ? prev.filter(f => f !== family) : [...prev, family]
    );
  };

  const filteredAndSortedPerfumes = useMemo(() => {
    let filtered = [...allPerfumes];

    // La búsqueda por nombre ahora se realiza en el servidor.

    // 2. Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // 3. Filter by fragrance family (AND logic)
    if (selectedFamilies.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.tags || !Array.isArray(p.tags)) return false; // Ensure tags exist and is an array
        return selectedFamilies.every(fam => p.tags.includes(fam));
      });
    }

    // 4. Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'alpha-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alpha-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default: // 'relevance'
        break;
    }

    return filtered;
  }, [allPerfumes, priceRange, selectedFamilies, sortBy]);

  return (
    <div className="bg-gray-50 min-h-screen animate-fadeIn">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">Explora nuestra colección exclusiva de fragancias.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4 xl:w-1/5">
            <div className="sticky top-24 space-y-8">
              {/* Search Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Buscar por Nombre</h3>
                <input
                  type="text"
                  placeholder="Escribe un nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold transition"
                />
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rango de Precio</h3>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">$</span>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    aria-label="Precio mínimo"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    aria-label="Precio máximo"
                  />
                </div>
              </div>

              {/* Fragrance Family Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Familia Olfativa</h3>
                <div className="space-y-2">
                  {availableFamilies.map(family => (
                    <label key={family} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFamilies.includes(family)}
                        onChange={() => handleFamilyChange(family)}
                        className="h-5 w-5 rounded border-gray-300 text-gold focus:ring-gold"
                      />
                      <span className="text-gray-700">{family}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">
                {filteredAndSortedPerfumes.length} {filteredAndSortedPerfumes.length === 1 ? 'resultado' : 'resultados'}
              </p>
              
              {/* Sort Dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Ordenar por: {sortOptions.find(o => o.value === sortBy)?.name}
                  <ChevronDownIcon className="h-5 w-5" />
                </Menu.Button>
                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      {sortOptions.map(option => (
                        <Menu.Item key={option.value}>
                          {({ active }) => (
                            <button
                              onClick={() => setSortBy(option.value)}
                              className={`${active ? 'bg-gray-100' : ''} ${sortBy === option.value ? 'font-bold text-gold' : ''} block w-full text-left px-4 py-2 text-sm text-gray-700`}
                            >
                              {option.name}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>

            {isLoading ? (
              <div className="text-center py-20">
                <p>Cargando fragancias...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">
                <p>{error}</p>
              </div>
            ) : filteredAndSortedPerfumes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredAndSortedPerfumes.map(product => (
                  <PerfumeCard key={product._id} perfume={product} onCardClick={() => setSelectedPerfume(product)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-2xl font-semibold text-gray-800">No se encontraron fragancias</h3>
                <p className="mt-2 text-gray-500">Intenta ajustar tus filtros para encontrar lo que buscas.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Render the modal conditionally */}
      <PerfumeDetailModal perfume={selectedPerfume} onClose={() => setSelectedPerfume(null)} />
    </div>
  );
};

export default CatalogoPage;
