import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Target, TrendingUp, Leaf, Users, Shield, BarChart3,
  Award, AlertTriangle, Zap,
} from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip as RechartsTooltip,
} from 'recharts'
import { staggerContainerVariants, staggerItemVariants } from '../lib/animations'

// --- Types ---

interface ScoreCategory {
  category: string
  fullMark: number
  score: number
  weight: number
}

interface StressTest {
  scenario: string
  impactNav: string
  impactIrr: string
  probability: string
  severity: 'low' | 'moderate' | 'high'
}

interface PeerFund {
  rank: number
  name: string
  irr: number
  tvpi: number
  isCurrent: boolean
}

// --- Donnees mock ---

const FUNDS = ['Fonds Alpha Capital', 'Fonds Beta Growth', 'Fonds Gamma Income']

const SCORECARD_DATA: ScoreCategory[] = [
  { category: 'Performance', score: 82, fullMark: 100, weight: 25 },
  { category: 'Risque', score: 68, fullMark: 100, weight: 20 },
  { category: 'Liquidite', score: 55, fullMark: 100, weight: 15 },
  { category: 'Gouvernance', score: 78, fullMark: 100, weight: 15 },
  { category: 'ESG', score: 74, fullMark: 100, weight: 15 },
  { category: 'Qualite Data', score: 65, fullMark: 100, weight: 10 },
]

const OVERALL_SCORE = Math.round(
  SCORECARD_DATA.reduce((sum, item) => sum + item.score * (item.weight / 100), 0),
)

const SWOT = {
  forces: [
    'Track record superieur au benchmark (+320 bps)',
    'Equipe experimentee (moy. 15 ans)',
    'Processus d\'investissement rigoureux',
    'Reseau de deal flow proprietaire',
  ],
  faiblesses: [
    'Concentration geographique (55% Europe)',
    'Frais de gestion au-dessus du median',
    'Donnees ESG incompletes',
    'Equipe key-man risk',
  ],
  opportunites: [
    'Expansion strategie ESG/Impact',
    'Nouvelles strategies co-investissement',
    'Marche secondaire en croissance',
    'Partenariats institutionnels asiatiques',
  ],
  menaces: [
    'Regulation AIFMD renforcee',
    'Concurrence fees compression',
    'Hausse des taux d\'interet',
    'Instabilite geopolitique',
  ],
}

const STRESS_TESTS: StressTest[] = [
  { scenario: 'Hausse taux +200bp', impactNav: '-8.5%', impactIrr: '-2.1%', probability: '30%', severity: 'moderate' },
  { scenario: 'Recession -15% PIB', impactNav: '-22.3%', impactIrr: '-6.4%', probability: '15%', severity: 'high' },
  { scenario: 'Crise liquidite', impactNav: '-15.1%', impactIrr: '-4.2%', probability: '10%', severity: 'high' },
  { scenario: 'Defaut majeur', impactNav: '-12.7%', impactIrr: '-3.8%', probability: '5%', severity: 'high' },
  { scenario: 'Rally marche +20%', impactNav: '+14.2%', impactIrr: '+3.1%', probability: '20%', severity: 'low' },
]

const ESG_SCORES = {
  environment: 68,
  social: 74,
  governance: 81,
  overall: 'A-',
}

const PEER_FUNDS: PeerFund[] = [
  { rank: 1, name: 'Fonds Omega Prime', irr: 18.2, tvpi: 1.85, isCurrent: false },
  { rank: 2, name: 'Fonds Delta Select', irr: 16.5, tvpi: 1.72, isCurrent: false },
  { rank: 3, name: 'Fonds Alpha Capital', irr: 14.2, tvpi: 1.57, isCurrent: true },
  { rank: 4, name: 'Fonds Sigma Value', irr: 12.8, tvpi: 1.45, isCurrent: false },
  { rank: 5, name: 'Fonds Lambda Core', irr: 11.1, tvpi: 1.32, isCurrent: false },
  { rank: 6, name: 'Fonds Epsilon Yield', irr: 9.4, tvpi: 1.21, isCurrent: false },
  { rank: 7, name: 'Fonds Kappa Growth', irr: 8.2, tvpi: 1.15, isCurrent: false },
  { rank: 8, name: 'Fonds Zeta Stable', irr: 6.5, tvpi: 1.08, isCurrent: false },
]

