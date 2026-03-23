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
      className='relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none group overflow-hidden'
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' 
          : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
      }}
      title={isDarkMode ? '切换到亮色模式' : '切换到暗色模式'}>
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ${
          isDarkMode ? 'translate-x-7' : 'translate-x-0.5'
        }`}>
        <i 
          className={`text-sm transition-all duration-300 ${
            isDarkMode 
              ? 'text-indigo-500 fas fa-moon' 
              : 'text-amber-500 fas fa-sun'
          }`}
        />
      </span>
    </button>
  )
}

export default DarkModeButton
