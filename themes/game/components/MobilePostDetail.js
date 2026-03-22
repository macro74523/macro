import { siteConfig } from '@/lib/config'
import { useState, useEffect, useRef, useCallback } from 'react'
import SmartLink from '@/components/SmartLink'
import NotionIcon from '@/components/NotionIcon'
import { useRouter } from 'next/router'
import { isBrowser } from '@/lib/utils'
import { useGlobal } from '@/lib/global'
import CommentSidebar from './CommentSidebar'
import PostReaction from './PostReaction'
import { uuidToId } from 'notion-utils'

export default function MobilePostDetail({ post, prevPost, nextPost, toc }) {
  const { isDarkMode, toggleDarkMode } = useGlobal()
  const [readingProgress, setReadingProgress] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const [showToc, setShowToc] = useState(false)
  const [activeSection, setActiveSection] = useState(null)
  const [commentCount, setCommentCount] = useState(0)
  const [fontSize, setFontSize] = useState(16)
  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImage, setModalImage] = useState('')
  const [pullDistance, setPullDistance] = useState(0)
  const [showPullTip, setShowPullTip] = useState(false)
  const [showDarkModeTip, setShowDarkModeTip] = useState(false)
  
  const router = useRouter()
  const touchStartY = useRef(0)
  const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
  const articlePath = post?.href

  useEffect(() => {
    if (!serverURL || !articlePath) return
    
    const initPageview = async () => {
      const { pageviewCount } = await import('@waline/client/pageview')
      pageviewCount({
        serverURL,
        path: articlePath,
        selector: '.waline-pageview-count',
        update: true
      })
    }
    
    initPageview()
  }, [serverURL, articlePath])

  useEffect(() => {
    if (!serverURL || !articlePath) return
    
    const fetchCommentCount = async () => {
      try {
        const response = await fetch(
          `${serverURL}/api/comment?type=count&url=${encodeURIComponent(articlePath)}`
        )
        const data = await response.json()
        setCommentCount(data.data || 0)
      } catch (error) {
        console.error('Failed to fetch comment count:', error)
      }
    }
    
    fetchCommentCount()
  }, [serverURL, articlePath])

  useEffect(() => {
    if (!toc || toc.length < 1) return
    
    const handleTocScroll = () => {
      const sections = document.getElementsByClassName('notion-h')
      let currentSectionId = null
      
      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i]
        if (!section || !(section instanceof Element)) continue
        const bbox = section.getBoundingClientRect()
        if (bbox.top < 200) {
          currentSectionId = section.getAttribute('data-id')
        }
      }
      
      if (currentSectionId) {
        setActiveSection(currentSectionId)
      }
    }
    
    window.addEventListener('scroll', handleTocScroll)
    return () => window.removeEventListener('scroll', handleTocScroll)
  }, [toc])

  useEffect(() => {
    const handleScroll = () => {
      const target = isBrowser && document.getElementById('article-wrapper')
      if (target) {
        const clientHeight = target.clientHeight
        const scrollY = window.pageYOffset
        const fullHeight = clientHeight - window.outerHeight
        let per = parseFloat(((scrollY / fullHeight) * 100).toFixed(0))
        if (per > 100) per = 100
        if (per < 0) per = 0
        setReadingProgress(per)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const savedFontSize = localStorage.getItem('reading_font_size')
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize))
    }
  }, [])

  useEffect(() => {
    const hour = new Date().getHours()
    const isNightTime = hour >= 18 || hour < 6
    const hasShownTip = localStorage.getItem('dark_mode_tip_shown')
    
    if (isNightTime && !hasShownTip) {
      const isDark = document.documentElement.classList.contains('dark')
      if (!isDark) {
        setShowDarkModeTip(true)
        localStorage.setItem('dark_mode_tip_shown', 'true')
        
        const timer = setTimeout(() => {
          setShowDarkModeTip(false)
        }, 3000)
        
        return () => clearTimeout(timer)
      }
    }
  }, [])

  useEffect(() => {
    const handleImageClick = (e) => {
      const img = e.target.closest('img')
      if (img && img.tagName === 'IMG') {
        setModalImage(img.src)
        setShowImageModal(true)
      }
    }

    const articleContent = document.getElementById('article-wrapper')
    if (articleContent) {
      articleContent.addEventListener('click', handleImageClick)
      return () => articleContent.removeEventListener('click', handleImageClick)
    }
  }, [])

  const handleTouchStart = useCallback((e) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY
    }
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (window.scrollY === 0 && touchStartY.current > 0) {
      const distance = e.touches[0].clientY - touchStartY.current
      if (distance > 0) {
        setPullDistance(Math.min(distance, 200))
        setShowPullTip(distance > 100)
      }
    }
  }, [])

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const handleTouchEnd = useCallback(() => {
    if (pullDistance > 150) {
      handleBack()
    }
    setPullDistance(0)
    setShowPullTip(false)
    touchStartY.current = 0
  }, [pullDistance])

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const handleFontSizeChange = (size) => {
    setFontSize(size)
    localStorage.setItem('reading_font_size', size.toString())
    document.documentElement.style.setProperty('--article-font-size', `${size}px`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }

  return (
    <div className='xl:hidden'>
      <div 
        className='fixed top-0 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800 z-50'
        style={{ transform: `translateY(${pullDistance * 0.3}px)` }}>
        <div 
          className='h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-150'
          style={{ width: `${readingProgress}%` }} 
        />
      </div>

      <button
        onClick={handleBack}
        className='fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-violet-500 hover:text-white transition-all duration-300 border border-zinc-200/50 dark:border-zinc-700/50'>
        <i className='fas fa-arrow-left text-sm'></i>
      </button>

      {showPullTip && (
        <div className='fixed top-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-white dark:bg-zinc-800 rounded-full shadow-lg text-sm text-zinc-600 dark:text-zinc-300 flex items-center gap-2'>
          <i className='fas fa-arrow-up text-violet-500'></i>
          <span>继续下滑返回</span>
        </div>
      )}

      {showDarkModeTip && (
        <div className='fixed top-4 left-4 right-4 z-50 p-4 bg-violet-500 text-white rounded-xl shadow-lg flex items-center justify-between animate-fadeIn'>
          <div className='flex items-center gap-3'>
            <i className='fas fa-moon text-lg'></i>
            <span className='text-sm'>夜间已至，建议开启暗黑模式</span>
          </div>
          <button 
            onClick={() => setShowDarkModeTip(false)}
            className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center'>
            <i className='fas fa-times text-xs'></i>
          </button>
        </div>
      )}

      <div className='px-1 pt-14'>
        <h1 className='font-bold text-2xl text-zinc-800 dark:text-zinc-100 mb-1 leading-snug'>
          {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}
          {post?.title}
        </h1>

        {serverURL && (
          <div className='flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400'>
            <span className='w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center'>
              <i className='far fa-eye text-[10px] text-zinc-400'></i>
            </span>
            <span className='waline-pageview-count' data-path={articlePath}>--</span>
            <span>次阅读</span>
          </div>
        )}
      </div>

      <div className='fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-800 px-4 py-2 safe-area-bottom'>
        <div className='flex items-center justify-around'>
          <button 
            onClick={() => setShowToc(true)}
            className='flex flex-col items-center gap-1 py-1 px-3 text-zinc-500 dark:text-zinc-400 transition-all relative'>
            <i className='fas fa-list-ul text-lg'></i>
            <span className='text-[10px]'>目录</span>
            {toc && toc.length > 0 && activeSection && (
              <span className='absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-violet-500 text-white text-[10px] rounded-full flex items-center justify-center'>
                {toc.findIndex(t => uuidToId(t.id) === activeSection) + 1}
              </span>
            )}
          </button>
          
          <button 
            onClick={handleShare}
            className='flex flex-col items-center gap-1 py-1 px-3 text-zinc-500 dark:text-zinc-400 transition-all'>
            <i className='fas fa-share-alt text-lg'></i>
            <span className='text-[10px]'>分享</span>
          </button>
          
          <button 
            onClick={toggleDarkMode}
            className='flex flex-col items-center gap-1 py-1 px-3 text-zinc-500 dark:text-zinc-400 transition-all'>
            <i className={`${isDarkMode ? 'fas fa-sun' : 'fas fa-moon'} text-lg`}></i>
            <span className='text-[10px]'>{isDarkMode ? '亮色' : '暗色'}</span>
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowComment(true)}
        className='fixed bottom-20 right-8 z-40 group xl:hidden'>
        <div className='relative'>
          <div className='w-11 h-11 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50 flex items-center justify-center text-zinc-600 dark:text-zinc-300 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300 border border-zinc-100 dark:border-zinc-700'>
            <i className='far fa-comment text-sm'></i>
          </div>
          {commentCount > 0 && (
            <span className='absolute -top-1 -right-1 min-w-[18px] h-5 px-1.5 bg-violet-500 text-white text-[10px] rounded-lg flex items-center justify-center shadow-md font-medium'>
              {commentCount > 99 ? '99+' : commentCount}
            </span>
          )}
        </div>
      </button>

      <PostReaction post={post} />

      {(prevPost || nextPost) && (
        <div className='mt-6 mb-32 px-1'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='flex-1 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent'></div>
            <span className='text-xs text-zinc-400 dark:text-zinc-500'>导航</span>
            <div className='flex-1 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent'></div>
          </div>
          
          <div className='space-y-3'>
            {prevPost && (
              <SmartLink
                href={prevPost.href}
                className='flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors'>
                <span className='w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0'>
                  <i className='fas fa-chevron-left text-xs text-zinc-400'></i>
                </span>
                <div className='flex-1 min-w-0'>
                  <div className='text-[10px] text-zinc-400 dark:text-zinc-500 mb-0.5'>上一篇</div>
                  <div className='text-sm text-zinc-700 dark:text-zinc-300 truncate'>{prevPost.title}</div>
                </div>
              </SmartLink>
            )}
            
            {nextPost && (
              <SmartLink
                href={nextPost.href}
                className='flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors'>
                <div className='flex-1 min-w-0 text-right'>
                  <div className='text-[10px] text-zinc-400 dark:text-zinc-500 mb-0.5'>下一篇</div>
                  <div className='text-sm text-zinc-700 dark:text-zinc-300 truncate'>{nextPost.title}</div>
                </div>
                <span className='w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0'>
                  <i className='fas fa-chevron-right text-xs text-zinc-400'></i>
                </span>
              </SmartLink>
            )}
          </div>
        </div>
      )}

      {showToc && toc && toc.length > 0 && (
        <>
          <div 
            className='fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 xl:hidden'
            onClick={() => setShowToc(false)}
          />
          <div className='fixed bottom-36 right-8 z-50 xl:hidden w-72 max-w-[calc(100vw-48px)] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden animate-slideUp border border-zinc-100 dark:border-zinc-800'>
            <div className='px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50'>
              <div className='flex items-center gap-2'>
                <span className='w-6 h-6 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center'>
                  <i className='fas fa-list-ul text-violet-500 text-xs'></i>
                </span>
                <span className='font-medium text-sm text-zinc-800 dark:text-zinc-100'>目录</span>
                <span className='text-xs text-zinc-400'>({toc.length})</span>
              </div>
              <button 
                onClick={() => setShowToc(false)}
                className='w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors'>
                <i className='fas fa-times text-xs'></i>
              </button>
            </div>
            <div className='overflow-y-auto max-h-[50vh] p-3'>
              <nav className='space-y-0.5'>
                {toc.map(tocItem => {
                  const id = uuidToId(tocItem.id)
                  const isActive = activeSection === id
                  return (
                    <a
                      key={id}
                      href={`#${id}`}
                      onClick={() => setShowToc(false)}
                      className={`block py-1.5 px-2 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 font-medium'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                      style={{ paddingLeft: 8 + tocItem.indentLevel * 10 }}>
                      <span className='flex items-center gap-1.5'>
                        {isActive && (
                          <span className='w-1 h-1 rounded-full bg-violet-500'></span>
                        )}
                        <span className='truncate'>{tocItem.text}</span>
                      </span>
                    </a>
                  )
                })}
              </nav>
            </div>
          </div>
        </>
      )}

      {showSettings && (
        <>
          <div 
            className='fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50'
            onClick={() => setShowSettings(false)}
          />
          <div className='fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 rounded-t-3xl shadow-2xl animate-slideUp'>
            <div className='p-4'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='font-medium text-zinc-800 dark:text-zinc-100'>阅读设置</h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  className='w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center'>
                  <i className='fas fa-times text-sm text-zinc-500'></i>
                </button>
              </div>
              
              <div className='space-y-6'>
                <div>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='text-sm text-zinc-600 dark:text-zinc-400'>字体大小</span>
                    <span className='text-sm text-violet-500'>{fontSize}px</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <button 
                      onClick={() => handleFontSizeChange(Math.max(12, fontSize - 2))}
                      className='w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400'>
                      <i className='fas fa-minus text-sm'></i>
                    </button>
                    <div className='flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full relative'>
                      <div 
                        className='absolute h-full bg-violet-500 rounded-full'
                        style={{ width: `${((fontSize - 12) / 12) * 100}%` }}
                      />
                    </div>
                    <button 
                      onClick={() => handleFontSizeChange(Math.min(24, fontSize + 2))}
                      className='w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400'>
                      <i className='fas fa-plus text-sm'></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showImageModal && (
        <div 
          className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center'
          onClick={() => setShowImageModal(false)}>
          <button 
            className='absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white'
            onClick={() => setShowImageModal(false)}>
            <i className='fas fa-times text-lg'></i>
          </button>
          <img 
            src={modalImage} 
            alt='preview' 
            className='max-w-full max-h-full object-contain'
          />
        </div>
      )}

      <CommentSidebar post={post} showComment={showComment} setShowComment={setShowComment} />
    </div>
  )
}
