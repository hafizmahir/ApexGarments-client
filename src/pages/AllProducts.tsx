import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../types/index.ts';
import { Search, Filter, ArrowRight, ArrowUpDown, ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { getProducts } from '../services/apiClient.ts';

interface AllProductsProps {
  navigate: (path: string) => void;
}

export const AllProducts: React.FC<AllProductsProps> = ({ navigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const categories: (ProductCategory | 'all')[] = [
    'all',
    'Shirt',
    'Pant',
    'Jacket',
    'Denim',
    'Knitwear',
    'Accessories',
    'Activewear'
  ];

  const fetchProducts = async (targetPage = 1) => {
    setIsLoading(true);
    try {
      const data = await getProducts({
        search: search.trim(),
        category: selectedCategory,
        sortBy,
        page: targetPage,
        limit: 9
      });
      if (data.success) {
        setProducts(data.products || []);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'All Products & Apparel Lines - ApexGarments';
    fetchProducts(1);
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Page Description */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Factory Garment Catalog
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          Browse certified production lines available for buyer booking. All items adhere to AQL 1.5 export quality with complete lot traceability.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, fabric or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 pr-20 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <span className="text-slate-400 flex items-center gap-1 mr-1 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Lines' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid (3-column layout) */}
      {isLoading ? (
        <LoadingSpinner label="Fetching factory products..." size="lg" />
      ) : products.length === 0 ? (
        <div className="text-center py-16 space-y-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <PackageSearch className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Products Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No garment items match your filter criteria. Try resetting the search or selecting another category.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              fetchProducts(1);
            }}
            className="px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <div
              key={product.id}
              className="flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={product.images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border border-slate-200/50 dark:border-slate-700/50">
                  {product.category}
                </div>
                <div className="absolute top-3 right-3 bg-indigo-600 text-white px-2.5 py-1 rounded-md text-xs font-extrabold shadow-md">
                  ${product.price.toFixed(2)} / pc
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>
                      Available: <strong className="text-slate-900 dark:text-slate-200">{(product.availableQuantity || 0).toLocaleString()}</strong> pcs
                    </span>
                    <span>
                      MOQ: <strong className="text-slate-900 dark:text-slate-200">{product.minimumOrderQuantity}</strong> pcs
                    </span>
                  </div>

                  {/* "View Details" Button (Requirement: redirects to product details page) */}
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 text-xs">
          <p className="text-slate-500">
            Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total products)
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => fetchProducts(page - 1)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchProducts(i + 1)}
                className={`w-8 h-8 rounded-lg font-bold transition-colors ${
                  page === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page >= totalPages}
              onClick={() => fetchProducts(page + 1)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
