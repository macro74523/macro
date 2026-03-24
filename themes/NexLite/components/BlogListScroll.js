import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { ArticleList } from './ArticleList'

export const BlogListScroll = props => {
  const { posts } = props
  const { locale, NOTION_CONFIG } = useGlobal()
  const [page, updatePage] = useState(1)
  const [initialLoading, setInitialLoading] = useState(true)
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)

  useEffect(() => {
    if (posts && posts.length > 0) {
      setInitialLoading(false)
    }
  }, [posts])

  const hasMore = useMemo(() => {
    if (!posts) return false
    return page * POSTS_PER_PAGE < posts.length
  }, [posts, page, POSTS_PER_PAGE])

  const postsToShow = useMemo(() => {
    if (!posts || !Array.isArray(posts)) return []
    return posts.slice(0, POSTS_PER_PAGE * page)
  }, [posts, page, POSTS_PER_PAGE])

  const handleGetMore = useCallback(() => {
    if (!hasMore) return
    updatePage(prev => prev + 1)
  }, [hasMore])

  const targetRef = useRef(null)

  useEffect(() => {
    const scrollTrigger = throttle(() => {
      const scrollS = window.scrollY + window.outerHeight
      const clientHeight = targetRef.current?.clientHeight || 0
      if (scrollS > clientHeight + 100) {
        handleGetMore()
      }
    }, 500)

    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
      scrollTrigger.cancel()
    }
  }, [handleGetMore])

  return (
    <>
      <div id='posts-wrapper' ref={targetRef}>
        <ArticleList posts={postsToShow} loading={initialLoading} />
      </div>

      <div
        onClick={handleGetMore}
        className='pix-card p-4 my-4 text-center cursor-pointer text-sm text-gray-400 dark:text-gray-500 hover:text-purple-500 transition-colors'>
        {hasMore ? (
          <span className='flex items-center justify-center gap-2'>
            <i className='fas fa-chevron-down'></i>
            {locale.COMMON.MORE}
          </span>
        ) : (
          <span className='flex items-center justify-center gap-2'>
            <i className='fas fa-check-circle'></i>
            {locale.COMMON.NO_MORE}
          </span>
        )}
      </div>
    </>
  )
}
