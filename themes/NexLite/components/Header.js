import { siteConfig } from '@/lib/config'
import { useNexLiteGlobal } from '..'
import Logo from './Logo'

const socialIcons = [
  { key: 'XIAOHONGSHU', icon: 'fa-heart', title: '小红书', color: 'hover:text-red-500 dark:hover:text-red-400', brand: false },
  { key: 'WEHCHAT_PUBLIC', icon: 'fa-weixin', title: '微信', color: 'hover:text-green-500 dark:hover:text-green-400', brand: true },
  { key: 'DOUYIN', icon: 'fa-tiktok', title: '抖音', color: 'hover:text-black dark:hover:text-white', brand: true },
  { key: 'BILIBILI', icon: 'fa-bilibili', title: 'B站', color: 'hover:text-pink-500 dark:hover:text-pink-400', brand: true },
]

export default function Header({ siteInfo, showSearch = true }) {
  const { setSideBarVisible, openDanmakuModal } = useNexLiteGlobal()
  const showRss = siteConfig('ENABLE_RSS')

  return (
    <header className='z-20 mb-4 relative'>
      <Logo siteInfo={siteInfo} onDanmakuClick={openDanmakuModal} />
      
      {showSearch && (
        <button
          onClick={() => setSideBarVisible(true)}
          className='absolute top-2 right-0 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-violet-500 dark:hover:text-violet-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all'
          title='搜索'>
          <i className='fas fa-search text-sm' />
        </button>
      )}

      <div className='flex items-center justify-center gap-3 mt-3'>
        {socialIcons.map(({ key, icon, title, color, brand }) => {
          const url = siteConfig(`CONTACT_${key}`)
          return (
            <a
              key={key}
              href={url || '#'}
              target={url ? '_blank' : undefined}
              rel='noreferrer'
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-500 ${url ? color : 'opacity-50 cursor-not-allowed'} hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all`}
              title={title}>
              <i className={`${brand ? 'fab' : 'fas'} ${icon} text-sm`} />
            </a>
          )
        })}
        {showRss && (
          <a
            href='/rss/feed.xml'
            target='_blank'
            rel='noreferrer'
            className='w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all'
            title='RSS 订阅'>
            <i className='fas fa-rss text-sm' />
          </a>
        )}
      </div>
    </header>
  )
}
