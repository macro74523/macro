import { siteConfig } from '@/lib/config'
import { useEffect, useRef } from 'react'
import '@waline/client/style'

export default function CommentSidebar({ post, showComment, setShowComment }) {
  const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
  const containerRef = useRef(null)
  const walineRef = useRef(null)

  useEffect(() => {
    if (showComment && containerRef.current && !walineRef.current) {
      import('@waline/client').then(({ init }) => {
        walineRef.current = init({
          el: containerRef.current,
          serverURL,
          lang: siteConfig('LANG'),
          reaction: true,
          dark: 'html.dark',
          emoji: [
            '//npm.elemecdn.com/@waline/emojis@1.1.0/tieba',
            '//npm.elemecdn.com/@waline/emojis@1.1.0/weibo',
            '//npm.elemecdn.com/@waline/emojis@1.1.0/bilibili'
          ]
        })
      })
    }
    
    return () => {
      if (walineRef.current) {
        walineRef.current.destroy()
        walineRef.current = null
      }
    }
  }, [showComment, serverURL])

  if (!showComment) return null

  return (
    <>
      <div 
        className='fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 xl:hidden'
        onClick={() => setShowComment(false)}
      />
      <div className='fixed bottom-0 left-0 right-0 h-[60vh] z-50 bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl animate-slideUp xl:hidden flex flex-col'>
        <div className='flex items-center justify-center pt-2 pb-1'>
          <div className='w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full'></div>
        </div>
        <div className='flex items-center justify-between px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0'>
          <div className='flex items-center gap-2'>
            <span className='w-7 h-7 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center'>
              <i className='far fa-comment text-violet-500 text-sm'></i>
            </span>
            <span className='font-medium text-zinc-800 dark:text-zinc-100'>评论区</span>
          </div>
          <button 
            onClick={() => setShowComment(false)}
            className='w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors'>
            <i className='fas fa-times text-xs'></i>
          </button>
        </div>
        
        <div className='flex-1 overflow-y-auto px-4 py-3'>
          {serverURL && (
            <div ref={containerRef} />
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}
