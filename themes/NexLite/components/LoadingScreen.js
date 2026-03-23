import { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true)
  const siteName = siteConfig('TITLE') || 'NexLite'

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  if (!loading) return null

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-zinc-900 transition-opacity duration-500'>
      <div className='text-center'>
        <div className='relative'>
          <h1 className='text-4xl font-black text-zinc-800 dark:text-zinc-100 animate-pulse'>
            {siteName}
          </h1>
          <div className='mt-4 flex justify-center gap-1'>
            <div className='w-2 h-2 rounded-full bg-violet-500 animate-bounce' style={{ animationDelay: '0ms' }}></div>
            <div className='w-2 h-2 rounded-full bg-violet-500 animate-bounce' style={{ animationDelay: '150ms' }}></div>
            <div className='w-2 h-2 rounded-full bg-violet-500 animate-bounce' style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
