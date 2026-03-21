import { useEffect, useState } from 'react'
import { isBrowser } from '@/lib/utils'

export default function ReadingProgress() {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const scrollListener = () => {
      const target = isBrowser && document.getElementById('article-wrapper')
      if (target) {
        const clientHeight = target.clientHeight
        const scrollY = window.pageYOffset
        const fullHeight = clientHeight - window.outerHeight
        let per = parseFloat(((scrollY / fullHeight) * 100).toFixed(0))
        if (per > 100) per = 100
        if (per < 0) per = 0
        setPercent(per)
      }
    }

    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [])

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h4 className='text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-2'>
          <span className='w-6 h-6 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center'>
            <i className='fas fa-book-reader text-violet-500 text-[10px]'></i>
          </span>
          阅读进度
        </h4>
        <span className='text-xs font-medium text-violet-500 dark:text-violet-400'>{percent}%</span>
      </div>
      <div className='h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden'>
        <div
          className='h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300 shadow-sm'
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
