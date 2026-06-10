import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Users,
  Eye,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  BarChart2,
  LogOut,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
  WifiOff,
  Search,
  FileText,
  Hash,
  Lightbulb,
  Crosshair,
  Layers,
  Zap,
} from 'lucide-react';
import {
  getPositionTier,
  categorizePage,
} from '../../lib/search-console/transform';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n?.toString() || '0';
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}

function formatDate(yyyymmdd) {
  if (!yyyymmdd) return '';
  const y = yyyymmdd.slice(0, 4);
  const m = yyyymmdd.slice(4, 6);
  const d = yyyymmdd.slice(6, 8);
  return `${d}/${m}`;
}

function formatDateISO(isoDate) {
  if (!isoDate) return '';
  const [, m, d] = isoDate.split('-');
  return `${d}/${m}`;
}

function deltaPercent(current, previous) {
  if (!previous || previous === 0) return null;
  return (((current - previous) / previous) * 100).toFixed(1);
}

function positionBadge(pos) {
  const t = getPositionTier(pos);
  return { bg: t.bg, color: t.color, label: `#${Number(pos).toFixed(0)}`, tier: t.short, hint: t.label };
}

function formatPeriodRange(period) {
  if (!period?.start || !period?.end) return 'Últimos 28 dias';
  const fmt = (iso) => {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };
  return `${fmt(period.start)} — ${fmt(period.end)}`;
}

// ─── Tela de Login ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Senha incorreta');
      } else {
        sessionStorage.setItem('admin_token', data.token);
        localStorage.setItem('disable_analytics', 'true');
        onLogin(data.token);
      }
    } catch {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginCard}>
        <div style={styles.loginLogo}>
          <div style={styles.loginLogoIcon}>
            <BarChart2 size={28} color="#4ade80" />
          </div>
          <div>
            <div style={styles.loginTitle}>CLT vs PJ</div>
            <div style={styles.loginSubtitle}>Analytics Admin</div>
          </div>
        </div>

        <p style={styles.loginDesc}>
          Acesso restrito ao proprietário do site.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha de acesso</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              style={styles.input}
              autoFocus
            />
          </div>

          {error && (
            <div style={styles.errorBox}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              ...styles.loginBtn,
              opacity: loading || !password ? 0.6 : 1,
            }}
          >
            {loading ? 'Verificando...' : 'Entrar no Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, delta, color, formatter, invertDelta }) {
  const deltaNum = parseFloat(delta);
  // Para posição média, menor é melhor, então inverter o sinal visual
  const isPositive = invertDelta ? deltaNum <= 0 : deltaNum >= 0;

  return (
    <div style={{ ...styles.kpiCard, borderTopColor: color }}>
      <div style={styles.kpiHeader}>
        <div style={{ ...styles.kpiIcon, background: color + '22' }}>
          <Icon size={20} color={color} />
        </div>
        {delta !== null && delta !== undefined && !isNaN(deltaNum) && (
          <div style={{ ...styles.kpiDelta, color: isPositive ? '#4ade80' : '#f87171' }}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{Math.abs(deltaNum)}%</span>
          </div>
        )}
      </div>
      <div style={styles.kpiValue}>
        {formatter ? formatter(value) : formatNumber(value)}
      </div>
      <div style={styles.kpiLabel}>{label}</div>
      {delta !== null && delta !== undefined && !isNaN(deltaNum) && (
        <div style={{ ...styles.kpiCompare, color: '#6b7280' }}>
          vs. 28 dias anteriores
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ width = '100%', height = 20, style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, #1f2335 25%, #252840 50%, #1f2335 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: 6,
        ...style,
      }}
    />
  );
}

// ─── Tabela de SEO ────────────────────────────────────────────────────────────

