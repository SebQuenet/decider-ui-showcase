import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, Scan, Eye, EyeOff, FileText, Download,
  Lock, Key, Clock, CheckCircle2,
  XCircle, AlertTriangle, Search, Upload, RefreshCw,
} from 'lucide-react'
import { Tabs } from '../components/ui/Tabs.tsx'
import { Badge } from '../components/ui/Badge.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Toggle } from '../components/ui/Toggle.tsx'
import { ProgressBar } from '../components/ui/ProgressBar.tsx'

// --- Types ---

type PIIType = 'name' | 'email' | 'phone' | 'address' | 'iban' | 'amount'

interface PIIDetection {
  id: string
  type: PIIType
  original: string
  replacement: string
  start: number
  end: number
  anonymized: boolean
  ignored: boolean
}

interface AuditEntry {
  id: string
  datetime: string
  user: string
  action: string
  resource: string
  ip: string
  status: 'success' | 'failure' | 'warning'
}

interface Permission {
  role: string
  view: boolean
  edit: boolean
  export: boolean
  admin: boolean
}

// --- Données mockées ---

const SAMPLE_TEXT = `Le gérant Jean-Pierre Dupont (jean.dupont@alpha-capital.com, +33 6 12 34 56 78) a confirmé que la société Alpha Capital Management, basée au 42 rue de la Paix, Paris, gérait 1.2Md€ d'actifs. Le client M. Robert Martin (compte n° FR76 3000 6000 0112 3456 789) a investi 5M€ dans le fonds. La directrice Mme Claire Fontaine (claire.fontaine@gamma-invest.fr) supervise l'opération depuis les bureaux du 15 avenue des Champs-Élysées, Paris 8e.`

const PII_DETECTIONS: PIIDetection[] = [
  { id: 'pii1', type: 'name', original: 'Jean-Pierre Dupont', replacement: '[PERSONNE_1]', start: 10, end: 28, anonymized: false, ignored: false },
  { id: 'pii2', type: 'email', original: 'jean.dupont@alpha-capital.com', replacement: '[EMAIL_1]', start: 30, end: 59, anonymized: false, ignored: false },
  { id: 'pii3', type: 'phone', original: '+33 6 12 34 56 78', replacement: '[TEL_1]', start: 61, end: 79, anonymized: false, ignored: false },
  { id: 'pii4', type: 'address', original: '42 rue de la Paix, Paris', replacement: '[ADRESSE_1]', start: 130, end: 154, anonymized: false, ignored: false },
  { id: 'pii5', type: 'amount', original: '1.2Md€', replacement: '[MONTANT_1]', start: 163, end: 169, anonymized: false, ignored: false },
  { id: 'pii6', type: 'name', original: 'Robert Martin', replacement: '[PERSONNE_2]', start: 191, end: 204, anonymized: false, ignored: false },
  { id: 'pii7', type: 'iban', original: 'FR76 3000 6000 0112 3456 789', replacement: '[IBAN_1]', start: 218, end: 246, anonymized: false, ignored: false },
  { id: 'pii8', type: 'amount', original: '5M€', replacement: '[MONTANT_2]', start: 260, end: 263, anonymized: false, ignored: false },
  { id: 'pii9', type: 'name', original: 'Claire Fontaine', replacement: '[PERSONNE_3]', start: 293, end: 308, anonymized: false, ignored: false },
  { id: 'pii10', type: 'email', original: 'claire.fontaine@gamma-invest.fr', replacement: '[EMAIL_2]', start: 310, end: 341, anonymized: false, ignored: false },
  { id: 'pii11', type: 'address', original: '15 avenue des Champs-Élysées, Paris 8e', replacement: '[ADRESSE_2]', start: 383, end: 421, anonymized: false, ignored: false },
]

