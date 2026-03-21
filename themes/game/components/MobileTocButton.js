import { useState, useEffect } from 'react'
import { uuidToId } from 'notion-utils'

export default function MobileTocButton({ toc }) {
  const [showToc, setShowToc] = useState(false)
  const [activeSection, setActiveSection] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
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
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!toc || toc.length < 1) {
    return null
  }

  const currentIndex = toc.findIndex(t => uuidToId(t.id) === activeSection) + 1

  return (
    <>
      <button
        onClick={() => setShowToc(true)}
        className='fixed bottom-20 right-8 xl:hidden z-40 group'>
        <div className='relative'>
          <div className='w-11 h-11 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50 flex items-center justify-center text-zinc-600 dark:text-zinc-300 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300 border border-zinc-100 dark:border-zinc-700'>
            <i className='fas fa-list-ul text-sm'></i>
          </div>
          {currentIndex > 0 && (
            <span className='absolute -top-1 -right-1 w-5 h-5 bg-violet-500 rounded-lg text-[10px] text-white font-bold flex items-center justify-center shadow-md'>
              {currentIndex}
            </span>
          )}
        </div>
      </button>

      {showToc && (
        <>
          <div 
            className='fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 xl:hidden'
            onClick={() => setShowToc(false)}
          />
          <div className='fixed bottom-36 right-8 z-50 xl:hidden w-64 max-w-[calc(100vw-48px)] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden animate-slideUp border border-zinc-100 dark:border-zinc-800'>
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
    </>
  )
}
