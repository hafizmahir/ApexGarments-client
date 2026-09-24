import React, { useState, useEffect } from 'react';
import { ProductCategory } from '../../../types/index.ts';
import { useAuth } from '../../../context/AuthContext.tsx';
import { useToast } from '../../../context/ToastContext.tsx';
import { PlusCircle, Image, Video, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

interface AddProductProps {
  navigate: (path: string) => void;
}

export const AddProduct: React.FC<AddProductProps> = ({ navigate }) => {
  const { user, isSuspended } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Shirt');
  const [price, setPrice] = useState<number>(18.5);
  const [availableQuantity, setAvailableQuantity] = useState<number>(3000);
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState<number>(200);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600'
  );
  const [demoVideoLink, setDemoVideoLink] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [paymentOptions, setPaymentOptions] = useState<'Cash on Delivery' | 'PayFirst'>('PayFirst');
  const [showOnHome, setShowOnHome] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Register New Garment Line - ApexGarments Manager';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Challenge point 4: If manager is suspended, cannot add new products
    if (isSuspended) {
      showToast(
        'Action Forbidden: Your manager account is suspended. Check Profile for feedback.',
        'error'
      );
      return;
    }

    if (!name.trim() || !description.trim()) {
      showToast('Product name and description are required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('apex_token')}`
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          category,
          price: Number(price),
          availableQuantity: Number(availableQuantity),
          minimumOrderQuantity: Number(minimumOrderQuantity),
          images: [imageUrl],
          demoVideoLink,
          paymentOptions,
          showOnHome
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('🎉 New garment product added to factory inventory!', 'success');
        navigate('/dashboard/manage-products');
      } else {
        showToast(data.message || 'Failed to create product.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error submitting product.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-indigo-600" />
          <span>Register New Apparel Production Line</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Catalog certified export apparel items with pricing, MOQ, video demo, and payment terms.
        </p>
      </div>

      {/* Challenge Point 4: Suspension Banner for Manager */}
      {isSuspended && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div>
            <p className="font-bold text-sm">Manager Privileges Suspended by Administrator</p>
            <p className="mt-1">
              {user?.suspendReason ||
                'Your manager credentials have been suspended. Adding new products or approving orders is temporarily disabled.'}
            </p>
            <button
              onClick={() => navigate('/dashboard/profile')}
              className="mt-2 font-bold underline cursor-pointer"
            >
              View Admin Suspension Feedback on Profile →
            </button>
          </div>
        </div>
      )}

      {/* Add Product Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 text-xs">
          {/* Product Name */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Garment / Style Name *
            </label>
            <input
              type="text"
              required
              disabled={isSuspended}
              placeholder="E.g. Oxford Organic Cotton Button-Down Shirt"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Technical Description & Fabric Specs *
            </label>
            <textarea
              rows={3}
              required
              disabled={isSuspended}
              placeholder="Provide yarn count, GSM, weave type, wash specifications, and pre-shrinkage testing..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50"
            />
          </div>

          {/* Category, Price, Stock, MOQ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                disabled={isSuspended}
                value={category}
                onChange={e => setCategory(e.target.value as ProductCategory)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium disabled:opacity-50"
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

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                FOB Price ($/pc) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                disabled={isSuspended}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Available Stock (Pcs) *
              </label>
              <input
                type="number"
                required
                disabled={isSuspended}
                value={availableQuantity}
                onChange={e => setAvailableQuantity(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Minimum Order (MOQ) *
              </label>
              <input
                type="number"
                required
                disabled={isSuspended}
                value={minimumOrderQuantity}
                onChange={e => setMinimumOrderQuantity(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Payment Options (Cash on Delivery / PayFirst) & Show On Home (default false) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Option Required *
              </label>
              <select
                disabled={isSuspended}
                value={paymentOptions}
                onChange={e => setPaymentOptions(e.target.value as any)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold disabled:opacity-50"
              >
                <option value="PayFirst">PayFirst (Online Escrow Authorization)</option>
                <option value="Cash on Delivery">Cash on Delivery (On Container Arrival)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Home Page Showcase
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                <input
                  type="checkbox"
                  id="showOnHome"
                  disabled={isSuspended}
                  checked={showOnHome}
                  onChange={e => setShowOnHome(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer disabled:opacity-50"
                />
                <label htmlFor="showOnHome" className="text-slate-700 dark:text-slate-300 cursor-pointer">
                  Showcase on Home Landing (Default: false)
                </label>
              </div>
            </div>
          </div>

          {/* Media Links & Live Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-indigo-500" />
                <span>Primary Garment Image URL *</span>
              </label>
              <input
                type="url"
                required
                disabled={isSuspended}
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-rose-500" />
                <span>Demo Video Link (YouTube / MP4)</span>
              </label>
              <input
                type="url"
                disabled={isSuspended}
                value={demoVideoLink}
                onChange={e => setDemoVideoLink(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Image Live Preview */}
          {imageUrl && (
            <div className="pt-2">
              <span className="block font-semibold text-slate-500 mb-2">Live Image Preview:</span>
              <div className="w-36 h-36 rounded-xl overflow-hidden border-2 border-indigo-500/30 shadow-md bg-slate-100 dark:bg-slate-800">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLElement).setAttribute(
                      'src',
                      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600'
                    );
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/manage-products')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSuspended || isSubmitting}
            className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 rounded-xl disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Registering Product...' : 'Publish Product to Catalog'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
