import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'

export default function MobilePostFooter({ siteInfo }) {
  const router = useRouter()

  return (
    <div className='xl:hidden mt-8 mb-4 py-6 border-t border-zinc-100 dark:border-zinc-800'>
      <div className='flex flex-col items-center'>
        <div 
          className='w-16 h-16 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm cursor-pointer hover:shadow-md transition-shadow'
          onClick={() => router.push('/')}>
          {siteInfo?.icon ? (
            <img src={siteInfo.icon} alt='avatar' className='w-full h-full object-cover' data-no-lightbox='true' />
          ) : (
            <div className='w-full h-full pix-gradient-bg flex items-center justify-center'>
              <i className='fas fa-user text-white text-xl'></i>
            </div>
          )}
        </div>
        <div className='text-center mt-3'>
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
