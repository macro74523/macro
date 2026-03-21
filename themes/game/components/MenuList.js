import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useGameGlobal } from '..'
import CONFIG from '../config'
import { MenuItemDrop } from './MenuItemDrop'
import OnlineUsers from './OnlineUsers'

export const MenuList = props => {
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
      <div className='flex flex-col items-center mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800'>
        <div className='w-14 h-14 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 mb-3'>
          {siteInfo?.icon ? (
            <img src={siteInfo.icon} alt='avatar' className='w-full h-full object-cover' />
          ) : (
            <div className='w-full h-full pix-gradient-bg flex items-center justify-center'>
              <i className='fas fa-user text-white'></i>
            </div>
          )}
        </div>
        <div className='text-center'>
          <h5 className='text-lg font-bold text-zinc-800 dark:text-zinc-100'>
            {siteInfo?.title || '博主'}
          </h5>
          <div className='mt-2'>
            <OnlineUsers />
          </div>
        </div>
      </div>

      <button
        className='w-full flex items-center gap-2.5 px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-200 text-sm group'
        onClick={() => {
          setSideBarVisible(true)
        }}>
        <i className='fas fa-search w-4 text-center text-zinc-300 dark:text-zinc-600 group-hover:text-violet-500 transition-colors'></i>
        <span className='group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-colors'>搜索</span>
      </button>

      <div className='pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-0.5'>
        {links?.map(
          (link, index) =>
            link && link.show && <MenuItemDrop key={index} link={link} />
        )}
      </div>
    </nav>
  )
}
