import React, { useState, useEffect } from 'react';
import { Order } from '../../../types/index.ts';
import { useAuth } from '../../../context/AuthContext.tsx';
import { useToast } from '../../../context/ToastContext.tsx';
import { LoadingSpinner } from '../../../components/LoadingSpinner.tsx';
import { Modal } from '../../../components/Modal.tsx';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldAlert,
  AlertTriangle,
  User,
  MapPin,
  CreditCard
} from 'lucide-react';

export const PendingOrders: React.FC = () => {
  const { user, isSuspended } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // View modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Action confirmation state
  const [actionOrder, setActionOrder] = useState<{ order: Order; type: 'Approve' | 'Reject' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPendingOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders/pending', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('apex_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching pending orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Pending Orders Review - ApexGarments Manager';
    fetchPendingOrders();
  }, []);

  const handleActionConfirm = async () => {
    if (!actionOrder) return;
    if (isSuspended) {
      showToast('Account Suspended: Cannot approve or reject orders.', 'error');
      return;
    }

    setIsProcessing(true);
    const endpoint =
      actionOrder.type === 'Approve'
        ? `/api/orders/${actionOrder.order.id}/approve`
        : `/api/orders/${actionOrder.order.id}/reject`;

    try {
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('apex_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          actionOrder.type === 'Approve'
            ? `Order #${actionOrder.order.id} approved! Floor scheduling active.`
            : `Order #${actionOrder.order.id} rejected.`,
          actionOrder.type === 'Approve' ? 'success' : 'warning'
        );
        setActionOrder(null);
        fetchPendingOrders();
      } else {
        showToast(data.message || 'Action failed.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Server error processing order.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-500" />
            <span>Pending Buyer Orders</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review incoming tech-packs, verify stock thresholds, and approve production floor routing.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 self-start sm:self-auto">
          {orders.length} Awaiting Approval
        </div>
      </div>

      {/* Suspension Alert */}
      {isSuspended && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-xs text-rose-800 dark:text-rose-300">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            Manager privileges suspended. Order approval and rejection buttons are disabled.
          </span>
        </div>
      )}

      {/* Table: | Order ID | User | Product | Quantity | Order Date | Actions | */}
      {isLoading ? (
        <LoadingSpinner label="Querying pending bookings..." />
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Pending Orders</h3>
          <p className="text-xs text-slate-500">All incoming buyer purchase orders have been processed.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Buyer User</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Order Date</th>
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

                  {/* User */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {o.firstName} {o.lastName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{o.userEmail}</span>
                  </td>

                  {/* Product */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {o.productName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ${((o.orderPrice ?? o.totalPrice) || 0).toLocaleString()} total
                    </span>
                  </td>

                  {/* Quantity */}
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {((o.orderQuantity) || 0).toLocaleString()} pcs
                  </td>

                  {/* Order Date */}
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions: Approve / Reject / View */}
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-indigo-500" />
                    </button>

                    <button
                      onClick={() => setActionOrder({ order: o, type: 'Approve' })}
                      disabled={isSuspended}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 shadow-xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => setActionOrder({ order: o, type: 'Reject' })}
                      disabled={isSuspended}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-40 shadow-xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {actionOrder && (
        <Modal
          isOpen={!!actionOrder}
          onClose={() => setActionOrder(null)}
          title={`Confirm ${actionOrder.type} Order #${actionOrder.order.id}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2 border border-slate-200 dark:border-slate-700">
              <p className="font-semibold text-slate-900 dark:text-white">
                {actionOrder.type === 'Approve'
                  ? 'Approving this order initiates shop-floor fabric allocation, CAD grading, and schedules cutting line entry.'
                  : 'Rejecting will cancel the production schedule and notify the buyer.'}
              </p>
              <div className="text-[11px] text-slate-500 space-y-0.5">
                <p>Buyer: {actionOrder.order.firstName} {actionOrder.order.lastName}</p>
                <p>Quantity: {((actionOrder.order.orderQuantity) || 0).toLocaleString()} pcs</p>
                <p>Amount: ${((actionOrder.order.orderPrice ?? actionOrder.order.totalPrice) || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionOrder(null)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleActionConfirm}
                className={`px-4 py-2 font-bold text-white rounded-lg shadow-sm cursor-pointer disabled:opacity-50 ${
                  actionOrder.type === 'Approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isProcessing ? 'Processing...' : `Confirm ${actionOrder.type}`}
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
          title={`Order Specification: #${selectedOrder.id}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block">Product</span>
                <strong className="text-slate-900 dark:text-white text-sm">{selectedOrder.productName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Total Volume</span>
                <strong className="text-slate-900 dark:text-white text-sm">
                  {((selectedOrder.orderQuantity) || 0).toLocaleString()} pcs
                </strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
              <p><strong>Buyer Name:</strong> {selectedOrder.firstName} {selectedOrder.lastName}</p>
              <p><strong>Email:</strong> {selectedOrder.userEmail}</p>
              <p><strong>Contact:</strong> {selectedOrder.contactNumber}</p>
              <p><strong>Address:</strong> {selectedOrder.deliveryAddress}</p>
              <p><strong>Payment Option:</strong> {selectedOrder.paymentOption}</p>
              {selectedOrder.additionalNotes && (
                <p><strong>Notes:</strong> {selectedOrder.additionalNotes}</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold"
              >
                Close View
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
