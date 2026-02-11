import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Share2, Link, Copy, Check, UserPlus, X,
  MessageSquare, Users, ChevronDown, Clock,
} from 'lucide-react'
import { Avatar } from '../components/ui/Avatar.tsx'
import { Badge } from '../components/ui/Badge.tsx'
import { Button } from '../components/ui/Button.tsx'

// --- Types ---

interface Collaborator {
  id: string
  name: string
  role: 'Lecteur' | 'Éditeur' | 'Admin'
  status: 'active' | 'idle' | 'offline'
  color: string
}

interface InlineComment {
  id: string
  highlightId: string
  text: string
  author: string
  timestamp: string
  replies: { author: string; text: string; timestamp: string }[]
  resolved: boolean
}

interface Team {
  id: string
  name: string
  members: string[]
}

interface ActivityEntry {
  id: string
  user: string
  action: string
  time: string
}

// --- Données mockées ---

const COLLABORATORS: Collaborator[] = [
  { id: 'c1', name: 'Sophie Lemaire', role: 'Éditeur', status: 'active', color: 'bg-glacier-500' },
  { id: 'c2', name: 'Marc Dubois', role: 'Éditeur', status: 'idle', color: 'bg-peach-500' },
  { id: 'c3', name: 'Élodie Renaud', role: 'Admin', status: 'active', color: 'bg-emerald-500' },
  { id: 'c4', name: 'Thomas Bernard', role: 'Lecteur', status: 'offline', color: 'bg-purple-500' },
]

const DOCUMENT_CONTENT = `Analyse de Performance - Alpha Growth Fund III
Période : Q4 2025

1. Résumé Exécutif

Le fonds Alpha Growth Fund III a enregistré une performance nette de +8.7% sur le quatrième trimestre 2025, surpassant son benchmark (MSCI Europe Growth) de 2.3 points. Cette surperformance est principalement attribuable à la sélection de titres dans les secteurs technologie et santé.

2. Attribution de Performance

La contribution sectorielle se décompose comme suit :
- Technologie : +4.2% (surpondération sur les semi-conducteurs européens)
- Santé : +2.8% (positions sur les biotechnologies nordiques)
- Industrie : +1.1% (exposition aux valeurs de transition énergétique)
- Finance : +0.6% (positions tactiques sur les banques du sud de l'Europe)

Les détracteurs principaux ont été les positions sur les utilities (-0.3%) et l'immobilier coté (-0.2%), impactés par la remontée des taux longs.

3. Analyse des Risques

Le ratio de Sharpe du fonds s'établit à 1.42 sur 12 mois glissants, en amélioration par rapport au trimestre précédent (1.28). La volatilité annualisée reste contenue à 12.3%, contre 14.1% pour le benchmark.

Le drawdown maximum sur la période a été de -4.8% (mi-octobre), rapidement récupéré en 3 semaines. L'exposition nette s'est maintenue entre 92% et 98% du portefeuille.

4. Perspectives Q1 2026

L'équipe de gestion maintient un biais positif sur les secteurs technologie et santé, avec un renforcement progressif sur les valeurs de la transition numérique. Une réduction de l'exposition aux valeurs cycliques est envisagée en raison des signaux de ralentissement économique en zone euro.`

const HIGHLIGHTS = [
  { id: 'h1', start: 'surpassant son benchmark', color: 'bg-yellow-200/60' },
  { id: 'h2', start: 'Le ratio de Sharpe du fonds', color: 'bg-yellow-200/60' },
  { id: 'h3', start: 'un biais positif sur les secteurs', color: 'bg-yellow-200/60' },
]

const COMMENTS: InlineComment[] = [
  {
    id: 'cm1',
    highlightId: 'h1',
    text: 'Impressionnant. Il faudrait détailler les facteurs de surperformance pour le comité.',
    author: 'Sophie Lemaire',
    timestamp: 'Il y a 2h',
    replies: [
      { author: 'Marc Dubois', text: 'D\'accord, je prépare un slide dédié à l\'attribution factorielle.', timestamp: 'Il y a 1h' },
      { author: 'Élodie Renaud', text: 'Ajoutez aussi la comparaison avec les pairs SVP.', timestamp: 'Il y a 45 min' },
    ],
    resolved: false,
  },
  {
    id: 'cm2',
    highlightId: 'h2',
    text: 'Le Sharpe est bon mais vérifiez si c\'est ajusté des frais de gestion.',
    author: 'Élodie Renaud',
    timestamp: 'Hier',
    replies: [
      { author: 'Sophie Lemaire', text: 'Oui, c\'est net de frais. Je l\'ai confirmé avec le middle office.', timestamp: 'Il y a 5h' },
    ],
    resolved: false,
  },
  {
    id: 'cm3',
    highlightId: 'h3',
    text: 'Attention au risque de concentration sectorielle. On est déjà à 38% sur la tech.',
    author: 'Marc Dubois',
    timestamp: 'Hier',
    replies: [],
    resolved: false,
  },
]

