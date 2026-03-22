import SmartLink from '@/components/SmartLink'
import WordCount from '@/components/WordCount'
import { useState, useRef, useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'

const generateQRCode = async (text, size = 80) => {
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&bgcolor=ffffff&color=18181b`
  try {
    const response = await fetch(apiUrl)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    return null
  }
}

export default function MobilePostMeta({ post }) {
  const router = useRouter()
  const [showPoster, setShowPoster] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [posterUrl, setPosterUrl] = useState('')
  const canvasRef = useRef(null)
  
  const shareUrl = siteConfig('LINK') + router.asPath
  const title = post?.title || ''
  const summary = post?.summary || ''
  const cover = post?.pageCoverThumbnail || post?.pageCover

  const generatePoster = async () => {
    setGenerating(true)
    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const width = 375, height = 600
      canvas.width = width
      canvas.height = height
      
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      
      let contentStartY = 30
      if (cover) {
        try {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            img.src = cover
          })
          const imgHeight = 180
          ctx.drawImage(img, 0, 0, width, imgHeight)
          contentStartY = imgHeight + 30
        } catch (e) {}
      }
      
      ctx.fillStyle = '#18181b'
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.textAlign = 'left'
      
      const maxWidth = width - 40
      const lineHeight = 28
      const words = title.split('')
      let line = '', y = contentStartY, lineCount = 0
      
      for (let n = 0; n < words.length && lineCount < 3; n++) {
        const testLine = line + words[n]
        if (ctx.measureText(testLine).width > maxWidth && n > 0) {
          ctx.fillText(line, 20, y)
          line = words[n]
          y += lineHeight
          lineCount++
        } else {
          line = testLine
        }
      }
      if (lineCount < 3) ctx.fillText(line, 20, y)
      
      const qrSize = 70
      const qrX = width - qrSize - 20
      const qrY = height - qrSize - 40
      
      const qrDataUrl = await generateQRCode(shareUrl, qrSize)
      if (qrDataUrl) {
        const qrImg = new Image()
        await new Promise((resolve, reject) => {
          qrImg.onload = resolve
          qrImg.onerror = reject
          qrImg.src = qrDataUrl
        })
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
      }
      
      ctx.fillStyle = '#71717a'
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.fillText('长按识别二维码', 20, height - 55)
      ctx.fillText('阅读完整文章', 20, height - 38)
      
      setPosterUrl(canvas.toDataURL('image/png'))
    } catch (error) {
      console.error('生成海报失败:', error)
    }
    setGenerating(false)
  }

  useEffect(() => {
    if (showPoster && !posterUrl) generatePoster()
  }, [showPoster])

  const downloadPoster = () => {
    if (!posterUrl) return
    const link = document.createElement('a')
    link.download = `${title || 'poster'}.png`
    link.href = posterUrl
    link.click()
  }

  return (
    <div className='xl:hidden mt-6 mb-3 px-1'>
      <div className='p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50'>
        <div className='flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mb-3'>
          {post?.publishDay && (
            <span className='flex items-center gap-1'>
              <i className='far fa-calendar text-zinc-400'></i>
              {post.publishDay}
            </span>
          )}
          {(post?.wordCount || post?.readTime) && (
            <span className='flex items-center gap-1'>
              <i className='far fa-clock text-zinc-400'></i>
              <WordCount wordCount={post.wordCount} readTime={post.readTime} />
            </span>
          )}
          <button
            onClick={() => setShowPoster(true)}
            className='flex items-center gap-1 px-2 py-0.5 bg-violet-500/10 text-violet-500 rounded-md hover:bg-violet-500/20 transition-colors'>
            <i className='fas fa-image text-[10px]'></i>
            <span>分享海报</span>
          </button>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          {post?.category && (
            <SmartLink
              href={`/category/${post.category}`}
              className='inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full text-xs'>
              <i className='fas fa-folder text-[9px]'></i>
              {post.category}
            </SmartLink>
          )}
          {post?.tags && post.tags.length > 0 && post.tags.map((tag, index) => (
            <SmartLink
              key={index}
              href={`/tag/${encodeURIComponent(tag)}`}
              className='inline-flex items-center gap-0.5 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700/80 text-zinc-600 dark:text-zinc-400 rounded-md text-xs hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-colors'>
              <i className='fas fa-hashtag text-[7px] opacity-50'></i>
              {tag}
            </SmartLink>
          ))}
        </div>
      </div>

      <canvas ref={canvasRef} className='hidden' />

      {showPoster && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4' onClick={() => setShowPoster(false)}>
          <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' />
          <div className='relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden' onClick={e => e.stopPropagation()}>
            <div className='flex items-center justify-between p-3 border-b border-zinc-100 dark:border-zinc-800'>
              <h3 className='font-bold text-zinc-800 dark:text-zinc-100'>文章海报</h3>
              <button onClick={() => setShowPoster(false)} className='w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800'>
                <i className='fas fa-times text-zinc-400 text-sm'></i>
              </button>
            </div>
            <div className='p-3'>
              {generating ? (
                <div className='flex flex-col items-center justify-center py-16'>
                  <i className='fas fa-spinner animate-spin text-2xl text-violet-500 mb-3'></i>
                  <p className='text-sm text-zinc-500'>生成中...</p>
                </div>
              ) : posterUrl && (
                <div className='flex flex-col items-center'>
                  <img src={posterUrl} alt='海报' className='w-full rounded-lg shadow-lg' />
                  <button onClick={downloadPoster} className='mt-3 flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg text-sm hover:bg-violet-600 transition-colors'>
                    <i className='fas fa-download'></i>
                    保存图片
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