const PII_TYPE_LABELS: Record<PIIType, { label: string; color: string; underline: string }> = {
  name: { label: 'Nom', color: 'text-orange-600', underline: 'decoration-orange-400' },
  email: { label: 'Email', color: 'text-red-600', underline: 'decoration-red-400' },
  phone: { label: 'Téléphone', color: 'text-red-600', underline: 'decoration-red-400' },
  address: { label: 'Adresse', color: 'text-yellow-600', underline: 'decoration-yellow-400' },
  iban: { label: 'IBAN', color: 'text-red-600', underline: 'decoration-red-400' },
  amount: { label: 'Montant', color: 'text-blue-600', underline: 'decoration-blue-400' },
}

const AUDIT_ENTRIES: AuditEntry[] = [
  { id: 'au1', datetime: '11/02/2026 09:15:23', user: 'Sophie Lemaire', action: 'Connexion', resource: 'Système', ip: '192.168.1.42', status: 'success' },
  { id: 'au2', datetime: '11/02/2026 09:18:05', user: 'Sophie Lemaire', action: 'Accès data room', resource: 'Alpha Growth III', ip: '192.168.1.42', status: 'success' },
  { id: 'au3', datetime: '11/02/2026 09:22:47', user: 'Marc Dubois', action: 'Connexion', resource: 'Système', ip: '10.0.0.15', status: 'success' },
  { id: 'au4', datetime: '11/02/2026 09:25:12', user: 'Marc Dubois', action: 'Export document', resource: 'Rapport Q4 2025', ip: '10.0.0.15', status: 'success' },
  { id: 'au5', datetime: '11/02/2026 09:30:00', user: 'Utilisateur inconnu', action: 'Tentative accès non autorisé', resource: 'Data room confidentiel', ip: '85.12.45.78', status: 'failure' },
  { id: 'au6', datetime: '11/02/2026 10:05:33', user: 'Élodie Renaud', action: 'Connexion', resource: 'Système', ip: '192.168.1.88', status: 'success' },
  { id: 'au7', datetime: '11/02/2026 10:12:18', user: 'Élodie Renaud', action: 'Modification paramètres', resource: 'Seuils d\'alerte', ip: '192.168.1.88', status: 'success' },
  { id: 'au8', datetime: '11/02/2026 10:15:44', user: 'Sophie Lemaire', action: 'Téléchargement', resource: 'LPA Asia PE VII', ip: '192.168.1.42', status: 'success' },
  { id: 'au9', datetime: '11/02/2026 10:30:02', user: 'Thomas Bernard', action: 'Connexion', resource: 'Système', ip: '172.16.0.5', status: 'warning' },
  { id: 'au10', datetime: '11/02/2026 10:31:15', user: 'Thomas Bernard', action: 'Accès data room', resource: 'Impact Health I', ip: '172.16.0.5', status: 'success' },
  { id: 'au11', datetime: '10/02/2026 18:45:22', user: 'Utilisateur inconnu', action: 'Tentative accès non autorisé', resource: 'Système admin', ip: '91.234.56.12', status: 'failure' },
  { id: 'au12', datetime: '10/02/2026 17:30:00', user: 'Marc Dubois', action: 'Export document', resource: 'Portefeuille Global', ip: '10.0.0.15', status: 'success' },
  { id: 'au13', datetime: '10/02/2026 16:15:33', user: 'Élodie Renaud', action: 'Modification paramètres', resource: 'Permissions utilisateurs', ip: '192.168.1.88', status: 'success' },
  { id: 'au14', datetime: '10/02/2026 14:22:11', user: 'Sophie Lemaire', action: 'Anonymisation', resource: 'Document due diligence', ip: '192.168.1.42', status: 'success' },
  { id: 'au15', datetime: '10/02/2026 11:05:47', user: 'Thomas Bernard', action: 'Connexion MFA', resource: 'Système', ip: '172.16.0.5', status: 'warning' },
  { id: 'au16', datetime: '10/02/2026 09:00:00', user: 'Système', action: 'Rotation des clés', resource: 'Chiffrement AES-256', ip: '-', status: 'success' },
]

