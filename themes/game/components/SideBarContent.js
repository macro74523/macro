import { siteConfig } from '@/lib/config'
import { deepClone } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { useGameGlobal } from '..'
import CONFIG from '../config'
import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'

export default function SideBarContent({ allNavPages, siteInfo }) {
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
    } else {
      setSearchValue('')
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

  return (
    <div className='flex flex-col h-full'>
      <div className='sticky top-0 bg-white dark:bg-gray-900 z-10 px-6 py-4 border-b border-gray-100 dark:border-gray-800'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2'>
            <i className='fas fa-search text-purple-500'></i>
            搜索
          </h2>
          <button
            onClick={() => setSideBarVisible(false)}
            className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'>
            <i className='fas fa-times'></i>
          </button>
        </div>
        
        <div className='relative'>
          <input
            autoFocus
            id='search-input'
            ref={inputRef}
            value={searchValue}
            className='w-full h-11 rounded-xl px-4 pl-10 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-gray-800 dark:text-white placeholder-gray-400'
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            placeholder='搜索文章、标签、分类...'
          />
          <i className='fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400'></i>
          {searchValue && (
            <button
              onClick={() => {
                setSearchValue('')
                handleSearch({ target: { value: '' } })
              }}
              className='absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'>
              <i className='fas fa-times text-xs text-gray-400'></i>
            </button>
          )}
        </div>
      </div>

      <div className='flex-1 overflow-y-auto px-4 py-4'>
        {searchValue && (
          <div className='mb-4 px-2'>
            <span className='text-xs text-gray-400'>
              找到 <span className='text-purple-500 font-medium'>{filterGames?.length || 0}</span> 个结果
            </span>
          </div>
        )}
        
        {filterGames && filterGames.length > 0 ? (
          <div className='space-y-2'>
            {filterGames.map((item, index) => (
              <SearchResultItem 
                key={item.id || index} 
                item={item} 
                onClick={() => setSideBarVisible(false)}
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-16 text-gray-400'>
            <i className='fas fa-search text-4xl mb-4 opacity-30'></i>
            <p className='text-sm'>没有找到相关内容</p>
          </div>
        )}
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
      className='flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group'>
      <div className='flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800'>
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
            <i className='fas fa-file-alt text-white/50'></i>
          </div>
        )}
      </div>
      
      <div className='flex-1 min-w-0 flex flex-col justify-center'>
        <h3 className='text-sm font-medium text-gray-800 dark:text-white line-clamp-1 group-hover:text-purple-500 transition-colors'>
          {title}
        </h3>
        {summary && (
          <p className='text-xs text-gray-400 dark:text-gray-500 line-clamp-1 mt-1'>
            {summary}
          </p>
        )}
        <div className='flex items-center gap-2 mt-1.5 text-xs text-gray-400'>
          {category && (
            <span className='px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs'>
              {category}
            </span>
          )}
          {date && <span>{date}</span>}
        </div>
      </div>
    </SmartLink>
  )
}
