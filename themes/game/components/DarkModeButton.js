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
      className='relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none'
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' 
          : '#e4e4e7'
      }}
      title={isDarkMode ? '切换到亮色模式' : '切换到暗色模式'}>
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center ${
          isDarkMode ? 'translate-x-6' : 'translate-x-0.5'
        }`}>
        <i 
          className={`text-xs transition-colors duration-300 ${
            isDarkMode 
              ? 'text-violet-500 fas fa-moon' 
              : 'text-amber-400 fas fa-sun'
          }`}
        />
      </span>
    </button>
  )
}
export default DarkModeButton