const PERMISSIONS: Permission[] = [
  { role: 'Admin', view: true, edit: true, export: true, admin: true },
  { role: 'Manager', view: true, edit: true, export: true, admin: false },
  { role: 'Analyste', view: true, edit: true, export: false, admin: false },
  { role: 'Lecteur', view: true, edit: false, export: false, admin: false },
]

const INNER_TABS = [
  { id: 'anonymisation', label: 'Anonymisation' },
  { id: 'audit', label: 'Audit Trail' },
  { id: 'settings', label: 'Paramètres' },
]

const STATUS_STYLES: Record<string, { variant: 'success' | 'danger' | 'warning'; icon: typeof CheckCircle2 }> = {
  success: { variant: 'success', icon: CheckCircle2 },
  failure: { variant: 'danger', icon: XCircle },
  warning: { variant: 'warning', icon: AlertTriangle },
}

// --- Composant principal ---

export function SecurityExperiment() {
  const [activeTab, setActiveTab] = useState('anonymisation')
  const [detections, setDetections] = useState<PIIDetection[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [isAnonymized, setIsAnonymized] = useState(false)
  const [auditFilter, setAuditFilter] = useState<string>('all')
  const [auditSort, setAuditSort] = useState<'asc' | 'desc'>('desc')
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleScan(): void {
    setIsScanning(true)
    setScanProgress(0)
    setDetections([])
    setIsAnonymized(false)

    let progress = 0
    function tick() {
      progress += 5
      setScanProgress(progress)
      if (progress >= 100) {
        setIsScanning(false)
        setDetections(PII_DETECTIONS)
        return
      }
      scanTimerRef.current = setTimeout(tick, 80)
    }
    scanTimerRef.current = setTimeout(tick, 80)
  }

  function handleAnonymizeAll(): void {
    setDetections((prev) =>
      prev.map((d) => d.ignored ? d : { ...d, anonymized: true }),
    )
    setIsAnonymized(true)
  }

  function handleToggleDetection(detectionId: string, action: 'anonymize' | 'ignore'): void {
    setDetections((prev) =>
      prev.map((d) => {
        if (d.id !== detectionId) return d
        if (action === 'anonymize') return { ...d, anonymized: true, ignored: false }
        return { ...d, ignored: true, anonymized: false }
      }),
    )
  }

  function handleResetAnonymization(): void {
    setDetections((prev) =>
      prev.map((d) => ({ ...d, anonymized: false, ignored: false })),
    )
    setIsAnonymized(false)
  }

  useEffect(() => {
    return () => {
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current)
    }
  }, [])

  return (
    <div className="w-full h-full max-w-7xl mx-auto flex flex-col bg-surface rounded-2xl shadow-lg overflow-hidden border border-border">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-glacier-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-body font-semibold text-text-primary">Sécurité</h2>
            <p className="text-small text-text-muted">Anonymisation, audit & paramètres</p>
          </div>
        </div>
        <Tabs
          tabs={INNER_TABS}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
          layoutId="security-tabs"
        />
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'anonymisation' && (
          <AnonymisationView
            detections={detections}
            isScanning={isScanning}
            scanProgress={scanProgress}
            isAnonymized={isAnonymized}
            onScan={handleScan}
            onAnonymizeAll={handleAnonymizeAll}
            onToggleDetection={handleToggleDetection}
            onReset={handleResetAnonymization}
          />
        )}
        {activeTab === 'audit' && (
          <AuditTrailView
            filter={auditFilter}
            onFilterChange={setAuditFilter}
            sort={auditSort}
            onSortChange={() => setAuditSort(auditSort === 'desc' ? 'asc' : 'desc')}
          />
        )}
        {activeTab === 'settings' && <SettingsView />}
      </div>
    </div>
  )
}

// --- Anonymisation ---

