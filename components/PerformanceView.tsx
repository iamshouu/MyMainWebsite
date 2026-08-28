import React, { useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  MONTHLY_PERFORMANCE_DATA,
  PERFORMANCE_DATA,
  TRADING_DETAILED_STATS,
} from '../constants';
import InfiniteGridBackground from './InfiniteGridBackground';
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap';

interface PerformanceViewProps {
  onClose: () => void;
  reducedMotion: boolean;
}

const performanceWithDrawdown = (() => {
  let currentPeak = -Infinity;

  return PERFORMANCE_DATA.map((point) => {
    currentPeak = Math.max(currentPeak, point.value);
    const drawdown = Number((point.value - currentPeak).toFixed(2));

    return {
      ...point,
      peak: currentPeak,
      drawdown,
      drawdownRange: [point.value, currentPeak] as [number, number],
    };
  });
})();

type PerformancePoint = (typeof performanceWithDrawdown)[number];
type MonthlyPoint = (typeof MONTHLY_PERFORMANCE_DATA)[number];

interface ChartTooltipProps<T> {
  active?: boolean;
  payload?: Array<{ payload: T }>;
  label?: string | number;
}

const maxProfit = Math.max(...performanceWithDrawdown.map((point) => point.value));
const maxDrawdown = Math.min(...performanceWithDrawdown.map((point) => point.drawdown));
const maxDrawdownPoint = performanceWithDrawdown.find((point) => point.drawdown === maxDrawdown);
const totalGrowth = PERFORMANCE_DATA.at(-1)?.value ?? 0;

const filteredMonthlyData = (() => {
  const reversedIndex = [...MONTHLY_PERFORMANCE_DATA].reverse().findIndex((point) => point.hasData);
  const lastDataIndex = reversedIndex === -1 ? 0 : MONTHLY_PERFORMANCE_DATA.length - 1 - reversedIndex;

  return MONTHLY_PERFORMANCE_DATA.slice(0, Math.min(lastDataIndex + 2, MONTHLY_PERFORMANCE_DATA.length));
})();

const ReturnTooltip: React.FC<ChartTooltipProps<PerformancePoint>> = ({ active, payload, label }) => {
  const data = payload?.[0]?.payload;
  if (!active || !data) return null;

  return (
    <div className="bg-black/90 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden min-w-[180px]">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div className="flex justify-between items-start mb-3 relative z-10">
        <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest">{label}</p>
        {data.drawdown < 0 && (
          <span className="text-[9px] font-mono text-red-300/80">DD: {data.drawdown.toFixed(2)}%</span>
        )}
      </div>
      <p className="text-xl font-black text-white tracking-tighter relative z-10">
        Return: {data.value > 0 ? '+' : ''}{data.value.toFixed(2)}%
      </p>
    </div>
  );
};

const MonthlyTooltip: React.FC<ChartTooltipProps<MonthlyPoint>> = ({ active, payload, label }) => {
  const data = payload?.[0]?.payload;
  if (!active || !data) return null;

  return (
    <div className="bg-black/95 backdrop-blur-2xl border border-white/20 p-4 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] min-w-[160px] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="flex justify-between items-start gap-4 mb-3">
        <p className="text-[11px] font-mono text-white/60 uppercase tracking-[0.2em]">{label}</p>
        {data.hasData && <span className="text-[10px] font-mono text-white/50">{data.trades} trades</span>}
      </div>
      {data.hasData ? (
        <p className="text-xl font-black text-white tracking-tighter">
          {data.value >= 0 ? '+' : ''}{data.value.toFixed(2)}%
        </p>
      ) : (
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest italic">Data pending</p>
      )}
    </div>
  );
};

const chartCardClass =
  'w-full bg-black/40 rounded-xl md:rounded-[2rem] border border-white/10 p-4 md:p-8 relative overflow-hidden flex flex-col outline-none';

