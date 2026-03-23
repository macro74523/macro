import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { useState, useEffect, memo } from 'react'
import LikeButton from './LikeButton'
import ArticleSkeleton from './ArticleSkeleton'

export const ArticleList = memo(function ArticleList({ posts, loading = false, skeletonCount = 6 }) {
  if (loading) {
    return <ArticleSkeleton count={skeletonCount} />
  }
  
  if (!posts || posts.length === 0) return null

  return (
    <div className='columns-2 gap-2 space-y-2'>
      {posts.map((post, index) => (
        <ArticleCard key={post.id || index} post={post} />
      ))}
    </div>
  )
})

const ArticleCard = memo(function ArticleCard({ post }) {
  const title = post.title
  const cover = post.pageCoverThumbnail || post.pageCover
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [aspectRatio, setAspectRatio] = useState('aspect-[4/3]')

  useEffect(() => {
    if (!cover || imageError) {
      setAspectRatio('aspect-[4/3]')
      return
    }

    const img = new Image()
    img.onload = () => {
      const ratio = img.width / img.height
      setAspectRatio(ratio > 1 ? 'aspect-[4/3]' : 'aspect-[3/4]')
    }
    img.onerror = () => {
      setAspectRatio('aspect-[4/3]')
    }
    img.src = cover
  }, [cover, imageError])

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  return (
    <article className='break-inside-avoid bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group'>
      <SmartLink 
        href={post.href} 
        title={title} 
        className='block'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        
        <div className={`relative ${aspectRatio} overflow-hidden bg-zinc-100 dark:bg-zinc-800`}>
          {cover && !imageError ? (
            <>
              {!imageLoaded && (
                <div className='absolute inset-0 overflow-hidden'>
                  <div className='absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 animate-shimmer' 
                    style={{ backgroundSize: '200% 100%' }} />
                </div>
              )}
              <div className={`absolute inset-0 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <LazyImage
                  src={cover}
                  alt={title}
                  className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
                  fill='full'
                  onLoad={() => setImageLoaded(true)}
                  onError={handleImageError}
                />
              </div>
            </>
          ) : (
            <div className='absolute inset-0 pix-gradient-bg flex items-center justify-center'>
              <i className='fas fa-image text-3xl text-white/30'></i>
            </div>
          )}
        </div>

        <div className='p-2.5'>
          <h3 className='text-sm font-medium text-zinc-800 dark:text-zinc-100 line-clamp-2 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors leading-snug'>
            {title}
          </h3>
          <div className='flex items-center justify-end mt-1.5'>
            <LikeButton post={post} />
          </div>
        </div>
      </SmartLink>
    </article>
  )
})
