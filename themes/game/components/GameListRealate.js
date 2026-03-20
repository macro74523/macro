import { deepClone } from '@/lib/utils'
import SmartLink from '@/components/SmartLink'
import { useState } from 'react'
import LazyImage from '@/components/LazyImage'

export const GameListRelate = ({ posts }) => {
  const gamesClone = deepClone(posts)
  const components = []
  const maxCount = 12

  let index = 0
  while (gamesClone?.length > 0 && index < maxCount) {
    const item = gamesClone.shift()
    components.push(<GameItem key={index} item={item} />)
    index++
    continue
  }

  if (components.length === 0) return null

  return (
    <div className='pix-card p-4 mb-4'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1'>
          <i className='fas fa-gamepad text-purple-500'></i>
          相关推荐
        </h3>
        <span className='text-xs text-gray-400'>{components.length}</span>
      </div>
      <div className='w-full overflow-x-auto'>
        <div className='flex gap-3' style={{ minWidth: 'min-content' }}>
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
      className='relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer group'>
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
          <i className='fas fa-gamepad text-white/50'></i>
        </div>
      )}

      <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10'></div>
      <div className='absolute bottom-1 left-1 right-1 z-20'>
        <p className='text-xs text-white line-clamp-1'>{title}</p>
      </div>
    </SmartLink>
  )
}
