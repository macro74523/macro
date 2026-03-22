import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import WordCount from '@/components/WordCount'
import { useEffect } from 'react'

export default function MobilePostMeta({ post }) {
  const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
  const articlePath = post?.href

  useEffect(() => {
    if (!serverURL || !articlePath) return
    
    const initPageview = async () => {
      const { pageviewCount } = await import('@waline/client/pageview')
      pageviewCount({
        serverURL,
        path: articlePath,
        selector: '.waline-pageview-count-meta',
        update: true
      })
    }
    
    initPageview()
  }, [serverURL, articlePath])

  return (
    <div className='xl:hidden mt-8 mb-4 px-1'>
      <div className='p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50'>
        <div className='flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mb-4'>
          {post?.publishDay && (
            <span className='flex items-center gap-1.5'>
              <span className='w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center'>
                <i className='far fa-calendar text-[10px] text-zinc-400'></i>
              </span>
              {post.publishDay}
            </span>
          )}
          {serverURL && (
            <span className='flex items-center gap-1.5'>
              <span className='w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center'>
                <i className='far fa-eye text-[10px] text-zinc-400'></i>
              </span>
              <span className='waline-pageview-count-meta' data-path={articlePath}>--</span>
              <span>阅读</span>
            </span>
          )}
          {(post?.wordCount || post?.readTime) && (
            <span className='flex items-center gap-1.5'>
              <span className='w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center'>
                <i className='far fa-clock text-[10px] text-zinc-400'></i>
              </span>
              <WordCount wordCount={post.wordCount} readTime={post.readTime} />
            </span>
          )}
        </div>

        {post?.category && (
          <div className='mb-3'>
            <SmartLink
              href={`/category/${post.category}`}
              className='inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full text-xs font-medium border border-violet-100 dark:border-violet-500/20'>
              <i className='fas fa-folder text-[10px]'></i>
              {post.category}
            </SmartLink>
          </div>
        )}

        {post?.tags && post.tags.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {post.tags.map((tag, index) => (
              <SmartLink
                key={index}
                href={`/tag/${encodeURIComponent(tag)}`}
                className='inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-700/80 text-zinc-600 dark:text-zinc-400 rounded-md text-xs hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-colors'>
                <i className='fas fa-hashtag text-[8px] opacity-50'></i>
                {tag}
              </SmartLink>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
