import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    const { params: pathParams } = params
    
    // 解析路径参数 例如: /api/placeholder/32/32 -> [32, 32]
    const width = parseInt(pathParams[0]) || 32
    const height = parseInt(pathParams[1]) || width
    
    // 生成SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 8}" fill="#6b7280">${width}×${height}</text>
      </svg>
    `
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000' // 1年缓存
      }
    })
  } catch (error) {
    console.error('Failed to generate placeholder:', error)
    
    // 返回简单的灰色SVG
    const fallbackSvg = `
      <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
      </svg>
    `
    
    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml'
      }
    })
  }
}