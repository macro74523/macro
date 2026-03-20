import { useGameGlobal } from '..'
import Logo from './Logo'

export default function Header(props) {
  const { siteInfo } = props
  const { setSideBarVisible } = useGameGlobal()
  return (
    <header className='z-20 mb-4'>
      <Logo siteInfo={siteInfo} />
      <button
        className='lg:hidden w-full mt-3 flex items-center justify-center gap-2 px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-sm hover:text-violet-500 dark:hover:text-violet-400 transition-colors'
        onClick={() => {
          setSideBarVisible(true)
        }}>
        <i className='fas fa-search' />
        <span>搜索</span>
      </button>
    </header>
  )
}
