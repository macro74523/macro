import { siteConfig } from '@/lib/config'
import { useEffect, useState, useRef } from 'react'

export function BusuanziStats({ compact = false }) {
  const [sitePv, setSitePv] = useState('--')
  const [siteUv, setSiteUv] = useState('--')
  const hasLoaded = useRef(false)
  
  const enabled = siteConfig('ANALYTICS_BUSUANZI_ENABLE')

  useEffect(() => {
    if (!enabled) return
    
    let checkCount = 0
    const maxChecks = 20
    
    const checkBusuanzi = setInterval(() => {
      if (hasLoaded.current) {
        clearInterval(checkBusuanzi)
        return
      }
      
      checkCount++
      const pvEls = document.getElementsByClassName('busuanzi_value_site_pv')
      const uvEls = document.getElementsByClassName('busuanzi_value_site_uv')
      
      const pvLoaded = pvEls.length > 0 && pvEls[0].textContent && pvEls[0].textContent !== '--'
      const uvLoaded = uvEls.length > 0 && uvEls[0].textContent && uvEls[0].textContent !== '--'
      
      if (pvLoaded) {
        setSitePv(pvEls[0].textContent)
      }
      if (uvLoaded) {
        setSiteUv(uvEls[0].textContent)
      }
      
      if (pvLoaded && uvLoaded) {
        hasLoaded.current = true
        clearInterval(checkBusuanzi)
      }
      
      if (checkCount >= maxChecks) {
        clearInterval(checkBusuanzi)
      }
    }, 300)

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
          <span className='busuanzi_value_site_pv'>{sitePv}</span>
        </div>
        <div className='flex items-center gap-1'>
          <i className='fas fa-users'></i>
          <span className='busuanzi_value_site_uv'>{siteUv}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-3 text-center'>
      <div className='py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg'>
        <div className='text-lg font-bold pix-gradient-text busuanzi_value_site_pv'>{sitePv}</div>
        <div className='text-xs text-zinc-400 dark:text-zinc-500 mt-1'>本站访问量</div>
      </div>
      <div className='py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg'>
        <div className='text-lg font-bold pix-gradient-text busuanzi_value_site_uv'>{siteUv}</div>
        <div className='text-xs text-zinc-400 dark:text-zinc-500 mt-1'>本站访客数</div>
      </div>
    </div>
  )
}
