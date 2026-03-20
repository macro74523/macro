import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { useState } from 'react'

export const ArticleList = ({ posts }) => {
  if (!posts || posts.length === 0) return null

  return (
    <div className='columns-2 gap-3 space-y-3'>
      {posts.map((post, index) => (
        <ArticleCard key={post.id || index} post={post} index={index} />
      ))}
    </div>
  )
}

const ArticleCard = ({ post, index }) => {
  const title = post.title
  const cover = post.pageCoverThumbnail || post.pageCover
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const heights = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[1/1]', 'aspect-[4/6]', 'aspect-[3/5]']
  const randomAspect = heights[index % heights.length]

  return (
    <article className='break-inside-avoid bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group'>
      <SmartLink 
        href={post.href} 
        title={title} 
        className='block'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        
        <div className={`relative ${randomAspect} overflow-hidden bg-zinc-100 dark:bg-zinc-800`}>
          {cover ? (
            <>
              {!imageLoaded && (
                <div className='absolute inset-0 bg-zinc-200 dark:bg-zinc-700 animate-pulse' />
              )}
              <LazyImage
                src={cover}
                alt={title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                priority
                fill='full'
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className='absolute inset-0 pix-gradient-bg flex items-center justify-center'>
              <i className='fas fa-image text-3xl text-white/30'></i>
            </div>
          )}
        </div>

        <div className='p-3'>
          <h3 className='text-sm font-medium text-zinc-800 dark:text-zinc-100 line-clamp-2 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors leading-snug'>
            {title}
          </h3>
          <div className='flex items-center justify-end mt-2'>
            <span className='flex items-center gap-0.5 text-xs text-zinc-300 dark:text-zinc-600'>
              <i className='far fa-heart text-[10px]'></i>
            </span>
          </div>
        </div>
      </SmartLink>
    </article>
  )
}
