import { siteConfig } from '@/lib/config'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import '@waline/client/style'

const PostReaction = dynamic(() => import('./PostReaction'), { ssr: false })

export default function CommentSidebar({ post, showComment, setShowComment }) {
  const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
  const containerRef = useRef(null)
  const walineRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (showComment && containerRef.current && !walineRef.current) {
      import('@waline/client').then(({ init }) => {
        walineRef.current = init({
          el: containerRef.current,
          serverURL,
          lang: siteConfig('LANG'),
          login: 'enable',
          requiredMeta: ['nick'],
          reaction: false,
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

  useEffect(() => {
    if (!showComment) {
      setIsFullscreen(false)
    }
  }, [showComment])

  if (!showComment) return null

  return (
    <>
      <div 
        className='fixed inset-0 bg-black/50 z-50 xl:hidden'
        onClick={() => setShowComment(false)}
      />
      <div className={`fixed left-0 right-0 z-50 bg-white dark:bg-zinc-900 shadow-2xl animate-slideUp xl:hidden flex flex-col transition-all duration-300 ${
        isFullscreen 
          ? 'inset-0' 
          : 'bottom-0 h-[75vh] rounded-t-2xl'
      }`}>
        <div className={`flex items-center justify-center pt-3 pb-2 flex-shrink-0 ${!isFullscreen ? 'cursor-grab' : ''}`}>
          <div className='w-9 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full'></div>
        </div>
        
        <div className='flex items-center justify-end px-4 pb-3 flex-shrink-0'>
          <div className='flex items-center gap-2'>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className='w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors'>
              <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'} text-sm`}></i>
            </button>
            <button 
              onClick={() => setShowComment(false)}
              className='w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors'>
              <i className='fas fa-times text-sm'></i>
            </button>
          </div>
        </div>
        
        <div className='flex-1 overflow-y-auto overflow-x-hidden relative'>
          {post && post?.href && <PostReaction post={post} key={`reaction-${post.href}`} />}
          {serverURL && (
            <div ref={containerRef} className='waline-container' />
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
        
        .waline-container {
          padding: 0 12px 120px 12px;
        }
        
        .waline-container .wl-panel {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--waline-bgcolor, #fff);
          border-top: 1px solid var(--waline-border-color, #ebeef5);
          padding: 8px 10px;
          margin: 0;
          border-radius: 0;
          z-index: 10;
        }
        
        .waline-container .wl-header {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 6px;
        }
        
        .waline-container .wl-header-item {
          flex: 1;
          min-width: 0;
        }
        
        .waline-container .wl-header-item:nth-child(n+2) {
          display: none;
        }
        
        .waline-container .wl-input {
          font-size: 13px;
          height: 32px;
          border-radius: 6px;
          padding: 0 10px;
        }
        
        .waline-container .wl-editor {
          min-height: 40px;
          max-height: 80px;
          font-size: 13px;
          line-height: 1.4;
          border-radius: 8px;
          padding: 8px 10px;
        }
        
        .waline-container .wl-close {
          position: absolute;
          top: 8px;
          right: 8px;
        }
        
        .waline-container .wl-cards .wl-card {
          padding: 12px 0;
          border-bottom: 1px solid var(--waline-border-color);
        }
        
        .waline-container .wl-card .wl-head {
          margin-bottom: 8px;
        }
        
        .waline-container .wl-card .wl-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
        
        .waline-container .wl-card .wl-nick {
          font-size: 13px;
          font-weight: 500;
        }
        
        .waline-container .wl-card .wl-time {
          font-size: 11px;
        }
        
        .waline-container .wl-card .wl-content {
          font-size: 14px;
          line-height: 1.6;
          margin-top: 4px;
        }
        
        .waline-container .wl-quote {
          padding-left: 8px;
          border-left: 2px solid var(--waline-theme-color);
          margin: 8px 0;
          font-size: 13px;
          color: var(--waline-color, #666);
        }
        
        .waline-container .wl-card .wl-meta {
          position: static;
          padding: 0;
          border: none;
          background: transparent;
          margin-top: 8px;
        }
        
        .waline-container .wl-card .wl-meta button {
          background: transparent;
          color: var(--waline-color, #666);
          width: auto;
          height: auto;
          padding: 4px 8px;
          font-size: 12px;
        }
        
        .waline-container .wl-reaction {
          display: none !important;
        }
        
        .waline-container .wl-comment-actions {
          margin-top: 6px;
          flex-wrap: wrap;
        }
        
        .waline-container .wl-comment-actions button {
          padding: 3px 8px;
          font-size: 11px;
        }
        
        html.dark .waline-container {
          --waline-bgcolor: #18181b;
          --waline-bgcolor-light: rgba(255,255,255,0.05);
          --waline-border-color: #27272a;
          --waline-color: #a1a1aa;
        }
      `}</style>
    </>
  )
}
