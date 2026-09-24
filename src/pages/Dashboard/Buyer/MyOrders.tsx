import React, { useState, useEffect } from 'react';
import { Order } from '../../../types/index.ts';
import { useAuth } from '../../../context/AuthContext.tsx';
import { useToast } from '../../../context/ToastContext.tsx';
import { LoadingSpinner } from '../../../components/LoadingSpinner.tsx';
import { Modal } from '../../../components/Modal.tsx';
import { getBuyerOrders } from '../../../services/apiClient.ts';
import {
  ShoppingBag,
  Eye,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Layers,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface MyOrdersProps {
  navigate: (path: string) => void;
}

export const MyOrders: React.FC<MyOrdersProps> = ({ navigate }) => {
  const { user, isSuspended } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // View modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Cancel order modal (Requirement: only visible if status = Pending, confirmation modal before canceling)
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);

  const fetchMyOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getBuyerOrders();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching buyer orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'My Purchase Orders - ApexGarments Buyer';
    fetchMyOrders();
  }, []);

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;
    setIsCanceling(true);
    try {
      const res = await fetch(`/api/orders/${orderToCancel.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('apex_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Order canceled and inventory stock restored.', 'success');
        setOrderToCancel(null);
        fetchMyOrders();
      } else {
        showToast(data.message || 'Failed to cancel order.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Server error canceling order.', 'error');
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-600" />
            <span>My Manufacturing Purchase Orders</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your factory orders, inspect line stages, and manage pending submissions.
          </p>
        </div>

        <button
          onClick={() => navigate('/all-products')}
          disabled={isSuspended}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-xl shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>Book New Garment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Suspension Alert */}
      {isSuspended && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-xs text-rose-800 dark:text-rose-300">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <div>
            <span className="font-bold">Buyer Account Suspended:</span> New order bookings are restricted.
            <button
              onClick={() => navigate('/dashboard/profile')}
              className="ml-2 font-bold underline"
            >
              View Admin Feedback →
            </button>
          </div>
        </div>
      )}

      {/* Table: | Order ID | Product | Quantity | Status | Payment | Actions | */}
      {isLoading ? (
        <LoadingSpinner label="Fetching your order ledger..." />
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You have not booked any apparel lots. Browse our catalog to initiate a production booking.
          </p>
          <button
            onClick={() => navigate('/all-products')}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
          >
            Explore All Products
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Product Line</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Order ID */}
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {o.id}
                  </td>

                  {/* Product */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {o.productName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Total: ${((o.orderPrice ?? o.totalPrice) || 0).toLocaleString()} (${o.unitPrice?.toFixed(2)}/pc)
                    </span>
                  </td>

                  {/* Quantity */}
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {((o.orderQuantity) || 0).toLocaleString()} pcs
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold text-[11px] px-2.5 py-0.5 rounded ${
                        o.orderStatus === 'Approved'
                          ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : o.orderStatus === 'Rejected'
                          ? 'text-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400'
                          : 'text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400'
                      }`}
                    >
                      {o.orderStatus === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                      {o.orderStatus === 'Pending' && <Clock className="w-3 h-3" />}
                      {o.orderStatus === 'Rejected' && <XCircle className="w-3 h-3" />}
                      {o.orderStatus}
                    </span>
                  </td>

                  {/* Payment */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {o.paymentOption}
                    </span>
                  </td>

                  {/* Actions: View & Cancel (Cancel ONLY visible if status = Pending) */}
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => navigate(`/dashboard/track-order/${o.id}`)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                    </button>

                    {/* Requirement: Cancel Button only visible if status = Pending */}
                    {o.orderStatus === 'Pending' && (
                      <button
                        onClick={() => setOrderToCancel(o)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 cursor-pointer inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel Order Confirmation Modal (Requirement) */}
      {orderToCancel && (
        <Modal
          isOpen={!!orderToCancel}
          onClose={() => setOrderToCancel(null)}
          title="Cancel Order Confirmation"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3.5 bg-rose-50 dark:bg-rose-950/30 rounded-xl text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="font-bold">Are you sure you want to cancel Order #{orderToCancel.id}?</p>
                <p className="text-[11px] mt-0.5">
                  Reserved stock ({orderToCancel.orderQuantity} pcs) will be restored to factory available inventory immediately.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOrderToCancel(null)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={isCanceling}
                onClick={confirmCancelOrder}
                className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isCanceling ? 'Canceling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Dossier: #${selectedOrder.id}`}
          subtitle={`Product: ${selectedOrder.productName}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block">Total Volume</span>
                <strong className="text-slate-900 dark:text-white font-bold text-sm">
                  {((selectedOrder.orderQuantity) || 0).toLocaleString()} pcs
                </strong>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block">Total Price</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold text-sm font-mono">
                  ${((selectedOrder.orderPrice ?? selectedOrder.totalPrice) || 0).toLocaleString()}
                </strong>
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <p><strong>Contact:</strong> {selectedOrder.contactNumber}</p>
              <p><strong>Shipping Address:</strong> {selectedOrder.deliveryAddress}</p>
              <p><strong>Payment Mode:</strong> {selectedOrder.paymentOption}</p>
              {selectedOrder.additionalNotes && (
                <p><strong>Custom Notes:</strong> "{selectedOrder.additionalNotes}"</p>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  navigate(`/dashboard/track-order/${selectedOrder.id}`);
                }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1"
              >
                <Truck className="w-4 h-4" />
                <span>Open Full Timeline Tracker →</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-white bg-slate-800 dark:bg-slate-700 rounded-lg font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
