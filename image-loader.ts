// Image loader for static export
export default function imageLoader({ src, width, quality }: { 
  src: string; 
  width: number; 
  quality?: number; 
}) {
  // For static export, return the original src
  // In production, you might want to use a CDN or image optimization service
  return `${src}?w=${width}&q=${quality || 75}`
}