import { useRouter } from 'next/router'
import { useState } from 'react'

export default function RandomPostButton({ posts }) {
  const router = useRouter()
  const [isSpinning, setIsSpinning] = useState(false)

  const handleRandomPost = () => {
    if (!posts || posts.length === 0) return
    
    setIsSpinning(true)
    
    const randomIndex = Math.floor(Math.random() * posts.length)
    const randomPost = posts[randomIndex]
    
    setTimeout(() => {
      setIsSpinning(false)
      if (randomPost?.href) {
        router.push(randomPost.href)
      }
    }, 500)
  }

  return (
    <div className='pt-6 border-t border-zinc-100 dark:border-zinc-800'>
      <button
        onClick={handleRandomPost}
        disabled={!posts || posts.length === 0}
        className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group'
      >
        <i className={`fas fa-shuffle ${isSpinning ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`}></i>
        <span className='font-medium text-sm'>随机阅读</span>
      </button>
    </div>
  )
}
