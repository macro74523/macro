import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'

const generateQRCode = async (text, size = 100) => {
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
    console.error('QR Code generation failed:', error)
    return null
  }
}

export default function PostPoster({ post }) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [posterUrl, setPosterUrl] = useState('')
  const canvasRef = useRef(null)
  
  const shareUrl = siteConfig('LINK') + router.asPath
  const title = post?.title || ''
  const summary = post?.summary || ''
  const cover = post?.pageCoverThumbnail || post?.pageCover
  const siteTitle = siteConfig('TITLE')

  const generatePoster = async () => {
    setGenerating(true)
    
    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      const width = 375
      const height = 667
      canvas.width = width
      canvas.height = height
      
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      
      const gradient = ctx.createLinearGradient(0, 0, width, 100)
      gradient.addColorStop(0, '#8b5cf6')
      gradient.addColorStop(1, '#a855f7')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, 100)
      
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(siteTitle || '博客', width / 2, 35)
      
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.fillText('扫描二维码阅读全文', width / 2, 58)
      
      let contentStartY = 120
      
      if (cover) {
        try {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            img.src = cover
          })
          
          const imgHeight = 200
          const imgY = 120
          ctx.drawImage(img, 20, imgY, width - 40, imgHeight)
          contentStartY = imgY + imgHeight + 20
        } catch (e) {
          ctx.fillStyle = '#f4f4f5'
          ctx.fillRect(20, 120, width - 40, 200)
          ctx.fillStyle = '#a1a1aa'
          ctx.font = '14px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('封面图片', width / 2, 220)
          contentStartY = 340
        }
      } else {
        ctx.fillStyle = '#f4f4f5'
        ctx.fillRect(20, 120, width - 40, 200)
        ctx.fillStyle = '#a1a1aa'
        ctx.font = '14px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('封面图片', width / 2, 220)
        contentStartY = 340
      }
      
      ctx.textAlign = 'left'
      ctx.fillStyle = '#18181b'
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      
      const maxWidth = width - 40
      const lineHeight = 26
      const words = title.split('')
      let line = ''
      let y = contentStartY
      let lineCount = 0
      
      for (let n = 0; n < words.length && lineCount < 3; n++) {
        const testLine = line + words[n]
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, 20, y)
          line = words[n]
          y += lineHeight
          lineCount++
        } else {
          line = testLine
        }
      }
      if (lineCount < 3) {
        ctx.fillText(line, 20, y)
      }
      
      if (summary) {
        ctx.fillStyle = '#71717a'
        ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        const summaryY = y + 35
        const summaryWords = summary.slice(0, 50).split('')
        let summaryLine = ''
        let sy = summaryY
        
        for (let n = 0; n < summaryWords.length; n++) {
          const testLine = summaryLine + summaryWords[n]
          const metrics = ctx.measureText(testLine)
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(summaryLine, 20, sy)
            summaryLine = summaryWords[n]
            sy += 20
            if (sy > summaryY + 45) break
          } else {
            summaryLine = testLine
          }
        }
        if (sy <= summaryY + 45) {
          ctx.fillText(summaryLine + '...', 20, sy)
        }
      }
      
      const qrSize = 80
      const qrX = width - qrSize - 20
      const qrY = height - qrSize - 50
      
      const qrDataUrl = await generateQRCode(shareUrl, qrSize)
      
      if (qrDataUrl) {
        const qrImg = new Image()
        await new Promise((resolve, reject) => {
          qrImg.onload = resolve
          qrImg.onerror = reject
          qrImg.src = qrDataUrl
        })
        
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
      } else {
        ctx.fillStyle = '#f4f4f5'
        ctx.fillRect(qrX, qrY, qrSize, qrSize)
        ctx.fillStyle = '#a1a1aa'
        ctx.font = '10px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('二维码', qrX + qrSize / 2, qrY + qrSize / 2)
      }
      
      ctx.fillStyle = '#71717a'
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('长按识别二维码', 20, height - 65)
      ctx.fillText('阅读完整文章', 20, height - 45)
      
      const posterDataUrl = canvas.toDataURL('image/png')
      setPosterUrl(posterDataUrl)
    } catch (error) {
      console.error('生成海报失败:', error)
    }
    
    setGenerating(false)
  }

  const downloadPoster = () => {
    if (!posterUrl) return
    
    const link = document.createElement('a')
    link.download = `${title || 'poster'}.png`
    link.href = posterUrl
    link.click()
  }

  useEffect(() => {
    if (showModal && !posterUrl) {
      generatePoster()
    }
  }, [showModal])

  if (!post || post?.type !== 'Post') {
    return <></>
  }

  return (
    <>
      <div className='my-4 flex flex-col items-end'>
        <button
          onClick={() => setShowModal(true)}
          className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105'>
          <i className='fas fa-image'></i>
          <span>分享</span>
        </button>
      </div>

      {showModal && (
        <div 
          className='fixed inset-0 z-50 flex items-center justify-center p-4'
          onClick={() => setShowModal(false)}>
          <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' />
          
          <div 
            className='relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn'
            onClick={e => e.stopPropagation()}>
            
            <div className='flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800'>
              <h3 className='text-lg font-bold text-zinc-800 dark:text-zinc-100'>
                文章海报
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors'>
                <i className='fas fa-times text-zinc-400'></i>
              </button>
            </div>
            
            <div className='p-4'>
              {generating ? (
                <div className='flex flex-col items-center justify-center py-20'>
                  <i className='fas fa-spinner animate-spin text-3xl text-violet-500 mb-4'></i>
                  <p className='text-sm text-zinc-500'>正在生成海报...</p>
                </div>
              ) : posterUrl ? (
                <div className='flex flex-col items-center'>
                  <img 
                    src={posterUrl} 
                    alt='文章海报' 
                    className='w-full rounded-lg shadow-lg'
                  />
                  
                  <div className='flex gap-3 mt-4'>
                    <button
                      onClick={downloadPoster}
                      className='flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors'>
                      <i className='fas fa-download'></i>
                      <span>保存图片</span>
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          fetch(posterUrl)
                            .then(res => res.blob())
                            .then(blob => {
                              const file = new File([blob], 'poster.png', { type: 'image/png' })
                              navigator.share({
                                title: title,
                                files: [file]
                              }).catch(() => {})
                            })
                        } else {
                          alert('您的浏览器不支持分享功能，请长按图片保存')
                        }
                      }}
                      className='flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors'>
                      <i className='fas fa-share-alt'></i>
                      <span>分享</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} className='hidden' />
    </>
  )
}
