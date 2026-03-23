import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function PostToc({ toc }) {
  const tocIds = []
  const tRef = useRef(null)
  const [activeSection, setActiveSection] = useState(null)

  useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy)
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [])

  const throttleMs = 200
  const actionSectionScrollSpy = useCallback(
    throttle(() => {
      const sections = document.getElementsByClassName('notion-h')
      let prevBBox = null
      let currentSectionId = activeSection
      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i]
        if (!section || !(section instanceof Element)) continue
        if (!currentSectionId) {
          currentSectionId = section.getAttribute('data-id')
        }
        const bbox = section.getBoundingClientRect()
        const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
        const offset = Math.max(150, prevHeight / 4)
        if (bbox.top - offset < 0) {
          currentSectionId = section.getAttribute('data-id')
          prevBBox = bbox
          continue
        }
        break
      }
      setActiveSection(currentSectionId)
      const index = tocIds.indexOf(currentSectionId) || 0
      tRef?.current?.scrollTo({ top: 28 * index, behavior: 'smooth' })
    }, throttleMs)
  )

  if (!toc || toc.length < 1) {
    return null
  }

  return (
    <div ref={tRef} className='max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar'>
      <nav className='space-y-0.5'>
        {toc.map(tocItem => {
          const id = uuidToId(tocItem.id)
          tocIds.push(id)
          const isActive = activeSection === id
          return (
            <a
              key={id}
              href={`#${id}`}
              className={`group flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 font-medium'
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
              style={{ paddingLeft: 8 + tocItem.indentLevel * 10 }}>
              {isActive && (
                <span className='w-1 h-1 rounded-full bg-violet-500 dark:bg-violet-400 flex-shrink-0'></span>
              )}
              <span className='truncate'>{tocItem.text}</span>
            </a>
          )
        })}
      </nav>
    </div>
  )
}
