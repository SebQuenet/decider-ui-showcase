import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  GitCompareArrows,
  FileText,
  AlertTriangle,
  MessageSquarePlus,
  Upload,
  LayoutDashboard,
  Settings,
  Check,
  Clock,
  ChevronRight,
  Sparkles,
  Search,
  TrendingUp,
  Globe,
} from 'lucide-react'
const PROMPT_CARDS = [
  {
    id: 'analyze',
    text: 'Analyser la performance du fonds Alpha',
    icon: BarChart3,
    bgClass: 'bg-glacier-50 border-glacier-200',
    iconClass: 'text-glacier-600 bg-glacier-100',
  },
  {
    id: 'compare',
    text: 'Comparer les fonds PE europeens',
    icon: GitCompareArrows,
    bgClass: 'bg-peach-50 border-peach-200',
    iconClass: 'text-peach-600 bg-peach-100',
  },
  {
    id: 'summarize',
    text: 'Resumer le dernier reporting',
    icon: FileText,
    bgClass: 'bg-lab-gray-50 border-lab-gray-200',
    iconClass: 'text-lab-gray-600 bg-lab-gray-100',
  },
  {
    id: 'contradictions',
    text: 'Detecter les contradictions',
    icon: AlertTriangle,
    bgClass: 'bg-danger-muted border-red-200',
    iconClass: 'text-danger bg-red-100',
  },
]

const CATEGORY_PROMPTS: Record<string, string[]> = {
  Analyse: [
    'Calculer le TRI net du fonds sur 5 ans',
    'Identifier les principaux contributeurs de performance',
    'Analyser la deviation par rapport au benchmark',
    'Decomposer l\'attribution de performance par secteur',
  ],
  Comparaison: [
    'Comparer les frais de gestion des fonds mid-cap',
    'Benchmarker Alpha vs Beta sur les metriques de risque',
    'Classement des fonds par ratio de Sharpe',
  ],
  Documents: [
    'Extraire les termes cles du prospectus',
    'Resumer les rapports trimestriels 2024',
    'Identifier les changements dans les conditions generales',
  ],
  Marché: [
    'Tendances du marche PE europeen Q4',
    'Impact des taux sur les valorisations',
    'Analyse des flux de capitaux par strategie',
    'Perspectives macro pour les fonds infrastructure',
  ],
}

const RECENT_CONVERSATIONS = [
  { id: '1', title: 'Analyse performance Alpha Growth', timeAgo: 'Il y a 2h', preview: 'Le fonds affiche un TRI de 18.4%...' },
  { id: '2', title: 'Comparaison frais fonds PE', timeAgo: 'Il y a 5h', preview: 'Les frais de gestion varient de 1.5% a 2.2%...' },
  { id: '3', title: 'Due diligence Beta Income', timeAgo: 'Hier', preview: 'Analyse des documents de la data room...' },
  { id: '4', title: 'Risque portefeuille global', timeAgo: 'Il y a 2j', preview: 'Le VaR 95% du portefeuille est de...' },
  { id: '5', title: 'Reporting Q3 resume', timeAgo: 'Il y a 3j', preview: 'Points cles du trimestre ecoulee...' },
]

const QUICK_ACTIONS = [
  { id: 'new', label: 'Nouveau chat', icon: MessageSquarePlus, color: 'bg-glacier-500' },
  { id: 'import', label: 'Importer documents', icon: Upload, color: 'bg-peach-500' },
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, color: 'bg-carbon-600' },
  { id: 'settings', label: 'Parametres', icon: Settings, color: 'bg-lab-gray-600' },
]

const ONBOARDING_STEPS = [
  { id: 'project', label: 'Creer votre premier projet', done: true },
  { id: 'dataroom', label: 'Importer une data room', done: false },
  { id: 'question', label: 'Poser votre premiere question', done: false },
  { id: 'alerts', label: 'Configurer vos alertes', done: false },
]

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon apres-midi'
  return 'Bonsoir'
}

