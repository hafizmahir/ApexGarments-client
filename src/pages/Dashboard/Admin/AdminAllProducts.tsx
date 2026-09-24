import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../../../types/index.ts';
import { useToast } from '../../../context/ToastContext.tsx';
import { LoadingSpinner } from '../../../components/LoadingSpinner.tsx';
import { Modal } from '../../../components/Modal.tsx';
import {
  Package,
  Search,
  Edit,
  Trash2,
  CheckSquare,
  Square,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const AdminAllProducts: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Edit Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editCategory, setEditCategory] = useState<ProductCategory>('Shirt');
  const [editAvailableQty, setEditAvailableQty] = useState(0);
  const [editMoq, setEditMoq] = useState(0);
  const [editDesc, setEditDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirmation Modal State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async (targetPage = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      params.append('page', String(targetPage));
      params.append('limit', '8');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
        setTotalProducts(data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'All Products Management - ApexGarments Admin';
    fetchProducts(1);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1);
  };

  // Toggle Show On Home Checkbox (Requirement: Admin can select/unselect which products appear on Home page)
  const handleToggleShowOnHome = async (product: Product) => {
    const nextVal = !product.showOnHome;
    // Optimistic UI update
    setProducts(prev =>
      prev.map(p => (p.id === product.id ? { ...p, showOnHome: nextVal } : p))
    );

    try {
      const res = await fetch(`/api/admin/products/${product.id}/toggle-home`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('apex_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          nextVal
            ? `"${product.name}" is now featured on the Home landing page.`
            : `"${product.name}" removed from Home page.`,
          'success'
        );
      } else {
        showToast(data.message || 'Failed to toggle Home visibility.', 'error');
        fetchProducts(page);
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating product.', 'error');
      fetchProducts(page);
    }
  };

  const handleOpenEdit = (p: Product) => {
    setSelectedProduct(p);
    setEditName(p.name);
    setEditPrice(p.price);
    setEditCategory(p.category);
    setEditAvailableQty(p.availableQuantity);
    setEditMoq(p.minimumOrderQuantity);
    setEditDesc(p.description);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('apex_token')}`
        },
        body: JSON.stringify({
          name: editName,
          price: Number(editPrice),
          category: editCategory,
          availableQuantity: Number(editAvailableQty),
          minimumOrderQuantity: Number(editMoq),
          description: editDesc
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('Product specifications updated successfully!', 'success');
        setIsEditModalOpen(false);
        fetchProducts(page);
      } else {
        showToast(data.message || 'Failed to update product.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Server error saving product.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('apex_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Product successfully deleted from factory inventory.', 'success');
        setProductToDelete(null);
        fetchProducts(page);
      } else {
        showToast(data.message || 'Failed to delete product.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Server error deleting product.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            <span>All Products & Catalog Governance</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit factory lines, customize home landing showcases, and manage item details.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 self-start sm:self-auto">
          {totalProducts} Registered Products
        </div>
      </div>

      {/* Search Filter */}
      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        <form onSubmit={handleSearchSubmit} className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-16 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold rounded bg-indigo-600 text-white cursor-pointer"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Table: | Image | Product Name | Price | Category | Created By | Show on Home | Actions | */}
      {isLoading ? (
        <LoadingSpinner label="Loading products table..." />
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-xs">No products found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Created By</th>
                <th className="py-3 px-4 text-center">Show on Home</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Image */}
                  <td className="py-3 px-4">
                    <img
                      src={p.images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=150'}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                    />
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{p.name}</span>
                    <span className="text-[10px] text-slate-400">Stock: {p.availableQuantity} | MOQ: {p.minimumOrderQuantity}</span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    ${p.price.toFixed(2)}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      {p.category}
                    </span>
                  </td>

                  {/* Created By */}
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {p.createdBy?.name || 'Manager Desk'}
                  </td>

                  {/* Show on Home Checkbox (Requirement: Admin can select/unselect) */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleShowOnHome(p)}
                      title={p.showOnHome ? 'Click to remove from Home' : 'Click to showcase on Home'}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      {p.showOnHome ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 mx-auto" />
                      )}
                    </button>
                  </td>

                  {/* Actions (Update & Delete with confirmation modal) */}
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setProductToDelete(p)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs pt-2">
          <span className="text-slate-500">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => fetchProducts(page - 1)}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => fetchProducts(page + 1)}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && selectedProduct && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Garment: ${selectedProduct.name}`}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Price ($/pc) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editPrice}
                  onChange={e => setEditPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value as ProductCategory)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <option value="Shirt">Shirt</option>
                  <option value="Pant">Pant</option>
                  <option value="Jacket">Jacket</option>
                  <option value="Denim">Denim</option>
                  <option value="Knitwear">Knitwear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Activewear">Activewear</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Available Quantity *
                </label>
                <input
                  type="number"
                  required
                  value={editAvailableQty}
                  onChange={e => setEditAvailableQty(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Minimum Order (MOQ) *
                </label>
                <input
                  type="number"
                  required
                  value={editMoq}
                  onChange={e => setEditMoq(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description *
              </label>
              <textarea
                rows={3}
                required
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <Modal
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          title="Confirm Deletion"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl text-rose-800 dark:text-rose-300">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <p>
                Are you sure you want to permanently delete <strong>{productToDelete.name}</strong> from factory inventory?
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
