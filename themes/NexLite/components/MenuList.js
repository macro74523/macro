import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useNexLiteGlobal } from '..'
import CONFIG from '../config'
import { useRouter } from 'next/router'
import { MenuItemDrop } from './MenuItemDrop'

export const MenuList = ({ showSearch = true, ...props }) => {
  const { setSideBarVisible } = useNexLiteGlobal()
  const { customNav, customMenu, siteInfo } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const showRss = siteConfig('ENABLE_RSS')
  
  const defaultLinks = [
    {
      id: 1,
      icon: 'fas fa-home',
      name: locale.NAV.INDEX,
      href: '/',
      show: true
    },
    {
      id: 2,
      icon: 'fas fa-th-large',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('NEXLITE_MENU_CATEGORY', null, CONFIG)
    },
    {
      id: 3,
      icon: 'fas fa-tags',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('NEXLITE_MENU_TAG', null, CONFIG)
    },
    {
      id: 4,
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: true
    }
  ]

  let links = [].concat(defaultLinks)
  if (customNav) {
    links = defaultLinks.concat(customNav)
  }

  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu
  }

  return (
    <nav className='space-y-1'>
      <div className='flex flex-col items-center mb-5 pb-5 border-b border-zinc-100 dark:border-zinc-800'>
        <div className='relative'>
          <div 
            className='w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 mb-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow'
            onClick={() => router.push('/')}>
            {siteInfo?.icon ? (
              <img src={siteInfo.icon} alt='avatar' className='w-full h-full object-cover' />
            ) : (
              <div className='w-full h-full pix-gradient-bg flex items-center justify-center'>
                <i className='fas fa-user text-white text-lg'></i>
              </div>
            )}
          </div>
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
        <div className='text-center'>
          <h5 className='text-lg font-bold text-zinc-800 dark:text-zinc-100 tracking-tight'>
            {siteInfo?.title || '博主'}
          </h5>
        </div>
      </div>

      {showSearch && (
        <button
          className='w-full flex items-center gap-3 px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-200 text-sm group rounded-lg'
          onClick={() => {
            setSideBarVisible(true)
          }}>
          <span className='w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-500/20 transition-colors'>
            <i className='fas fa-search text-xs text-zinc-400 dark:text-zinc-500 group-hover:text-violet-500 transition-colors'></i>
          </span>
          <span className='group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-colors'>搜索</span>
        </button>
      )}

      <div className={`${showSearch ? 'pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800' : ''} space-y-1`}>
        {links?.map(
          (link, index) =>
            link && link.show && <MenuItemDrop key={index} link={link} />
        )}
      </div>
    </nav>
  )
}
