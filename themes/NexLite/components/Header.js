import { useNexLiteGlobal } from '..'
import Logo from './Logo'

export default function Header({ siteInfo, showSearch = true }) {
  const { setSideBarVisible } = useNexLiteGlobal()
  return (
    <header className='z-20 mb-4'>
      <Logo siteInfo={siteInfo} />
      {showSearch && (
        <button
          className='lg:hidden w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-sm hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-500 dark:hover:text-violet-400 transition-all rounded-xl border border-zinc-100 dark:border-zinc-700/50'
          onClick={() => {
            setSideBarVisible(true)
          }}>
          <span className='w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center'>
            <i className='fas fa-search text-xs' />
          </span>
          <span>搜索</span>
        </button>
      )}
    </header>
  )
}