function AnonymisationView({
  detections,
  isScanning,
  scanProgress,
  isAnonymized,
  onScan,
  onAnonymizeAll,
  onToggleDetection,
  onReset,
}: {
  detections: PIIDetection[]
  isScanning: boolean
  scanProgress: number
  isAnonymized: boolean
  onScan: () => void
  onAnonymizeAll: () => void
  onToggleDetection: (id: string, action: 'anonymize' | 'ignore') => void
  onReset: () => void
}) {
  const [hoveredPII, setHoveredPII] = useState<string | null>(null)

  function renderAnonymizedText(): React.ReactNode {
    if (detections.length === 0) return SAMPLE_TEXT

    let text = SAMPLE_TEXT
    const sortedDetections = [...detections].sort((a, b) => b.original.length - a.original.length)

    for (const detection of sortedDetections) {
      if (detection.anonymized) {
        text = text.replace(detection.original, detection.replacement)
      }
    }

    const parts: React.ReactNode[] = []
    let remaining = text
    let keyIndex = 0

    for (const detection of detections) {
      if (detection.anonymized || detection.ignored) continue

      const searchTerm = detection.original
      const index = remaining.indexOf(searchTerm)
      if (index === -1) continue

      const before = remaining.slice(0, index)
      remaining = remaining.slice(index + searchTerm.length)
      const typeInfo = PII_TYPE_LABELS[detection.type]

      if (before) parts.push(<span key={keyIndex++}>{before}</span>)

      parts.push(
        <span
          key={keyIndex++}
          className={`underline decoration-2 ${typeInfo.underline} cursor-pointer relative`}
          onMouseEnter={() => setHoveredPII(detection.id)}
          onMouseLeave={() => setHoveredPII(null)}
        >
          {searchTerm}
          {hoveredPII === detection.id && (
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 -top-12 bg-surface border border-border rounded-lg shadow-lg p-2 z-20 whitespace-nowrap"
            >
              <span className={`text-small font-medium ${typeInfo.color}`}>{typeInfo.label}</span>
              <span className="flex gap-2 mt-1">
                <button
                  onClick={() => onToggleDetection(detection.id, 'anonymize')}
                  className="text-small text-accent hover:underline cursor-pointer"
                >
                  Anonymiser
                </button>
                <button
                  onClick={() => onToggleDetection(detection.id, 'ignore')}
                  className="text-small text-text-muted hover:underline cursor-pointer"
                >
                  Ignorer
                </button>
              </span>
            </motion.span>
          )}
        </span>,
      )
    }

    if (remaining) parts.push(<span key={keyIndex++}>{remaining}</span>)

    return parts.length > 0 ? parts : text
  }

  const typeCount = detections.reduce<Record<string, { total: number; anonymized: number }>>((acc, d) => {
    const typeLabel = PII_TYPE_LABELS[d.type].label
    if (!acc[typeLabel]) acc[typeLabel] = { total: 0, anonymized: 0 }
    acc[typeLabel].total += 1
    if (d.anonymized) acc[typeLabel].anonymized += 1
    return acc
  }, {})

  return (
    <div className="h-full flex overflow-hidden">
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        <div className="bg-surface-secondary rounded-lg border border-border p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-caption font-semibold text-text-primary">Texte source</span>
            <div className="flex gap-2">
              {detections.length > 0 && !isAnonymized && (
                <Button size="sm" onClick={onAnonymizeAll}>
                  <EyeOff className="w-3.5 h-3.5" />
                  Anonymiser tout
                </Button>
              )}
              {detections.length > 0 && (
                <Button variant="ghost" size="sm" onClick={onReset}>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Réinitialiser
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={onScan} disabled={isScanning}>
                <Scan className="w-3.5 h-3.5" />
                Détecter PII
              </Button>
            </div>
          </div>

          {isScanning && (
            <div className="mb-3">
              <ProgressBar value={scanProgress} showLabel />
              <p className="text-small text-text-muted mt-1">Analyse du texte en cours...</p>
            </div>
          )}

          <div className="bg-surface rounded-lg border border-border p-4">
            <p className="text-body text-text-primary leading-relaxed whitespace-pre-wrap">
              {renderAnonymizedText()}
            </p>
          </div>
        </div>

        {/* Upload de document */}
        <div className="bg-surface-secondary rounded-lg border border-border p-4">
          <span className="text-caption font-semibold text-text-primary mb-3 block">Anonymisation de document</span>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <p className="text-small text-text-muted">Glissez un document ici ou</p>
            <Button variant="secondary" size="sm" className="mt-2">
              <FileText className="w-3.5 h-3.5" />
              Parcourir
            </Button>
          </div>
        </div>
      </div>

      {/* Panneau latéral résumé PII */}
      {detections.length > 0 && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          className="border-l border-border bg-surface-secondary shrink-0 overflow-y-auto"
        >
          <div className="p-4">
            <span className="text-caption font-semibold text-text-primary">Résumé PII</span>
            <div className="mt-3 space-y-2">
              {Object.entries(typeCount).map(([type, counts]) => (
                <div key={type} className="flex items-center justify-between bg-surface rounded-lg border border-border px-3 py-2">
                  <span className="text-small text-text-primary">{type}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" size="sm">{counts.total}</Badge>
                    {counts.anonymized > 0 && (
                      <Badge variant="success" size="sm">{counts.anonymized} masqué(s)</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1.5">
              {detections.map((detection) => {
                const typeInfo = PII_TYPE_LABELS[detection.type]
                return (
                  <div
                    key={detection.id}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-small ${
                      detection.anonymized
                        ? 'bg-success-muted text-success line-through'
                        : detection.ignored
                          ? 'bg-surface-tertiary text-text-muted line-through'
                          : 'bg-surface border border-border text-text-primary'
                    }`}
                  >
                    {detection.anonymized ? (
                      <EyeOff className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="truncate">{detection.original}</span>
                    <span className={`text-small ${typeInfo.color} ml-auto shrink-0`}>{typeInfo.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// --- Audit Trail ---

function AuditTrailView({
  filter,
  onFilterChange,
  sort,
  onSortChange,
}: {
  filter: string
  onFilterChange: (filter: string) => void
  sort: 'asc' | 'desc'
  onSortChange: () => void
}) {
  const actions = ['all', ...new Set(AUDIT_ENTRIES.map((e) => e.action))]

  const filteredEntries = AUDIT_ENTRIES
    .filter((e) => filter === 'all' || e.action === filter)
    .sort((a, b) => {
      if (sort === 'desc') return b.datetime.localeCompare(a.datetime)
      return a.datetime.localeCompare(b.datetime)
    })

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-text-muted" />
          <select
            value={filter}
            onChange={(event) => onFilterChange(event.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-small text-text-primary"
          >
            {actions.map((action) => (
              <option key={action} value={action}>
                {action === 'all' ? 'Toutes les actions' : action}
              </option>
            ))}
          </select>
          <button
            onClick={onSortChange}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-small text-text-primary hover:bg-surface-secondary cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            {sort === 'desc' ? 'Plus récent' : 'Plus ancien'}
          </button>
        </div>
        <Button variant="secondary" size="sm">
          <Download className="w-3.5 h-3.5" />
          Exporter
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto border border-border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-surface-secondary sticky top-0">
            <tr>
              <th className="px-4 py-2.5 text-small font-semibold text-text-primary">Date/Heure</th>
              <th className="px-4 py-2.5 text-small font-semibold text-text-primary">Utilisateur</th>
              <th className="px-4 py-2.5 text-small font-semibold text-text-primary">Action</th>
              <th className="px-4 py-2.5 text-small font-semibold text-text-primary">Ressource</th>
              <th className="px-4 py-2.5 text-small font-semibold text-text-primary">IP</th>
              <th className="px-4 py-2.5 text-small font-semibold text-text-primary">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => {
              const statusStyle = STATUS_STYLES[entry.status]
              const StatusIcon = statusStyle.icon
              return (
                <tr key={entry.id} className="border-t border-border hover:bg-surface-secondary transition-colors">
                  <td className="px-4 py-2.5 text-small text-text-secondary font-mono">{entry.datetime}</td>
                  <td className="px-4 py-2.5 text-small text-text-primary">{entry.user}</td>
                  <td className="px-4 py-2.5 text-small text-text-secondary">{entry.action}</td>
                  <td className="px-4 py-2.5 text-small text-text-secondary">{entry.resource}</td>
                  <td className="px-4 py-2.5 text-small text-text-muted font-mono">{entry.ip}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={statusStyle.variant} size="sm">
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {entry.status === 'success' ? 'Succès' : entry.status === 'failure' ? 'Échec' : 'Warning'}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- Paramètres ---

function SettingsView() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState('30min')
  const [retentionPolicy, setRetentionPolicy] = useState('3ans')
  const [permissions, setPermissions] = useState(PERMISSIONS)

  function handleTogglePermission(role: string, permission: keyof Permission): void {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.role !== role) return p
        return { ...p, [permission]: !p[permission] }
      }),
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Authentification */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-accent" />
            <span className="text-caption font-semibold text-text-primary">Authentification</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-small text-text-primary">Authentification 2FA</span>
              <Toggle checked={twoFactorEnabled} onChange={setTwoFactorEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-small text-text-primary">Timeout session</span>
              <select
                value={sessionTimeout}
                onChange={(event) => setSessionTimeout(event.target.value)}
                className="rounded-md border border-border bg-surface px-2 py-1 text-small text-text-primary"
              >
                <option value="15min">15 min</option>
                <option value="30min">30 min</option>
                <option value="1h">1 heure</option>
                <option value="4h">4 heures</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chiffrement */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-accent" />
            <span className="text-caption font-semibold text-text-primary">Chiffrement</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-small text-text-primary">Algorithme</span>
              <Badge variant="success">AES-256 ✓</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-small text-text-primary">Rotation des clés</span>
              <span className="text-small text-text-secondary">Tous les 90 jours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-small text-text-primary">Dernière rotation</span>
              <span className="text-small text-text-muted">10/02/2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Matrice d'accès */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-accent" />
          <span className="text-caption font-semibold text-text-primary">Matrice d'accès par rôle</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-2.5 text-small font-semibold text-text-primary">Rôle</th>
                <th className="px-4 py-2.5 text-small font-semibold text-text-primary text-center">Voir données</th>
                <th className="px-4 py-2.5 text-small font-semibold text-text-primary text-center">Modifier</th>
                <th className="px-4 py-2.5 text-small font-semibold text-text-primary text-center">Exporter</th>
                <th className="px-4 py-2.5 text-small font-semibold text-text-primary text-center">Administrer</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm) => (
                <tr key={perm.role} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5 text-small font-medium text-text-primary">{perm.role}</td>
                  {(['view', 'edit', 'export', 'admin'] as const).map((key) => (
                    <td key={key} className="px-4 py-2.5 text-center">
                      <button
                        onClick={() => handleTogglePermission(perm.role, key)}
                        className="cursor-pointer"
                      >
                        {perm[key] ? (
                          <CheckCircle2 className="w-5 h-5 text-success mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-text-muted mx-auto" />
                        )}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rétention */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-accent" />
          <span className="text-caption font-semibold text-text-primary">Politique de rétention des données</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-small text-text-primary">Durée de conservation :</span>
          <select
            value={retentionPolicy}
            onChange={(event) => setRetentionPolicy(event.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-small text-text-primary"
          >
            <option value="1an">1 an</option>
            <option value="3ans">3 ans</option>
            <option value="5ans">5 ans</option>
            <option value="unlimited">Illimité</option>
          </select>
          <span className="text-small text-text-muted">Données supprimées automatiquement après expiration</span>
        </div>
      </div>
    </div>
  )
}
