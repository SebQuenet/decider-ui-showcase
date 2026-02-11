import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Download, Copy, ChevronLeft, ChevronRight, X,
  Square, RectangleHorizontal, RectangleVertical, Pencil,
  Grid2x2, Image as ImageIcon, Wand2,
} from 'lucide-react'
import { staggerContainerVariants, staggerItemScaleVariants } from '../lib/animations'

type StylePreset = 'realistic' | 'illustration' | '3d' | 'minimal'
type AspectRatio = '1:1' | '16:9' | '9:16'

interface GeneratedImage {
  id: string
  prompt: string
  style: StylePreset
  gradient: string
  aspectRatio: AspectRatio
  timestamp: Date
}

const STYLE_PRESETS: { id: StylePreset; label: string }[] = [
  { id: 'realistic', label: 'Realiste' },
  { id: 'illustration', label: 'Illustration' },
  { id: '3d', label: '3D' },
  { id: 'minimal', label: 'Minimaliste' },
]

const ASPECT_RATIOS: { id: AspectRatio; icon: React.ReactNode; label: string }[] = [
  { id: '1:1', icon: <Square className="w-4 h-4" />, label: 'Carre' },
  { id: '16:9', icon: <RectangleHorizontal className="w-4 h-4" />, label: 'Paysage' },
  { id: '9:16', icon: <RectangleVertical className="w-4 h-4" />, label: 'Portrait' },
]

const GRADIENTS = [
  'linear-gradient(135deg, #29abb5, #6366f1)',
  'linear-gradient(135deg, #fe6d11, #dc2626)',
  'linear-gradient(135deg, #16a34a, #0891b2)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #10b981, #6366f1)',
  'linear-gradient(135deg, #f97316, #a855f7)',
  'linear-gradient(135deg, #14b8a6, #8b5cf6)',
  'linear-gradient(135deg, #eab308, #22c55e)',
  'linear-gradient(135deg, #e11d48, #7c3aed)',
  'linear-gradient(135deg, #0ea5e9, #a78bfa)',
]

const MOCK_LABELS = [
  'Graphique performance Q4',
  'Dashboard financier',
  'Equipe collaboration',
  'Architecture systeme',
  'Analyse de donnees',
  'Presentation investisseurs',
  'Vue portefeuille',
  'Rapport ESG',
]

function createInitialGallery(): GeneratedImage[] {
  return MOCK_LABELS.map((label, index) => ({
    id: `gallery-${index}`,
    prompt: label,
    style: STYLE_PRESETS[index % STYLE_PRESETS.length].id,
    gradient: GRADIENTS[index % GRADIENTS.length],
    aspectRatio: '1:1',
    timestamp: new Date(Date.now() - (index + 1) * 3600000),
  }))
}

const ASPECT_RATIO_CLASSES: Record<AspectRatio, string> = {
  '1:1': 'aspect-square',
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16]',
}

let imageIdCounter = 100

