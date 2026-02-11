interface CodeBlock {
  language: string
  code: string
  startIndex: number
  endIndex: number
}

export function truncateMarkdown(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text

  let truncated = text.slice(0, maxLength)

  // Ne pas couper au milieu d'un bloc de code
  const openFences = (truncated.match(/```/g) ?? []).length
  if (openFences % 2 !== 0) {
    const lastFenceIndex = truncated.lastIndexOf('```')
    truncated = truncated.slice(0, lastFenceIndex)
  }

  // Ne pas couper au milieu d'un lien markdown
  const lastOpenBracket = truncated.lastIndexOf('[')
  const lastCloseParen = truncated.lastIndexOf(')')
  if (lastOpenBracket > lastCloseParen) {
    truncated = truncated.slice(0, lastOpenBracket)
  }

  // Ne pas couper au milieu d'un formatage gras/italique
  const boldMarkers = (truncated.match(/\*\*/g) ?? []).length
  if (boldMarkers % 2 !== 0) {
    const lastBoldIndex = truncated.lastIndexOf('**')
    truncated = truncated.slice(0, lastBoldIndex)
  }

  return truncated.trimEnd() + '...'
}

export function extractCodeBlocks(text: string): CodeBlock[] {
  const codeBlocks: CodeBlock[] = []
  const regex = /```(\w*)\n([\s\S]*?)```/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    codeBlocks.push({
      language: match[1] || 'text',
      code: match[2].trimEnd(),
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    })
  }

  return codeBlocks
}

export function countTokensEstimate(text: string): number {
  const words = text.split(/\s+/).filter((word) => word.length > 0).length
  return Math.ceil(words / 0.75)
}
