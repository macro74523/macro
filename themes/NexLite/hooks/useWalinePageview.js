import { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'

export function useWalinePageview(articlePath) {
  const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
  const [pageview, setPageview] = useState(null)
  
  useEffect(() => {
    if (!serverURL || !articlePath) return
    
    let mounted = true
    
    const fetchPageview = async () => {
      try {
        const url = `${serverURL}/api/article?path=${encodeURIComponent(articlePath)}`
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (mounted) {
          let count = 0
          
          if (data && data.data) {
            if (typeof data.data === 'number') {
              count = data.data
            } else if (typeof data.data === 'object') {
              count = data.data.time || data.data.pv || data.data.readingCount || 0
            }
          }
          
          setPageview(count)
          
          const elements = document.querySelectorAll('.waline-pageview-count')
          elements.forEach(el => {
            if (el.dataset.path === articlePath) {
              el.textContent = count
            }
          })
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to fetch pageview:', error)
        }
        if (mounted) {
          const elements = document.querySelectorAll('.waline-pageview-count')
          elements.forEach(el => {
            if (el.dataset.path === articlePath) {
              el.textContent = '--'
            }
          })
        }
      }
    }
    
    fetchPageview()
    
    return () => {
      mounted = false
    }
  }, [serverURL, articlePath])
  
  return pageview
}
