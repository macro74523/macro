import { deepClone } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useGameGlobal } from '..'
import LazyImage from '@/components/LazyImage'

export const GameListRecent = ({ maxCount = 10 }) => {
  const { recentGames } = useGameGlobal()
  const [isVisible, setIsVisible] = useState(true)
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

  if (components.length === 0 || !isVisible) {
    return <></>
  }

  return (
    <div className='mb-4'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5'>
          <i className='fas fa-clock-rotate-left text-violet-500 text-xs'></i>
          最近浏览
          <span className='text-xs text-zinc-400 dark:text-zinc-500 ml-1'>({components.length})</span>
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className='w-6 h-6 flex items-center justify-center rounded text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors'
          title='关闭'>
          <i className='fas fa-times text-xs'></i>
        </button>
      </div>
      <div className='w-full overflow-x-auto scrollbar-hide'>
        <div className='flex gap-2' style={{ minWidth: 'min-content' }}>
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
      className='relative flex-shrink-0 w-20 rounded-md overflow-hidden cursor-pointer group bg-zinc-100 dark:bg-zinc-800'>
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
      <button
        onClick={removeRecent}
        className='absolute top-1 right-1 z-20 w-5 h-5 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70'>
        <i className='fas fa-times text-[10px]'></i>
      </button>
    </div>
  )
}
