import LazyImage from '@/components/LazyImage'
import { deepClone } from '@/lib/utils'
import SmartLink from '@/components/SmartLink'
import { useState } from 'react'

export const GameListIndexCombine = ({ posts, maxCount = 3 }) => {
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
      <div className='flex flex-col gap-2'>
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
      className='relative block w-full aspect-[5/1] rounded-lg overflow-hidden cursor-pointer group bg-zinc-100 dark:bg-zinc-800'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {img ? (
        <LazyImage
          src={img}
          alt={title}
          className={`w-full h-full object-cover object-center transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          priority
          fill='full'
        />
      ) : (
        <div className='w-full h-full pix-gradient-bg flex items-center justify-center'>
          <i className='fas fa-image text-white/30 text-xl'></i>
        </div>
      )}
      <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
    </SmartLink>
  )
}