const TEAMS: Team[] = [
  { id: 'tm1', name: 'Équipe DD Alpha', members: ['Sophie Lemaire', 'Marc Dubois', 'Thomas Bernard', 'Julie Martin'] },
  { id: 'tm2', name: 'Comité Investissement', members: ['Élodie Renaud', 'Marc Dubois', 'Sophie Lemaire', 'Dir. Investissement', 'Dir. Risques', 'DG'] },
]

const ACTIVITIES: ActivityEntry[] = [
  { id: 'ac1', user: 'Sophie Lemaire', action: 'a modifié la section Performance', time: 'Il y a 5 min' },
  { id: 'ac2', user: 'Marc Dubois', action: 'a ajouté un commentaire', time: 'Il y a 15 min' },
  { id: 'ac3', user: 'Élodie Renaud', action: 'a relu la section Risques', time: 'Il y a 30 min' },
  { id: 'ac4', user: 'Sophie Lemaire', action: 'a mis à jour les graphiques', time: 'Il y a 1h' },
  { id: 'ac5', user: 'Thomas Bernard', action: 'a consulté le document', time: 'Il y a 2h' },
]

const CURSOR_POSITIONS = [
  { name: 'Sophie', color: 'bg-glacier-500', textColor: 'text-white', top: 28, left: 45 },
  { name: 'Marc', color: 'bg-peach-500', textColor: 'text-white', top: 58, left: 62 },
]

const STATUS_LABELS: Record<string, string> = {
  active: 'Actif',
  idle: 'Absent',
  offline: 'Hors ligne',
}

const STATUS_DOT_COLORS: Record<string, string> = {
  active: 'bg-success',
  idle: 'bg-warning',
  offline: 'bg-carbon-400',
}

// --- Composant principal ---

