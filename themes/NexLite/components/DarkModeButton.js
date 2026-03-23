import { useGlobal } from '@/lib/global'
import { useImperativeHandle } from 'react'

const DarkModeButton = props => {
  const { cRef } = props
  const { isDarkMode, toggleDarkMode } = useGlobal()

  useImperativeHandle(cRef, () => {
    return {
      handleChangeDarkMode: () => {
        toggleDarkMode()
      }
    }
  })

  return (
    <button
      onClick={toggleDarkMode}
      className='w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-violet-500 dark:hover:text-violet-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all'
      title={isDarkMode ? '切换到亮色模式' : '切换到暗色模式'}>
      <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`} />
    </button>
  )
}

export default DarkModeButton