function useTypingEffect(text: string, speed: number = 60): string {
  const [displayed, setDisplayed] = useState('')
  const indexRef = useRef(0)

  useEffect(() => {
    indexRef.current = 0
    setDisplayed('')

    const interval = setInterval(() => {
      indexRef.current += 1
      if (indexRef.current > text.length) {
        clearInterval(interval)
        return
      }
      setDisplayed(text.slice(0, indexRef.current))
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return displayed
}

export function HomeScreenExperiment() {
  const [activeCategory, setActiveCategory] = useState('Analyse')
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  const typedName = useTypingEffect('Decider.ai', 80)

  function showToast(message: string): void {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const categories = Object.keys(CATEGORY_PROMPTS)

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-4xl mx-auto py-8 px-6 space-y-8">
        {/* Logo + greeting */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-glacier-400 via-glacier-500 to-glacier-700 flex items-center justify-center shadow-glow"
          >
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="text-h1 font-bold text-white"
              style={{
                backgroundImage: 'linear-gradient(90deg, #fff, #d7f6f7, #fff)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              D
            </motion.span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-h2 font-bold text-text-primary">
              {typedName}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                className="inline-block w-0.5 h-6 bg-accent ml-1 align-text-bottom"
              />
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-h3 text-text-secondary"
          >
            {getGreeting()},{' '}
            <span className="font-semibold text-text-primary">Utilisateur</span>
          </motion.p>
        </div>

        {/* Onboarding banner */}
        <AnimatePresence>
          {showOnboarding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-accent-muted border border-glacier-200 rounded-xl p-4 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-caption font-semibold text-text-primary">Demarrage rapide</span>
                </div>
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="text-small text-text-muted hover:text-text-primary cursor-pointer"
                >
                  Masquer
                </button>
              </div>
              <div className="flex gap-3">
                {ONBOARDING_STEPS.map((step, index) => (
                  <div key={step.id} className="flex-1 flex items-start gap-2">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      step.done
                        ? 'bg-success text-white'
                        : 'border-2 border-border bg-surface'
                    }`}>
                      {step.done ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <span className="text-[10px] font-bold text-text-muted">{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-small ${step.done ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prompt suggestion cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-3"
        >
          {PROMPT_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => showToast(`Navigation vers : "${card.text}"`)}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-shadow hover:shadow-md cursor-pointer text-left ${card.bgClass}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${card.iconClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-caption font-medium text-text-primary leading-snug">
                  {card.text}
                </span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Category tabs + prompts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex gap-1 mb-3 border-b border-border">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-2 text-caption font-medium transition-colors cursor-pointer ${
                  activeCategory === cat ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div
                    layoutId="home-category-indicator"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-2"
            >
              {CATEGORY_PROMPTS[activeCategory].map((prompt, index) => (
                <motion.button
                  key={prompt}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => showToast(`Navigation vers : "${prompt}"`)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left hover:bg-surface-secondary transition-colors cursor-pointer group"
                >
                  <Search className="w-4 h-4 text-text-muted shrink-0" />
                  <span className="text-caption text-text-secondary group-hover:text-text-primary transition-colors flex-1">
                    {prompt}
                  </span>
                  <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex gap-3"
        >
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => showToast(`Action : ${action.label}`)}
                className="flex-1 flex flex-col items-center gap-2 py-3 rounded-xl bg-surface border border-border hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${action.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-small font-medium text-text-secondary">{action.label}</span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Recent conversations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h3 className="text-caption font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-muted" />
            Conversations recentes
          </h3>
          <div className="space-y-1">
            {RECENT_CONVERSATIONS.map((conv, index) => (
              <motion.button
                key={conv.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.05 }}
                onClick={() => showToast(`Ouvrir : "${conv.title}"`)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-secondary transition-colors cursor-pointer group text-left"
              >
                <div className="w-8 h-8 rounded-full bg-surface-tertiary flex items-center justify-center shrink-0">
                  {index === 0 ? (
                    <TrendingUp className="w-4 h-4 text-glacier-500" />
                  ) : index === 1 ? (
                    <GitCompareArrows className="w-4 h-4 text-peach-500" />
                  ) : (
                    <Globe className="w-4 h-4 text-text-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-caption font-medium text-text-primary truncate">{conv.title}</span>
                    <span className="text-small text-text-muted shrink-0 ml-2">{conv.timeAgo}</span>
                  </div>
                  <p className="text-small text-text-muted truncate">{conv.preview}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-surface-inverse text-text-inverse px-5 py-3 rounded-xl shadow-xl text-caption font-medium"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
