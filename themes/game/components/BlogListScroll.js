import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { deepClone } from '@/lib/utils'
import throttle from 'lodash.throttle'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArticleList } from './ArticleList'

export const BlogListScroll = props => {
  const { posts } = props
  const { locale, NOTION_CONFIG } = useGlobal()
  const [page, updatePage] = useState(1)
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)

  let hasMore = false
  const postsToShow =
    posts && Array.isArray(posts)
      ? deepClone(posts).slice(0, POSTS_PER_PAGE * page)
      : []

  if (posts) {
    const totalCount = posts.length
    hasMore = page * POSTS_PER_PAGE < totalCount
  }
  const handleGetMore = () => {
    if (!hasMore) return
    updatePage(page + 1)
  }

  const targetRef = useRef(null)

  const scrollTrigger = useCallback(
    throttle(() => {
      const scrollS = window.scrollY + window.outerHeight
      const clientHeight = targetRef
        ? targetRef.current
          ? targetRef.current.clientHeight
          : 0
        : 0
      if (scrollS > clientHeight + 100) {
        handleGetMore()
      }
    }, 500)
  )

  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  })

  return (
    <>
      <div id='posts-wrapper' ref={targetRef}>
        <ArticleList posts={postsToShow} />
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
