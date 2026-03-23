import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

const PaginationSimple = ({ page, totalPage }) => {
  const router = useRouter()
  const currentPage = +page
  
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

  const getPageUrl = (pageNum) => {
    if (pageNum === 1) {
      return pagePrefix || '/'
    }
    return `${pagePrefix}/page/${pageNum}`
  }

  const pages = useMemo(() => {
    if (!totalPage || totalPage <= 1) return []
    
    const arr = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPage, start + maxVisible - 1)
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      arr.push(i)
    }
    
    return arr
  }, [currentPage, totalPage])

  if (!totalPage || totalPage <= 1) return null

  return (
    <div className='my-6 flex justify-center items-center gap-1.5'>
      {currentPage > 1 && (
        <SmartLink
          href={getPageUrl(currentPage - 1)}
          className='w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-violet-500 hover:text-white transition-all text-sm'>
          <i className='fas fa-chevron-left text-xs'></i>
        </SmartLink>
      )}
      
      {pages[0] > 1 && (
        <>
          <SmartLink
            href={getPageUrl(1)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all ${
              currentPage === 1
                ? 'bg-violet-500 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-violet-500 hover:text-white'
            }`}>
            1
          </SmartLink>
          {pages[0] > 2 && (
            <span className='w-8 h-8 flex items-center justify-center text-zinc-400 text-sm'>...</span>
          )}
        </>
      )}
      
      {pages.map(p => (
        <SmartLink
          key={p}
          href={getPageUrl(p)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all ${
            currentPage === p
              ? 'bg-violet-500 text-white'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-violet-500 hover:text-white'
          }`}>
          {p}
        </SmartLink>
      ))}
      
      {pages[pages.length - 1] < totalPage && (
        <>
          {pages[pages.length - 1] < totalPage - 1 && (
            <span className='w-8 h-8 flex items-center justify-center text-zinc-400 text-sm'>...</span>
          )}
          <SmartLink
            href={getPageUrl(totalPage)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all ${
              currentPage === totalPage
                ? 'bg-violet-500 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-violet-500 hover:text-white'
            }`}>
            {totalPage}
          </SmartLink>
        </>
      )}
      
      {currentPage < totalPage && (
        <SmartLink
          href={getPageUrl(currentPage + 1)}
          className='w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-violet-500 hover:text-white transition-all text-sm'>
          <i className='fas fa-chevron-right text-xs'></i>
        </SmartLink>
      )}
    </div>
  )
}

export default PaginationSimple
