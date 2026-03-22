import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'

export default function PostReaction({ post }) {
  const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
  const [reactions, setReactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeReaction, setActiveReaction] = useState(null)
  const [reacting, setReacting] = useState(false)

  const reactionOptions = [
    { icon: '👍', name: '不错', key: 'like' },
    { icon: '❤️', name: '喜欢', key: 'heart' },
    { icon: '🔥', name: '精彩', key: 'fire' },
    { icon: '💡', name: '有用', key: 'idea' },
  ]

  useEffect(() => {
    if (!serverURL || !post?.href) return
    
    const fetchReactions = async () => {
      try {
        const response = await fetch(
          `${serverURL}/api/article?path=${encodeURIComponent(post.href)}`
        )
        const data = await response.json()
        if (data.data?.reaction) {
          setReactions(data.data.reaction)
        }
      } catch (error) {
        console.error('Failed to fetch reactions:', error)
      }
      setLoading(false)
    }
    
    fetchReactions()
  }, [serverURL, post?.href])

  const handleReaction = async (reactionKey) => {
    if (reacting || !serverURL || !post?.href) return
    
    setReacting(true)
    const previousActive = activeReaction
    
    try {
      setActiveReaction(reactionKey)
      
      const response = await fetch(`${serverURL}/api/article`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: post.href,
          reaction: reactionKey,
        }),
      })
      
      const data = await response.json()
      if (data.data?.reaction) {
        setReactions(data.data.reaction)
      }
    } catch (error) {
      console.error('Failed to submit reaction:', error)
      setActiveReaction(previousActive)
    }
    
    setReacting(false)
  }

  if (loading) {
    return (
      <div className='xl:hidden mt-6 mb-3 px-1'>
        <div className='p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50'>
          <div className='text-center text-sm text-zinc-400'>
            <i className='fas fa-spinner animate-spin mr-2'></i>
            加载中...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='xl:hidden mt-6 mb-3 px-1'>
      <div className='p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-500/10 dark:to-purple-500/10 rounded-xl border border-violet-100 dark:border-violet-500/20'>
        <div className='text-center mb-3'>
          <span className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
            你认为这篇文章怎么样？
          </span>
        </div>
        
        <div className='flex justify-center gap-4'>
          {reactionOptions.map((option) => {
            const count = reactions[option.key] || 0
            const isActive = activeReaction === option.key
            
            return (
              <button
                key={option.key}
                onClick={() => handleReaction(option.key)}
                disabled={reacting}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-violet-500 text-white scale-110 shadow-lg' 
                    : 'hover:bg-white dark:hover:bg-zinc-700/50'
                }`}>
                <span className='text-2xl'>{option.icon}</span>
                <span className={`text-[10px] ${isActive ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
