import { useState, useRef, useEffect } from 'react'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

export default function CategoryTabs({ categories, currentCategory }) {
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const scrollRef = useRef(null)
  const router = useRouter()

  const defaultTabs = [
    { name: '推荐', href: '/', icon: 'fas fa-fire' },
    { name: '最新', href: '/?sort=latest', icon: 'fas fa-clock' },
    { name: '热门', href: '/?sort=hot', icon: 'fas fa-chart-line' },
  ]

  const allTabs = [...defaultTabs, ...(categories || []).map(c => ({ name: c.name, href: `/category/${c.name}`, count: c.count }))]

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        setShowLeftArrow(scrollLeft > 0)
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
      }
    }
    
    checkScroll()
    const scrollEl = scrollRef.current
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
      return () => {
        scrollEl.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [])

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const isActiveTab = (tab, index) => {
    const pathname = router.pathname
    const query = router.query
    
    if (tab.href === '/' && pathname === '/') {
      return true
    }
    
    if (tab.href.startsWith('/category/') && query.slug === tab.name) {
      return true
    }
    
    if (currentCategory === tab.name) {
      return true
    }
    
    return false
  }

  return (
    <div className='relative bg-white dark:bg-zinc-900 sticky top-0 z-10 border-b border-zinc-100 dark:border-zinc-800'>
      <div className='flex items-center px-1'>
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className='absolute left-0 z-10 w-8 h-8 flex items-center justify-center bg-gradient-to-r from-white dark:from-zinc-900 to-transparent'>
            <i className='fas fa-chevron-left text-zinc-400 text-xs'></i>
          </button>
        )}
        
        <div
          ref={scrollRef}
          className='flex items-center gap-1 overflow-x-auto scrollbar-hide py-3 px-2 scroll-smooth'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {allTabs.map((tab, index) => {
            const isActive = isActiveTab(tab, index)
            return (
              <SmartLink
                key={index}
                href={tab.href}
                className={`flex-shrink-0 px-4 py-1.5 text-sm rounded-full transition-all duration-300 ${
                  isActive
                    ? 'text-white font-medium bg-violet-500 dark:bg-violet-500 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-violet-500 dark:hover:text-violet-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}>
                {tab.icon && <i className={`${tab.icon} mr-1.5 text-xs`}></i>}
                {tab.name}
                {tab.count && (
                  <span className={`ml-1 text-xs ${isActive ? 'text-white/80' : 'text-zinc-300 dark:text-zinc-600'}`}>({tab.count})</span>
                )}
              </SmartLink>
            )
          })}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className='absolute right-0 z-10 w-8 h-8 flex items-center justify-center bg-gradient-to-l from-white dark:from-zinc-900 to-transparent'>
            <i className='fas fa-chevron-right text-zinc-400 text-xs'></i>
          </button>
        )}
      </div>
    </div>
  )
}
