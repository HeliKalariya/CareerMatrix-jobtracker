import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ─── Shared palette ───────────────────────────────────────────────────────────
export const COLORS = {
  blue:    '#3b82f6',
  blueDim: '#1d4ed8',
  amber:   '#f59e0b',
  violet:  '#a78bfa',
  emerald: '#34d399',
  rose:    '#fb7185',
  slate:   '#64748b',
  grid:    'rgba(255,255,255,0.04)',
  tooltip: {
    bg:     '#1e2433',
    title:  '#94a3b8',
    body:   '#e2e8f0',
    border: 'rgba(255,255,255,0.06)',
  },
};

// ─── Global Chart.js defaults ─────────────────────────────────────────────────
Chart.defaults.color               = '#4a5568';
Chart.defaults.font.family         = 'Inter, system-ui, sans-serif';
Chart.defaults.font.size           = 11;
Chart.defaults.borderColor         = COLORS.grid;
Chart.defaults.responsive          = true;
Chart.defaults.maintainAspectRatio = false;

// ─── Reusable tooltip style ───────────────────────────────────────────────────
export const tooltipDefaults = {
  backgroundColor: COLORS.tooltip.bg,
  titleColor:      COLORS.tooltip.title,
  bodyColor:       COLORS.tooltip.body,
  borderColor:     COLORS.tooltip.border,
  borderWidth:     1,
  padding:         10,
  cornerRadius:    8,
  displayColors:   false,
};

// ─── Reusable axis builders ───────────────────────────────────────────────────
const axisBase = {
  ticks:  { color: '#4a5568', font: { size: 11 } },
  grid:   { color: COLORS.grid },
  border: { color: 'transparent' },
};

export const xAxis = (overrides = {}) => ({ ...axisBase, ...overrides });
export const yAxis = (overrides = {}) => ({
  ...axisBase,
  beginAtZero: true,
  ...overrides,
});

// ─── 1. Weekly Activity Bar Chart ─────────────────────────────────────────────
export const weeklyActivityConfig = (labels, data) => ({
  type: 'bar',
  data: {
    labels,
    datasets: [
      {
        label: 'Jobs Applied',
        data,
        backgroundColor:      COLORS.blue,
        hoverBackgroundColor: '#60a5fa',
        borderRadius:   5,
        borderSkipped:  false,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipDefaults,
        callbacks: {
          title: (items) => items[0].label,
          label: (item)  => ` ${item.parsed.y} applications`,
        },
      },
    },
    scales: {
      x: xAxis({
        ticks: { color: '#4a5568', font: { size: 11 }, autoSkip: false },
      }),
      y: yAxis({
        min: 0,
        ticks: { stepSize: 4 },
        title: {
          display: true,
          text:    'NUMBER OF JOBS APPLIED',
          color:   '#4a5568',
          font:    { size: 9, weight: '500' },
        },
      }),
    },
  },
});

// ─── 2. Applications by Month Bar Chart ───────────────────────────────────────
export const applicationsByMonthConfig = (labels, data) => ({
  type: 'bar',
  data: {
    labels,
    datasets: [
      {
        label: 'Applications',
        data,
        backgroundColor:      COLORS.blue,
        hoverBackgroundColor: '#60a5fa',
        borderRadius:   4,
        borderSkipped:  false,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipDefaults,
        callbacks: {
          label: (item) => ` ${item.parsed.y} applications`,
        },
      },
    },
    scales: {
      x: xAxis(),
      y: yAxis({ ticks: { stepSize: 5 } }),
    },
  },
});

// ─── 3. Applications by Status Doughnut ───────────────────────────────────────
export const statusDonutConfig = (labels, data) => ({
  type: 'doughnut',
  data: {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          '#3b82f6', // Applied
          '#f59e0b', // Assessment
          '#34d399', // Interview
          '#a78bfa', // Offer
          '#fb7185', // Rejected
          '#64748b', // Wishlist
        ],
        borderColor:  '#141720',
        borderWidth:  3,
        hoverOffset:  6,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipDefaults,
        callbacks: {
          label: (item) => {
            const total = item.dataset.data.reduce((a, b) => a + b, 0);
            const pct   = total ? Math.round((item.parsed / total) * 100) : 0;
            return ` ${item.parsed} (${pct}%)`;
          },
        },
      },
    },
  },
});

// ─── 4. Success / Offer Rate Line Chart ───────────────────────────────────────
export const successRateConfig = (labels, successData, offerData) => ({
  type: 'line',
  data: {
    labels,
    datasets: [
      {
        label:               'Success Rate',
        data:                successData,
        borderColor:         COLORS.emerald,
        backgroundColor:     'rgba(52,211,153,0.08)',
        pointBackgroundColor: COLORS.emerald,
        pointRadius:         4,
        pointHoverRadius:    6,
        borderWidth:         2,
        tension:             0.4,
        fill:                true,
      },
      {
        label:               'Offer Rate',
        data:                offerData,
        borderColor:         COLORS.blue,
        backgroundColor:     'rgba(59,130,246,0.08)',
        pointBackgroundColor: COLORS.blue,
        pointRadius:         4,
        pointHoverRadius:    6,
        borderWidth:         2,
        tension:             0.4,
        fill:                true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipDefaults,
        displayColors: true,
        callbacks: {
          label: (item) => ` ${item.dataset.label}: ${item.parsed.y}%`,
        },
      },
    },
    scales: {
      x: xAxis(),
      y: yAxis({
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: (v) => `${v}%`,
        },
      }),
    },
  },
});

// ─── 5. Status Progress Horizontal Bar Chart ───────────────────────────────────
export const statusProgressConfig = (labels, data, total) => ({
  type: 'bar',
  data: {
    labels,
    datasets: [
      {
        label: 'Count',
        data,
        backgroundColor: [
          COLORS.blue,
          COLORS.amber,
          COLORS.violet,
          COLORS.emerald,
          COLORS.rose,
          COLORS.slate,
        ],
        borderRadius:  4,
        borderSkipped: false,
      },
    ],
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipDefaults,
        displayColors: true,
        callbacks: {
          label: (item) => {
            const pct = total ? Math.round((item.parsed.x / total) * 100) : 0;
            return ` ${item.parsed.x} applications (${pct}%)`;
          },
        },
      },
    },
    scales: {
      x: xAxis({ ticks: { stepSize: 5 } }),
      y: {
        ticks:  { color: '#94a3b8', font: { size: 11 } },
        grid:   { display: false },
        border: { color: 'transparent' },
      },
    },
  },
});

export default Chart;