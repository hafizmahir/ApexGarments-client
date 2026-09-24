import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../../types/index.ts';
import { useToast } from '../../../context/ToastContext.tsx';
import { LoadingSpinner } from '../../../components/LoadingSpinner.tsx';
import { Modal } from '../../../components/Modal.tsx';
import {
  ShoppingBag,
  Search,
  Eye,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  CreditCard,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const AdminAllOrders: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // View Order Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async (targetPage = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      params.append('page', String(targetPage));
      params.append('limit', '8');

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('apex_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
        setTotalOrders(data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'All Manufacturing Orders - ApexGarments Admin';
    fetchOrders(1);
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-600" />
            <span>All Manufacturing Orders Audit</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global factory PO registry, status checkpoints, and multi-stage tracking oversight.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 self-start sm:self-auto">
          {totalOrders} Total Production Orders
        </div>
      </div>

      {/* Filter & Search */}
      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by buyer email, name or order ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-16 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs font-semibold rounded bg-indigo-600 text-white cursor-pointer"
          >
            Filter
          </button>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table: | Order ID | User | Product | Quantity | Total Price | Status | Actions | */}
      {isLoading ? (
        <LoadingSpinner label="Loading orders ledger..." />
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-xs">No orders found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Buyer User</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
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

                  {/* Buyer */}
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
                    <span className="text-[10px] text-slate-400">
                      ${o.unitPrice?.toFixed(2)}/pc ({o.paymentOption})
                    </span>
                  </td>

                  {/* Quantity */}
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {((o.orderQuantity) || 0).toLocaleString()} pcs
                  </td>

                  {/* Total Price */}
                  <td className="py-3 px-4 font-black text-indigo-600 dark:text-indigo-400 font-mono">
                    ${((o.orderPrice ?? o.totalPrice) || 0).toLocaleString()}
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

                  {/* Actions: View Button */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="px-3 py-1.5 rounded-lg font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-500" />
                      <span>View</span>
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
              onClick={() => fetchOrders(page - 1)}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => fetchOrders(page + 1)}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Order Details & Tracking Inspector Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Dossier: ${selectedOrder.id}`}
          subtitle={`Placed on ${new Date(selectedOrder.createdAt).toLocaleDateString()}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-xs">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block">Order Status</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block">Total Volume</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {((selectedOrder.orderQuantity) || 0).toLocaleString()} pcs
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block">Order Amount</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">
                  ${((selectedOrder.orderPrice ?? selectedOrder.totalPrice) || 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block">Payment Mode</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  {selectedOrder.paymentOption}
                </span>
              </div>
            </div>

            {/* Buyer & Delivery Info */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">Consignee & Shipping Destination:</h4>
              <p className="text-slate-700 dark:text-slate-300">
                <strong>Buyer:</strong> {selectedOrder.firstName} {selectedOrder.lastName} ({selectedOrder.userEmail})
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                <strong>Contact Phone:</strong> {selectedOrder.contactNumber}
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                <strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}
              </p>
              {selectedOrder.additionalNotes && (
                <p className="text-slate-500 italic mt-1">
                  <strong>Notes:</strong> "{selectedOrder.additionalNotes}"
                </p>
              )}
            </div>

            {/* Tracking History Timeline */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Production Stage Progression Log</span>
              </h4>

              <div className="space-y-3 pl-2 border-l-2 border-indigo-200 dark:border-indigo-900">
                {(selectedOrder.trackingUpdates || selectedOrder.trackingHistory || []).map((update, idx) => (
                  <div key={idx} className="relative pl-4 space-y-0.5">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-950" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{update.stage}</span>
                      <span className="text-[10px] text-slate-400">
                        {update.timestamp ? new Date(update.timestamp).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{update.note}</p>
                    <span className="text-[10px] text-indigo-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {update.location}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
