import { AdSlot } from '@/components/GoogleAdsense'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { deepClone } from '@/lib/utils'
import SmartLink from '@/components/SmartLink'
import { useState } from 'react'
import CONFIG from '../config'

export const GameListIndexCombine = ({ posts }) => {
  const gamesClone = deepClone(posts)
  const items = []
  
  let index = 0
  while (gamesClone?.length > 0) {
    index++
    if (index % 10 === 0) {
      items.push(<GameAd key={`ad-${index}`} />)
    } else {
      const item = gamesClone.shift()
      if (item) {
        items.push(<GameCard key={item.id || index} item={item} index={index} />)
      }
    }
  }

  return (
    <div className='columns-2 gap-3 space-y-3'>
      {items}
    </div>
  )
}

const GameAd = () => {
  return (
    <div className='break-inside-avoid bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm p-4 flex flex-col items-center justify-center text-center'>
      <p className='text-sm font-medium pix-gradient-text'>{siteConfig('TITLE')}</p>
      <p className='text-xs text-zinc-400 dark:text-zinc-500 mt-2 mb-3'>{siteConfig('DESCRIPTION')}</p>
      <AdSlot type='flow' />
    </div>
  )
}

const GameCard = ({ item, index }) => {
  const { title, summary } = item
  const img = item.pageCoverThumbnail || item.pageCover
  const date = item.publishDay || item.publishDate
  const category = item.category
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const aspects = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[1/1]', 'aspect-[4/6]', 'aspect-[3/5]', 'aspect-[2/3]']
  const randomAspect = aspects[index % aspects.length]

  return (
    <article className='break-inside-avoid bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group'>
      <SmartLink
        title={title}
        href={`${item?.href}`}
        className='block'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        
        <div className={`relative ${randomAspect} overflow-hidden bg-zinc-100 dark:bg-zinc-800`}>
          {img ? (
            <>
              {!imageLoaded && (
                <div className='absolute inset-0 bg-zinc-200 dark:bg-zinc-700 animate-pulse' />
              )}
              <LazyImage
                src={img}
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
          
          {category && (
            <div className='absolute top-2 left-2'>
              <span className='px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[10px]'>
                {category}
              </span>
            </div>
          )}
        </div>

        <div className='p-3'>
          <h3 className='text-sm font-medium text-zinc-800 dark:text-zinc-100 line-clamp-2 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors mb-2 leading-snug'>
            {title}
          </h3>
          
          {summary && (
            <p className='text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-2 leading-relaxed'>
              {summary}
            </p>
          )}
          
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-5 h-5 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0'>
                <i className='fas fa-user text-[8px] text-zinc-400 dark:text-zinc-500 flex items-center justify-center w-full h-full'></i>
              </div>
              <span className='text-xs text-zinc-400 dark:text-zinc-500 truncate'>博主</span>
            </div>
            <div className='flex items-center gap-2 text-xs text-zinc-300 dark:text-zinc-600'>
              <span className='flex items-center gap-0.5'>
                <i className='far fa-heart text-[10px]'></i>
              </span>
              <span className='flex items-center gap-0.5'>
                <i className='far fa-star text-[10px]'></i>
              </span>
            </div>
          </div>
        </div>
      </SmartLink>
    </article>
  )
}
