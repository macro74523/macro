import { deepClone } from '@/lib/utils'
import SmartLink from '@/components/SmartLink'
import { useState } from 'react'
import LazyImage from '@/components/LazyImage'

export const GameListRelate = ({ posts }) => {
  const gamesClone = deepClone(posts)
  const components = []
  const maxCount = 6

  let index = 0
  while (gamesClone?.length > 0 && index < maxCount) {
    const item = gamesClone.shift()
    components.push(<GameItem key={index} item={item} />)
    index++
    continue
  }

  if (components.length === 0) return null

  return (
    <div className='mb-4'>
      <h3 className='text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-1.5'>
        <i className='fas fa-lightbulb text-violet-500 text-xs'></i>
        相关推荐
      </h3>
      <div className='w-full overflow-x-auto scrollbar-hide'>
        <div className='flex gap-2' style={{ minWidth: 'min-content' }}>
          {components}
        </div>
      </div>
    </div>
  )
}

const GameItem = ({ item }) => {
  const { title } = item
  const [isHovered, setIsHovered] = useState(false)
  const img = item?.pageCoverThumbnail

  return (
    <SmartLink
      href={`${item?.href}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
      className='relative flex-shrink-0 w-24 rounded-md overflow-hidden cursor-pointer group bg-zinc-100 dark:bg-zinc-800'>
      <div className='aspect-[4/3] overflow-hidden'>
        {img ? (
          <LazyImage
            src={img}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
            priority
            fill='full'
          />
        ) : (
          <div className='w-full h-full pix-gradient-bg flex items-center justify-center'>
            <i className='fas fa-image text-white/30 text-sm'></i>
          </div>
        )}
      </div>
      <div className='p-1.5'>
        <p className='text-xs text-zinc-700 dark:text-zinc-300 line-clamp-1 group-hover:text-violet-500 transition-colors'>{title}</p>
      </div>
    </SmartLink>
  )
}