// --- Composants ---

function ScoreGauge({ score, size = 120 }: { score: number; size?: number }): React.ReactNode {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference

  let colorClass: string
  if (score >= 70) {
    colorClass = 'text-success'
  } else if (score >= 50) {
    colorClass = 'text-warning'
  } else {
    colorClass = 'text-danger'
  }

  let strokeColor: string
  if (score >= 70) {
    strokeColor = '#16a34a'
  } else if (score >= 50) {
    strokeColor = '#d97706'
  } else {
    strokeColor = '#dc2626'
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#e9ecef" strokeWidth="8"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={strokeColor} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-h2 font-bold font-data ${colorClass}`}>{score}</span>
        <span className="text-[0.625rem] text-text-muted">/100</span>
      </div>
    </div>
  )
}

function ESGBar({ label, score, color }: { label: string; score: number; color: string }): React.ReactNode {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-small text-text-secondary">{label}</span>
        <span className="text-small font-medium font-data text-text-primary">{score}/100</span>
      </div>
      <div className="w-full h-2.5 bg-surface-tertiary rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function QuartileBar({ currentRank, totalFunds }: { currentRank: number; totalFunds: number }): React.ReactNode {
  const position = ((currentRank - 0.5) / totalFunds) * 100
  return (
    <div className="relative">
      <div className="flex h-8 rounded-lg overflow-hidden">
        <div className="flex-1 bg-success/20 flex items-center justify-center text-[0.625rem] font-medium text-success">Q1</div>
        <div className="flex-1 bg-success/10 flex items-center justify-center text-[0.625rem] font-medium text-success/70">Q2</div>
        <div className="flex-1 bg-warning/10 flex items-center justify-center text-[0.625rem] font-medium text-warning/70">Q3</div>
        <div className="flex-1 bg-danger/10 flex items-center justify-center text-[0.625rem] font-medium text-danger/70">Q4</div>
      </div>
      <motion.div
        className="absolute top-0 h-full flex items-center"
        style={{ left: `${position}%` }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
      >
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-accent relative -translate-x-1/2 -top-1" />
      </motion.div>
    </div>
  )
}

// --- Composant principal ---

export function ScoringExperiment(): React.ReactNode {
  const [selectedFund, setSelectedFund] = useState(FUNDS[0])
  const [showScorecard, setShowScorecard] = useState(true)

  function handleGenerateScorecard(): void {
    setShowScorecard(false)
    setTimeout(() => setShowScorecard(true), 500)
  }

  return (
    <div className="w-full h-full flex flex-col bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-secondary">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-accent" />
          <h1 className="text-h4 text-text-primary">Scoring & Due Diligence</h1>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedFund}
            onChange={(event) => setSelectedFund(event.target.value)}
            className="px-3 py-2 bg-surface rounded-lg border border-border text-small text-text-primary cursor-pointer outline-none"
          >
            {FUNDS.map((fund) => (
              <option key={fund} value={fund}>{fund}</option>
            ))}
          </select>
          <button
            onClick={handleGenerateScorecard}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors cursor-pointer text-caption font-medium"
          >
            <BarChart3 className="w-4 h-4" />
            Generer Scorecard
          </button>
        </div>
      </div>

      {/* Contenu */}
      {showScorecard && (
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-y-auto scrollbar-thin p-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {/* Scorecard principale */}
            <motion.div variants={staggerItemVariants} className="xl:col-span-2 bg-surface rounded-xl border border-border shadow-sm">
              <div className="px-4 py-3 border-b border-border-muted">
                <h3 className="text-caption font-semibold text-text-primary">Scorecard Principale</h3>
              </div>
              <div className="p-4 flex gap-6">
                <div className="w-64 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={SCORECARD_DATA}>
                      <PolarGrid stroke="#e9ecef" />
                      <PolarAngleAxis
                        dataKey="category"
                        tick={{ fontSize: 10, fill: '#91919f' }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fontSize: 9, fill: '#91919f' }}
                      />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#29abb5"
                        fill="#29abb5"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <RechartsTooltip
                        formatter={(value?: number) => [`${value ?? 0}/100`, 'Score']}
                        contentStyle={{
                          background: '#fff',
                          border: '1px solid #e9ecef',
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex-1">
                  <table className="w-full text-small">
                    <thead>
                      <tr className="border-b border-border-muted">
                        <th className="text-left py-2 text-text-muted font-medium">Categorie</th>
                        <th className="text-right py-2 text-text-muted font-medium">Score</th>
                        <th className="text-right py-2 text-text-muted font-medium">Poids</th>
                        <th className="text-right py-2 text-text-muted font-medium">Pondere</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SCORECARD_DATA.map((item) => (
                        <tr key={item.category} className="border-b border-border-muted/50">
                          <td className="py-2 text-text-primary">{item.category}</td>
                          <td className="py-2 text-right font-data">
                            <span className={
                              item.score >= 70 ? 'text-success' : item.score >= 50 ? 'text-warning' : 'text-danger'
                            }>
                              {item.score}
                            </span>
                          </td>
                          <td className="py-2 text-right text-text-muted font-data">{item.weight}%</td>
                          <td className="py-2 text-right font-medium font-data text-text-primary">
                            {(item.score * item.weight / 100).toFixed(1)}
                          </td>
                        </tr>
                      ))}
                      <tr className="font-medium">
                        <td className="py-2 text-text-primary">Total</td>
                        <td className="py-2 text-right" />
                        <td className="py-2 text-right text-text-muted font-data">100%</td>
                        <td className="py-2 text-right text-text-primary font-data">{OVERALL_SCORE}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col items-center justify-center px-4">
                  <div className="text-small text-text-muted mb-2">Score Global</div>
                  <ScoreGauge score={OVERALL_SCORE} />
                </div>
              </div>
            </motion.div>

            {/* ESG Scorecard */}
            <motion.div variants={staggerItemVariants} className="bg-surface rounded-xl border border-border shadow-sm">
              <div className="px-4 py-3 border-b border-border-muted flex items-center gap-2">
                <Leaf className="w-4 h-4 text-success" />
                <h3 className="text-caption font-semibold text-text-primary">ESG Scorecard</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-center gap-4 pb-3 border-b border-border-muted">
                  <div className="text-center">
                    <div className="text-h1 font-bold text-accent">{ESG_SCORES.overall}</div>
                    <div className="text-small text-text-muted">Rating ESG</div>
                  </div>
                </div>
                <ESGBar label="Environnement" score={ESG_SCORES.environment} color="#16a34a" />
                <ESGBar label="Social" score={ESG_SCORES.social} color="#29abb5" />
                <ESGBar label="Gouvernance" score={ESG_SCORES.governance} color="#8b5cf6" />
              </div>
            </motion.div>

            {/* SWOT */}
            <motion.div variants={staggerItemVariants} className="xl:col-span-2 bg-surface rounded-xl border border-border shadow-sm">
              <div className="px-4 py-3 border-b border-border-muted">
                <h3 className="text-caption font-semibold text-text-primary">Matrice SWOT</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {([
                  { title: 'Forces', items: SWOT.forces, bgClass: 'bg-success-muted', textClass: 'text-success', icon: TrendingUp },
                  { title: 'Faiblesses', items: SWOT.faiblesses, bgClass: 'bg-danger-muted', textClass: 'text-danger', icon: AlertTriangle },
                  { title: 'Opportunites', items: SWOT.opportunites, bgClass: 'bg-info-muted', textClass: 'text-info', icon: Zap },
                  { title: 'Menaces', items: SWOT.menaces, bgClass: 'bg-warning-muted', textClass: 'text-warning', icon: Shield },
                ] as const).map((quadrant) => (
                  <div key={quadrant.title} className={`rounded-xl ${quadrant.bgClass} p-3`}>
                    <div className="flex items-center gap-2 mb-2.5">
                      <quadrant.icon className={`w-4 h-4 ${quadrant.textClass}`} />
                      <span className={`text-small font-semibold ${quadrant.textClass}`}>{quadrant.title}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {quadrant.items.map((item) => (
                        <li key={item} className="text-small text-text-secondary leading-tight flex items-start gap-1.5">
                          <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${quadrant.textClass} bg-current`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Peer Group */}
            <motion.div variants={staggerItemVariants} className="bg-surface rounded-xl border border-border shadow-sm">
              <div className="px-4 py-3 border-b border-border-muted flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <h3 className="text-caption font-semibold text-text-primary">Peer Group</h3>
              </div>
              <div className="p-4 space-y-4">
                <QuartileBar currentRank={3} totalFunds={PEER_FUNDS.length} />

                <div className="max-h-48 overflow-y-auto scrollbar-thin">
                  <table className="w-full text-small">
                    <thead>
                      <tr className="border-b border-border-muted">
                        <th className="text-left py-1.5 text-text-muted font-medium">#</th>
                        <th className="text-left py-1.5 text-text-muted font-medium">Fonds</th>
                        <th className="text-right py-1.5 text-text-muted font-medium">IRR</th>
                        <th className="text-right py-1.5 text-text-muted font-medium">TVPI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PEER_FUNDS.map((fund) => (
                        <tr
                          key={fund.rank}
                          className={`border-b border-border-muted/50 ${
                            fund.isCurrent ? 'bg-accent-muted/30 font-medium' : ''
                          }`}
                        >
                          <td className="py-1.5 font-data text-text-muted">{fund.rank}</td>
                          <td className="py-1.5 text-text-primary truncate max-w-[140px]">
                            {fund.isCurrent && <Award className="w-3 h-3 text-accent inline mr-1" />}
                            {fund.name}
                          </td>
                          <td className="py-1.5 text-right font-data text-text-primary">{fund.irr}%</td>
                          <td className="py-1.5 text-right font-data text-text-primary">{fund.tvpi}x</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* Stress Tests */}
            <motion.div variants={staggerItemVariants} className="xl:col-span-3 bg-surface rounded-xl border border-border shadow-sm">
              <div className="px-4 py-3 border-b border-border-muted flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <h3 className="text-caption font-semibold text-text-primary">Stress Tests</h3>
              </div>
              <div className="p-4">
                <table className="w-full text-small">
                  <thead>
                    <tr className="border-b border-border-muted">
                      <th className="text-left py-2 text-text-muted font-medium">Scenario</th>
                      <th className="text-right py-2 text-text-muted font-medium">Impact NAV</th>
                      <th className="text-right py-2 text-text-muted font-medium">Impact IRR</th>
                      <th className="text-right py-2 text-text-muted font-medium">Probabilite</th>
                      <th className="text-right py-2 text-text-muted font-medium">Severite</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STRESS_TESTS.map((test) => {
                      const isPositive = test.impactNav.startsWith('+')
                      return (
                        <tr key={test.scenario} className="border-b border-border-muted/50">
                          <td className="py-2.5 text-text-primary">{test.scenario}</td>
                          <td className={`py-2.5 text-right font-data font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
                            {test.impactNav}
                          </td>
                          <td className={`py-2.5 text-right font-data font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
                            {test.impactIrr}
                          </td>
                          <td className="py-2.5 text-right font-data text-text-secondary">{test.probability}</td>
                          <td className="py-2.5 text-right">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[0.625rem] font-medium ${
                              test.severity === 'high'
                                ? 'bg-danger-muted text-danger'
                                : test.severity === 'moderate'
                                  ? 'bg-warning-muted text-warning'
                                  : 'bg-success-muted text-success'
                            }`}>
                              {test.severity === 'high' ? 'Eleve' : test.severity === 'moderate' ? 'Modere' : 'Faible'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
