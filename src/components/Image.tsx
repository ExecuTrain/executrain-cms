import { cn } from '@/lib/utils'

interface ImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  className?: string
  style?: React.CSSProperties
}

/**
 * Komponen Image sederhana pengganti next/image.
 * Statis & tanpa optimasi — cukup untuk CMS internal.
 */
export default function Image({
  src,
  alt,
  width,
  height,
  className,
  style,
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn('object-contain', className)}
      style={style}
    />
  )
}
