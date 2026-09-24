import React, { useState, useEffect } from 'react';
import { Order, TrackingStage } from '../../../types/index.ts';
import { useAuth } from '../../../context/AuthContext.tsx';
import { useToast } from '../../../context/ToastContext.tsx';
import { LoadingSpinner } from '../../../components/LoadingSpinner.tsx';
import { Modal } from '../../../components/Modal.tsx';
import {
  CheckCircle,
  PlusCircle,
  Eye,
  Truck,
  MapPin,
  Calendar,
  Clock,
  ShieldAlert,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ApprovedOrders: React.FC = () => {
  const { isSuspended } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Tracking Modal State
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [stage, setStage] = useState<TrackingStage>('Cutting Completed');
  const [location, setLocation] = useState('Line B2 - CAD Cutting Bay');
  const [note, setNote] = useState('Fabric spreading and CNC laser cutting completed. Pattern inspection passed.');
  const [isSubmittingTracking, setIsSubmittingTracking] = useState(false);

  // View Timeline Modal State
  const [timelineOrder, setTimelineOrder] = useState<Order | null>(null);

  const fetchApprovedOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders/approved', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('apex_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching approved orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Approved Orders Tracking - ApexGarments Manager';
    fetchApprovedOrders();
  }, []);

  const handleOpenAddTracking = (order: Order) => {
    if (isSuspended) {
      showToast('Account Suspended: Cannot update tracking stages.', 'error');
      return;
    }
    setSelectedOrderForTracking(order);

    // Auto suggest next stage based on last tracking update
    const history = order.trackingUpdates || order.trackingHistory || [];
    const lastUpdate = history.length > 0 ? history[history.length - 1] : undefined;
    if (lastUpdate) {
      if (lastUpdate.stage === 'Order Placed') {
        setStage('Cutting Completed');
        setLocation('Building 1 - CNC Laser Cutting Section');
        setNote('Precision cutting complete. 100% panel bundle count verified.');
      } else if (lastUpdate.stage === 'Cutting Completed') {
        setStage('Sewing Started');
        setLocation('Floor 2 - Modular Sewing Line 4');
        setNote('Sewing line setup active. Front/back assembly underway.');
      } else if (lastUpdate.stage === 'Sewing Started') {
        setStage('Finishing');
        setLocation('Floor 3 - Steam Tunnel & Finishing Hall');
        setNote('Thread trimming, iron press, and care label stitch complete.');
      } else if (lastUpdate.stage === 'Finishing') {
        setStage('QC Checked');
        setLocation('Quality Lab - AQL 1.5 Audit Room');
        setNote('AQL 1.5 statistical sampling passed. Zero broken needle detect verified.');
      } else if (lastUpdate.stage === 'QC Checked') {
        setStage('Packed');
        setLocation('Central Warehouse - Barcode Packaging Bay');
        setNote('Polybagging and 5-ply export carton packaging completed.');
      } else if (lastUpdate.stage === 'Packed') {
        setStage('Shipped / Out for Delivery');
        setLocation('Chittagong Port Terminal - Container Bay 3');
        setNote('Container sealed and Bill of Lading handed to international carrier.');
      }
    }
  };

  const handleAddTrackingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForTracking) return;

    setIsSubmittingTracking(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrderForTracking.id}/tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('apex_token')}`
        },
        body: JSON.stringify({
          stage,
          location,
          note
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Tracking stage "${stage}" broadcast to buyer!`, 'success');
        setSelectedOrderForTracking(null);
        fetchApprovedOrders();
      } else {
        showToast(data.message || 'Failed to update tracking.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating tracking.', 'error');
    } finally {
      setIsSubmittingTracking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <span>Approved Orders & Production Tracking</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish shop-floor manufacturing stages, QC inspection results, and logistics dispatch milestones.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 self-start sm:self-auto">
          {orders.length} Active Production Runs
        </div>
      </div>

      {/* Suspension Alert */}
      {isSuspended && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-xs text-rose-800 dark:text-rose-300">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            Manager privileges suspended. Adding new production tracking milestones is disabled.
          </span>
        </div>
      )}

      {/* Table: | Order ID | User | Product | Quantity | Approved Date | Actions | */}
      {isLoading ? (
        <LoadingSpinner label="Loading approved orders ledger..." />
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <Truck className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Approved Orders</h3>
          <p className="text-xs text-slate-500">Approve pending orders to start stage-by-stage tracking.</p>
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
                <th className="py-3 px-4">Approved Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map(o => {
                const history = o.trackingUpdates || o.trackingHistory || [];
                const latestStage =
                  (history.length > 0 ? history[history.length - 1]?.stage : undefined) || 'Approved';
                return (
                  <tr key={o.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Order ID + Latest Stage Chip */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 block">
                        {o.id}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {latestStage}
                      </span>
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
                        ${((o.orderPrice ?? o.totalPrice) || 0).toLocaleString()} ({o.paymentOption})
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {((o.orderQuantity) || 0).toLocaleString()} pcs
                    </td>

                    {/* Approved Date */}
                    <td className="py-3 px-4 text-slate-500">
                      {o.approvedAt
                        ? new Date(o.approvedAt).toLocaleDateString()
                        : new Date(o.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions: Add Tracking / View Tracking */}
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenAddTracking(o)}
                        disabled={isSuspended}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 shadow-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add Tracking</span>
                      </button>

                      <button
                        onClick={() => setTimelineOrder(o)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-500" />
                        <span>View Timeline</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Tracking Modal */}
      {selectedOrderForTracking && (
        <Modal
          isOpen={!!selectedOrderForTracking}
          onClose={() => setSelectedOrderForTracking(null)}
          title={`Push Production Tracking Update`}
          subtitle={`Order #${selectedOrderForTracking.id} - ${selectedOrderForTracking.productName}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleAddTrackingSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Milestone Stage *
              </label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value as TrackingStage)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
              >
                <option value="Cutting Completed">Cutting Completed</option>
                <option value="Sewing Started">Sewing Started</option>
                <option value="Finishing">Finishing</option>
                <option value="QC Checked">QC Checked (AQL 1.5)</option>
                <option value="Packed">Packed</option>
                <option value="Shipped / Out for Delivery">Shipped / Out for Delivery</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Floor Location / Bay *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="E.g. Building 2, Line 4 / Savar Dispatch"
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Progress Note / Inspection Details *
              </label>
              <textarea
                rows={3}
                required
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Provide real-time updates for the buyer..."
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedOrderForTracking(null)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingTracking}
                className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                <span>{isSubmittingTracking ? 'Pushing Update...' : 'Broadcast Tracking Update'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Tracking Timeline Modal */}
      {timelineOrder && (
        <Modal
          isOpen={!!timelineOrder}
          onClose={() => setTimelineOrder(null)}
          title={`Order #${timelineOrder.id} Tracking History`}
          subtitle={`${timelineOrder.productName} · ${((timelineOrder.orderQuantity) || 0).toLocaleString()} pcs`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-6 text-xs">
            <div className="space-y-4 pl-3 border-l-2 border-indigo-200 dark:border-indigo-900">
              {(timelineOrder.trackingUpdates || timelineOrder.trackingHistory || []).map((update, idx) => (
                <div key={idx} className="relative pl-4 space-y-1">
                  <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-950" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {update.stage}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {update.timestamp ? new Date(update.timestamp).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {update.note}
                  </p>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-semibold">
                    <MapPin className="w-3 h-3" />
                    <span>{update.location}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setTimelineOrder(null)}
                className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
