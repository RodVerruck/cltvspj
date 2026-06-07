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
} from 'lucide-react';

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

function deltaPercent(current, previous) {
  if (!previous || previous === 0) return null;
  return (((current - previous) / previous) * 100).toFixed(1);
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
        {/* Logo */}
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

function KpiCard({ icon: Icon, label, value, delta, color, formatter }) {
  const deltaNum = parseFloat(delta);
  const isPositive = deltaNum >= 0;

  return (
    <div style={{ ...styles.kpiCard, borderTopColor: color }}>
      <div style={styles.kpiHeader}>
        <div style={{ ...styles.kpiIcon, background: color + '22' }}>
          <Icon size={20} color={color} />
        </div>
        {delta !== null && delta !== undefined && (
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
      {delta !== null && delta !== undefined && (
        <div style={{ ...styles.kpiCompare, color: '#6b7280' }}>
          vs. semana anterior
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

// ─── Dashboard Principal ──────────────────────────────────────────────────────

function Dashboard({ token, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const refreshRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        onLogout();
        return;
      }
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

  useEffect(() => {
    fetchData();
    // Auto-refresh a cada 5 minutos
    refreshRef.current = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(refreshRef.current);
  }, [fetchData]);

  // ── Gráfico de linha (usuários por dia) ──────────────────────────────────
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
      legend: {
        labels: { color: '#9ca3af', font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: '#1f2335',
        titleColor: '#e2e8f0',
        bodyColor: '#9ca3af',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#6b7280', font: { size: 11 } },
        grid: { color: '#1f2335' },
      },
      y: {
        ticks: { color: '#6b7280', font: { size: 11 } },
        grid: { color: '#1a1d2e' },
      },
    },
  };

  // ── Gráfico de barras (páginas) ───────────────────────────────────────────
  const barData = data?.pages
    ? {
        labels: data.pages.slice(0, 8).map((p) =>
          p.path.length > 28 ? p.path.slice(0, 28) + '…' : p.path
        ),
        datasets: [
          {
            label: 'Pageviews',
            data: data.pages.slice(0, 8).map((p) => p.views),
            backgroundColor: 'rgba(96, 165, 250, 0.7)',
            borderColor: '#60a5fa',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      }
    : null;

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2335',
        titleColor: '#e2e8f0',
        bodyColor: '#9ca3af',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#6b7280', font: { size: 11 } },
        grid: { color: '#1a1d2e' },
      },
      y: {
        ticks: { color: '#d1d5db', font: { size: 11 } },
        grid: { display: false },
      },
    },
  };

  // ── Gráfico rosca (origens) ───────────────────────────────────────────────
  const sourceColors = ['#4ade80', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa', '#fb923c'];
  const donutData = data?.sources
    ? {
        labels: data.sources.map((s) => s.channel),
        datasets: [
          {
            data: data.sources.map((s) => s.sessions),
            backgroundColor: sourceColors.slice(0, data.sources.length),
            borderColor: '#0f1117',
            borderWidth: 3,
            hoverOffset: 8,
          },
        ],
      }
    : null;

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#9ca3af', font: { size: 12 }, padding: 16 },
      },
      tooltip: {
        backgroundColor: '#1f2335',
        titleColor: '#e2e8f0',
        bodyColor: '#9ca3af',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
  };

  const deviceIcon = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };
  const deviceColor = { desktop: '#60a5fa', mobile: '#4ade80', tablet: '#fbbf24' };

  const wc = data?.weekComparison;

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
          <div style={styles.sidebarNavItem}>
            <BarChart2 size={16} color="#4ade80" />
            <span style={{ color: '#e2e8f0' }}>Analytics</span>
          </div>
        </nav>

        <div style={styles.sidebarFooter}>
          {lastRefresh && (
            <div style={styles.lastRefresh}>
              Atualizado às {lastRefresh.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
          <button onClick={fetchData} disabled={loading} style={styles.refreshBtn}>
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
        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Dashboard de Analytics</h1>
            <p style={styles.pageSubtitle}>Últimos 30 dias · Propriedade GA4: {process.env.NEXT_PUBLIC_GA_ID || 'G-Z58J44F2DW'}</p>
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

        {/* Aviso: GA4 não configurado */}
        {data?.configured === false && (
          <div style={styles.warningBanner}>
            <AlertCircle size={18} color="#fbbf24" />
            <div>
              <strong style={{ color: '#fbbf24' }}>Configure as credenciais do GA4</strong>
              <p style={{ color: '#d1d5db', marginTop: 4, fontSize: 13 }}>
                {data.message}
              </p>
              <p style={{ color: '#9ca3af', marginTop: 6, fontSize: 12 }}>
                1. Crie uma Service Account no Google Cloud Console<br />
                2. Adicione-a como leitora na propriedade GA4<br />
                3. Preencha <code style={{ background: '#1f2335', padding: '1px 6px', borderRadius: 4 }}>GA4_PROPERTY_ID</code>, <code style={{ background: '#1f2335', padding: '1px 6px', borderRadius: 4 }}>GA4_CLIENT_EMAIL</code> e <code style={{ background: '#1f2335', padding: '1px 6px', borderRadius: 4 }}>GA4_PRIVATE_KEY</code> no <code style={{ background: '#1f2335', padding: '1px 6px', borderRadius: 4 }}>.env.local</code><br />
                4. Reinicie o servidor (<code style={{ background: '#1f2335', padding: '1px 6px', borderRadius: 4 }}>npm run dev</code>)
              </p>
            </div>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div style={{ ...styles.warningBanner, borderColor: '#f8717166', background: '#f8717111' }}>
            <AlertCircle size={18} color="#f87171" />
            <div>
              <strong style={{ color: '#f87171' }}>Erro ao carregar dados</strong>
              <p style={{ color: '#d1d5db', marginTop: 4, fontSize: 13 }}>{error}</p>
            </div>
          </div>
        )}

        {/* ── KPIs principais ── */}
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
              <KpiCard
                icon={Users}
                label="Usuários Ativos"
                value={data.kpis.users}
                delta={wc ? deltaPercent(wc.users.current, wc.users.previous) : null}
                color="#4ade80"
              />
              <KpiCard
                icon={MousePointerClick}
                label="Sessões"
                value={data.kpis.sessions}
                delta={wc ? deltaPercent(wc.sessions.current, wc.sessions.previous) : null}
                color="#60a5fa"
              />
              <KpiCard
                icon={Eye}
                label="Pageviews"
                value={data.kpis.pageviews}
                delta={wc ? deltaPercent(wc.pageviews.current, wc.pageviews.previous) : null}
                color="#a78bfa"
              />
              <KpiCard
                icon={TrendingUp}
                label="Novos Usuários"
                value={data.kpis.newUsers}
                color="#f472b6"
              />
              <KpiCard
                icon={Clock}
                label="Duração Média"
                value={data.kpis.avgSessionDuration}
                color="#fbbf24"
                formatter={formatDuration}
              />
              <KpiCard
                icon={TrendingDown}
                label="Taxa de Rejeição"
                value={data.kpis.bounceRate}
                color="#fb923c"
                formatter={(v) => `${v}%`}
              />
            </>
          ) : null}
        </div>

        {/* ── Gráfico de linha ── */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h2 style={styles.chartTitle}>Usuários e Sessões por Dia</h2>
            <span style={styles.chartSubtitle}>Últimos 30 dias</span>
          </div>
          <div style={{ height: 260 }}>
            {loading ? (
              <Skeleton height={260} />
            ) : lineData ? (
              <Line data={lineData} options={lineOptions} />
            ) : (
              <div style={styles.noData}>Sem dados disponíveis</div>
            )}
          </div>
        </div>

        {/* ── Grid: Páginas + Origens ── */}
        <div style={styles.gridTwo}>
          {/* Top páginas */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h2 style={styles.chartTitle}>Top Páginas</h2>
              <span style={styles.chartSubtitle}>Por pageviews</span>
            </div>
            <div style={{ height: 280 }}>
              {loading ? (
                <Skeleton height={280} />
              ) : barData ? (
                <Bar data={barData} options={barOptions} />
              ) : (
                <div style={styles.noData}>Sem dados</div>
              )}
            </div>
          </div>

          {/* Origens de tráfego */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h2 style={styles.chartTitle}>Origens de Tráfego</h2>
              <span style={styles.chartSubtitle}>Por canal</span>
            </div>
            <div style={{ height: 280 }}>
              {loading ? (
                <Skeleton height={280} />
              ) : donutData ? (
                <Doughnut data={donutData} options={donutOptions} />
              ) : (
                <div style={styles.noData}>Sem dados</div>
              )}
            </div>
          </div>
        </div>

        {/* ── Grid: Dispositivos + Países ── */}
        <div style={styles.gridTwo}>
          {/* Dispositivos */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h2 style={styles.chartTitle}>Dispositivos</h2>
            </div>
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
            ) : (
              <div style={styles.noData}>Sem dados</div>
            )}
          </div>

          {/* Países */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h2 style={styles.chartTitle}>Top Países</h2>
            </div>
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
            ) : (
              <div style={styles.noData}>Sem dados</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={styles.dashFooter}>
          <span>CLT vs PJ · Analytics Dashboard · 2026</span>
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

  function handleLogin(t) {
    setToken(t);
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_token');
    setToken(null);
  }

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
        <Dashboard token={token} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </>
  );
}

// ─── Styles (JS-in-CSS para isolamento total do design system do site) ────────

const styles = {
  // Login
  loginContainer: {
    minHeight: '100vh',
    background: '#0f1117',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif",
    padding: 24,
  },
  loginCard: {
    background: '#151824',
    border: '1px solid #1f2335',
    borderRadius: 16,
    padding: '40px 36px',
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
  },
  loginLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
  },
  loginLogoIcon: {
    width: 44,
    height: 44,
    background: 'rgba(74,222,128,0.12)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(74,222,128,0.2)',
  },
  loginTitle: {
    color: '#e2e8f0',
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 1.2,
  },
  loginSubtitle: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 2,
  },
  loginDesc: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 28,
    lineHeight: 1.6,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    display: 'block',
    color: '#d1d5db',
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: '#0f1117',
    border: '1px solid #374151',
    borderRadius: 10,
    color: '#e2e8f0',
    fontSize: 15,
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#f8717111',
    border: '1px solid #f8717133',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#f87171',
    fontSize: 13,
    marginBottom: 16,
  },
  loginBtn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
    border: 'none',
    borderRadius: 10,
    color: '#0f1117',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'opacity 0.2s',
    marginTop: 8,
  },

  // Dashboard
  dashContainer: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0f1117',
    fontFamily: "'Inter', sans-serif",
    color: '#e2e8f0',
  },

  // Sidebar
  sidebar: {
    width: 220,
    minHeight: '100vh',
    background: '#151824',
    borderRight: '1px solid #1f2335',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    flexShrink: 0,
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
    paddingBottom: 24,
    borderBottom: '1px solid #1f2335',
  },
  sidebarNav: {
    flex: 1,
  },
  sidebarNavItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    background: 'rgba(74,222,128,0.08)',
    border: '1px solid rgba(74,222,128,0.15)',
    cursor: 'default',
    fontSize: 14,
    fontWeight: 500,
  },
  sidebarFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    paddingTop: 24,
    borderTop: '1px solid #1f2335',
  },
  lastRefresh: {
    color: '#6b7280',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 4,
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    padding: '9px',
    background: '#1f2335',
    border: '1px solid #374151',
    borderRadius: 8,
    color: '#9ca3af',
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'background 0.2s',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    padding: '9px',
    background: 'transparent',
    border: '1px solid #374151',
    borderRadius: 8,
    color: '#6b7280',
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },

  // Main
  mainContent: {
    flex: 1,
    padding: '28px 32px',
    overflowY: 'auto',
    maxWidth: 1200,
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#f1f5f9',
    margin: 0,
  },
  pageSubtitle: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 6,
    margin: '6px 0 0',
  },
  headerStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
  },

  // Warning
  warningBanner: {
    display: 'flex',
    gap: 14,
    background: '#fbbf2411',
    border: '1px solid #fbbf2433',
    borderRadius: 12,
    padding: '16px 20px',
    marginBottom: 24,
    alignItems: 'flex-start',
  },

  // KPI Grid
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 24,
  },
  kpiCard: {
    background: '#151824',
    border: '1px solid #1f2335',
    borderTop: '3px solid',
    borderRadius: 12,
    padding: '20px 20px 16px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  kpiHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  kpiIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiDelta: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 12,
    fontWeight: 600,
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: 700,
    color: '#f1f5f9',
    lineHeight: 1,
    marginBottom: 6,
  },
  kpiLabel: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: 500,
  },
  kpiCompare: {
    fontSize: 11,
    marginTop: 4,
  },

  // Charts
  chartCard: {
    background: '#151824',
    border: '1px solid #1f2335',
    borderRadius: 12,
    padding: '22px 24px',
    marginBottom: 20,
  },
  chartHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  chartTitle: {
    color: '#f1f5f9',
    fontSize: 15,
    fontWeight: 600,
    margin: 0,
  },
  chartSubtitle: {
    color: '#6b7280',
    fontSize: 12,
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    marginBottom: 20,
  },

  // Devices
  deviceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    background: '#1a1d2e',
    borderRadius: 10,
  },
  deviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  deviceLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 500,
  },
  progressTrack: {
    height: 5,
    background: '#0f1117',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.6s ease',
  },

  // Countries
  countryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 4px',
    borderBottom: '1px solid #1f2335',
  },
  countryRank: {
    color: '#4b5563',
    fontSize: 12,
    fontWeight: 700,
    minWidth: 18,
  },
  countryBar: {
    flex: 1,
    height: 4,
    background: '#1f2335',
    borderRadius: 2,
    overflow: 'hidden',
    minWidth: 60,
  },
  countryFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
    borderRadius: 2,
    transition: 'width 0.6s ease',
  },

  // Footer
  dashFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#374151',
    fontSize: 12,
    marginTop: 16,
    paddingTop: 20,
    borderTop: '1px solid #1f2335',
  },

  // No data
  noData: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#4b5563',
    fontSize: 14,
    fontStyle: 'italic',
  },
};
