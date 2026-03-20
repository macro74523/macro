import { deepClone } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useGameGlobal } from '..'
import LazyImage from '@/components/LazyImage'

export const GameListRecent = ({ maxCount = 10 }) => {
  const { recentGames } = useGameGlobal()
  const gamesClone = deepClone(recentGames)
  const components = []

  let index = 0
  while (gamesClone?.length > 0 && index < maxCount) {
    const item = gamesClone?.shift()
    if (item) {
      components.push(<GameItem key={index} item={item} />)
      index++
    }
    continue
  }

  if (components.length === 0) {
    return <></>
  }

  return (
    <div className='pix-card p-4 mb-4'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1'>
          <i className='fas fa-clock-rotate-left text-purple-500'></i>
          最近浏览
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
  const router = useRouter()
  const { recentGames, setRecentGames } = useGameGlobal()
  const { title } = item || {}
  const [isHovered, setIsHovered] = useState(false)

  const removeRecent = e => {
    e.stopPropagation()
    const updatedRecentGames = deepClone(recentGames)
    const indexToRemove = updatedRecentGames.findIndex(
      game => game?.title === item.title
    )
    if (indexToRemove !== -1) {
      updatedRecentGames.splice(indexToRemove, 1)
      setRecentGames(updatedRecentGames)
      localStorage.setItem('recent_games', JSON.stringify(updatedRecentGames))
    }
  }

  const handleButtonClick = () => {
    router.push(item?.href)
  }

  const img = item?.pageCoverThumbnail

  return (
    <div
      onClick={handleButtonClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className='relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer group'>
      <button
        onClick={removeRecent}
        className='absolute top-1 right-1 z-20 w-4 h-4 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity'>
        <i className='fas fa-times text-xs'></i>
      </button>

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
    </div>
  )
}
