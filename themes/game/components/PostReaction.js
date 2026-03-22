import { siteConfig } from '@/lib/config'
import { useEffect, useRef, useState } from 'react'
import '@waline/client/style'

export default function PostReaction({ post }) {
  const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
  const containerRef = useRef(null)
  const reactionRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!serverURL || !post?.href) {
      setIsLoading(false)
      return
    }
    
    const container = containerRef.current
    if (!container) {
      setIsLoading(false)
      return
    }

    let mounted = true
    setIsLoading(true)
    setHasError(false)
    
    const initReaction = async () => {
      try {
        const { reaction } = await import('@waline/client')
        
        if (!mounted) return
        
        if (container && !reactionRef.current) {
          reactionRef.current = reaction({
            el: container,
            serverURL,
            path: post.href,
            dark: 'html.dark',
          })
          if (mounted) {
            setIsLoading(false)
          }
        }
      } catch (error) {
        console.error('Failed to init reaction:', error)
        if (mounted) {
          setHasError(true)
          setIsLoading(false)
        }
      }
    }
    
    initReaction()
    
    return () => {
      mounted = false
      if (reactionRef.current) {
        try {
          reactionRef.current.destroy()
        } catch (e) {
          console.error('Failed to destroy reaction:', e)
        }
        reactionRef.current = null
      }
    }
  }, [serverURL, post?.href])

  if (!serverURL || !post?.href) return null

  return (
    <div className='post-reaction-wrapper mb-3 px-3'>
      <div className='p-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-500/10 dark:to-purple-500/10 rounded-xl border border-violet-100 dark:border-violet-500/20'>
        <div ref={containerRef} className='flex justify-center items-center min-h-[60px]'>
          {isLoading && (
            <div className='flex items-center gap-2 text-zinc-400 text-sm'>
              <i className='fas fa-spinner fa-spin'></i>
              <span>加载中...</span>
            </div>
          )}
          {hasError && (
            <div className='text-zinc-400 text-sm'>
              加载失败
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .post-reaction-wrapper .wl-reaction,
        .post-reaction-wrapper > div > .wl-reaction {
          display: flex !important;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          padding: 8px 0;
        }
        
        .post-reaction-wrapper .wl-reaction-item,
        .post-reaction-wrapper .wl-reaction .wl-reaction-item {
          display: flex !important;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .post-reaction-wrapper .wl-reaction-item:hover {
          transform: scale(1.1);
        }
        
        .post-reaction-wrapper .wl-reaction-img,
        .post-reaction-wrapper .wl-reaction .wl-reaction-img {
          width: 40px !important;
          height: 40px !important;
          border-radius: 50%;
          transition: transform 0.2s;
        }
        
        .post-reaction-wrapper .wl-reaction-item:hover .wl-reaction-img {
          transform: scale(1.1);
        }
        
        .post-reaction-wrapper .wl-reaction-text,
        .post-reaction-wrapper .wl-reaction .wl-reaction-text {
          font-size: 12px !important;
          color: #71717a !important;
        }
        
        html.dark .post-reaction-wrapper .wl-reaction-text,
        html.dark .post-reaction-wrapper .wl-reaction .wl-reaction-text {
          color: #a1a1aa !important;
        }
        
        .post-reaction-wrapper .wl-reaction-active .wl-reaction-img {
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </div>
  )
}
