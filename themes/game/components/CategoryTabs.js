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
  ]

  const allTabs = [...defaultTabs, ...(categories || []).map(c => ({ name: c.name, href: `/category/${c.name}`, count: c.count }))]

  useEffect(() => {
    const checkScroll = () => {
      const el = scrollRef.current
      if (!el) return

      const { scrollLeft, scrollWidth, clientWidth } = el
      // 给判断留一点容差，避免“临界抖动”
      const tolerance = 4
      setShowLeftArrow(scrollLeft > tolerance)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - tolerance)
    }

    // 首次/路由切换/类别变化后，确保箭头状态正确
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

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const activeIndex = allTabs.findIndex((tab, idx) => isActiveTab(tab, idx))
    if (activeIndex < 0) return

    // 将当前激活 tab 滚动到视口内（居中显示更像 Pix 的交互）
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
            className='absolute left-0 z-10 w-8 h-8 flex items-center justify-center bg-gradient-to-r from-white dark:from-zinc-900 to-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30 rounded-full'
            aria-label='向左滚动分类'
            type='button'>
            <i className='fas fa-chevron-left text-zinc-400 text-xs'></i>
          </button>
        )}
        
        <div
          ref={scrollRef}
          className='flex items-center gap-1 overflow-x-auto scrollbar-hide py-3 scroll-smooth'
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            // 给左右箭头留出点击/可视区域，避免遮挡
            paddingLeft: showLeftArrow ? 12 : 12,
            paddingRight: showRightArrow ? 48 : 12
          }}>
          {allTabs.map((tab, index) => {
            const isActive = isActiveTab(tab, index)
            return (
              <SmartLink
                key={index}
                href={tab.href}
                className={`flex-shrink-0 px-4 py-1.5 text-sm rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30 ${
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
            className='absolute right-0 z-10 w-8 h-8 flex items-center justify-center bg-gradient-to-l from-white dark:from-zinc-900 to-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30 rounded-full'
            aria-label='向右滚动分类'
            type='button'>
            <i className='fas fa-chevron-right text-zinc-400 text-xs'></i>
          </button>
        )}
      </div>
    </div>
  )
}
