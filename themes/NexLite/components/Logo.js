import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import RssButton from './RssButton'

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
        {showRss && <RssButton />}
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
