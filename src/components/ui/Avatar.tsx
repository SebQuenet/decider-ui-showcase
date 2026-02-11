type AvatarSize = 'sm' | 'md' | 'lg'
type StatusColor = 'online' | 'offline' | 'busy'

interface AvatarProps {
  src?: string
  name: string
  size?: AvatarSize
  status?: StatusColor
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-small',
  md: 'h-10 w-10 text-caption',
  lg: 'h-14 w-14 text-body',
}

const statusDotSize: Record<AvatarSize, string> = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
}

const statusColors: Record<StatusColor, string> = {
  online: 'bg-success',
  offline: 'bg-carbon-400',
  busy: 'bg-danger',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function Avatar({
  src,
  name,
  size = 'md',
  status,
  className = '',
}: AvatarProps) {
  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`rounded-full object-cover ${sizeClasses[size]}`}
        />
      ) : (
        <div
          className={`rounded-full flex items-center justify-center font-medium bg-accent-muted text-accent-strong ${sizeClasses[size]}`}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ring-surface ${statusColors[status]} ${statusDotSize[size]}`}
        />
      )}
    </div>
  )
}
