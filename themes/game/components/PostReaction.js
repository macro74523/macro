import { siteConfig } from '@/lib/config'
import { useEffect, useRef } from 'react'
import '@waline/client/style'

export default function PostReaction({ post }) {
  const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
  const containerRef = useRef(null)
  const reactionRef = useRef(null)

  useEffect(() => {
    if (!serverURL || !post?.href || !containerRef.current) return
    
    const initReaction = async () => {
      const { reaction } = await import('@waline/client')
      
      reactionRef.current = reaction({
        el: containerRef.current,
        serverURL,
        path: post.href,
        dark: 'html.dark',
      })
    }
    
    initReaction()
    
    return () => {
      if (reactionRef.current) {
        reactionRef.current.destroy()
      }
    }
  }, [serverURL, post?.href])

  if (!serverURL || !post?.href) return null

  return (
    <div className='mt-6 mb-3 px-1'>
      <div className='p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-500/10 dark:to-purple-500/10 rounded-xl border border-violet-100 dark:border-violet-500/20'>
        <div className='text-center mb-3'>
          <span className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
            你认为这篇文章怎么样？
          </span>
        </div>
        <div ref={containerRef} className='waline-reaction-container' />
      </div>

      <style jsx global>{`
        .waline-reaction-container .wl-reaction {
          display: flex;
          justify-content: center;
          gap: 12px;
        }
        
        .waline-reaction-container .wl-reaction-img {
          width: 48px;
          height: 48px;
        }
        
        .waline-reaction-container .wl-reaction-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        html.dark .waline-reaction-container {
          --waline-bgcolor: transparent;
        }
      `}</style>
    </div>
  )
}
