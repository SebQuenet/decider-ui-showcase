interface NAVDataPoint {
  date: string
  nav: number
  benchmark: number
}

interface AllocationDataPoint {
  name: string
  value: number
  color: string
}

interface CashFlowDataPoint {
  quarter: string
  calls: number
  distributions: number
  net: number
}

interface PeerComparisonDataPoint {
  name: string
  irr: number
  tvpi: number
  dpi: number
}

export function generateNAVHistory(months: number): NAVDataPoint[] {
  const dataPoints: NAVDataPoint[] = []
  let nav = 100
  let benchmark = 100

  for (let i = 0; i < months; i++) {
    const date = new Date(2024, i, 1)
    dataPoints.push({
      date: date.toISOString().slice(0, 7),
      nav: Math.round(nav * 100) / 100,
      benchmark: Math.round(benchmark * 100) / 100,
    })
    nav *= 1 + (Math.random() * 0.06 - 0.01)
    benchmark *= 1 + (Math.random() * 0.04 - 0.01)
  }

  return dataPoints
}

export function generateAllocation(): AllocationDataPoint[] {
  return [
    { name: 'Technologie', value: 35, color: '#6366f1' },
    { name: 'Sante', value: 20, color: '#22c55e' },
    { name: 'Industrie', value: 15, color: '#f59e0b' },
    { name: 'Finance', value: 12, color: '#3b82f6' },
    { name: 'Consommation', value: 10, color: '#ec4899' },
    { name: 'Energie', value: 8, color: '#8b5cf6' },
  ]
}

export function generateCashFlows(): CashFlowDataPoint[] {
  const quarters = ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024']

  return quarters.map((quarter) => {
    const calls = -(Math.random() * 30 + 10)
    const distributions = Math.random() * 25 + 5
    return {
      quarter,
      calls: Math.round(calls * 10) / 10,
      distributions: Math.round(distributions * 10) / 10,
      net: Math.round((calls + distributions) * 10) / 10,
    }
  })
}

export function generatePeerComparison(): PeerComparisonDataPoint[] {
  return [
    { name: 'Alpha Growth', irr: 18.5, tvpi: 1.65, dpi: 0.42 },
    { name: 'Peer A', irr: 14.2, tvpi: 1.45, dpi: 0.55 },
    { name: 'Peer B', irr: 12.8, tvpi: 1.38, dpi: 0.62 },
    { name: 'Peer C', irr: 21.1, tvpi: 1.82, dpi: 0.31 },
    { name: 'Peer D', irr: 9.5, tvpi: 1.22, dpi: 0.78 },
    { name: 'Median', irr: 13.5, tvpi: 1.41, dpi: 0.58 },
  ]
}
