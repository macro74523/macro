import LazyImage from '@/components/LazyImage'
import { deepClone } from '@/lib/utils'
import SmartLink from '@/components/SmartLink'
import { useState } from 'react'

export const GameListIndexCombine = ({ posts, maxCount = 8 }) => {
  const gamesClone = deepClone(posts)
  const items = []
  
  let index = 0
  while (gamesClone?.length > 0 && index < maxCount) {
    const item = gamesClone.shift()
    if (item) {
      items.push(<GameCard key={item.id || index} item={item} />)
      index++
    }
  }

  if (items.length === 0) return null

  return (
    <div className='mt-6'>
      <h3 className='text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-1.5'>
        <i className='fas fa-compass text-violet-500 text-xs'></i>
        更多推荐
      </h3>
      <div className='grid grid-cols-4 sm:grid-cols-6 gap-2'>
        {items}
      </div>
    </div>
  )
}

const GameCard = ({ item }) => {
  const { title } = item
  const img = item.pageCoverThumbnail || item.pageCover
  const [isHovered, setIsHovered] = useState(false)

  return (
    <SmartLink
      title={title}
      href={`${item?.href}`}
      className='group block'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      
      <div className='relative aspect-[4/3] rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-1.5'>
        {img ? (
          <LazyImage
            src={img}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
            priority
            fill='full'
          />
        ) : (
          <div className='w-full h-full pix-gradient-bg flex items-center justify-center'>
            <i className='fas fa-image text-white/30 text-sm'></i>
          </div>
        )}
      </div>
      
      <p className='text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1 group-hover:text-violet-500 transition-colors'>
        {title}
      </p>
    </SmartLink>
  )
}
