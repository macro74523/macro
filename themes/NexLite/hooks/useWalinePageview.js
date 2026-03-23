import { useEffect } from 'react'
import { siteConfig } from '@/lib/config'

export function useWalinePageview(articlePath) {
  const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
  
  useEffect(() => {
    if (!serverURL || !articlePath) return
    
    let mounted = true
    
    const initPageview = async () => {
      try {
        const { pageviewCount } = await import('@waline/client/pageview')
        if (mounted) {
          pageviewCount({
            serverURL,
            path: articlePath,
            selector: '.waline-pageview-count',
            update: true
          })
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to init pageview:', error)
        }
      }
    }
    
    initPageview()
    
    return () => {
      mounted = false
    }
  }, [serverURL, articlePath])
}
