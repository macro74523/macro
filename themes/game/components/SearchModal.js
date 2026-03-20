import { siteConfig } from '@/lib/config'
import { deepClone } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { useGameGlobal } from '..'
import CONFIG from '../config'
import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'

export default function SearchModal({ allNavPages, siteInfo }) {
  const { sideBarVisible, setSideBarVisible, filterGames, setFilterGames } =
    useGameGlobal()
  const inputRef = useRef(null)
  const [searchValue, setSearchValue] = useState('')
  const allGames = deepClone(allNavPages)
  
  useEffect(() => {
    if (sideBarVisible) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      document.body.style.overflow = 'hidden'
    } else {
      setSearchValue('')
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sideBarVisible])

  useEffect(() => {
    if (allGames && allGames.length > 0) {
      setFilterGames(
        allGames?.filter(item =>
          item.tags?.some(
            t => t === siteConfig('GAME_RECOMMEND_TAG', 'Recommend', CONFIG)
          )
        )
      )
    }
  }, [allNavPages])

  const handleSearch = e => {
    const search = e.target.value
    setSearchValue(search)
    
    if (!search || search === '') {
      setFilterGames(
        allGames?.filter(item =>
          item.tags?.some(
            t => t === siteConfig('GAME_RECOMMEND_TAG', 'Recommend', CONFIG)
          )
        )
      )
      return
    }
    
    const filtered = allGames?.filter(item => {
      return (
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.summary?.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase()) ||
        item.tags?.some(tag => tag?.toLowerCase().includes(search.toLowerCase()))
      )
    })

    setFilterGames(deepClone(filtered))
  }

  const handleKeyDown = e => {
    if (e.key === 'Escape') {
      setSideBarVisible(false)
    }
  }

  if (!sideBarVisible) return null

  return (
    <div 
      className='fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-6'
      onClick={() => setSideBarVisible(false)}>
      <div 
        className='absolute inset-0 bg-zinc-900/50 backdrop-blur-sm'
        onClick={() => setSideBarVisible(false)}
      />
      
      <div 
        className='relative w-full max-w-2xl bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden animate-fadeIn'
        onClick={e => e.stopPropagation()}>
        <div className='p-6'>
          <div className='relative'>
            <input
              autoFocus
              id='search-input'
              ref={inputRef}
              value={searchValue}
              className='w-full h-14 px-5 pl-12 text-base bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 focus:border-violet-500 dark:focus:border-violet-500 transition-all outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400'
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              placeholder='搜索文章、标签、分类...'
            />
            <i className='fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg'></i>
            {searchValue && (
              <button
                onClick={() => {
                  setSearchValue('')
                  handleSearch({ target: { value: '' } })
                  inputRef.current?.focus()
                }}
                className='absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors'>
                <i className='fas fa-times text-zinc-400'></i>
              </button>
            )}
          </div>
          
          <div className='flex items-center justify-between mt-4 text-xs text-zinc-400'>
            <span>
              {searchValue ? (
                <>找到 <span className='text-violet-500 font-medium'>{filterGames?.length || 0}</span> 个结果</>
              ) : (
                '输入关键词开始搜索'
              )}
            </span>
            <span className='flex items-center gap-1'>
              <kbd className='px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-xs'>ESC</kbd>
              <span>关闭</span>
            </span>
          </div>
        </div>

        <div className='border-t border-zinc-100 dark:border-zinc-800 max-h-[50vh] overflow-y-auto'>
          {filterGames && filterGames.length > 0 ? (
            <div className='p-2'>
              {filterGames.slice(0, 8).map((item, index) => (
                <SearchResultItem 
                  key={item.id || index} 
                  item={item} 
                  onClick={() => setSideBarVisible(false)}
                />
              ))}
              {filterGames.length > 8 && (
                <div className='text-center py-3 text-sm text-zinc-400'>
                  还有 {filterGames.length - 8} 个结果...
                </div>
              )}
            </div>
          ) : searchValue ? (
            <div className='flex flex-col items-center justify-center py-12 text-zinc-400'>
              <i className='fas fa-search text-4xl mb-3 opacity-30'></i>
              <p className='text-sm'>没有找到相关内容</p>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-12 text-zinc-400'>
              <i className='fas fa-file-alt text-4xl mb-3 opacity-30'></i>
              <p className='text-sm'>开始搜索你的内容</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SearchResultItem({ item, onClick }) {
  const title = item.title
  const summary = item.summary
  const cover = item.pageCoverThumbnail || item.pageCover
  const date = item.publishDay || item.publishDate
  const category = item.category

  return (
    <SmartLink
      href={item.href}
      onClick={onClick}
      className='flex gap-4 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group'>
      <div className='flex-shrink-0 w-20 h-20 overflow-hidden bg-zinc-100 dark:bg-zinc-800'>
        {cover ? (
          <LazyImage
            src={cover}
            alt={title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            priority
            fill='full'
          />
        ) : (
          <div className='w-full h-full pix-gradient-bg flex items-center justify-center'>
            <i className='fas fa-file-alt text-white/50 text-xl'></i>
          </div>
        )}
      </div>
      
      <div className='flex-1 min-w-0 flex flex-col justify-center'>
        <h3 className='text-base font-medium text-zinc-800 dark:text-zinc-100 line-clamp-1 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors'>
          {title}
        </h3>
        {summary && (
          <p className='text-sm text-zinc-400 dark:text-zinc-500 line-clamp-2 mt-1'>
            {summary}
          </p>
        )}
        <div className='flex items-center gap-3 mt-2 text-xs text-zinc-400'>
          {category && (
            <span className='px-2 py-0.5 bg-violet-50 dark:bg-violet-500/10 text-violet-500 dark:text-violet-400'>
              {category}
            </span>
          )}
          {date && <span>{date}</span>}
        </div>
      </div>
    </SmartLink>
  )
}
