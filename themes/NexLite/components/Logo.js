import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'

export default function Logo({ siteInfo }) {
  const showRss = siteConfig('ENABLE_RSS')
  
  return (
    <SmartLink
      passHref
      href='/'
      className='logo cursor-pointer flex flex-col items-center text-center py-2 group'>
      <div className='relative'>
        {siteInfo?.icon ? (
          <img 
            src={siteInfo.icon} 
            alt='logo' 
            className='w-16 h-16 rounded-full shadow-sm mb-3'
          />
        ) : (
          <div className='w-16 h-16 rounded-full pix-gradient-bg flex items-center justify-center shadow-sm mb-3'>
            <i className='fas fa-gamepad text-white text-2xl'></i>
          </div>
        )}
        {showRss && (
          <a
            href='/rss/feed.xml'
            target='_blank'
            rel='noreferrer'
            onClick={(e) => e.stopPropagation()}
            className='absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 z-10'
            title='RSS 订阅'>
            <i className='fas fa-rss text-white text-[10px]'></i>
          </a>
        )}
      </div>
      <h1 className='text-base font-bold text-gray-800 dark:text-white leading-tight mb-1'>
        {siteInfo?.title}
      </h1>
      <h2 className='text-xs text-gray-400 dark:text-gray-500 line-clamp-2'>
        {siteConfig('BIO')}
      </h2>
    </SmartLink>
  )
}
