import { useState, useEffect } from 'react'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className='fixed bottom-32 right-8 z-40 group xl:hidden'
      title='回到顶部'>
      <div className='w-11 h-11 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50 flex items-center justify-center text-zinc-600 dark:text-zinc-300 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300 border border-zinc-100 dark:border-zinc-700'>
        <i className='fas fa-arrow-up text-sm group-hover:-translate-y-0.5 transition-transform'></i>
      </div>
    </button>
  )
}