const PerformanceView: React.FC<PerformanceViewProps> = ({ onClose, reducedMotion }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  useDialogFocusTrap(overlayRef);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] isolate overflow-y-auto outline-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="performance-view-title"
      tabIndex={-1}
      data-portfolio-view="performance"
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
        <InfiniteGridBackground accent="cyan" reducedMotion={reducedMotion} />
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/30 to-black/60"
        aria-hidden
      />

      <div className="relative z-10 min-h-full px-4 pb-28 pt-28 md:px-24 md:pb-24 md:pt-36">
        <div className="max-w-7xl mx-auto">
          <button
            type="button"
            onClick={onClose}
            className="relative z-50 mb-8 inline-flex min-h-11 items-center gap-2 py-2 pr-4 text-white/55 transition-colors active:text-white focus-visible:outline-none focus-visible:text-white md:mb-16 md:gap-3 md:hover:text-white"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform md:w-[18px]" />
            <span className="font-mono tracking-widest text-[8px] md:text-[10px]">BACK TO TERMINAL</span>
          </button>

          <div className="relative w-full h-[60px] md:h-[160px] mb-8 md:mb-16 select-none pointer-events-none">
            <svg className="w-full h-full overflow-visible" aria-hidden>
              <text
                x="0"
                y="50%"
                dominantBaseline="central"
                textAnchor="start"
                className="text-5xl md:text-[10rem] font-black tracking-tighter uppercase"
                fill="transparent"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.5"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                PERFORMANCE
              </text>
            </svg>
            <h1 id="performance-view-title" className="sr-only">Trading performance</h1>
          </div>

          <section className={`${chartCardClass} h-[430px] md:h-[600px]`} aria-labelledby="cumulative-title">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="relative z-10 mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center md:mb-10 md:gap-5">
              <div>
                <h2 id="cumulative-title" className="text-xl md:text-3xl font-black tracking-tighter text-white">
                  Cumulative Return
                </h2>
                <p className="text-[11px] md:text-[13px] font-mono text-white/60 uppercase tracking-widest mt-1 md:mt-2">
                  Verified trading data
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-2xl md:text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  {totalGrowth >= 0 ? '+' : ''}{totalGrowth.toFixed(2)}%
                </p>
                <p className="text-[9px] md:text-[11px] font-mono text-white/50 uppercase tracking-widest mt-1">
                  Total growth YTD
                </p>
              </div>
            </div>

            <div className="w-full flex-1 min-h-0 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceWithDrawdown} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} accessibilityLayer={false} tabIndex={-1}>
                  <defs>
                    <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4} />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff4444" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#ff4444" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }} tickLine={false} axisLine={false} minTickGap={20} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                  <Tooltip content={<ReturnTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }} isAnimationActive={false} />
                  <ReferenceLine y={maxProfit} stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" label={{ position: 'top', value: `MAX PROFIT: +${maxProfit.toFixed(2)}%`, fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace', dy: -12 }} />
                  {maxDrawdownPoint && (
                    <ReferenceLine y={maxDrawdownPoint.value} stroke="rgba(255,68,68,0.3)" strokeDasharray="3 3" label={{ position: 'bottom', value: `MAX DRAWDOWN: ${maxDrawdown.toFixed(2)}%`, fill: 'rgba(255,68,68,0.65)', fontSize: 9, fontFamily: 'monospace', dy: 12 }} />
                  )}
                  <Area type="monotone" dataKey="drawdownRange" stroke="none" fill="url(#colorDrawdown)" isAnimationActive={!reducedMotion} animationDuration={1000} />
                  <Area type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorReturn)" activeDot={{ r: 5, fill: '#fff', strokeWidth: 2, stroke: 'rgba(255,255,255,0.5)' }} isAnimationActive={!reducedMotion} animationDuration={900} animationEasing="ease-out" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className={`${chartCardClass} h-[400px] md:h-[500px] mt-8 md:mt-16`} aria-labelledby="monthly-title">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="mb-6 md:mb-10 relative z-10">
              <h2 id="monthly-title" className="text-xl md:text-3xl font-black tracking-tighter text-white">Monthly Performance</h2>
              <p className="text-[11px] md:text-[13px] font-mono text-white/60 uppercase tracking-widest mt-1 md:mt-2">Profit/Loss by month</p>
            </div>
            <div className="w-full flex-1 min-h-0 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredMonthlyData} margin={{ top: 40, right: 0, left: -20, bottom: 20 }} accessibilityLayer={false} tabIndex={-1}>
                  <defs>
                    <linearGradient id="barPositive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="barNegative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold' }} tickLine={false} axisLine={false} dy={10} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'monospace' }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<MonthlyTooltip />} />
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]} maxBarSize={80} isAnimationActive={!reducedMotion}>
                    {filteredMonthlyData.map((entry) => (
                      <Cell
                        key={entry.month}
                        fill={!entry.hasData ? 'transparent' : entry.value >= 0 ? 'url(#barPositive)' : 'url(#barNegative)'}
                        className="transition-all duration-300 hover:brightness-150"
                        stroke={entry.hasData ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'}
                        strokeWidth={1}
                        strokeDasharray={!entry.hasData ? '3 3' : '0'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 md:mt-6 px-2 text-[8px] md:text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] italic">
              * Monthly returns are independent. See cumulative return for total performance.
            </p>
          </section>

          <section className="mt-8 md:mt-16 mb-20" aria-labelledby="statistics-title">
            <div className="flex items-center gap-4 mb-8 md:mb-12">
              <h2 id="statistics-title" className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase">Trading Statistics</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-9">
              {TRADING_DETAILED_STATS.map((stat) => {
                const valueColor = stat.type === 'positive' || (stat.type === 'winrate' && Number.parseFloat(stat.value) >= 50)
                  ? 'text-emerald-300'
                  : stat.type === 'negative' || stat.type === 'winrate'
                    ? 'text-amber-300'
                    : 'text-white';

                return (
                  <div key={stat.label} className="border-t border-white/15 pt-4">
                    <dt className="text-[9px] md:text-[11px] font-mono text-white/55 uppercase tracking-[0.25em] mb-2">{stat.label}</dt>
                    <dd className={`text-xl md:text-3xl font-black tracking-tighter ${valueColor}`}>{stat.value}</dd>
                  </div>
                );
              })}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PerformanceView;
