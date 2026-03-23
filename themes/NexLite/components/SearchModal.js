import { siteConfig } from '@/lib/config'
import { deepClone } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { useNexLiteGlobal } from '..'
import CONFIG from '../config'
import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'

export default function SearchModal({ allNavPages, siteInfo }) {
  const { sideBarVisible, setSideBarVisible, filterPosts, setFilterPosts } =
    useNexLiteGlobal()
  const inputRef = useRef(null)
  const [searchValue, setSearchValue] = useState('')
  const allPosts = deepClone(allNavPages) || []
  
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
    if (allPosts && allPosts.length > 0) {
      setFilterPosts(
        allPosts?.filter(item =>
          item.tags?.some(
            t => t === siteConfig('NEXLITE_RECOMMEND_TAG', 'Recommend', CONFIG)
          )
        )
      )
    }
  }, [allNavPages])

  const handleSearch = e => {
    const search = e.target.value
    setSearchValue(search)
    
    if (!search || search === '') {
      setFilterPosts(
        allPosts?.filter(item =>
          item.tags?.some(
            t => t === siteConfig('NEXLITE_RECOMMEND_TAG', 'Recommend', CONFIG)
          )
        )
      )
      return
    }
    
    const filtered = allPosts?.filter(item => {
      return (
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.summary?.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase()) ||
        item.tags?.some(tag => tag?.toLowerCase().includes(search.toLowerCase()))
      )
    })

    setFilterPosts(deepClone(filtered))
  }

  const handleKeyDown = e => {
    if (e.key === 'Escape') {
      setSideBarVisible(false)
    }
  }

  if (!sideBarVisible) return null

  return (
    <div 
      className='fixed inset-0 z-50 flex items-start justify-center pt-[8vh] px-4'
      onClick={() => setSideBarVisible(false)}>
      <div 
        className='absolute inset-0 bg-zinc-900/60 backdrop-blur-sm'
        onClick={() => setSideBarVisible(false)}
      />
      
      <div 
        className='relative w-full max-w-3xl bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden animate-fadeIn rounded-2xl'
        onClick={e => e.stopPropagation()}>
        <div className='p-5 border-b border-zinc-100 dark:border-zinc-800'>
          <div className='relative'>
            <input
              autoFocus
              id='search-input'
              ref={inputRef}
              value={searchValue}
              className='w-full h-12 px-5 pl-11 text-base bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 focus:border-violet-500 dark:focus:border-violet-500 transition-all outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 rounded-xl'
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              placeholder='搜索文章、标签、分类...'
            />
            <i className='fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400'></i>
            {searchValue && (
              <button
                onClick={() => {
                  setSearchValue('')
                  handleSearch({ target: { value: '' } })
                  inputRef.current?.focus()
                }}
                className='absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors'>
                <i className='fas fa-times text-zinc-400 text-sm'></i>
              </button>
            )}
          </div>
          
          <div className='flex items-center justify-between mt-3 text-xs text-zinc-400'>
            <span>
              {searchValue ? (
                <>找到 <span className='text-violet-500 font-medium'>{filterPosts?.length || 0}</span> 个结果</>
              ) : (
                '输入关键词开始搜索'
              )}
            </span>
            <button
              onClick={() => setSideBarVisible(false)}
              className='flex items-center gap-1 hover:text-violet-500 transition-colors cursor-pointer'>
              <kbd className='px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-xs rounded'>ESC</kbd>
              <span>关闭</span>
            </button>
          </div>
        </div>

        <div className='max-h-[65vh] overflow-y-auto'>
          {filterPosts && filterPosts.length > 0 ? (
            <div className='p-4 grid grid-cols-2 sm:grid-cols-3 gap-3'>
              {filterPosts.slice(0, 9).map((item, index) => (
                <SearchResultItem 
                  key={item.id || index} 
                  item={item} 
                  onClick={() => setSideBarVisible(false)}
                />
              ))}
            </div>
          ) : searchValue ? (
            <div className='flex flex-col items-center justify-center py-16 text-zinc-400'>
              <i className='fas fa-search text-5xl mb-4 opacity-20'></i>
              <p className='text-sm'>没有找到相关内容</p>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-16 text-zinc-400'>
              <i className='fas fa-file-alt text-5xl mb-4 opacity-20'></i>
              <p className='text-sm'>开始搜索你的内容</p>
            </div>
          )}
          {filterPosts && filterPosts.length > 9 && (
            <div className='text-center py-4 text-sm text-zinc-400 border-t border-zinc-100 dark:border-zinc-800'>
              还有 {filterPosts.length - 9} 个结果...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SearchResultItem({ item, onClick }) {
  const title = item.title
  const cover = item.pageCoverThumbnail || item.pageCover
  const [imageError, setImageError] = useState(false)

  return (
    <SmartLink
      href={item.href}
      onClick={onClick}
      className='group block'>
      <div className='relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-xl'>
        {cover && !imageError ? (
          <LazyImage
            src={cover}
            alt={title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
            priority
            fill='full'
            onError={() => setImageError(true)}
          />
        ) : (
          <div className='w-full h-full pix-gradient-bg flex items-center justify-center'>
            <i className='fas fa-file-alt text-white/50 text-2xl'></i>
          </div>
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
      </div>
      <div className='mt-2 px-1'>
        <h3 className='text-sm font-medium text-zinc-800 dark:text-zinc-100 line-clamp-2 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors leading-snug'>
          {title}
        </h3>
      </div>
    </SmartLink>
  )
}
