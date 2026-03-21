import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'

export default function BusuanziCounter() {
  const [sitePv, setSitePv] = useState('--')
  const [siteUv, setSiteUv] = useState('--')
  
  const enabled = siteConfig('ANALYTICS_BUSUANZI_ENABLE')

  useEffect(() => {
    if (!enabled) return
    
    const checkBusuanzi = setInterval(() => {
      const pvEl = document.getElementById('busuanzi_value_site_pv')
      const uvEl = document.getElementById('busuanzi_value_site_uv')
      
      if (pvEl && pvEl.textContent && pvEl.textContent !== '--') {
        setSitePv(pvEl.textContent)
      }
      if (uvEl && uvEl.textContent && uvEl.textContent !== '--') {
        setSiteUv(uvEl.textContent)
      }
    }, 500)

    return () => clearInterval(checkBusuanzi)
  }, [enabled])

  if (!enabled) {
    return null
  }

  return (
    <>
      <span id='busuanzi_value_site_pv' className='hidden'>{sitePv}</span>
      <span id='busuanzi_value_site_uv' className='hidden'>{siteUv}</span>
    </>
  )
}

export function BusuanziStats({ compact = false }) {
  const [sitePv, setSitePv] = useState('--')
  const [siteUv, setSiteUv] = useState('--')
  
  const enabled = siteConfig('ANALYTICS_BUSUANZI_ENABLE')

  useEffect(() => {
    if (!enabled) return
    
    const checkBusuanzi = setInterval(() => {
      const pvEl = document.getElementById('busuanzi_value_site_pv')
      const uvEl = document.getElementById('busuanzi_value_site_uv')
      
      if (pvEl && pvEl.textContent && pvEl.textContent !== '--') {
        setSitePv(pvEl.textContent)
      }
      if (uvEl && uvEl.textContent && uvEl.textContent !== '--') {
        setSiteUv(uvEl.textContent)
      }
    }, 500)

    return () => clearInterval(checkBusuanzi)
  }, [enabled])

  if (!enabled) {
    return null
  }

  if (compact) {
    return (
      <div className='flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400'>
        <div className='flex items-center gap-1'>
          <i className='far fa-eye'></i>
          <span>{sitePv}</span>
        </div>
        <div className='flex items-center gap-1'>
          <i className='fas fa-users'></i>
          <span>{siteUv}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-3 text-center'>
      <div className='py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg'>
        <div className='text-lg font-bold pix-gradient-text'>{sitePv}</div>
        <div className='text-xs text-zinc-400 dark:text-zinc-500 mt-1'>本站访问量</div>
      </div>
      <div className='py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg'>
        <div className='text-lg font-bold pix-gradient-text'>{siteUv}</div>
        <div className='text-xs text-zinc-400 dark:text-zinc-500 mt-1'>本站访客数</div>
      </div>
    </div>
  )
}