export function ImagesExperiment() {
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>('realistic')
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('1:1')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [gallery, setGallery] = useState<GeneratedImage[]>(createInitialGallery)
  const [lightboxImage, setLightboxImage] = useState<GeneratedImage | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [editInstruction, setEditInstruction] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [variationsMode, setVariationsMode] = useState(false)
  const [variations, setVariations] = useState<GeneratedImage[]>([])

  const allImages = [...generatedImages, ...gallery]

  const handleGenerate = useCallback(() => {
    const trimmed = prompt.trim()
    if (!trimmed || isGenerating) return
    setIsGenerating(true)
    setGeneratedImages([])

    setTimeout(() => {
      const newImages: GeneratedImage[] = Array.from({ length: 4 }, (_, index) => ({
        id: String(++imageIdCounter),
        prompt: trimmed,
        style: selectedStyle,
        gradient: GRADIENTS[(imageIdCounter + index) % GRADIENTS.length],
        aspectRatio: selectedRatio,
        timestamp: new Date(),
      }))
      setGeneratedImages(newImages)
      setGallery((previous) => [...newImages, ...previous])
      setIsGenerating(false)
    }, 2500)
  }, [prompt, isGenerating, selectedStyle, selectedRatio])

  const handleVariations = useCallback((image: GeneratedImage) => {
    setVariationsMode(true)
    setVariations([])
    setLightboxImage(null)

    setTimeout(() => {
      const newVariations: GeneratedImage[] = Array.from({ length: 4 }, (_, index) => ({
        id: String(++imageIdCounter),
        prompt: `Variation de "${image.prompt}"`,
        style: image.style,
        gradient: GRADIENTS[(imageIdCounter + index + 3) % GRADIENTS.length],
        aspectRatio: image.aspectRatio,
        timestamp: new Date(),
      }))
      setVariations(newVariations)
    }, 2000)
  }, [])

  const handleEdit = useCallback(() => {
    if (!editInstruction.trim() || !lightboxImage) return
    setIsEditing(true)

    setTimeout(() => {
      const editedImage: GeneratedImage = {
        id: String(++imageIdCounter),
        prompt: `${lightboxImage.prompt} - ${editInstruction}`,
        style: lightboxImage.style,
        gradient: GRADIENTS[(imageIdCounter + 5) % GRADIENTS.length],
        aspectRatio: lightboxImage.aspectRatio,
        timestamp: new Date(),
      }
      setLightboxImage(editedImage)
      setGallery((previous) => [editedImage, ...previous])
      setEditInstruction('')
      setIsEditing(false)
    }, 1500)
  }, [editInstruction, lightboxImage])

  const openLightbox = useCallback((image: GeneratedImage) => {
    const index = allImages.findIndex((img) => img.id === image.id)
    setLightboxImage(image)
    setLightboxIndex(index >= 0 ? index : 0)
    setEditMode(false)
    setVariationsMode(false)
  }, [allImages])

  const navigateLightbox = useCallback((direction: -1 | 1) => {
    const newIndex = (lightboxIndex + direction + allImages.length) % allImages.length
    setLightboxIndex(newIndex)
    setLightboxImage(allImages[newIndex])
    setEditMode(false)
  }, [lightboxIndex, allImages])

  function ShimmerGrid() {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className={`${ASPECT_RATIO_CLASSES[selectedRatio]} rounded-lg overflow-hidden`}>
            <motion.div
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full"
              style={{
                background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full h-full max-w-5xl mx-auto flex flex-col bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-surface-secondary">
        <div className="flex items-end gap-3 mb-3">
          <div className="flex-1">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  handleGenerate()
                }
              }}
              placeholder="Decrivez l'image a generer..."
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-body focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-muted"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Generer
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {STYLE_PRESETS.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`px-3 py-1.5 text-small font-medium rounded-lg border transition-colors cursor-pointer ${
                  selectedStyle === style.id
                    ? 'bg-accent-muted text-accent border-accent/30'
                    : 'bg-surface text-text-muted border-border hover:border-accent/30'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-border" />

          <div className="flex gap-1">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => setSelectedRatio(ratio.id)}
                title={ratio.label}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  selectedRatio === ratio.id
                    ? 'bg-accent-muted text-accent border-accent/30'
                    : 'bg-surface text-text-muted border-border hover:border-accent/30'
                }`}
              >
                {ratio.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {(isGenerating || generatedImages.length > 0) && (
          <div>
            <h3 className="text-caption font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-accent" />
              Generation
            </h3>
            {isGenerating ? (
              <ShimmerGrid />
            ) : (
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-3"
              >
                {generatedImages.map((image) => (
                  <motion.div
                    key={image.id}
                    variants={staggerItemScaleVariants}
                    className={`${ASPECT_RATIO_CLASSES[image.aspectRatio]} rounded-lg overflow-hidden cursor-pointer group relative`}
                    onClick={() => openLightbox(image)}
                  >
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: image.gradient }}
                    >
                      <span className="text-white/80 text-small font-medium text-center px-4">{image.prompt}</span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {variationsMode && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-caption font-semibold text-text-primary flex items-center gap-2">
                <Grid2x2 className="w-4 h-4 text-accent" />
                Variations
              </h3>
              <button
                onClick={() => setVariationsMode(false)}
                className="text-small text-text-muted hover:text-text-primary cursor-pointer"
              >
                Fermer
              </button>
            </div>
            {variations.length === 0 ? (
              <ShimmerGrid />
            ) : (
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-3"
              >
                {variations.map((image) => (
                  <motion.div
                    key={image.id}
                    variants={staggerItemScaleVariants}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                    onClick={() => openLightbox(image)}
                  >
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: image.gradient }}
                    >
                      <span className="text-white/80 text-small font-medium text-center px-4">{image.prompt}</span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        <div>
          <h3 className="text-caption font-semibold text-text-primary mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-accent" />
            Galerie
          </h3>
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-4 gap-3"
          >
            {gallery.map((image) => (
              <motion.div
                key={image.id}
                variants={staggerItemScaleVariants}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                onClick={() => openLightbox(image)}
              >
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: image.gradient }}
                >
                  <span className="text-white/70 text-[0.625rem] font-medium text-center px-2">{image.prompt}</span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="text-white text-small font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Voir
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-8"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative max-w-3xl w-full"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                onClick={() => navigateLightbox(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={() => navigateLightbox(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              <div
                className={`w-full ${ASPECT_RATIO_CLASSES[lightboxImage.aspectRatio]} max-h-[60vh] rounded-xl overflow-hidden flex items-center justify-center`}
                style={{ background: lightboxImage.gradient }}
              >
                <span className="text-white/80 text-h3 font-medium text-center px-8">{lightboxImage.prompt}</span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-white text-body font-medium">{lightboxImage.prompt}</p>
                  <p className="text-white/50 text-small">{lightboxImage.style} - {lightboxImage.aspectRatio}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVariations(lightboxImage)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 text-white text-small hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <Grid2x2 className="w-3.5 h-3.5" />
                    Variations
                  </button>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-small transition-colors cursor-pointer ${
                      editMode ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Modifier
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 text-white text-small hover:bg-white/20 transition-colors cursor-pointer">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 text-white text-small hover:bg-white/20 transition-colors cursor-pointer">
                    <Download className="w-3.5 h-3.5" />
                    Telecharger
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {editMode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="flex gap-2">
                      <input
                        value={editInstruction}
                        onChange={(event) => setEditInstruction(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') handleEdit()
                        }}
                        placeholder="Instruction de modification..."
                        className="flex-1 rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-white text-small placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <button
                        onClick={handleEdit}
                        disabled={isEditing || !editInstruction.trim()}
                        className="px-4 py-2.5 rounded-lg bg-accent text-white text-small font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isEditing ? 'Modification...' : 'Appliquer'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
