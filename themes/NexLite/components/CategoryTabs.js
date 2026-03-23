import { useState, useRef, useEffect } from 'react'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

const categoryIcons = {
  '推荐': 'fas fa-fire',
  '热门': 'fas fa-fire-flame-curved',
  '最新': 'fas fa-clock',
  '动作': 'fas fa-bolt',
  '冒险': 'fas fa-compass',
  '益智': 'fas fa-puzzle-piece',
  '休闲': 'fas fa-gamepad',
  '体育': 'fas fa-futbol',
  '竞速': 'fas fa-car',
  '射击': 'fas fa-crosshairs',
  '策略': 'fas fa-chess',
  '角色扮演': 'fas fa-hat-wizard',
  '模拟': 'fas fa-vr-cardboard',
  '多人': 'fas fa-users',
  '单人': 'fas fa-user',
  '经典': 'fas fa-star',
  '小游戏': 'fas fa-dice',
}

const getCategoryIcon = (name) => {
  return categoryIcons[name] || 'fas fa-folder'
}

export default function CategoryTabs({ categories, currentCategory }) {
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const scrollRef = useRef(null)
  const router = useRouter()

  const defaultTabs = [
    { name: '推荐', href: '/', icon: 'fas fa-fire' },
  ]

  const allTabs = [...defaultTabs, ...(categories || []).map(c => ({ 
    name: c.name, 
    href: `/category/${c.name}`, 
    count: c.count,
    icon: getCategoryIcon(c.name)
  }))]

  useEffect(() => {
    const checkScroll = () => {
      const el = scrollRef.current
      if (!el) return

      const { scrollLeft, scrollWidth, clientWidth } = el
      const tolerance = 4
      setShowLeftArrow(scrollLeft > tolerance)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - tolerance)
    }

    checkScroll()

    const scrollEl = scrollRef.current
    if (!scrollEl) return

    scrollEl.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      scrollEl.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [router.asPath, (categories || []).length])

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  function isActiveTab(tab, index) {
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

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const activeIndex = allTabs.findIndex((tab, idx) => isActiveTab(tab, idx))
    if (activeIndex < 0) return

    const anchors = el.querySelectorAll('a')
    const activeEl = anchors?.[activeIndex]
    if (activeEl && typeof activeEl.scrollIntoView === 'function') {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [router.asPath, currentCategory, (categories || []).length])

  return (
    <div className='relative bg-white dark:bg-zinc-900 sticky top-0 z-10 border-b border-zinc-100 dark:border-zinc-800'>
      <div className='flex items-center px-1'>
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className='absolute left-0 z-10 w-8 h-8 flex items-center justify-center bg-gradient-to-r from-white dark:from-zinc-900 to-transparent focus:outline-none'
            aria-label='向左滚动分类'
            type='button'>
            <i className='fas fa-chevron-left text-zinc-400 text-xs'></i>
          </button>
        )}
        
        <div
          ref={scrollRef}
          className='flex items-center gap-2 overflow-x-auto scrollbar-hide py-2.5 scroll-smooth'
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingLeft: showLeftArrow ? 28 : 8,
            paddingRight: showRightArrow ? 40 : 8
          }}>
          {allTabs.map((tab, index) => {
            const isActive = isActiveTab(tab, index)
            return (
              <SmartLink
                key={index}
                href={tab.href}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-white font-medium bg-violet-500 shadow-sm shadow-violet-500/20'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-violet-500 dark:hover:text-violet-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}>
                <i className={`${tab.icon} text-xs ${isActive ? 'text-white' : 'text-zinc-400'}`}></i>
                <span>{tab.name}</span>
                {tab.count && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
                  }`}>{tab.count}</span>
                )}
              </SmartLink>
            )
          })}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className='absolute right-0 z-10 w-8 h-8 flex items-center justify-center bg-gradient-to-l from-white dark:from-zinc-900 to-transparent focus:outline-none'
            aria-label='向右滚动分类'
            type='button'>
            <i className='fas fa-chevron-right text-zinc-400 text-xs'></i>
          </button>
        )}
      </div>
    </div>
  )
}
