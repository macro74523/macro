import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { useState, useCallback, useEffect } from 'react'

export const ArticleList = ({ posts }) => {
  if (!posts || posts.length === 0) return null

  return (
    <div className='columns-2 gap-3 space-y-3'>
      {posts.map((post, index) => (
        <ArticleCard key={post.id || index} post={post} index={index} />
      ))}
    </div>
  )
}

const ArticleCard = ({ post, index }) => {
  const title = post.title
  const cover = post.pageCoverThumbnail || post.pageCover
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)

  const heights = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[1/1]', 'aspect-[4/6]', 'aspect-[3/5]']
  const randomAspect = heights[index % heights.length]

  const handleImageClick = useCallback((e) => {
    if (cover) {
      e.preventDefault()
      e.stopPropagation()
      setShowLightbox(true)
    }
  }, [cover])

  const closeLightbox = useCallback(() => {
    setShowLightbox(false)
  }, [])

  return (
    <>
      <article className='break-inside-avoid bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group'>
        <SmartLink 
          href={post.href} 
          title={title} 
          className='block'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          
          <div className={`relative ${randomAspect} overflow-hidden bg-zinc-100 dark:bg-zinc-800`}>
            {cover ? (
              <>
                {!imageLoaded && (
                  <div className='absolute inset-0 overflow-hidden'>
                    <div className='absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 animate-shimmer' 
                      style={{ backgroundSize: '200% 100%' }} />
                  </div>
                )}
                <div 
                  className={`absolute inset-0 cursor-zoom-in ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onClick={handleImageClick}>
                  <LazyImage
                    src={cover}
                    alt={title}
                    className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
                    priority
                    fill='full'
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>
                {imageLoaded && (
                  <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <span className='bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1'>
                      <i className='fas fa-expand text-[10px]'></i>
                      <span>放大</span>
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className='absolute inset-0 pix-gradient-bg flex items-center justify-center'>
                <i className='fas fa-image text-3xl text-white/30'></i>
              </div>
            )}
          </div>

          <div className='p-3'>
            <h3 className='text-sm font-medium text-zinc-800 dark:text-zinc-100 line-clamp-2 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors leading-snug'>
              {title}
            </h3>
            <div className='flex items-center justify-end mt-2'>
              <span className='flex items-center gap-0.5 text-xs text-zinc-300 dark:text-zinc-600'>
                <i className='far fa-heart text-[10px]'></i>
              </span>
            </div>
          </div>
        </SmartLink>
      </article>

      {showLightbox && (
        <Lightbox src={cover} alt={title} onClose={closeLightbox} />
      )}
    </>
  )
}

const Lightbox = ({ src, alt, onClose }) => {
  const [isClosing, setIsClosing] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleBackdropClick}>
      <div className='absolute inset-0 bg-black/90 backdrop-blur-sm' />
      
      <button 
        onClick={handleClose}
        className='absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors'>
        <i className='fas fa-times text-white text-lg'></i>
      </button>

      <button 
        onClick={toggleZoom}
        className='absolute top-4 right-16 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors'>
        <i className={`fas ${isZoomed ? 'fa-compress' : 'fa-expand'} text-white text-lg`}></i>
      </button>

      <div className={`relative max-w-[90vw] max-h-[90vh] transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}>
        <img 
          src={src} 
          alt={alt} 
          className='max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl'
          onClick={(e) => {
            e.stopPropagation()
            toggleZoom()
          }}
        />
      </div>

      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm'>
        点击图片切换缩放 · ESC 或点击背景关闭
      </div>
    </div>
  )
}
