import React, { useState, useEffect } from 'react';
import { Product } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { Modal } from '../components/Modal.tsx';
import { getProductById, submitOrder } from '../services/apiClient.ts';
import {
  ShieldAlert,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  Video,
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  Lock
} from 'lucide-react';

interface ProductDetailsProps {
  productId: string;
  navigate: (path: string) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, navigate }) => {
  const { user, isAuthenticated, isBuyer, isAdmin, isManager, isSuspended } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Booking Modal & Form state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || 'Buyer');
  const [orderQuantity, setOrderQuantity] = useState<number>(100);
  const [contactNumber, setContactNumber] = useState('+1 (555) 234-5678');
  const [deliveryAddress, setDeliveryAddress] = useState('Central Warehouse Port 4, Bay Logistics Hub');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Payment simulation state for PayFirst
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('889');

  useEffect(() => {
    if (user && !firstName) {
      setFirstName(user.name?.split(' ')[0] || '');
      setLastName(user.name?.split(' ').slice(1).join(' ') || 'Buyer');
    }
  }, [user]);

  useEffect(() => {
    // If not authenticated, prompt or redirect
    if (!isAuthenticated) {
      // Store redirect target
      sessionStorage.setItem('apex_redirect_target', `/product/${productId}`);
      navigate('/login');
      return;
    }

    const fetchProduct = async () => {
      try {
        const prod = await getProductById(productId);
        if (prod) {
          setProduct(prod);
          setOrderQuantity(prod.minimumOrderQuantity || 100);
          document.title = `${prod.name} - ApexGarments`;
        } else {
          showToast('Product not found', 'error');
          navigate('/all-products');
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, isAuthenticated]);

  if (isLoading || !product) {
    return <LoadingSpinner label="Loading technical product specification..." size="lg" fullScreen />;
  }

  // Live order price calculation
  const calculatedTotal = Number((orderQuantity * product.price).toFixed(2));
  const isQuantityValid =
    orderQuantity >= product.minimumOrderQuantity && orderQuantity <= product.availableQuantity;

  const handleOpenBooking = () => {
    if (!isBuyer) {
      showToast('Only buyer accounts can place manufacturing orders.', 'warning');
      return;
    }
    if (isSuspended) {
      showToast(
        'Account Suspended: You cannot place new orders. Check your Profile page for admin feedback.',
        'error'
      );
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleInitialOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isQuantityValid) {
      showToast(
        `Quantity must be between MOQ (${product.minimumOrderQuantity}) and available stock (${product.availableQuantity}).`,
        'error'
      );
      return;
    }

    // Check if PayFirst requires online payment step
    if (product.paymentOptions === 'PayFirst') {
      setShowPaymentStep(true);
    } else {
      executeOrderPlacement(false);
    }
  };

  const executeOrderPlacement = async (isOnlinePaid: boolean) => {
    setIsSubmittingOrder(true);
    try {
      const data = await submitOrder({
        productId: product.id,
        orderQuantity,
        firstName,
        lastName,
        contactNumber,
        deliveryAddress,
        additionalNotes,
        paymentOption: product.paymentOptions,
        isOnlinePaid
      });

      if (data.success) {
        showToast('🎉 Order placed successfully! Tracking is now active.', 'success');
        setIsBookingModalOpen(false);
        setShowPaymentStep(false);
        navigate('/dashboard/my-orders');
      } else {
        showToast(data.message || 'Failed to place order.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error communicating with ERP server.', 'error');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/all-products')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Products</span>
      </button>

      {/* Main Product Specification Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Gallery & Video Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md aspect-4/3">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {product.demoVideoLink && (
              <button
                onClick={() => setShowVideoModal(true)}
                className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 hover:bg-indigo-600 transition-colors shadow-lg"
              >
                <Video className="w-4 h-4 text-rose-500" />
                <span>Watch Video Demo</span>
              </button>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Booking Action Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {product.category}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Certified Lot
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-slate-500">/ piece (FOB Port)</span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Technical Specification Matrix */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Available Stock:</span>
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                  {((product.availableQuantity) || 0).toLocaleString()} pieces
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Minimum Order Quantity (MOQ):</span>
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                  {product.minimumOrderQuantity} pieces
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Option:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  {product.paymentOptions === 'PayFirst' ? (
                    <CreditCard className="w-3.5 h-3.5" />
                  ) : (
                    <Truck className="w-3.5 h-3.5" />
                  )}
                  {product.paymentOptions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registered By Manager:</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {product.createdBy?.name || 'Factory Head'}
                </span>
              </div>
            </div>
          </div>

          {/* Action / Booking Area */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            {/* Suspended Alert */}
            {isBuyer && isSuspended && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <div>
                  <p className="font-bold">Account Suspended by Admin</p>
                  <p className="mt-0.5">
                    {user?.suspendReason || 'New booking privileges are restricted on your account.'}
                  </p>
                  <p className="mt-1 text-[11px] underline cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
                    View Admin Feedback in Profile →
                  </p>
                </div>
              </div>
            )}

            {/* Non-Buyer Notice */}
            {(isAdmin || isManager) && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  Logged in as <strong>{user?.role?.toUpperCase()}</strong>. Booking is exclusive to Buyer accounts.
                </span>
              </div>
            )}

            {/* Order / Booking Button */}
            <button
              onClick={handleOpenBooking}
              disabled={!isBuyer || isSuspended}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                isBuyer && !isSuspended
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              {isBuyer && !isSuspended ? (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Place Order / Booking</span>
                </>
              ) : isSuspended ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Booking Suspended</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Buyer Role Required to Book</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400">
              Instant ERP confirmation. Production floor line booking allocated upon manager approval.
            </p>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <Modal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          title={`Demo Video: ${product.name}`}
          maxWidth="max-w-2xl"
        >
          <div className="aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
            {product.demoVideoLink && product.demoVideoLink.includes('youtube.com') ? (
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Garment Production Demo"
                allowFullScreen
              />
            ) : product.demoVideoLink ? (
              <video controls autoPlay className="w-full h-full object-cover">
                <source src={product.demoVideoLink} type="video/mp4" />
                Your browser does not support HTML video.
              </video>
            ) : (
              <div className="text-white text-xs">No video demo available for this garment.</div>
            )}
          </div>
        </Modal>
      )}

      {/* BOOKING FORM MODAL */}
      {isBookingModalOpen && (
        <Modal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setShowPaymentStep(false);
          }}
          title={showPaymentStep ? 'Payment Verification (PayFirst)' : 'Apparel Booking / Purchase Order'}
          subtitle={
            showPaymentStep
              ? `Processing total: $${((calculatedTotal) || 0).toLocaleString()}`
              : `Product: ${product.name}`
          }
          maxWidth="max-w-xl"
        >
          {!showPaymentStep ? (
            <form onSubmit={handleInitialOrderSubmit} className="space-y-4 text-xs">
              {/* Read-Only Product Title */}
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Product Title (Read-Only)</label>
                <input
                  type="text"
                  readOnly
                  value={product.name}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-medium cursor-not-allowed"
                />
              </div>

              {/* Read-Only Email & Payment Option */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-500 mb-1">Buyer Email (Read-Only)</label>
                  <input
                    type="email"
                    readOnly
                    value={user?.email || ''}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-medium cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 mb-1">Price / Payment Mode (Read-Only)</label>
                  <input
                    type="text"
                    readOnly
                    value={`$${product.price.toFixed(2)}/pc (${product.paymentOptions})`}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Order Quantity & Automatic Calculated Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Order Quantity (MOQ: {product.minimumOrderQuantity}, Max: {product.availableQuantity}) *
                  </label>
                  <input
                    type="number"
                    required
                    min={product.minimumOrderQuantity}
                    max={product.availableQuantity}
                    value={orderQuantity}
                    onChange={e => setOrderQuantity(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-lg border text-slate-900 dark:text-slate-100 focus:ring-2 ${
                      isQuantityValid
                        ? 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500'
                        : 'border-rose-500 focus:ring-rose-500 bg-rose-50 dark:bg-rose-950/20'
                    }`}
                  />
                  {!isQuantityValid && (
                    <p className="text-[10px] text-rose-500 mt-1">
                      Quantity must be between {product.minimumOrderQuantity} and {product.availableQuantity}.
                    </p>
                  )}
                </div>

                {/* Automatically Calculated Order Price (Read-Only) */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Order Price (Calculated Automatically)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`$${((calculatedTotal) || 0).toLocaleString()}`}
                    className="w-full p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-bold text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Contact Number & Delivery Address */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Number *</label>
                <input
                  type="text"
                  required
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Delivery Address *</label>
                <textarea
                  required
                  rows={2}
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Additional Notes / Tech-Pack Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="E.g., custom care label instructions, Pantone color reference..."
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isQuantityValid || isSubmittingOrder}
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {product.paymentOptions === 'PayFirst' ? 'Continue to Payment →' : 'Confirm Order (COD)'}
                </button>
              </div>
            </form>
          ) : (
            /* PayFirst Payment Gateway Step */
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-1">
                <div className="flex justify-between font-bold text-indigo-900 dark:text-indigo-200">
                  <span>PayFirst Secure Escrow</span>
                  <span>${((calculatedTotal) || 0).toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                  Funds are secured in factory escrow until AQL 1.5 inspection passes.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentStep(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Back to Form
                </button>
                <button
                  type="button"
                  onClick={() => executeOrderPlacement(true)}
                  disabled={isSubmittingOrder}
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmittingOrder ? (
                    'Processing Authorization...'
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Authorize & Confirm (${((calculatedTotal) || 0).toLocaleString()})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
