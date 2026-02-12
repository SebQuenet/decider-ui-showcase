import type {
  FundLifecycle,
  FundCashFlow,
  FundMetricSnapshot,
  FundLifecycleEvent,
  AllocationTarget,
  FundLifecyclePhase,
  FundStrategy,
} from '../types/finance'

// --- Helpers de génération ---

function quarterEndDates(startYear: number, endYear: number): string[] {
  const dates: string[] = []
  for (let y = startYear; y <= endYear; y++) {
    for (const m of ['03-31', '06-30', '09-30', '12-31']) {
      dates.push(`${y}-${m}`)
    }
  }
  return dates
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

// Génère une séquence réaliste de cash flows pour un fonds
function generateCashFlows(
  fund: FundLifecycle,
  seed: number,
): FundCashFlow[] {
  const flows: FundCashFlow[] = []
  const vintage = fund.vintageYear
  const committed = fund.committed
  const investPeriod = fund.investmentPeriodYears
  const totalTerm = fund.fundTermYears

  // Pseudo-random déterministe
  let rng = seed
  function rand(): number {
    rng = (rng * 16807 + 0) % 2147483647
    return (rng & 0x7fffffff) / 0x7fffffff
  }

  let totalCalled = 0
  let totalDistributed = 0

  // Capital calls (investissement)
  const callYears = investPeriod + 1
  for (let y = 0; y < callYears; y++) {
    const numCalls = y === 0 ? 1 : Math.floor(2 + rand() * 2)
    for (let c = 0; c < numCalls; c++) {
      if (totalCalled >= committed * 0.95) break
      const progress = (y + c / numCalls) / callYears
      // Appels plus gros au début
      const basePct = y === 0 ? 0.15 : lerp(0.12, 0.05, progress)
      const amount = committed * basePct * (0.8 + rand() * 0.4)
      const callAmount = Math.min(amount, committed - totalCalled)
      if (callAmount < committed * 0.01) continue
      totalCalled += callAmount
      const month = Math.floor(1 + (c / numCalls) * 11)
      const day = Math.min(28, 10 + Math.floor(rand() * 18))
      flows.push({
        id: `cf-${fund.fundId}-call-${y}-${c}`,
        fundId: fund.fundId,
        date: `${vintage + y}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        type: 'capital_call',
        amount: -Math.round(callAmount),
        description: y === 0 ? 'Appel initial' : `Appel de fonds #${flows.filter(f => f.type === 'capital_call').length + 1}`,
        isEstimate: false,
      })
    }
  }

  // Management fees (annuels simplifiés)
  for (let y = 0; y < Math.min(totalTerm, 2026 - vintage); y++) {
    const feeBase = y < investPeriod ? committed : totalCalled * 0.7
    const fee = feeBase * (fund.managementFeeRate / 100)
    flows.push({
      id: `cf-${fund.fundId}-fee-${y}`,
      fundId: fund.fundId,
      date: `${vintage + y}-01-15`,
      type: 'management_fee',
      amount: -Math.round(fee),
      description: `Frais de gestion ${vintage + y}`,
      isEstimate: false,
    })
  }

  // Distributions (commencent après quelques années)
  const distStartYear = investPeriod - 1
  const currentAge = 2026 - vintage
  const distEndYear = Math.min(totalTerm, currentAge)

  for (let y = distStartYear; y < distEndYear; y++) {
    if (y < 2) continue
    const numDist = Math.floor(1 + rand() * 2)
    for (let d = 0; d < numDist; d++) {
      const progress = (y - distStartYear) / (distEndYear - distStartYear || 1)
      const basePct = lerp(0.03, 0.15, progress) * (0.7 + rand() * 0.6)
      const amount = committed * basePct
      totalDistributed += amount

      const month = Math.floor(3 + d * 5 + rand() * 3)
      const day = Math.min(28, 5 + Math.floor(rand() * 20))
      const isGain = rand() > 0.4
      flows.push({
        id: `cf-${fund.fundId}-dist-${y}-${d}`,
        fundId: fund.fundId,
        date: `${vintage + y}-${String(clamp(month, 1, 12)).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        type: isGain ? 'capital_gain' : 'return_of_capital',
        amount: Math.round(amount),
        description: isGain ? `Distribution de plus-value` : `Retour de capital`,
        isEstimate: false,
      })
    }
  }

  // Flux prévisionnels pour les fonds en cours
  if (fund.phase !== 'terminated' && fund.phase !== 'liquidation') {
    const futureYears = Math.min(3, totalTerm - currentAge)
    for (let y = 0; y < futureYears; y++) {
      const year = 2026 + y
      if (fund.phase === 'fundraising' || fund.phase === 'investment_period') {
        const remaining = committed - totalCalled
        if (remaining > committed * 0.05) {
          const callAmt = remaining * lerp(0.3, 0.15, y / futureYears)
          totalCalled += callAmt
          flows.push({
            id: `cf-${fund.fundId}-est-call-${y}`,
            fundId: fund.fundId,
            date: `${year}-06-15`,
            type: 'capital_call',
            amount: -Math.round(callAmt),
            description: `Appel estimé ${year}`,
            isEstimate: true,
          })
        }
      }
      const distAmt = committed * (0.05 + rand() * 0.08)
      flows.push({
        id: `cf-${fund.fundId}-est-dist-${y}`,
        fundId: fund.fundId,
        date: `${year}-09-15`,
        type: 'capital_gain',
        amount: Math.round(distAmt),
        description: `Distribution estimée ${year}`,
        isEstimate: true,
      })
    }
  }

  return flows.sort((a, b) => a.date.localeCompare(b.date))
}

// Génère des snapshots trimestriels de métriques
function generateMetricSnapshots(
  fund: FundLifecycle,
  cashFlows: FundCashFlow[],
): FundMetricSnapshot[] {
  const snapshots: FundMetricSnapshot[] = []
  const realFlows = cashFlows.filter(f => !f.isEstimate)
  const firstFlowYear = fund.vintageYear
  const lastYear = Math.min(2025, fund.vintageYear + fund.fundTermYears)
  const dates = quarterEndDates(firstFlowYear, lastYear)

  for (const date of dates) {
    const flowsBefore = realFlows.filter(f => f.date <= date)
    const called = flowsBefore
      .filter(f => f.amount < 0)
      .reduce((s, f) => s + Math.abs(f.amount), 0)
    const distributed = flowsBefore
      .filter(f => f.amount > 0)
      .reduce((s, f) => s + f.amount, 0)

    if (called === 0) continue

    const age = (new Date(date).getTime() - new Date(`${fund.vintageYear}-01-01`).getTime()) / (365.25 * 24 * 3600 * 1000)
    const unfunded = Math.max(0, fund.committed - called)

    // NAV modélisée : J-curve réaliste
    const investRatio = clamp(age / fund.investmentPeriodYears, 0, 1)
    const lifeRatio = clamp(age / fund.fundTermYears, 0, 1)

    let multiplier: number
    if (age < 2) {
      multiplier = lerp(0.85, 0.92, age / 2)
    } else if (age < fund.investmentPeriodYears) {
      multiplier = lerp(0.92, 1.15, (age - 2) / (fund.investmentPeriodYears - 2))
    } else {
      multiplier = lerp(1.15, 1.8, (lifeRatio - investRatio) / (1 - investRatio || 1))
    }

    // Ajustement par stratégie
    const strategyMultiplier: Record<FundStrategy, number> = {
      'Buyout': 1.0,
      'Venture Capital': 1.3,
      'Growth': 1.15,
      'Real Estate': 0.85,
      'Infrastructure': 0.8,
      'Private Debt': 0.7,
      'Secondaries': 0.9,
      'Fund of Funds': 0.95,
    }
    multiplier = 1 + (multiplier - 1) * (strategyMultiplier[fund.strategy] ?? 1)

    const nav = Math.round(Math.max(0, called * multiplier - distributed * 0.3))
    const tvpi = (distributed + nav) / called
    const dpi = distributed / called
    const rvpi = nav / called

    // IRR simplifié (approximation)
    let irr: number
    if (age < 1.5) {
      irr = -15 + age * 5
    } else if (age < 3) {
      irr = lerp(-5, 5, (age - 1.5) / 1.5)
    } else {
      irr = lerp(5, 18, clamp((age - 3) / 7, 0, 1)) * (strategyMultiplier[fund.strategy] ?? 1) * 0.8
    }

    snapshots.push({
      fundId: fund.fundId,
      date,
      calledAmount: Math.round(called),
      distributedAmount: Math.round(distributed),
      nav,
      unfundedCommitment: Math.round(unfunded),
      tvpiNet: Math.round(tvpi * 100) / 100,
      dpiNet: Math.round(dpi * 100) / 100,
      rvpiNet: Math.round(rvpi * 100) / 100,
      irrNetInception: Math.round(irr * 10) / 10,
    })
  }

  return snapshots
}

// Génère les événements du cycle de vie
function generateLifecycleEvents(fund: FundLifecycle, cashFlows: FundCashFlow[]): FundLifecycleEvent[] {
  const events: FundLifecycleEvent[] = []
  let eventId = 0

  events.push({
    id: `evt-${fund.fundId}-${eventId++}`,
    fundId: fund.fundId,
    date: fund.firstCloseDate,
    type: 'first_close',
    label: 'Premier closing',
    description: `Premier closing à ${Math.round(fund.committed * 0.4 / 1_000_000)} M${fund.currency}`,
    amount: Math.round(fund.committed * 0.4),
  })

  if (fund.finalCloseDate) {
    events.push({
      id: `evt-${fund.fundId}-${eventId++}`,
      fundId: fund.fundId,
      date: fund.finalCloseDate,
      type: 'final_close',
      label: 'Closing final',
      description: `Closing final à ${Math.round(fund.committed / 1_000_000)} M${fund.currency}`,
      amount: fund.committed,
    })
  }

  // Événements de capital call (agrégés par année)
  const callsByYear = new Map<number, { count: number; total: number }>()
  for (const f of cashFlows.filter(f => f.type === 'capital_call' && !f.isEstimate)) {
    const year = parseInt(f.date.substring(0, 4))
    const entry = callsByYear.get(year) ?? { count: 0, total: 0 }
    entry.count++
    entry.total += Math.abs(f.amount)
    callsByYear.set(year, entry)
  }
  for (const [year, data] of callsByYear) {
    events.push({
      id: `evt-${fund.fundId}-${eventId++}`,
      fundId: fund.fundId,
      date: `${year}-06-30`,
      type: 'capital_call',
      label: `${data.count} appel(s) de fonds`,
      description: `${Math.round(data.total / 1_000_000)} M${fund.currency} appelés en ${year}`,
      amount: data.total,
    })
  }

  // Distributions significatives
  const distsByYear = new Map<number, number>()
  for (const f of cashFlows.filter(f => f.amount > 0 && !f.isEstimate)) {
    const year = parseInt(f.date.substring(0, 4))
    distsByYear.set(year, (distsByYear.get(year) ?? 0) + f.amount)
  }
  for (const [year, total] of distsByYear) {
    if (total > fund.committed * 0.03) {
      events.push({
        id: `evt-${fund.fundId}-${eventId++}`,
        fundId: fund.fundId,
        date: `${year}-09-30`,
        type: 'distribution',
        label: 'Distribution',
        description: `${Math.round(total / 1_000_000)} M${fund.currency} distribués en ${year}`,
        amount: total,
      })
    }
  }

  if (fund.investmentPeriodEndDate) {
    events.push({
      id: `evt-${fund.fundId}-${eventId++}`,
      fundId: fund.fundId,
      date: fund.investmentPeriodEndDate,
      type: 'investment_period_end',
      label: 'Fin de période d\'investissement',
      description: 'Le fonds ne réalise plus de nouveaux investissements',
    })
  }

  if (fund.phase === 'extension') {
    events.push({
      id: `evt-${fund.fundId}-${eventId++}`,
      fundId: fund.fundId,
      date: fund.expectedTermDate,
      type: 'extension',
      label: 'Extension approuvée',
      description: 'Extension de 1 an approuvée par le LPAC',
    })
  }

  if (fund.phase === 'liquidation' || fund.phase === 'terminated') {
    events.push({
      id: `evt-${fund.fundId}-${eventId++}`,
      fundId: fund.fundId,
      date: fund.actualTermDate ?? fund.expectedTermDate,
      type: 'liquidation',
      label: 'Liquidation',
      description: 'Distribution finale et dissolution du véhicule',
    })
  }

  return events.sort((a, b) => a.date.localeCompare(b.date))
}

// --- Fonds ---

export const mockFundLifecycles: FundLifecycle[] = [
  {
    fundId: 'fl-ardian-lbo7',
    name: 'Ardian LBO Fund VII',
    shortName: 'Ardian LBO VII',
    phase: 'harvest',
    strategy: 'Buyout',
    geography: 'Europe',
    currency: 'EUR',
    vintageYear: 2018,
    fundTermYears: 10,
    investmentPeriodYears: 5,
    committed: 720_000_000,
    firstCloseDate: '2018-03-15',
    finalCloseDate: '2018-09-20',
    investmentPeriodEndDate: '2023-03-15',
    expectedTermDate: '2028-03-15',
    actualTermDate: null,
    managementFeeRate: 1.75,
    carriedInterestRate: 20,
    preferredReturn: 8,
    legalStructure: 'SLP',
    gpName: 'Ardian',
  },
  {
    fundId: 'fl-kkr-eu5',
    name: 'KKR European Fund V',
    shortName: 'KKR EU V',
    phase: 'extension',
    strategy: 'Buyout',
    geography: 'Europe',
    currency: 'EUR',
    vintageYear: 2015,
    fundTermYears: 10,
    investmentPeriodYears: 5,
    committed: 1_200_000_000,
    firstCloseDate: '2015-06-01',
    finalCloseDate: '2016-01-15',
    investmentPeriodEndDate: '2020-06-01',
    expectedTermDate: '2026-06-01',
    actualTermDate: null,
    managementFeeRate: 1.5,
    carriedInterestRate: 20,
    preferredReturn: 8,
    legalStructure: 'SCSp',
    gpName: 'KKR',
  },
  {
    fundId: 'fl-sofinnova9',
    name: 'Sofinnova Capital IX',
    shortName: 'Sofinnova IX',
    phase: 'investment_period',
    strategy: 'Venture Capital',
    geography: 'Europe',
    currency: 'EUR',
    vintageYear: 2021,
    fundTermYears: 12,
    investmentPeriodYears: 5,
    committed: 280_000_000,
    firstCloseDate: '2021-04-01',
    finalCloseDate: '2021-11-30',
    investmentPeriodEndDate: null,
    expectedTermDate: '2033-04-01',
    actualTermDate: null,
    managementFeeRate: 2.0,
    carriedInterestRate: 20,
    preferredReturn: 8,
    legalStructure: 'FPCI',
    gpName: 'Sofinnova Partners',
  },
  {
    fundId: 'fl-blackstone-re9',
    name: 'Blackstone Real Estate IX',
    shortName: 'BREP IX',
    phase: 'harvest',
    strategy: 'Real Estate',
    geography: 'Global',
    currency: 'USD',
    vintageYear: 2019,
    fundTermYears: 10,
    investmentPeriodYears: 4,
    committed: 950_000_000,
    firstCloseDate: '2019-01-20',
    finalCloseDate: '2019-07-15',
    investmentPeriodEndDate: '2023-01-20',
    expectedTermDate: '2029-01-20',
    actualTermDate: null,
    managementFeeRate: 1.5,
    carriedInterestRate: 20,
    preferredReturn: 7,
    legalStructure: 'Delaware LP',
    gpName: 'Blackstone',
  },
  {
    fundId: 'fl-meridiam4',
    name: 'Meridiam Infrastructure Fund IV',
    shortName: 'Meridiam IV',
    phase: 'harvest',
    strategy: 'Infrastructure',
    geography: 'Europe',
    currency: 'EUR',
    vintageYear: 2016,
    fundTermYears: 15,
    investmentPeriodYears: 5,
    committed: 650_000_000,
    firstCloseDate: '2016-09-01',
    finalCloseDate: '2017-03-15',
    investmentPeriodEndDate: '2021-09-01',
    expectedTermDate: '2031-09-01',
    actualTermDate: null,
    managementFeeRate: 1.25,
    carriedInterestRate: 15,
    preferredReturn: 6,
    legalStructure: 'SLP',
    gpName: 'Meridiam',
  },
  {
    fundId: 'fl-tikehau-dl4',
    name: 'Tikehau Direct Lending IV',
    shortName: 'Tikehau DL IV',
    phase: 'investment_period',
    strategy: 'Private Debt',
    geography: 'Europe',
    currency: 'EUR',
    vintageYear: 2022,
    fundTermYears: 8,
    investmentPeriodYears: 3,
    committed: 420_000_000,
    firstCloseDate: '2022-05-10',
    finalCloseDate: '2022-12-01',
    investmentPeriodEndDate: null,
    expectedTermDate: '2030-05-10',
    actualTermDate: null,
    managementFeeRate: 1.5,
    carriedInterestRate: 15,
    preferredReturn: 6,
    legalStructure: 'SLP',
    gpName: 'Tikehau Capital',
  },
  {
    fundId: 'fl-ardian-sec8',
    name: 'Ardian Secondaries VIII',
    shortName: 'Ardian Sec VIII',
    phase: 'harvest',
    strategy: 'Secondaries',
    geography: 'Global',
    currency: 'EUR',
    vintageYear: 2020,
    fundTermYears: 10,
    investmentPeriodYears: 4,
    committed: 540_000_000,
    firstCloseDate: '2020-02-01',
    finalCloseDate: '2020-09-30',
    investmentPeriodEndDate: '2024-02-01',
    expectedTermDate: '2030-02-01',
    actualTermDate: null,
    managementFeeRate: 1.5,
    carriedInterestRate: 18,
    preferredReturn: 8,
    legalStructure: 'SCSp',
    gpName: 'Ardian',
  },
  {
    fundId: 'fl-pantheon-gs',
    name: 'Pantheon Global Secondaries',
    shortName: 'Pantheon GS',
    phase: 'extension',
    strategy: 'Fund of Funds',
    geography: 'Global',
    currency: 'USD',
    vintageYear: 2017,
    fundTermYears: 12,
    investmentPeriodYears: 5,
    committed: 380_000_000,
    firstCloseDate: '2017-01-15',
    finalCloseDate: '2017-07-01',
    investmentPeriodEndDate: '2022-01-15',
    expectedTermDate: '2029-01-15',
    actualTermDate: null,
    managementFeeRate: 1.0,
    carriedInterestRate: 10,
    preferredReturn: 7,
    legalStructure: 'Delaware LP',
    gpName: 'Pantheon',
  },
  {
    fundId: 'fl-eurazeo-g3',
    name: 'Eurazeo Growth III',
    shortName: 'Eurazeo G III',
    phase: 'investment_period',
    strategy: 'Growth',
    geography: 'Europe',
    currency: 'EUR',
    vintageYear: 2023,
    fundTermYears: 10,
    investmentPeriodYears: 5,
    committed: 310_000_000,
    firstCloseDate: '2023-03-01',
    finalCloseDate: '2023-10-15',
    investmentPeriodEndDate: null,
    expectedTermDate: '2033-03-01',
    actualTermDate: null,
    managementFeeRate: 2.0,
    carriedInterestRate: 20,
    preferredReturn: 8,
    legalStructure: 'FPCI',
    gpName: 'Eurazeo',
  },
  {
    fundId: 'fl-tpg-rise2',
    name: 'TPG Rise Climate II',
    shortName: 'TPG Rise II',
    phase: 'investment_period',
    strategy: 'Infrastructure',
    geography: 'Global',
    currency: 'USD',
    vintageYear: 2022,
    fundTermYears: 15,
    investmentPeriodYears: 5,
    committed: 510_000_000,
    firstCloseDate: '2022-07-01',
    finalCloseDate: '2023-01-15',
    investmentPeriodEndDate: null,
    expectedTermDate: '2037-07-01',
    actualTermDate: null,
    managementFeeRate: 1.5,
    carriedInterestRate: 20,
    preferredReturn: 7,
    legalStructure: 'Delaware LP',
    gpName: 'TPG',
  },
  {
    fundId: 'fl-carlyle-eu5',
    name: 'Carlyle Europe Partners V',
    shortName: 'Carlyle EU V',
    phase: 'liquidation',
    strategy: 'Buyout',
    geography: 'Europe',
    currency: 'EUR',
    vintageYear: 2014,
    fundTermYears: 10,
    investmentPeriodYears: 5,
    committed: 880_000_000,
    firstCloseDate: '2014-04-01',
    finalCloseDate: '2014-10-15',
    investmentPeriodEndDate: '2019-04-01',
    expectedTermDate: '2024-04-01',
    actualTermDate: '2025-12-31',
    managementFeeRate: 1.5,
    carriedInterestRate: 20,
    preferredReturn: 8,
    legalStructure: 'SCSp',
    gpName: 'Carlyle',
  },
  {
    fundId: 'fl-cvc8',
    name: 'CVC Capital Partners VIII',
    shortName: 'CVC VIII',
    phase: 'fundraising',
    strategy: 'Buyout',
    geography: 'Europe',
    currency: 'EUR',
    vintageYear: 2024,
    fundTermYears: 10,
    investmentPeriodYears: 5,
    committed: 500_000_000,
    firstCloseDate: '2024-09-01',
    finalCloseDate: null,
    investmentPeriodEndDate: null,
    expectedTermDate: '2034-09-01',
    actualTermDate: null,
    managementFeeRate: 1.75,
    carriedInterestRate: 20,
    preferredReturn: 8,
    legalStructure: 'SCSp',
    gpName: 'CVC',
  },
  {
    fundId: 'fl-primonial-pat',
    name: 'Primonial SCPI Patrimoine',
    shortName: 'Primonial Patrimoine',
    phase: 'terminated',
    strategy: 'Real Estate',
    geography: 'Europe',
    currency: 'EUR',
    vintageYear: 2010,
    fundTermYears: 12,
    investmentPeriodYears: 4,
    committed: 350_000_000,
    firstCloseDate: '2010-03-01',
    finalCloseDate: '2010-09-15',
    investmentPeriodEndDate: '2014-03-01',
    expectedTermDate: '2022-03-01',
    actualTermDate: '2022-06-30',
    managementFeeRate: 1.25,
    carriedInterestRate: 15,
    preferredReturn: 7,
    legalStructure: 'SCPI',
    gpName: 'Primonial REIM',
  },
  {
    fundId: 'fl-permira7',
    name: 'Permira Fund VII',
    shortName: 'Permira VII',
    phase: 'investment_period',
    strategy: 'Buyout',
    geography: 'Global',
    currency: 'EUR',
    vintageYear: 2021,
    fundTermYears: 10,
    investmentPeriodYears: 5,
    committed: 630_000_000,
    firstCloseDate: '2021-06-01',
    finalCloseDate: '2021-12-15',
    investmentPeriodEndDate: null,
    expectedTermDate: '2031-06-01',
    actualTermDate: null,
    managementFeeRate: 1.75,
    carriedInterestRate: 20,
    preferredReturn: 8,
    legalStructure: 'SCSp',
    gpName: 'Permira',
  },
  {
    fundId: 'fl-icg-eu8',
    name: 'ICG Europe Fund VIII',
    shortName: 'ICG EU VIII',
    phase: 'harvest',
    strategy: 'Private Debt',
    geography: 'Europe',
    currency: 'EUR',
    vintageYear: 2019,
    fundTermYears: 8,
    investmentPeriodYears: 3,
    committed: 460_000_000,
    firstCloseDate: '2019-05-01',
    finalCloseDate: '2019-11-15',
    investmentPeriodEndDate: '2022-05-01',
    expectedTermDate: '2027-05-01',
    actualTermDate: null,
    managementFeeRate: 1.25,
    carriedInterestRate: 15,
    preferredReturn: 6,
    legalStructure: 'SCSp',
    gpName: 'ICG',
  },
]

// --- Génération des données dérivées ---

const FUND_SEEDS: Record<string, number> = {
  'fl-ardian-lbo7': 42,
  'fl-kkr-eu5': 137,
  'fl-sofinnova9': 256,
  'fl-blackstone-re9': 389,
  'fl-meridiam4': 512,
  'fl-tikehau-dl4': 647,
  'fl-ardian-sec8': 783,
  'fl-pantheon-gs': 891,
  'fl-eurazeo-g3': 1024,
  'fl-tpg-rise2': 1157,
  'fl-carlyle-eu5': 1283,
  'fl-cvc8': 1401,
  'fl-primonial-pat': 1567,
  'fl-permira7': 1689,
  'fl-icg-eu8': 1823,
}

export const mockCashFlows: FundCashFlow[] = mockFundLifecycles.flatMap(
  (fund) => generateCashFlows(fund, FUND_SEEDS[fund.fundId] ?? 42),
)

export const mockMetricSnapshots: FundMetricSnapshot[] = mockFundLifecycles.flatMap(
  (fund) => generateMetricSnapshots(fund, mockCashFlows.filter(f => f.fundId === fund.fundId)),
)

export const mockLifecycleEvents: FundLifecycleEvent[] = mockFundLifecycles.flatMap(
  (fund) => generateLifecycleEvents(fund, mockCashFlows.filter(f => f.fundId === fund.fundId)),
)

// --- Allocation cibles ---

export const mockAllocationTargets: AllocationTarget[] = [
  // Par stratégie
  { dimension: 'strategy', category: 'Buyout', targetPct: 40, actualPct: 43.2, navAmount: 2_850_000_000, commitmentAmount: 3_930_000_000 },
  { dimension: 'strategy', category: 'Venture Capital', targetPct: 8, actualPct: 5.8, navAmount: 383_000_000, commitmentAmount: 280_000_000 },
  { dimension: 'strategy', category: 'Growth', targetPct: 8, actualPct: 6.4, navAmount: 422_000_000, commitmentAmount: 310_000_000 },
  { dimension: 'strategy', category: 'Real Estate', targetPct: 15, actualPct: 14.1, navAmount: 931_000_000, commitmentAmount: 1_300_000_000 },
  { dimension: 'strategy', category: 'Infrastructure', targetPct: 15, actualPct: 16.8, navAmount: 1_109_000_000, commitmentAmount: 1_160_000_000 },
  { dimension: 'strategy', category: 'Private Debt', targetPct: 10, actualPct: 10.2, navAmount: 673_000_000, commitmentAmount: 880_000_000 },
  { dimension: 'strategy', category: 'Secondaries', targetPct: 4, actualPct: 3.5, navAmount: 231_000_000, commitmentAmount: 540_000_000 },
  // Par géographie
  { dimension: 'geography', category: 'Europe', targetPct: 60, actualPct: 62.3, navAmount: 4_112_000_000, commitmentAmount: 5_390_000_000 },
  { dimension: 'geography', category: 'Global', targetPct: 30, actualPct: 29.4, navAmount: 1_941_000_000, commitmentAmount: 2_380_000_000 },
  { dimension: 'geography', category: 'North America', targetPct: 10, actualPct: 8.3, navAmount: 548_000_000, commitmentAmount: 510_000_000 },
  // Par vintage
  { dimension: 'vintage', category: '2010-2015', targetPct: 10, actualPct: 8.5, navAmount: 561_000_000, commitmentAmount: 2_430_000_000 },
  { dimension: 'vintage', category: '2016-2019', targetPct: 35, actualPct: 38.2, navAmount: 2_521_000_000, commitmentAmount: 3_230_000_000 },
  { dimension: 'vintage', category: '2020-2022', targetPct: 35, actualPct: 36.8, navAmount: 2_429_000_000, commitmentAmount: 2_380_000_000 },
  { dimension: 'vintage', category: '2023-2025', targetPct: 20, actualPct: 16.5, navAmount: 1_089_000_000, commitmentAmount: 810_000_000 },
]

// --- Helpers pour les expérimentations ---

export function getLatestSnapshot(fundId: string): FundMetricSnapshot | undefined {
  const fundSnapshots = mockMetricSnapshots.filter(s => s.fundId === fundId)
  return fundSnapshots[fundSnapshots.length - 1]
}

export function getPhaseLabel(phase: FundLifecyclePhase): string {
  const labels: Record<FundLifecyclePhase, string> = {
    fundraising: 'Levée',
    investment_period: 'Investissement',
    harvest: 'Récolte',
    extension: 'Extension',
    liquidation: 'Liquidation',
    terminated: 'Terminé',
  }
  return labels[phase]
}

export function getPhaseColor(phase: FundLifecyclePhase): string {
  const colors: Record<FundLifecyclePhase, string> = {
    fundraising: '#94a3b8',
    investment_period: '#29abb5',
    harvest: '#16a34a',
    extension: '#d97706',
    liquidation: '#dc2626',
    terminated: '#6b7280',
  }
  return colors[phase]
}

export const STRATEGY_COLORS: Record<string, string> = {
  'Buyout': '#29abb5',
  'Venture Capital': '#fe6d11',
  'Growth': '#6366f1',
  'Real Estate': '#16a34a',
  'Infrastructure': '#8b5cf6',
  'Private Debt': '#0891b2',
  'Secondaries': '#ca8a04',
  'Fund of Funds': '#ec4899',
}