function PositionBadge({ position, showTier = false }) {
  const b = positionBadge(position);
  return (
    <span title={b.hint} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
      <span style={{ background: b.bg, color: b.color, padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
        {b.label}
      </span>
      {showTier && (
        <span style={{ fontSize: 10, color: '#6b7280' }}>{b.tier}</span>
      )}
    </span>
  );
}

function SeoInsightCard({ insight }) {
  return (
    <div style={{
      background: '#151824', border: `1px solid ${insight.color}33`, borderLeft: `3px solid ${insight.color}`,
      borderRadius: 10, padding: '14px 16px', flex: 1, minWidth: 220,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Lightbulb size={14} color={insight.color} />
        <span style={{ color: insight.color, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {insight.title}
        </span>
      </div>
      <p style={{ color: '#d1d5db', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{insight.body}</p>
    </div>
  );
}

function SeoTable({ rows, columns, loading, skeletonRows = 8 }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: skeletonRows }).map((_, i) => (
          <Skeleton key={i} height={40} />
        ))}
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div style={styles.noData}>Sem dados disponíveis</div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.seoTable}>
        <thead>
          <tr>
            <th style={{ ...styles.seoTh, width: 32, textAlign: 'center' }}>#</th>
            {columns.map((col) => (
              <th key={col.key} style={{ ...styles.seoTh, textAlign: col.align || 'left', width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} style={styles.seoTr}>
              <td style={{ ...styles.seoTd, color: '#4b5563', fontSize: 12, textAlign: 'center', fontWeight: 700 }}>
                {idx + 1}
              </td>
              {columns.map((col) => (
                <td key={col.key} style={{ ...styles.seoTd, textAlign: col.align || 'left' }}>
                  {col.render ? col.render(row[col.key], row) : (
                    <span style={{ color: col.color || '#e2e8f0', fontSize: 13 }}>
                      {row[col.key]}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Dashboard Principal ──────────────────────────────────────────────────────

function Dashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [data, setData] = useState(null);
  const [gscData, setGscData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gscLoading, setGscLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gscError, setGscError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const refreshRef = useRef(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { onLogout(); return; }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro desconhecido');
      setData(json);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, onLogout]);

  const fetchGSC = useCallback(async () => {
    setGscLoading(true);
    setGscError(null);
    try {
      const res = await fetch('/api/search-console', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { onLogout(); return; }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro desconhecido');
      setGscData(json);
    } catch (err) {
      setGscError(err.message);
    } finally {
      setGscLoading(false);
    }
  }, [token, onLogout]);

  useEffect(() => {
    fetchAnalytics();
    refreshRef.current = setInterval(fetchAnalytics, 5 * 60 * 1000);
    return () => clearInterval(refreshRef.current);
  }, [fetchAnalytics]);

  // Carrega GSC ao trocar para a aba SEO (lazy)
  useEffect(() => {
    if (activeTab === 'seo' && !gscData && !gscLoading) {
      fetchGSC();
    }
  }, [activeTab, gscData, gscLoading, fetchGSC]);

  function handleRefresh() {
    fetchAnalytics();
    if (activeTab === 'seo') fetchGSC();
  }

  // ── Gráfico de linha GA4 ──────────────────────────────────────────────────
  const lineData = data?.daily
    ? {
        labels: data.daily.map((d) => formatDate(d.date)),
        datasets: [
          {
            label: 'Usuários',
            data: data.daily.map((d) => d.users),
            borderColor: '#4ade80',
            backgroundColor: 'rgba(74, 222, 128, 0.08)',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#4ade80',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Sessões',
            data: data.daily.map((d) => d.sessions),
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96, 165, 250, 0.05)',
            borderWidth: 2,
            pointRadius: 2,
            pointBackgroundColor: '#60a5fa',
            fill: true,
            tension: 0.4,
          },
        ],
      }
    : null;

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#9ca3af', font: { size: 12 } } },
      tooltip: { backgroundColor: '#1f2335', titleColor: '#e2e8f0', bodyColor: '#9ca3af', borderColor: '#374151', borderWidth: 1 },
    },
    scales: {
      x: { ticks: { color: '#6b7280', font: { size: 11 } }, grid: { color: '#1f2335' } },
      y: { ticks: { color: '#6b7280', font: { size: 11 } }, grid: { color: '#1a1d2e' } },
    },
  };

  // ── Gráfico de barras GA4 ─────────────────────────────────────────────────
  const barData = data?.pages
    ? {
        labels: data.pages.slice(0, 8).map((p) =>
          p.path.length > 28 ? p.path.slice(0, 28) + '…' : p.path
        ),
        datasets: [{
          label: 'Pageviews',
          data: data.pages.slice(0, 8).map((p) => p.views),
          backgroundColor: 'rgba(96, 165, 250, 0.7)',
          borderColor: '#60a5fa',
          borderWidth: 1,
          borderRadius: 4,
        }],
      }
    : null;

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1f2335', titleColor: '#e2e8f0', bodyColor: '#9ca3af', borderColor: '#374151', borderWidth: 1 },
    },
    scales: {
      x: { ticks: { color: '#6b7280', font: { size: 11 } }, grid: { color: '#1a1d2e' } },
      y: { ticks: { color: '#d1d5db', font: { size: 11 } }, grid: { display: false } },
    },
  };

  // ── Gráfico rosca GA4 ─────────────────────────────────────────────────────
  const sourceColors = ['#4ade80', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa', '#fb923c'];
  const donutData = data?.sources
    ? {
        labels: data.sources.map((s) => s.channel),
        datasets: [{
          data: data.sources.map((s) => s.sessions),
          backgroundColor: sourceColors.slice(0, data.sources.length),
          borderColor: '#0f1117',
          borderWidth: 3,
          hoverOffset: 8,
        }],
      }
    : null;

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { position: 'bottom', labels: { color: '#9ca3af', font: { size: 12 }, padding: 16 } },
      tooltip: { backgroundColor: '#1f2335', titleColor: '#e2e8f0', bodyColor: '#9ca3af', borderColor: '#374151', borderWidth: 1 },
    },
  };

  // ── Gráfico de linha GSC ──────────────────────────────────────────────────
  const gscLineData = gscData?.daily
    ? {
        labels: gscData.daily.map((d) => formatDateISO(d.date)),
        datasets: [
          {
            label: 'Cliques',
            data: gscData.daily.map((d) => d.clicks),
            borderColor: '#4ade80',
            backgroundColor: 'rgba(74, 222, 128, 0.1)',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#4ade80',
            fill: true,
            tension: 0.4,
            yAxisID: 'y',
          },
          {
            label: 'Impressões',
            data: gscData.daily.map((d) => d.impressions),
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96, 165, 250, 0.05)',
            borderWidth: 2,
            pointRadius: 2,
            pointBackgroundColor: '#60a5fa',
            fill: true,
            tension: 0.4,
            yAxisID: 'y1',
          },
        ],
      }
    : null;

  const gscLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { labels: { color: '#9ca3af', font: { size: 12 } } },
      tooltip: {
        backgroundColor: '#1f2335', titleColor: '#e2e8f0', bodyColor: '#9ca3af', borderColor: '#374151', borderWidth: 1,
        callbacks: {
          afterBody: (items) => {
            const idx = items[0]?.dataIndex;
            const day = gscData?.daily?.[idx];
            if (!day?.position) return '';
            return `Posição média: #${day.position}`;
          },
        },
      },
    },
    scales: {
      x: { ticks: { color: '#6b7280', font: { size: 11 }, maxRotation: 0 }, grid: { color: '#1f2335' } },
      y: {
        type: 'linear', position: 'left',
        ticks: { color: '#4ade80', font: { size: 11 }, precision: 0 },
        grid: { color: '#1a1d2e' },
        title: { display: true, text: 'Cliques', color: '#4ade80', font: { size: 11 } },
      },
      y1: {
        type: 'linear', position: 'right',
        ticks: { color: '#60a5fa', font: { size: 11 }, precision: 0 },
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Impressões', color: '#60a5fa', font: { size: 11 } },
      },
    },
  };

  const gscPositionBarData = gscData?.positionDistribution?.length
    ? {
        labels: gscData.positionDistribution.map((b) => b.label),
        datasets: [{
          label: 'Queries',
          data: gscData.positionDistribution.map((b) => b.count),
          backgroundColor: gscData.positionDistribution.map((b) => b.color + 'cc'),
          borderColor: gscData.positionDistribution.map((b) => b.color),
          borderWidth: 1,
          borderRadius: 6,
        }],
      }
    : null;

  const gscPositionBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2335', titleColor: '#e2e8f0', bodyColor: '#9ca3af', borderColor: '#374151', borderWidth: 1,
        callbacks: {
          afterLabel: (ctx) => {
            const bucket = gscData.positionDistribution[ctx.dataIndex];
            return `${bucket.impressions} impressões`;
          },
        },
      },
    },
    scales: {
      x: { ticks: { color: '#9ca3af', font: { size: 11 } }, grid: { display: false } },
      y: { ticks: { color: '#6b7280', font: { size: 11 }, precision: 0 }, grid: { color: '#1a1d2e' } },
    },
  };

  const gscDeviceDonutData = gscData?.devices?.length
    ? {
        labels: gscData.devices.map((d) => d.label),
        datasets: [{
          data: gscData.devices.map((d) => d.impressions),
          backgroundColor: ['#60a5fa', '#4ade80', '#fbbf24'],
          borderColor: '#0f1117',
          borderWidth: 3,
          hoverOffset: 6,
        }],
      }
    : null;

  const gscPageTypeDonutData = gscData?.pageTypes?.length
    ? {
        labels: gscData.pageTypes.map((t) => t.label),
        datasets: [{
          data: gscData.pageTypes.map((t) => t.impressions),
          backgroundColor: gscData.pageTypes.map((t) => t.color + 'cc'),
          borderColor: gscData.pageTypes.map((t) => t.color),
          borderWidth: 2,
          hoverOffset: 6,
        }],
      }
    : null;

  const gscDonutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: { position: 'bottom', labels: { color: '#9ca3af', font: { size: 11 }, padding: 12 } },
      tooltip: {
        backgroundColor: '#1f2335', titleColor: '#e2e8f0', bodyColor: '#9ca3af', borderColor: '#374151', borderWidth: 1,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : 0;
            return ` ${ctx.label}: ${formatNumber(ctx.raw)} imp. (${pct}%)`;
          },
        },
      },
    },
  };

  const deviceIcon = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };
  const deviceColor = { desktop: '#60a5fa', mobile: '#4ade80', tablet: '#fbbf24' };
  const wc = data?.weekComparison;
  const gc = gscData?.comparison;

  // Colunas da tabela de queries
  const queryColumns = [
    {
      key: 'query', label: 'Palavra-chave',
      render: (v) => <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>{v}</span>,
    },
    {
      key: 'impressions', label: 'Impressões', align: 'right', width: 90,
      render: (v) => <span style={{ color: '#60a5fa', fontWeight: 600, fontFamily: 'monospace' }}>{formatNumber(v)}</span>,
    },
    {
      key: 'clicks', label: 'Cliques', align: 'right', width: 70,
      render: (v) => <span style={{ color: v > 0 ? '#4ade80' : '#4b5563', fontWeight: 600, fontFamily: 'monospace' }}>{v}</span>,
    },
    {
      key: 'ctr', label: 'CTR', align: 'right', width: 65,
      render: (v) => <span style={{ color: '#a78bfa', fontFamily: 'monospace' }}>{v}%</span>,
    },
    {
      key: 'position', label: 'Posição', align: 'right', width: 90,
      render: (v) => <PositionBadge position={v} showTier />,
    },
  ];

  const opportunityColumns = [
    {
      key: 'query', label: 'Query · zona 11–30',
      render: (v) => <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>{v}</span>,
    },
    {
      key: 'impressions', label: 'Impressões', align: 'right', width: 90,
      render: (v) => <span style={{ color: '#60a5fa', fontWeight: 600, fontFamily: 'monospace' }}>{formatNumber(v)}</span>,
    },
    {
      key: 'position', label: 'Posição', align: 'right', width: 90,
      render: (v) => <PositionBadge position={v} showTier />,
    },
    {
      key: 'action', label: 'Ação sugerida',
      render: (v) => <span style={{ color: '#9ca3af', fontSize: 12, lineHeight: 1.5 }}>{v}</span>,
    },
  ];

  const pageColumns = [
    {
      key: 'page', label: 'Página',
      render: (v, row) => {
        const cat = categorizePage(v);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ color: '#e2e8f0', fontSize: 12, fontFamily: 'monospace' }}>
              {v.length > 36 ? v.slice(0, 36) + '…' : v}
            </span>
            <span style={{
              alignSelf: 'flex-start', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.05em', padding: '2px 6px', borderRadius: 4,
              background: cat.color + '22', color: cat.color,
            }}>
              {cat.label}
            </span>
          </div>
        );
      },
    },
    {
      key: 'impressions', label: 'Impressões', align: 'right', width: 90,
      render: (v) => <span style={{ color: '#60a5fa', fontWeight: 600, fontFamily: 'monospace' }}>{formatNumber(v)}</span>,
    },
    {
      key: 'clicks', label: 'Cliques', align: 'right', width: 70,
      render: (v) => <span style={{ color: v > 0 ? '#4ade80' : '#4b5563', fontWeight: 600, fontFamily: 'monospace' }}>{v}</span>,
    },
    {
      key: 'ctr', label: 'CTR', align: 'right', width: 65,
      render: (v) => <span style={{ color: '#a78bfa', fontFamily: 'monospace' }}>{v}%</span>,
    },
    {
      key: 'position', label: 'Posição', align: 'right', width: 90,
      render: (v) => <PositionBadge position={v} showTier />,
    },
  ];

  return (
    <div style={styles.dashContainer}>
      {/* ── Sidebar ── */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <div style={styles.loginLogoIcon}>
            <BarChart2 size={22} color="#4ade80" />
          </div>
          <div>
            <div style={{ ...styles.loginTitle, fontSize: 15 }}>CLT vs PJ</div>
            <div style={{ ...styles.loginSubtitle, fontSize: 11 }}>Admin</div>
          </div>
        </div>

        <nav style={styles.sidebarNav}>
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              ...styles.sidebarNavItem,
              background: activeTab === 'analytics' ? 'rgba(74,222,128,0.08)' : 'transparent',
              border: activeTab === 'analytics' ? '1px solid rgba(74,222,128,0.15)' : '1px solid transparent',
              cursor: 'pointer',
              width: '100%',
              marginBottom: 6,
            }}
          >
            <BarChart2 size={16} color={activeTab === 'analytics' ? '#4ade80' : '#6b7280'} />
            <span style={{ color: activeTab === 'analytics' ? '#e2e8f0' : '#6b7280', fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
              Analytics
            </span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            style={{
              ...styles.sidebarNavItem,
              background: activeTab === 'seo' ? 'rgba(96,165,250,0.08)' : 'transparent',
              border: activeTab === 'seo' ? '1px solid rgba(96,165,250,0.15)' : '1px solid transparent',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <Search size={16} color={activeTab === 'seo' ? '#60a5fa' : '#6b7280'} />
            <span style={{ color: activeTab === 'seo' ? '#e2e8f0' : '#6b7280', fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
              SEO / Google
            </span>
            {gscData?.configured && (
              <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
            )}
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          {lastRefresh && (
            <div style={styles.lastRefresh}>
              Atualizado às {lastRefresh.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
          <button onClick={handleRefresh} disabled={loading} style={styles.refreshBtn}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>Atualizar</span>
          </button>
          <button onClick={onLogout} style={styles.logoutBtn}>
            <LogOut size={14} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={styles.mainContent}>

        {/* ══════════════════════════════════════════════════════════════════
            ABA: ANALYTICS (GA4)
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'analytics' && (
          <>
            {/* Header */}
            <div style={styles.pageHeader}>
              <div>
                <h1 style={styles.pageTitle}>Dashboard de Analytics</h1>
                <p style={styles.pageSubtitle}>Últimos 30 dias · GA4 {process.env.NEXT_PUBLIC_GA_ID || 'G-Z58J44F2DW'}</p>
              </div>
              <div style={styles.headerStatus}>
                {data?.configured === false ? (
                  <div style={{ ...styles.statusBadge, background: '#fbbf2422', color: '#fbbf24' }}>
                    <WifiOff size={14} /> Sem credenciais GA4
                  </div>
                ) : data ? (
                  <div style={{ ...styles.statusBadge, background: '#4ade8022', color: '#4ade80' }}>
                    <CheckCircle size={14} /> Dados ao vivo
                  </div>
                ) : null}
              </div>
            </div>

            {/* Aviso GA4 */}
            {data?.configured === false && (
              <div style={styles.warningBanner}>
                <AlertCircle size={18} color="#fbbf24" />
                <div>
                  <strong style={{ color: '#fbbf24' }}>Configure as credenciais do GA4</strong>
                  <p style={{ color: '#d1d5db', marginTop: 4, fontSize: 13 }}>{data.message}</p>
                </div>
              </div>
            )}

            {error && (
              <div style={{ ...styles.warningBanner, borderColor: '#f8717166', background: '#f8717111' }}>
                <AlertCircle size={18} color="#f87171" />
                <div>
                  <strong style={{ color: '#f87171' }}>Erro ao carregar dados</strong>
                  <p style={{ color: '#d1d5db', marginTop: 4, fontSize: 13 }}>{error}</p>
                </div>
              </div>
            )}

            {/* KPIs GA4 */}
            <div style={styles.kpiGrid}>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ ...styles.kpiCard, borderTopColor: '#374151' }}>
                    <Skeleton height={36} style={{ marginBottom: 12 }} />
                    <Skeleton height={28} width="60%" style={{ marginBottom: 8 }} />
                    <Skeleton height={14} width="80%" />
                  </div>
                ))
              ) : data?.kpis ? (
                <>
                  <KpiCard icon={Users} label="Usuários Ativos" value={data.kpis.users}
                    delta={wc ? deltaPercent(wc.users.current, wc.users.previous) : null} color="#4ade80" />
                  <KpiCard icon={MousePointerClick} label="Sessões" value={data.kpis.sessions}
                    delta={wc ? deltaPercent(wc.sessions.current, wc.sessions.previous) : null} color="#60a5fa" />
                  <KpiCard icon={Eye} label="Pageviews" value={data.kpis.pageviews}
                    delta={wc ? deltaPercent(wc.pageviews.current, wc.pageviews.previous) : null} color="#a78bfa" />
                  <KpiCard icon={TrendingUp} label="Novos Usuários" value={data.kpis.newUsers} color="#f472b6" />
                  <KpiCard icon={Clock} label="Duração Média" value={data.kpis.avgSessionDuration}
                    color="#fbbf24" formatter={formatDuration} />
                  <KpiCard icon={TrendingDown} label="Taxa de Rejeição" value={data.kpis.bounceRate}
                    color="#fb923c" formatter={(v) => `${v}%`} />
                </>
              ) : null}
            </div>

            {/* Gráfico linha */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h2 style={styles.chartTitle}>Usuários e Sessões por Dia</h2>
                <span style={styles.chartSubtitle}>Últimos 30 dias</span>
              </div>
              <div style={{ height: 260 }}>
                {loading ? <Skeleton height={260} /> : lineData ? <Line data={lineData} options={lineOptions} /> : <div style={styles.noData}>Sem dados</div>}
              </div>
            </div>

            {/* Grid: Páginas + Origens */}
            <div style={styles.gridTwo}>
              <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                  <h2 style={styles.chartTitle}>Top Páginas</h2>
                  <span style={styles.chartSubtitle}>Por pageviews</span>
                </div>
                <div style={{ height: 280 }}>
                  {loading ? <Skeleton height={280} /> : barData ? <Bar data={barData} options={barOptions} /> : <div style={styles.noData}>Sem dados</div>}
                </div>
              </div>

              <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                  <h2 style={styles.chartTitle}>Origens de Tráfego</h2>
                  <span style={styles.chartSubtitle}>Por canal</span>
                </div>
                <div style={{ height: 280 }}>
                  {loading ? <Skeleton height={280} /> : donutData ? <Doughnut data={donutData} options={donutOptions} /> : <div style={styles.noData}>Sem dados</div>}
                </div>
              </div>
            </div>

            {/* Grid: Dispositivos + Países */}
            <div style={styles.gridTwo}>
              <div style={styles.chartCard}>
                <div style={styles.chartHeader}><h2 style={styles.chartTitle}>Dispositivos</h2></div>
                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[1, 2, 3].map((i) => <Skeleton key={i} height={52} />)}
                  </div>
                ) : data?.devices ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(() => {
                      const total = data.devices.reduce((a, d) => a + d.sessions, 0);
                      return data.devices.map((d) => {
                        const key = d.device.toLowerCase();
                        const DevIcon = deviceIcon[key] || Monitor;
                        const color = deviceColor[key] || '#9ca3af';
                        const pct = total > 0 ? ((d.sessions / total) * 100).toFixed(1) : 0;
                        return (
                          <div key={d.device} style={styles.deviceRow}>
                            <div style={{ ...styles.deviceIcon, background: color + '22' }}>
                              <DevIcon size={18} color={color} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={styles.deviceLabel}>
                                <span style={{ color: '#e2e8f0', textTransform: 'capitalize' }}>{d.device}</span>
                                <span style={{ color: '#9ca3af' }}>{formatNumber(d.sessions)} sessões · {pct}%</span>
                              </div>
                              <div style={styles.progressTrack}>
                                <div style={{ ...styles.progressBar, width: `${pct}%`, background: color }} />
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                ) : <div style={styles.noData}>Sem dados</div>}
              </div>

              <div style={styles.chartCard}>
                <div style={styles.chartHeader}><h2 style={styles.chartTitle}>Top Países</h2></div>
                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height={44} />)}
                  </div>
                ) : data?.countries ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(() => {
                      const total = data.countries.reduce((a, c) => a + c.sessions, 0);
                      return data.countries.map((c, idx) => {
                        const pct = total > 0 ? ((c.sessions / total) * 100).toFixed(1) : 0;
                        return (
                          <div key={c.country} style={styles.countryRow}>
                            <span style={styles.countryRank}>{idx + 1}</span>
                            <Globe size={14} color="#6b7280" />
                            <span style={{ flex: 1, color: '#e2e8f0', fontSize: 13 }}>{c.country}</span>
                            <div style={styles.countryBar}>
                              <div style={{ ...styles.countryFill, width: `${pct}%` }} />
                            </div>
                            <span style={{ color: '#9ca3af', fontSize: 12, minWidth: 36, textAlign: 'right' }}>{pct}%</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                ) : <div style={styles.noData}>Sem dados</div>}
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            ABA: SEO / SEARCH CONSOLE
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'seo' && (
          <>
            <div style={styles.pageHeader}>
              <div>
                <h1 style={styles.pageTitle}>SEO · Google Search Console</h1>
                <p style={styles.pageSubtitle}>
                  {formatPeriodRange(gscData?.period)} · {gscData?.siteHost || 'calculadora-cltvspj.vercel.app'}
                  {gscData?.period?.lagDays ? ` · dados com ${gscData.period.lagDays}d de atraso (normal no GSC)` : ''}
                </p>
              </div>
              <div style={styles.headerStatus}>
                {gscData?.configured === false ? (
                  <div style={{ ...styles.statusBadge, background: '#fbbf2422', color: '#fbbf24' }}>
                    <WifiOff size={14} /> Não configurado
                  </div>
                ) : gscData?.configured ? (
                  <div style={{ ...styles.statusBadge, background: '#60a5fa22', color: '#60a5fa' }}>
                    <Search size={14} /> Conectado
                  </div>
                ) : null}
              </div>
            </div>

            {gscData?.configured === false && (
              <div style={{ ...styles.warningBanner, borderColor: '#fbbf2433', background: '#fbbf2411', marginBottom: 24 }}>
                <AlertCircle size={18} color="#fbbf24" />
                <div>
                  <strong style={{ color: '#fbbf24' }}>Search Console não configurado</strong>
                  <p style={{ color: '#d1d5db', marginTop: 6, fontSize: 13, lineHeight: 1.7 }}>
                    Execute no terminal para conectar sua conta Google:<br />
                    <code style={{ background: '#0f1117', padding: '2px 8px', borderRadius: 4, color: '#4ade80', marginTop: 4, display: 'inline-block', fontSize: 12 }}>
                      node scripts/setup-gsc.mjs
                    </code>
                  </p>
                </div>
              </div>
            )}

            {gscError && (
              <div style={{ ...styles.warningBanner, borderColor: '#f8717166', background: '#f8717111' }}>
                <AlertCircle size={18} color="#f87171" />
                <div>
                  <strong style={{ color: '#f87171' }}>Erro ao carregar Search Console</strong>
                  <p style={{ color: '#d1d5db', marginTop: 4, fontSize: 13 }}>{gscError}</p>
                </div>
              </div>
            )}

            {/* KPIs principais */}
            <div style={{ ...styles.kpiGrid, gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {gscLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ ...styles.kpiCard, borderTopColor: '#374151' }}>
                    <Skeleton height={36} style={{ marginBottom: 12 }} />
                    <Skeleton height={28} width="60%" style={{ marginBottom: 8 }} />
                    <Skeleton height={14} width="80%" />
                  </div>
                ))
              ) : gscData?.configured && gscData.kpis ? (
                <>
                  <KpiCard icon={Eye} label="Impressões" value={gscData.kpis.impressions}
                    delta={gc ? deltaPercent(gc.impressions.current, gc.impressions.previous) : null}
                    color="#60a5fa" />
                  <KpiCard icon={MousePointerClick} label="Cliques Orgânicos" value={gscData.kpis.clicks}
                    delta={gc ? deltaPercent(gc.clicks.current, gc.clicks.previous) : null}
                    color="#4ade80" />
                  <KpiCard icon={Crosshair} label="Oportunidades 11–30" value={gscData.meta?.strikingCount ?? 0}
                    color="#fbbf24" formatter={(v) => v.toString()} />
                  <KpiCard icon={Hash} label="Posição Média" value={gscData.kpis.position}
                    delta={gc ? deltaPercent(gc.position.current, gc.position.previous) : null}
                    color="#9ca3af" formatter={(v) => `#${v}`} invertDelta />
                </>
              ) : null}
            </div>

            {/* Nota sobre posição média */}
            {gscData?.configured && gscData.kpis && (
              <div style={{
                background: '#1a1d2e', border: '1px solid #1f2335', borderRadius: 10,
                padding: '12px 16px', marginBottom: 20, fontSize: 12, color: '#9ca3af', lineHeight: 1.6,
              }}>
                <strong style={{ color: '#d1d5db' }}>Como ler estes números:</strong>{' '}
                Impressões = Google já mostra seu site. Posição média (#{gscData.kpis.position}) é puxada por queries genéricas —
                foque nas queries individuais na faixa <span style={{ color: '#fbbf24' }}>11–30</span> (tabela abaixo), não na média do site.
                CTR {gscData.kpis.ctr}% com {gscData.kpis.clicks} cliques = fase de descoberta, típico em domínio novo.
              </div>
            )}

            {/* Insights automáticos */}
            {gscData?.insights?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Lightbulb size={16} color="#fbbf24" />
                  <h2 style={{ ...styles.chartTitle, margin: 0 }}>Diagnóstico automático</h2>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {gscData.insights.map((insight) => (
                    <SeoInsightCard key={insight.title} insight={insight} />
                  ))}
                </div>
              </div>
            )}

            {/* Ações recomendadas */}
            {gscData?.actions?.length > 0 && (
              <div style={{
                background: '#151824', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 12,
                padding: '16px 20px', marginBottom: 20,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Zap size={16} color="#4ade80" />
                  <span style={{ color: '#4ade80', fontWeight: 700, fontSize: 13 }}>Próximas ações sugeridas</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, color: '#d1d5db', fontSize: 13, lineHeight: 1.8 }}>
                  {gscData.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gráfico tendência */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h2 style={styles.chartTitle}>Tendência diária</h2>
                <span style={styles.chartSubtitle}>Cliques (esq.) · Impressões (dir.) · hover mostra posição média do dia</span>
              </div>
              <div style={{ height: 280 }}>
                {gscLoading ? <Skeleton height={280} />
                  : gscLineData ? <Line data={gscLineData} options={gscLineOptions} />
                  : <div style={styles.noData}>Sem dados disponíveis</div>}
              </div>
            </div>

            {/* Distribuição + dispositivos */}
            <div style={styles.gridTwo}>
              <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Layers size={16} color="#fbbf24" />
                    <h2 style={styles.chartTitle}>Queries por faixa de posição</h2>
                  </div>
                  <span style={styles.chartSubtitle}>Quantas keywords em cada página do Google</span>
                </div>
                <div style={{ height: 240 }}>
                  {gscLoading ? <Skeleton height={240} />
                    : gscPositionBarData ? <Bar data={gscPositionBarData} options={gscPositionBarOptions} />
                    : <div style={styles.noData}>Sem dados</div>}
                </div>
              </div>

              <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                  <h2 style={styles.chartTitle}>Impressões por tipo de página</h2>
                  <span style={styles.chartSubtitle}>Onde o Google está mostrando o site</span>
                </div>
                <div style={{ height: 240 }}>
                  {gscLoading ? <Skeleton height={240} />
                    : gscPageTypeDonutData ? <Doughnut data={gscPageTypeDonutData} options={gscDonutOptions} />
                    : gscDeviceDonutData ? <Doughnut data={gscDeviceDonutData} options={gscDonutOptions} />
                    : <div style={styles.noData}>Sem dados</div>}
                </div>
              </div>
            </div>

            {/* Oportunidades — minas de ouro */}
            <div style={{ ...styles.chartCard, borderColor: 'rgba(251,191,36,0.25)' }}>
              <div style={styles.chartHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Crosshair size={16} color="#fbbf24" />
                  <h2 style={styles.chartTitle}>Oportunidades · posição 11–30</h2>
                </div>
                <span style={styles.chartSubtitle}>
                  Minas de ouro — mais fácil subir da posição 24 para 8 do que de 90 para 8
                </span>
              </div>
              <SeoTable
                rows={gscData?.strikingDistance}
                columns={opportunityColumns}
                loading={gscLoading}
                skeletonRows={5}
              />
              {!gscLoading && gscData?.configured && (!gscData.strikingDistance || gscData.strikingDistance.length === 0) && (
                <p style={{ color: '#6b7280', fontSize: 13, marginTop: 12, fontStyle: 'italic' }}>
                  Nenhuma query na faixa 11–30 com impressões ainda. Continue indexando e aguarde 2–4 semanas.
                </p>
              )}
            </div>

            {/* Tabelas queries + páginas */}
            <div style={styles.gridTwo}>
              <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Search size={16} color="#4ade80" />
                    <h2 style={styles.chartTitle}>Top palavras-chave</h2>
                  </div>
                  <span style={styles.chartSubtitle}>Ordenado por impressões · até 50 queries</span>
                </div>
                <SeoTable rows={gscData?.queries?.slice(0, 15)} columns={queryColumns} loading={gscLoading} />
              </div>

              <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={16} color="#60a5fa" />
                    <h2 style={styles.chartTitle}>Top páginas no Google</h2>
                  </div>
                  <span style={styles.chartSubtitle}>
                    {gscData?.meta?.pagesWithImpressions ?? 0} URL(s) com impressões no período
                  </span>
                </div>
                <SeoTable rows={gscData?.pages} columns={pageColumns} loading={gscLoading} />
              </div>
            </div>

            {gscData?.configured && (
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, fontSize: 12, color: '#6b7280', alignItems: 'center',
                padding: '12px 16px', background: '#151824', borderRadius: 10, border: '1px solid #1f2335',
              }}>
                <span style={{ fontWeight: 600, color: '#9ca3af' }}>Legenda de posição:</span>
                <span style={{ background: '#4ade8022', color: '#4ade80', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>Top 3</span>
                <span style={{ background: '#86efac22', color: '#86efac', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>Pág. 1 (4–10)</span>
                <span style={{ background: '#fbbf2422', color: '#fbbf24', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>Pág. 2 · ouro (11–20)</span>
                <span style={{ background: '#fb923c22', color: '#fb923c', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>Pág. 3 · atacável (21–30)</span>
                <span style={{ background: '#f8717122', color: '#f87171', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>31+</span>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div style={styles.dashFooter}>
          <span>CLT vs PJ · Admin Dashboard · 2026</span>
          {lastRefresh && (
            <span>Última atualização: {lastRefresh.toLocaleString('pt-BR')}</span>
          )}
        </div>
      </main>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0f1117; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
      `}</style>
    </div>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_token');
    if (saved) setToken(saved);
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <>
      <Head>
        <title>Admin · CLT vs PJ Analytics</title>
        <meta name="robots" content="noindex, nofollow" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {token ? (
        <Dashboard token={token} onLogout={() => { sessionStorage.removeItem('admin_token'); setToken(null); }} />
      ) : (
        <LoginScreen onLogin={(t) => setToken(t)} />
      )}
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  // Login
  loginContainer: {
    minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: 24,
  },
  loginCard: {
    background: '#151824', border: '1px solid #1f2335', borderRadius: 16,
    padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
  },
  loginLogo: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 },
  loginLogoIcon: {
    width: 44, height: 44, background: 'rgba(74,222,128,0.12)', borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(74,222,128,0.2)',
  },
  loginTitle: { color: '#e2e8f0', fontWeight: 700, fontSize: 18, lineHeight: 1.2 },
  loginSubtitle: { color: '#6b7280', fontSize: 13, marginTop: 2 },
  loginDesc: { color: '#9ca3af', fontSize: 14, marginBottom: 28, lineHeight: 1.6 },
  inputGroup: { marginBottom: 16 },
  label: { display: 'block', color: '#d1d5db', fontSize: 13, fontWeight: 500, marginBottom: 8 },
  input: {
    width: '100%', padding: '12px 16px', background: '#0f1117', border: '1px solid #374151',
    borderRadius: 10, color: '#e2e8f0', fontSize: 15, outline: 'none', fontFamily: "'Inter', sans-serif",
  },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: 8, background: '#f8717111',
    border: '1px solid #f8717133', borderRadius: 8, padding: '10px 14px',
    color: '#f87171', fontSize: 13, marginBottom: 16,
  },
  loginBtn: {
    width: '100%', padding: '13px', background: 'linear-gradient(135deg, #4ade80, #22c55e)',
    border: 'none', borderRadius: 10, color: '#0f1117', fontWeight: 700, fontSize: 15,
    cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'opacity 0.2s', marginTop: 8,
  },

  // Dashboard
  dashContainer: { display: 'flex', minHeight: '100vh', background: '#0f1117', fontFamily: "'Inter', sans-serif", color: '#e2e8f0' },

  // Sidebar
  sidebar: {
    width: 220, minHeight: '100vh', background: '#151824', borderRight: '1px solid #1f2335',
    display: 'flex', flexDirection: 'column', padding: '24px 16px', flexShrink: 0,
  },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #1f2335' },
  sidebarNav: { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 },
  sidebarNavItem: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
    borderRadius: 8, fontSize: 14, fontWeight: 500, background: 'transparent', border: '1px solid transparent',
  },
  sidebarFooter: { display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 24, borderTop: '1px solid #1f2335' },
  lastRefresh: { color: '#6b7280', fontSize: 11, textAlign: 'center', marginBottom: 4 },
  refreshBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px',
    background: '#1f2335', border: '1px solid #374151', borderRadius: 8, color: '#9ca3af',
    fontSize: 13, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'background 0.2s',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px',
    background: 'transparent', border: '1px solid #374151', borderRadius: 8, color: '#6b7280',
    fontSize: 13, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
  },

  // Main
  mainContent: { flex: 1, padding: '28px 32px', overflowY: 'auto', maxWidth: 1320 },
  pageHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 },
  pageTitle: { fontSize: 24, fontWeight: 700, color: '#f1f5f9', margin: 0 },
  pageSubtitle: { color: '#6b7280', fontSize: 13, marginTop: 6, margin: '6px 0 0' },
  headerStatus: { display: 'flex', alignItems: 'center', gap: 8 },
  statusBadge: { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500 },

  // Warning
  warningBanner: {
    display: 'flex', gap: 14, background: '#fbbf2411', border: '1px solid #fbbf2433',
    borderRadius: 12, padding: '16px 20px', marginBottom: 24, alignItems: 'flex-start',
  },

  // KPI Grid
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 },
  kpiCard: {
    background: '#151824', border: '1px solid #1f2335', borderTop: '3px solid',
    borderRadius: 12, padding: '20px 20px 16px', transition: 'transform 0.2s, box-shadow 0.2s',
  },
  kpiHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  kpiIcon: { width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  kpiDelta: { display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600 },
  kpiValue: { fontSize: 32, fontWeight: 700, color: '#f1f5f9', lineHeight: 1, marginBottom: 6 },
  kpiLabel: { color: '#9ca3af', fontSize: 13, fontWeight: 500 },
  kpiCompare: { fontSize: 11, marginTop: 4 },

  // Charts
  chartCard: { background: '#151824', border: '1px solid #1f2335', borderRadius: 12, padding: '22px 24px', marginBottom: 20 },
  chartHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  chartTitle: { color: '#f1f5f9', fontSize: 15, fontWeight: 600, margin: 0 },
  chartSubtitle: { color: '#6b7280', fontSize: 12 },
  gridTwo: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 },

  // Devices
  deviceRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#1a1d2e', borderRadius: 10 },
  deviceIcon: { width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  deviceLabel: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontSize: 13, fontWeight: 500 },
  progressTrack: { height: 5, background: '#0f1117', borderRadius: 3, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 3, transition: 'width 0.6s ease' },

  // Countries
  countryRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', borderBottom: '1px solid #1f2335' },
  countryRank: { color: '#4b5563', fontSize: 12, fontWeight: 700, minWidth: 18 },
  countryBar: { flex: 1, height: 4, background: '#1f2335', borderRadius: 2, overflow: 'hidden', minWidth: 60 },
  countryFill: { height: '100%', background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', borderRadius: 2, transition: 'width 0.6s ease' },

  // SEO Table
  seoTable: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  seoTh: {
    padding: '8px 12px', color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
    letterSpacing: '0.05em', borderBottom: '1px solid #1f2335', background: '#0f1117',
  },
  seoTr: { borderBottom: '1px solid #1f2335', transition: 'background 0.15s' },
  seoTd: { padding: '10px 12px', verticalAlign: 'middle' },

  // Footer
  dashFooter: { display: 'flex', justifyContent: 'space-between', color: '#374151', fontSize: 12, marginTop: 16, paddingTop: 20, borderTop: '1px solid #1f2335' },

  // No data
  noData: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 100, color: '#4b5563', fontSize: 14, fontStyle: 'italic' },
};
