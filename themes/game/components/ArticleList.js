import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'

export const ArticleList = ({ posts }) => {
  if (!posts || posts.length === 0) return null

  return (
    <div className='space-y-0'>
      {posts.map((post, index) => (
        <ArticleCard key={post.id || index} post={post} />
      ))}
    </div>
  )
}

const ArticleCard = ({ post }) => {
  const title = post.title
  const summary = post.summary
  const cover = post.pageCoverThumbnail || post.pageCover
  const date = post.publishDay || post.publishDate
  const category = post.category
  const author = siteConfig('AUTHOR') || '博主'

  return (
    <article className='pix-card overflow-hidden group'>
      <SmartLink href={post.href} title={title} className='flex gap-4 p-5'>
        <div className='flex-shrink-0 w-36 h-24 sm:w-44 sm:h-28 overflow-hidden bg-zinc-100 dark:bg-zinc-800'>
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
              <i className='fas fa-image text-2xl text-white/50'></i>
            </div>
          )}
        </div>

        <div className='flex-1 min-w-0 flex flex-col justify-between py-0.5'>
          <div>
            <h3 className='text-base font-medium text-zinc-800 dark:text-zinc-100 mb-1.5 line-clamp-1 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors'>
              {title}
            </h3>

            {summary && (
              <p className='text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-2'>
                {summary}
              </p>
            )}
          </div>

          <div className='flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500'>
            <span className='flex items-center gap-1.5'>
              <i className='fas fa-user text-zinc-300 dark:text-zinc-600'></i>
              @{author}
            </span>
            <span className='flex items-center gap-1.5'>
              <i className='far fa-calendar-alt text-zinc-300 dark:text-zinc-600'></i>
              {date}
            </span>
            {category && (
              <span className='hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'>
                {category}
              </span>
            )}
          </div>
        </div>
      </SmartLink>
    </article>
  )
}
