import React, { useState, useEffect } from 'react';
import { Order, TrackingStage } from '../../../types/index.ts';
import { LoadingSpinner } from '../../../components/LoadingSpinner.tsx';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  AlertCircle
} from 'lucide-react';

interface TrackOrderProps {
  orderIdFromRoute?: string;
  navigate: (path: string) => void;
}

export const TrackOrder: React.FC<TrackOrderProps> = ({ orderIdFromRoute, navigate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // All 7 standard production & delivery steps in exact sequence
  const pipelineStages: { stage: TrackingStage; title: string; subtitle: string }[] = [
    { stage: 'Order Placed', title: 'Order Intake', subtitle: 'Tech-pack ingestion & PO validation' },
    { stage: 'Cutting Completed', title: 'CAD Spreading & Cutting', subtitle: 'Fabric relaxation & CNC laser cutting' },
    { stage: 'Sewing Started', title: 'Modular Line Sewing', subtitle: 'Panel stitching & seam reinforcement' },
    { stage: 'Finishing', title: 'Finishing & Pressing', subtitle: 'Thread trimming & steam tunnel iron' },
    { stage: 'QC Checked', title: 'AQL 1.5 Quality Audit', subtitle: 'Zero-needle detector & dimensional audit' },
    { stage: 'Packed', title: 'Export Packaging', subtitle: 'RFID barcoding & polybag carton packing' },
    { stage: 'Shipped / Out for Delivery', title: 'Port Logistics Dispatch', subtitle: 'Containerized & Bill of Lading active' }
  ];

  useEffect(() => {
    document.title = 'Production & Logistics Tracker - ApexGarments Buyer';

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('apex_token')}`
          }
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);

          // Select matching order or first available
          if (orderIdFromRoute) {
            const matched = data.orders.find((o: Order) => o.id === orderIdFromRoute);
            setSelectedOrder(matched || data.orders[0] || null);
          } else if (data.orders.length > 0) {
            setSelectedOrder(data.orders[0]);
          }
        }
      } catch (err) {
        console.error('Error loading tracker orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [orderIdFromRoute]);

  if (isLoading) {
    return <LoadingSpinner label="Connecting to shop-floor telemetry..." size="lg" />;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 space-y-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Truck className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Orders to Track</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You currently do not have any active or previous manufacturing orders to track.
        </p>
        <button
          onClick={() => navigate('/all-products')}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
        >
          Book Your First Product
        </button>
      </div>
    );
  }

  // Determine stage indexes for highlighting
  const updates = selectedOrder?.trackingUpdates || selectedOrder?.trackingHistory || [];
  const currentStageName = updates.length > 0 ? updates[updates.length - 1]?.stage : 'Order Placed';
  const currentStageIndex = pipelineStages.findIndex(s => s.stage === currentStageName);

  return (
    <div className="space-y-8">
      {/* Header & Order Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-indigo-600" />
            <span>Garment Production & Freight Tracker</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time stage transparency from Dhaka floor lines to destination ports.
          </p>
        </div>

        {/* Order Selector Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-semibold">Active PO:</span>
          <select
            value={selectedOrder?.id || ''}
            onChange={e => {
              const ord = orders.find(o => o.id === e.target.value);
              if (ord) setSelectedOrder(ord);
            }}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-mono shadow-xs"
          >
            {orders.map(o => (
              <option key={o.id} value={o.id}>
                #{o.id} - {o.productName} ({((o.orderQuantity) || 0).toLocaleString()} pcs)
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedOrder && (
        <div className="space-y-8">
          {/* Order Overview Banner */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Product Line
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedOrder.productName}</h3>
                <p className="text-xs text-slate-400">Order #{selectedOrder.id}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Volume & Valuation
                </span>
                <p className="text-base font-extrabold text-white mt-0.5">
                  {((selectedOrder.orderQuantity) || 0).toLocaleString()} pcs
                </p>
                <p className="text-xs text-emerald-400 font-mono">${((selectedOrder.orderPrice ?? selectedOrder.totalPrice) || 0).toLocaleString()}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Current Manufacturing Phase
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-base font-bold text-emerald-300">{currentStageName}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Updated: {new Date(selectedOrder.trackingUpdates[selectedOrder.trackingUpdates.length - 1].timestamp).toLocaleDateString()}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Destination Address
                </span>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {selectedOrder.deliveryAddress}
                </p>
              </div>
            </div>
          </div>

          {/* 1. VISUAL PRODUCTION TIMELINE (Requirement: Timeline view of all 7 steps, latest highlighted) */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Progress Milestone Roadmap
              </h3>
              <p className="text-xs text-slate-500">
                Step-by-step verification through the standardized garment production cycle
              </p>
            </div>

            {/* Horizontal / Step Chain Tracker */}
            <div className="relative">
              <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-7 gap-3">
                {pipelineStages.map((ps, idx) => {
                  const isCompleted = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const isUpcoming = idx > currentStageIndex;

                  // Find log for this stage if exists
                  const log = selectedOrder.trackingUpdates.find(u => u.stage === ps.stage);

                  return (
                    <div
                      key={ps.stage}
                      className={`relative p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/30'
                          : isCompleted
                          ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20'
                          : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-60'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                              isCurrent
                                ? 'bg-indigo-600 text-white'
                                : isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            0{idx + 1}
                          </span>

                          {isCompleted && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                          {isCurrent && (
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
                            </span>
                          )}
                          {isUpcoming && <Clock className="w-4 h-4 text-slate-300 dark:text-slate-700" />}
                        </div>

                        <h4
                          className={`text-xs font-bold leading-tight ${
                            isCurrent
                              ? 'text-indigo-900 dark:text-indigo-200 font-extrabold'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {ps.stage}
                        </h4>

                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                          {ps.subtitle}
                        </p>
                      </div>

                      {log && (
                        <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-400">
                          <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. FACTORY SHOP-FLOOR STAGE MAP (Interactive Stage Map Visual) */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <span>Interactive Factory Floor & Dispatch Hub Map</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Visual sensor localization of your garment batch across the DEPZ industrial facility
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 self-start sm:self-auto">
                DEPZ Savar Campus · Hall 3
              </span>
            </div>

            {/* Shop Floor Layout Map */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  code: 'ZONE-A',
                  name: 'CAD Cutting Bay',
                  stage: 'Cutting Completed',
                  desc: 'High-speed CNC spreading tables'
                },
                {
                  code: 'ZONE-B',
                  name: 'Sewing Assembly Line 4',
                  stage: 'Sewing Started',
                  desc: 'Multi-head programmable Juki stations'
                },
                {
                  code: 'ZONE-C',
                  name: 'Finishing & AQL 1.5 Lab',
                  stage: 'QC Checked',
                  desc: 'Tunnel press & optical needle scanners'
                },
                {
                  code: 'ZONE-D',
                  name: 'Freight Dispatch Bay',
                  stage: 'Shipped / Out for Delivery',
                  desc: '40ft High-Cube container loading'
                }
              ].map(zone => {
                const isActiveZone =
                  (zone.stage === 'Cutting Completed' && currentStageName === 'Cutting Completed') ||
                  (zone.stage === 'Sewing Started' && (currentStageName === 'Sewing Started' || currentStageName === 'Finishing')) ||
                  (zone.stage === 'QC Checked' && currentStageName === 'QC Checked') ||
                  (zone.stage === 'Shipped / Out for Delivery' && (currentStageName === 'Packed' || currentStageName === 'Shipped / Out for Delivery'));

                return (
                  <div
                    key={zone.code}
                    className={`p-4 rounded-xl border transition-all ${
                      isActiveZone
                        ? 'border-indigo-600 bg-indigo-600/5 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400">{zone.code}</span>
                      {isActiveZone ? (
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                          Batch Present
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Standby</span>
                      )}
                    </div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">{zone.name}</h5>
                    <p className="text-[11px] text-slate-500 mt-1">{zone.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. VERIFIED STAGE LOGS TABLE (Read-Only) */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Supervisor Verification Logs (Read-Only)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Stage</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Station Location</th>
                    <th className="py-2.5 px-3">Supervisor Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(selectedOrder.trackingUpdates || selectedOrder.trackingHistory || []).map((u, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                        {u.stage}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono">
                        {u.timestamp ? new Date(u.timestamp).toLocaleString() : 'N/A'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{u.location}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        {u.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
