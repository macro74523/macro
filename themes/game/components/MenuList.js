import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useGameGlobal } from '..'
import CONFIG from '../config'
import { MenuItemDrop } from './MenuItemDrop'

export const MenuList = ({ showSearch = true, ...props }) => {
  const { setSideBarVisible } = useGameGlobal()
  const { customNav, customMenu, siteInfo } = props
  const { locale } = useGlobal()
  
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
      show: siteConfig('GAME_MENU_CATEGORY', null, CONFIG)
    },
    {
      id: 3,
      icon: 'fas fa-tags',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('GAME_MENU_TAG', null, CONFIG)
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
        <div className='w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 mb-3 shadow-sm'>
          {siteInfo?.icon ? (
            <img src={siteInfo.icon} alt='avatar' className='w-full h-full object-cover' />
          ) : (
            <div className='w-full h-full pix-gradient-bg flex items-center justify-center'>
              <i className='fas fa-user text-white text-lg'></i>
            </div>
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

      {siteConfig('ENABLE_RSS') && (
        <div className='pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800'>
          <a
            href='/rss/feed.xml'
            target='_blank'
            rel='noreferrer'
            className='w-full flex items-center gap-3 px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-200 text-sm group rounded-lg'>
            <span className='w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-500/30 transition-colors'>
              <i className='fas fa-rss text-xs text-orange-500 transition-colors'></i>
            </span>
            <span className='group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-colors'>RSS 订阅</span>
          </a>
        </div>
      )}
    </nav>
  )
}
