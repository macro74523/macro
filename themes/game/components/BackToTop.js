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
      className='fixed bottom-8 right-8 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-violet-500 text-white shadow-lg hover:bg-violet-600 transition-all duration-300 hover:scale-110 group'
      title='回到顶部'>
      <i className='fas fa-arrow-up text-sm group-hover:-translate-y-0.5 transition-transform'></i>
    </button>
  )
}
