import { AdSlot } from '@/components/GoogleAdsense'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { deepClone } from '@/lib/utils'
import SmartLink from '@/components/SmartLink'
import { useState } from 'react'
import CONFIG from '../config'

export const GameListIndexCombine = ({ posts }) => {
  const gamesClone = deepClone(posts)
  const components = []
  const recommend = siteConfig('GAME_INDEX_EXPAND_RECOMMEND', true, CONFIG)

  let index = 0
  if (recommend) {
    let groupItems = []

    while (gamesClone?.length > 0) {
      index++

      if (index % 9 === 0) {
        components.push(<GameAd key={index} />)
        continue
      }

      while (gamesClone?.length > 0 && groupItems.length < 4) {
        const item = gamesClone.shift()
        index++
        if (
          item.tags?.some(
            t => t === siteConfig('GAME_RECOMMEND_TAG', 'Recommend', CONFIG)
          )
        ) {
          components.push(
            <GameItem key={index} item={item} isLargeCard={true} />
          )
          continue
        } else {
          groupItems.push(item)
        }
      }

      if (groupItems.length === 4) {
        components.push(<GameItemGroup key={index} items={groupItems} />)
        groupItems = []
      } else {
        while (groupItems.length > 0) {
          const item = groupItems.shift()
          index++
          components.push(
            <GameItem key={index++} item={item} isLargeCard={true} />
          )
        }
      }
    }
  } else {
    while (gamesClone?.length > 0) {
      index++

      if (index % 6 === 0) {
        components.push(<GameAd key={index} />)
      } else if (index % 2 === 0 && gamesClone?.length >= 4) {
        const groupItems = []
        for (let i = 1; i <= 4; i++) {
          groupItems.push(gamesClone.shift())
        }
        components.push(<GameItemGroup key={index} items={groupItems} />)
      } else {
        const item = gamesClone.shift()
        components.push(<GameItem key={index} item={item} isLargeCard={true} />)
      }
    }
  }

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1'>
      {components?.map((ItemComponent, index) => {
        return ItemComponent
      })}
    </div>
  )
}

const GameAd = () => {
  return (
    <div className='pix-card h-32 flex flex-col justify-center items-center text-center p-4'>
      <p className='text-sm font-bold pix-gradient-text'>{siteConfig('TITLE')}</p>
      <p className='text-xs text-gray-400 mt-1'>{siteConfig('DESCRIPTION')}</p>
      <AdSlot type='flow' />
    </div>
  )
}

const GameItemGroup = ({ items }) => {
  return (
    <div className='h-32 grid grid-cols-2 grid-rows-2 gap-1 overflow-hidden'>
      {items.map((item, index) => (
        <GameItem key={index} item={item} />
      ))}
    </div>
  )
}

const GameItem = ({ item, isLargeCard }) => {
  const { title } = item
  const img = item.pageCoverThumbnail
  const [isHovered, setIsHovered] = useState(false)

  return (
    <SmartLink
      title={title}
      href={`${item?.href}`}
      className={`relative overflow-hidden group ${isLargeCard ? 'h-32' : 'h-full'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {img ? (
        <LazyImage
          src={img}
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
          priority
          fill='full'
        />
      ) : (
        <div className='absolute inset-0 pix-gradient-bg flex items-center justify-center'>
          <i className='fas fa-gamepad text-white/50'></i>
        </div>
      )}

      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10'></div>

      <div className='absolute bottom-0 left-0 right-0 p-2 z-20'>
        <p className={`text-white line-clamp-1 ${isLargeCard ? 'text-xs' : 'text-xs'}`}>
          {title}
        </p>
      </div>
    </SmartLink>
  )
}
