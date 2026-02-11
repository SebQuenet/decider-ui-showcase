import { format as dateFnsFormat } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CurrencyOptions {
  locale?: 'fr' | 'en'
  compact?: boolean
}

interface NumberOptions {
  decimals?: number
  locale?: 'fr' | 'en'
}

export function formatCurrency(
  value: number,
  currency = 'EUR',
  options: CurrencyOptions = {},
): string {
  const { locale = 'fr', compact = false } = options

  if (compact) {
    const absValue = Math.abs(value)
    let suffix = ''
    let divisor = 1

    if (absValue >= 1_000_000_000) {
      suffix = ' Md'
      divisor = 1_000_000_000
    } else if (absValue >= 1_000_000) {
      suffix = ' M'
      divisor = 1_000_000
    } else if (absValue >= 1_000) {
      suffix = ' k'
      divisor = 1_000
    }

    const formatted = (value / divisor).toFixed(1).replace(/\.0$/, '')
    const displayValue = locale === 'fr' ? formatted.replace('.', ',') : formatted
    const symbol = currency === 'EUR' ? ' \u20ac' : currency === 'USD' ? ' $' : ` ${currency}`

    return `${displayValue}${suffix}${symbol}`
  }

  const localeTag = locale === 'fr' ? 'fr-FR' : 'en-US'
  return new Intl.NumberFormat(localeTag, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercentage(value: number, decimals = 2): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

export function formatNumber(value: number, options: NumberOptions = {}): string {
  const { decimals = 2, locale = 'fr' } = options
  const localeTag = locale === 'fr' ? 'fr-FR' : 'en-US'

  return new Intl.NumberFormat(localeTag, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatDate(
  date: Date | string,
  formatString = 'dd MMM yyyy',
): string {
  const dateObject = typeof date === 'string' ? new Date(date) : date
  return dateFnsFormat(dateObject, formatString, { locale: fr })
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} Go`
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
  const minutes = Math.floor(ms / 60_000)
  const seconds = Math.round((ms % 60_000) / 1000)
  return `${minutes}m ${seconds}s`
}
