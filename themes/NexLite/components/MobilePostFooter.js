import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

export default function MobilePostFooter({ siteInfo }) {
  const router = useRouter()
  const showRss = siteConfig('ENABLE_RSS')

  return (
    <div className='xl:hidden mt-8 mb-4 py-6 border-t border-zinc-100 dark:border-zinc-800'>
      <div className='flex flex-col items-center'>
        <div className='relative mb-3'>
          <div 
            className='w-16 h-16 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm cursor-pointer hover:shadow-md transition-shadow'
            onClick={() => router.push('/')}>
            {siteInfo?.icon ? (
              <img src={siteInfo.icon} alt='avatar' className='w-full h-full object-cover' />
            ) : (
              <div className='w-full h-full pix-gradient-bg flex items-center justify-center'>
                <i className='fas fa-user text-white text-xl'></i>
              </div>
            )}
          </div>
          {showRss && (
            <a
              href='/rss/feed.xml'
              target='_blank'
              rel='noreferrer'
              onClick={(e) => e.stopPropagation()}
              className='absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center shadow-md'>
              <i className='fas fa-rss text-white text-[8px]'></i>
            </a>
          )}
        </div>
        <div className='text-center'>
          <h5 className='text-base font-bold text-zinc-800 dark:text-zinc-100'>
            {siteInfo?.title || '博主'}
          </h5>
          <p className='text-xs text-zinc-400 dark:text-zinc-500 mt-1'>
            {siteConfig('BIO')}
          </p>
        </div>
      </div>
    </div>
  )
}
