import { siteConfig } from '@/lib/config'
import { useEffect, useRef, useState } from 'react'
import '@waline/client/style'

export default function PostReaction({ post }) {
  const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
  const containerRef = useRef(null)
  const reactionRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

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
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to init reaction:', error)
        }
        if (mounted) {
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
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to destroy reaction:', e)
          }
        }
        reactionRef.current = null
      }
    }
  }, [serverURL, post?.href])

  if (!serverURL || !post?.href) return null

  return (
    <div className='post-reaction-wrapper mb-3 px-3'>
      <div ref={containerRef} className='flex justify-center items-center min-h-[60px]'>
        {isLoading && (
          <div className='flex items-center gap-2 text-zinc-400 text-sm'>
            <i className='fas fa-spinner fa-spin'></i>
            <span>加载中...</span>
          </div>
        )}
      </div>
    </div>
  )
}