export function CollaborationExperiment() {
  const [showShareModal, setShowShareModal] = useState(false)
  const [activeComment, setActiveComment] = useState<string | null>(null)
  const [comments, setComments] = useState(COMMENTS)
  const [linkCopied, setLinkCopied] = useState(false)
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({})

  function handleCopyLink(): void {
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  function handleResolveComment(commentId: string): void {
    setComments((prev) =>
      prev.map((c) => c.id === commentId ? { ...c, resolved: true } : c),
    )
    setActiveComment(null)
  }

  function handleAddReply(commentId: string): void {
    const text = replyTexts[commentId]?.trim()
    if (!text) return
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c
        return {
          ...c,
          replies: [...c.replies, { author: 'Vous', text, timestamp: 'À l\'instant' }],
        }
      }),
    )
    setReplyTexts((prev) => ({ ...prev, [commentId]: '' }))
  }

  return (
    <div className="w-full h-full max-w-7xl mx-auto flex flex-col bg-surface rounded-2xl shadow-lg overflow-hidden border border-border">
      {/* Barre supérieure */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-glacier-600 flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-body font-semibold text-text-primary">Analyse Alpha Growth III - Q4 2025</h2>
            <p className="text-small text-text-muted">Document collaboratif</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2">
            {COLLABORATORS.filter((c) => c.status !== 'offline').map((collaborator) => (
              <div key={collaborator.id} className="relative">
                <Avatar name={collaborator.name} size="sm" />
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-surface ${STATUS_DOT_COLORS[collaborator.status]}`} />
              </div>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowShareModal(true)}>
            <Share2 className="w-3.5 h-3.5" />
            Partager
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Éditeur de document */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <DocumentEditor
            content={DOCUMENT_CONTENT}
            highlights={HIGHLIGHTS}
            activeComment={activeComment}
            onHighlightClick={setActiveComment}
          />
          {/* Curseurs simulés */}
          {CURSOR_POSITIONS.map((cursor) => (
            <SimulatedCursor key={cursor.name} {...cursor} />
          ))}
        </div>

        {/* Panneau commentaires / activité */}
        <div className="w-80 border-l border-border flex flex-col bg-surface-secondary shrink-0">
          {/* Commentaire actif */}
          <AnimatePresence mode="wait">
            {activeComment ? (
              <motion.div
                key={activeComment}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="border-b border-border"
              >
                {comments
                  .filter((c) => c.highlightId === activeComment && !c.resolved)
                  .map((comment) => (
                    <CommentThread
                      key={comment.id}
                      comment={comment}
                      replyText={replyTexts[comment.id] ?? ''}
                      onReplyTextChange={(text) => setReplyTexts((prev) => ({ ...prev, [comment.id]: text }))}
                      onAddReply={() => handleAddReply(comment.id)}
                      onResolve={() => handleResolveComment(comment.id)}
                      onClose={() => setActiveComment(null)}
                    />
                  ))}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Présence */}
          <div className="px-4 py-3 border-b border-border">
            <span className="text-small font-semibold text-text-primary">En ligne maintenant</span>
            <div className="mt-2 space-y-2">
              {COLLABORATORS.filter((c) => c.status !== 'offline').map((collaborator) => (
                <div key={collaborator.id} className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar name={collaborator.name} size="sm" />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-surface-secondary ${STATUS_DOT_COLORS[collaborator.status]}`} />
                  </div>
                  <div>
                    <span className="text-small text-text-primary">{collaborator.name}</span>
                    <span className="text-small text-text-muted ml-1">({STATUS_LABELS[collaborator.status]})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activité récente */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            <span className="text-small font-semibold text-text-primary">Activité récente</span>
            <div className="mt-2 space-y-3">
              {ACTIVITIES.map((activity) => (
                <div key={activity.id} className="flex items-start gap-2">
                  <Avatar name={activity.user} size="sm" />
                  <div>
                    <p className="text-small text-text-secondary">
                      <span className="font-medium text-text-primary">{activity.user.split(' ')[0]}</span>{' '}
                      {activity.action}
                    </p>
                    <span className="text-small text-text-muted">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Équipes */}
            <div className="mt-6">
              <span className="text-small font-semibold text-text-primary">Équipes</span>
              <div className="mt-2 space-y-2">
                {TEAMS.map((team) => (
                  <div key={team.id} className="bg-surface border border-border rounded-lg">
                    <button
                      onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                      className="w-full flex items-center justify-between px-3 py-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-text-muted" />
                        <span className="text-small font-medium text-text-primary">{team.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" size="sm">{team.members.length}</Badge>
                        <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${expandedTeam === team.id ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedTeam === team.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-2 space-y-1.5 border-t border-border pt-2">
                            {team.members.map((member) => (
                              <div key={member} className="flex items-center gap-2">
                                <Avatar name={member} size="sm" />
                                <span className="text-small text-text-secondary">{member}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de partage */}
      <AnimatePresence>
        {showShareModal && (
          <ShareModal
            collaborators={COLLABORATORS}
            linkCopied={linkCopied}
            onCopyLink={handleCopyLink}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// --- Sous-composants ---

function DocumentEditor({
  content,
  highlights,
  activeComment,
  onHighlightClick,
}: {
  content: string
  highlights: { id: string; start: string; color: string }[]
  activeComment: string | null
  onHighlightClick: (id: string) => void
}) {
  function renderContent(): React.ReactNode {
    let remaining = content
    const parts: React.ReactNode[] = []
    let keyIndex = 0

    for (const highlight of highlights) {
      const highlightIndex = remaining.indexOf(highlight.start)
      if (highlightIndex === -1) continue

      const before = remaining.slice(0, highlightIndex)
      const matched = remaining.slice(highlightIndex, highlightIndex + highlight.start.length)
      remaining = remaining.slice(highlightIndex + highlight.start.length)

      if (before) {
        parts.push(<span key={keyIndex++}>{before}</span>)
      }
      parts.push(
        <span
          key={keyIndex++}
          onClick={() => onHighlightClick(highlight.id)}
          className={`${highlight.color} cursor-pointer hover:bg-yellow-300/60 transition-colors rounded px-0.5 ${
            activeComment === highlight.id ? 'ring-2 ring-accent' : ''
          }`}
        >
          {matched}
          <MessageSquare className="w-3 h-3 inline ml-1 text-accent opacity-60" />
        </span>,
      )
    }

    if (remaining) {
      parts.push(<span key={keyIndex++}>{remaining}</span>)
    }

    return parts
  }

  return (
    <div className="max-w-3xl mx-auto">
      <pre className="text-body text-text-primary leading-relaxed whitespace-pre-wrap font-sans">
        {renderContent()}
      </pre>
    </div>
  )
}

function SimulatedCursor({ name, color, textColor, top, left }: {
  name: string
  color: string
  textColor: string
  top: number
  left: number
}) {
  const [position, setPosition] = useState({ top, left })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPosition((prev) => ({
        top: prev.top + (Math.random() - 0.5) * 3,
        left: prev.left + (Math.random() - 0.5) * 2,
      }))
    }, 2000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <motion.div
      animate={{ top: `${position.top}%`, left: `${position.left}%` }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      className="absolute pointer-events-none z-10"
    >
      <div className={`w-0.5 h-5 ${color} rounded-full`} />
      <span className={`${color} ${textColor} text-[0.6rem] px-1.5 py-0.5 rounded-full font-medium -ml-1`}>
        {name}
      </span>
    </motion.div>
  )
}

function CommentThread({
  comment,
  replyText,
  onReplyTextChange,
  onAddReply,
  onResolve,
  onClose,
}: {
  comment: InlineComment
  replyText: string
  onReplyTextChange: (text: string) => void
  onAddReply: () => void
  onResolve: () => void
  onClose: () => void
}) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-small font-semibold text-text-primary">Commentaire</span>
        <button onClick={onClose} className="p-1 rounded hover:bg-surface-tertiary cursor-pointer">
          <X className="w-3.5 h-3.5 text-text-muted" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Avatar name={comment.author} size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-small font-medium text-text-primary">{comment.author}</span>
              <span className="text-small text-text-muted">{comment.timestamp}</span>
            </div>
            <p className="text-small text-text-secondary mt-0.5">{comment.text}</p>
          </div>
        </div>

        {comment.replies.map((reply, index) => (
          <div key={index} className="flex items-start gap-2 pl-4 border-l-2 border-border">
            <Avatar name={reply.author} size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-small font-medium text-text-primary">{reply.author}</span>
                <span className="text-small text-text-muted">{reply.timestamp}</span>
              </div>
              <p className="text-small text-text-secondary mt-0.5">{reply.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={replyText}
          onChange={(event) => onReplyTextChange(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') onAddReply() }}
          placeholder="Répondre..."
          className="flex-1 rounded-md border border-border bg-surface px-3 py-1.5 text-small text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <Button size="sm" onClick={onAddReply} disabled={!replyText.trim()}>
          Envoyer
        </Button>
      </div>
      <button
        onClick={onResolve}
        className="text-small text-accent font-medium hover:underline cursor-pointer"
      >
        Résoudre ce fil
      </button>
    </div>
  )
}

function ShareModal({
  collaborators,
  linkCopied,
  onCopyLink,
  onClose,
}: {
  collaborators: Collaborator[]
  linkCopied: boolean
  onCopyLink: () => void
  onClose: () => void
}) {
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Lecteur')
  const [expiration, setExpiration] = useState('7j')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
        className="bg-surface rounded-xl border border-border shadow-2xl w-[480px] max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-body font-semibold text-text-primary">Partager le document</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface-secondary cursor-pointer">
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Lien de partage */}
          <div>
            <span className="text-small font-semibold text-text-primary mb-2 block">Lien de partage</span>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-surface-secondary rounded-lg px-3 py-2 border border-border">
                <Link className="w-4 h-4 text-text-muted shrink-0" />
                <span className="text-small text-text-secondary truncate">https://app.decider.io/docs/alpha-q4-2025</span>
              </div>
              <Button variant="secondary" size="sm" onClick={onCopyLink}>
                {linkCopied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                {linkCopied ? 'Copié' : 'Copier'}
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-small text-text-muted">Expiration :</span>
              <select
                value={expiration}
                onChange={(event) => setExpiration(event.target.value)}
                className="rounded-md border border-border bg-surface px-2 py-1 text-small text-text-primary"
              >
                <option value="24h">24 heures</option>
                <option value="7j">7 jours</option>
                <option value="30j">30 jours</option>
                <option value="never">Jamais</option>
              </select>
            </div>
          </div>

          {/* Invitation par email */}
          <div>
            <span className="text-small font-semibold text-text-primary mb-2 block">Inviter par email</span>
            <div className="flex gap-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="email@exemple.com"
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-small text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <select
                value={inviteRole}
                onChange={(event) => setInviteRole(event.target.value)}
                className="rounded-lg border border-border bg-surface px-2 py-2 text-small text-text-primary"
              >
                <option>Lecteur</option>
                <option>Éditeur</option>
                <option>Admin</option>
              </select>
              <Button size="sm">
                <UserPlus className="w-3.5 h-3.5" />
                Inviter
              </Button>
            </div>
          </div>

          {/* Collaborateurs actuels */}
          <div>
            <span className="text-small font-semibold text-text-primary mb-2 block">Collaborateurs</span>
            <div className="space-y-2">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Avatar name={collaborator.name} size="sm" />
                    <span className="text-small text-text-primary">{collaborator.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" size="sm">{collaborator.role}</Badge>
                    <button className="text-small text-danger hover:underline cursor-pointer">Retirer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Résumé des permissions */}
          <div className="bg-surface-secondary rounded-lg p-3 border border-border">
            <span className="text-small font-medium text-text-primary">Permissions</span>
            <div className="flex gap-3 mt-2">
              <Badge variant="success" size="sm">Peut voir</Badge>
              <Badge variant="accent" size="sm">Peut modifier</Badge>
              <Badge variant="warning" size="sm">Peut partager</Badge>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
