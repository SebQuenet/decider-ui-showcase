import type { Fund } from '../types/finance.ts'

function generateMonthlyNav(
  startValue: number,
  months: number,
  volatility: number,
  trend: number,
): { date: string; value: number }[] {
  const history: { date: string; value: number }[] = []
  let value = startValue

  for (let i = 0; i < months; i++) {
    const date = new Date(2024, i, 1)
    const dateString = date.toISOString().slice(0, 10)
    history.push({ date: dateString, value: Math.round(value * 100) / 100 })
    const change = trend + (Math.random() - 0.5) * volatility
    value *= 1 + change
  }

  return history
}

export const mockFunds: Fund[] = [
  {
    id: 'fund-alpha',
    name: 'Alpha Growth Fund',
    strategy: 'Private Equity',
    vintage: 2020,
    aum: 850_000_000,
    currency: 'EUR',
    status: 'active',
    manager: 'Alpha Capital Partners',
    geography: 'Europe',
    sector: 'Technology',
    metrics: {
      irr: 18.5,
      tvpi: 1.65,
      dpi: 0.42,
      rvpi: 1.23,
      nav: 612_000_000,
      committed: 850_000_000,
      called: 680_000_000,
      distributed: 285_600_000,
      navHistory: generateMonthlyNav(500_000_000, 12, 0.03, 0.015),
    },
  },
  {
    id: 'fund-beta',
    name: 'Beta Income Fund',
    strategy: 'Credit',
    vintage: 2019,
    aum: 1_200_000_000,
    currency: 'EUR',
    status: 'active',
    manager: 'Beta Fixed Income Management',
    geography: 'Global',
    sector: 'Multi-sector',
    metrics: {
      irr: 8.2,
      tvpi: 1.35,
      dpi: 0.85,
      rvpi: 0.5,
      nav: 420_000_000,
      committed: 1_200_000_000,
      called: 1_100_000_000,
      distributed: 935_000_000,
      navHistory: generateMonthlyNav(450_000_000, 12, 0.015, 0.005),
    },
  },
  {
    id: 'fund-gamma',
    name: 'Gamma Venture Fund',
    strategy: 'Venture Capital',
    vintage: 2021,
    aum: 350_000_000,
    currency: 'USD',
    status: 'fundraising',
    manager: 'Gamma Ventures',
    geography: 'North America',
    sector: 'Healthcare & Biotech',
    metrics: {
      irr: 25.3,
      tvpi: 2.1,
      dpi: 0.15,
      rvpi: 1.95,
      nav: 290_000_000,
      committed: 350_000_000,
      called: 210_000_000,
      distributed: 31_500_000,
      navHistory: generateMonthlyNav(180_000_000, 12, 0.06, 0.025),
    },
  },
]
