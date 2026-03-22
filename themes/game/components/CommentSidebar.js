import { siteConfig } from '@/lib/config'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const Comment = dynamic(() => import('@/components/Comment'), { 
  ssr: false,
  loading: () => (
    <div className='flex items-center justify-center py-8'>
      <div className='w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin'></div>
    </div>
  )
})

export default function CommentSidebar({ post, showComment, setShowComment }) {
  const [mounted, setMounted] = useState(false)
  const sidebarRef = useRef(null)

  useEffect(() => {
    if (showComment) {
      setMounted(true)
    }
  }, [showComment])

  if (!showComment) return null

  return (
    <>
      <div 
        className='fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 xl:hidden'
        onClick={() => setShowComment(false)}
      />
      <div 
        ref={sidebarRef}
        className='fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm z-50 bg-white dark:bg-zinc-900 shadow-2xl animate-slideInRight xl:hidden flex flex-col'>
        <div className='flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0'>
          <div className='flex items-center gap-2'>
            <span className='w-8 h-8 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center'>
              <i className='far fa-comment text-violet-500'></i>
            </span>
            <span className='font-medium text-zinc-800 dark:text-zinc-100'>评论区</span>
          </div>
          <button 
            onClick={() => setShowComment(false)}
            className='w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors'>
            <i className='fas fa-times text-sm'></i>
          </button>
        </div>
        
        <div className='flex-1 overflow-y-auto p-4'>
          {mounted && post && (
            <Comment frontMatter={post} />
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}
