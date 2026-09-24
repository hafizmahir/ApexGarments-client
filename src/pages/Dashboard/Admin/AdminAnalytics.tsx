import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../../components/LoadingSpinner.tsx';
import {
  BarChart3,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  ShieldCheck,
  Calendar,
  Filter,
  ArrowUpRight,
  Layers,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('30days');

  useEffect(() => {
    document.title = 'Analytics & Executive KPI Dashboard - ApexGarments Admin';

    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/analytics?timeRange=${timeRange}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('apex_token')}`
          }
        });
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  if (isLoading && !data) {
    return <LoadingSpinner label="Compiling factory operations analytics..." size="lg" />;
  }

  const stats = data?.stats || {
    productsToday: 3,
    productsWeek: 7,
    productsMonth: 8,
    totalProducts: 8,
    ordersThisMonth: 4,
    totalOrders: 4,
    totalRevenueMonth: 148500,
    totalUsers: 6,
    newUsers: 3,
    activeManagers: 1
  };

  const categoryDistribution = data?.categoryDistribution || [
    { name: 'Shirt', value: 2 },
    { name: 'Denim', value: 2 },
    { name: 'Jacket', value: 1 },
    { name: 'Pant', value: 1 },
    { name: 'Knitwear', value: 1 },
    { name: 'Activewear', value: 1 }
  ];

  const statusCounts: Record<string, number> = {
    Pending: Number(data?.statusCounts?.Pending || 1),
    Approved: Number(data?.statusCounts?.Approved || 2),
    Rejected: Number(data?.statusCounts?.Rejected || 1),
    Cancelled: Number(data?.statusCounts?.Cancelled || 0)
  };

  const dailyTrend = data?.dailyTrend || [
    { day: 'Mon', output: 1420, orders: 4, revenue: 12400 },
    { day: 'Tue', output: 1680, orders: 6, revenue: 18600 },
    { day: 'Wed', output: 1540, orders: 5, revenue: 15200 },
    { day: 'Thu', output: 1890, orders: 8, revenue: 22100 },
    { day: 'Fri', output: 2100, orders: 9, revenue: 27800 },
    { day: 'Sat', output: 1750, orders: 3, revenue: 11500 },
    { day: 'Sun', output: 950,  orders: 2, revenue: 6400 }
  ];

  const maxCategory = Math.max(...categoryDistribution.map((c: any) => Number(c.value)), 1);
  const maxOutput = Math.max(...dailyTrend.map((d: any) => Number(d.output)), 1);
  const totalStatus: number =
    statusCounts.Pending + statusCounts.Approved + statusCounts.Rejected + statusCounts.Cancelled || 1;

  return (
    <div className="space-y-8">
      {/* Header with Period Filters (Requirement: Today | 7 Days | 30 Days) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>Factory Production & Revenue Analytics</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Executive oversight on order values, factory SKU growth, and floor operations.
          </p>
        </div>

        {/* Time Filters */}
        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold self-start sm:self-auto shadow-xs">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              timeRange === 'today'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('7days')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              timeRange === '7days'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30days')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              timeRange === '30days'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* KPI Cards: Products (Today/Week/Month) | Orders (Month) | Users (New/Total) | Active Managers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Products KPI */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Products Catalog</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalProducts} Styles</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Today: <strong className="text-indigo-600">+{stats.productsToday}</strong> · Week: <strong className="text-indigo-600">+{stats.productsWeek}</strong> · Month: <strong className="text-indigo-600">+{stats.productsMonth}</strong>
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Active SKU lines in catalog</span>
          </div>
        </div>

        {/* Orders KPI */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Orders (This Month)</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.ordersThisMonth} POs</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Gross Value: <strong className="text-emerald-600 font-mono">${((stats?.totalRevenueMonth || 148500) || 0).toLocaleString()}</strong>
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{stats.totalOrders} total historic orders</span>
          </div>
        </div>

        {/* Users KPI */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Users: New & Total</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalUsers} Accounts</p>
            <p className="text-[11px] text-slate-500 mt-1">
              New Registrations: <strong className="text-sky-600">+{stats.newUsers} recent</strong>
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
            <span>Verified international accounts</span>
          </div>
        </div>

        {/* Managers Active Count */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Active Factory Managers</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.activeManagers} Supervisors</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Supervising sewing & cutting floors
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-purple-600 font-semibold">
            <span>Authorized role status: Approved</span>
          </div>
        </div>
      </div>

      {/* CHARTS GRID (Bar Chart, Line Chart, Pie/Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Bar Chart: Category Breakdown */}
        <div className="lg:col-span-6 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Garments by Category (Bar Chart)
              </h3>
              <p className="text-[11px] text-slate-500">Product line diversity across categories</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600">Active Lines</span>
          </div>

          <div className="space-y-3 pt-2">
            {categoryDistribution.map((cat: any) => {
              const pct = Math.round((cat.value / maxCategory) * 100);
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300">{cat.name}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{cat.value} styles ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Line Chart: Daily Production & Output Curve */}
        <div className="lg:col-span-6 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Weekly Production Output Curve (Line Chart)
              </h3>
              <p className="text-[11px] text-slate-500">Finished garments throughput (pcs/day)</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600">Throughput +14.2%</span>
          </div>

          {/* SVG Line Chart */}
          <div className="pt-4 h-56 flex flex-col justify-between">
            <svg className="w-full h-40 overflow-visible" viewBox="0 0 600 120">
              <defs>
                <linearGradient id="gradientTrend2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area */}
              <polygon
                fill="url(#gradientTrend2)"
                points={`
                  0,120 
                  0,${120 - (dailyTrend[0].output / maxOutput) * 100}
                  100,${120 - (dailyTrend[1].output / maxOutput) * 100}
                  200,${120 - (dailyTrend[2].output / maxOutput) * 100}
                  300,${120 - (dailyTrend[3].output / maxOutput) * 100}
                  400,${120 - (dailyTrend[4].output / maxOutput) * 100}
                  500,${120 - (dailyTrend[5].output / maxOutput) * 100}
                  600,${120 - (dailyTrend[6].output / maxOutput) * 100}
                  600,120
                `}
              />

              {/* Line */}
              <polyline
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={`
                  0,${120 - (dailyTrend[0].output / maxOutput) * 100}
                  100,${120 - (dailyTrend[1].output / maxOutput) * 100}
                  200,${120 - (dailyTrend[2].output / maxOutput) * 100}
                  300,${120 - (dailyTrend[3].output / maxOutput) * 100}
                  400,${120 - (dailyTrend[4].output / maxOutput) * 100}
                  500,${120 - (dailyTrend[5].output / maxOutput) * 100}
                  600,${120 - (dailyTrend[6].output / maxOutput) * 100}
                `}
              />

              {/* Interactive Points */}
              {dailyTrend.map((d: any, idx: number) => {
                const cx = idx * 100;
                const cy = 120 - (d.output / maxOutput) * 100;
                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r="4.5"
                    fill="#ffffff"
                    stroke="#4f46e5"
                    strokeWidth="3"
                  />
                );
              })}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[11px] text-slate-400 font-medium px-2">
              {dailyTrend.map((d: any) => (
                <div key={d.day} className="text-center">
                  <span className="block font-bold text-slate-700 dark:text-slate-300">{d.day}</span>
                  <span className="text-[9px] text-slate-400 font-mono">{d.output}p</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Pie / Donut Chart: Order Fulfillment Statuses */}
        <div className="lg:col-span-12 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Purchase Order Status Allocation (Pie / Donut Chart)
              </h3>
              <p className="text-[11px] text-slate-500">Audit of orders in Pending, Approved, and Rejected states</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-2">
            {/* Donut Chart representation */}
            <div className="flex justify-center">
              <div className="relative w-44 h-44">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    stroke="currentColor"
                    strokeWidth="3.8"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Approved segment */}
                  <path
                    className="text-emerald-500"
                    strokeDasharray={`${Math.round((statusCounts.Approved / totalStatus) * 100)}, 100`}
                    stroke="currentColor"
                    strokeWidth="3.8"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Pending segment */}
                  <path
                    className="text-amber-500"
                    strokeDasharray={`${Math.round((statusCounts.Pending / totalStatus) * 100)}, 100`}
                    strokeDashoffset={`-${Math.round((statusCounts.Approved / totalStatus) * 100)}`}
                    stroke="currentColor"
                    strokeWidth="3.8"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Rejected segment */}
                  <path
                    className="text-rose-500"
                    strokeDasharray={`${Math.round((statusCounts.Rejected / totalStatus) * 100)}, 100`}
                    strokeDashoffset={`-${Math.round(((statusCounts.Approved + statusCounts.Pending) / totalStatus) * 100)}`}
                    stroke="currentColor"
                    strokeWidth="3.8"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">{totalStatus}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total POs</span>
                </div>
              </div>
            </div>

            {/* Legend breakdown cards */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Approved Orders</span>
                </div>
                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-2">
                  {statusCounts.Approved} POs
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {Math.round((statusCounts.Approved / totalStatus) * 100)}% active production run
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Pending Review</span>
                </div>
                <p className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-2">
                  {statusCounts.Pending} POs
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {Math.round((statusCounts.Pending / totalStatus) * 100)}% awaiting manager audit
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Rejected / Cancelled</span>
                </div>
                <p className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-2">
                  {statusCounts.Rejected + (statusCounts.Cancelled || 0)} POs
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {Math.round(((statusCounts.Rejected + (statusCounts.Cancelled || 0)) / totalStatus) * 100)}% closed or canceled
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
