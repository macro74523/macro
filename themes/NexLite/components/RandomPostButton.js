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
    <button
      onClick={handleRandomPost}
      disabled={!posts || posts.length === 0}
      className='w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-violet-500 dark:hover:text-violet-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
      title='随机阅读'>
      <i className={`fas fa-shuffle ${isSpinning ? 'animate-spin' : ''}`} />
    </button>
  )
}
