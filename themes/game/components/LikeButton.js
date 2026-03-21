import { siteConfig } from '@/lib/config'
import { useState, useEffect } from 'react'

const LIKED_STORAGE_KEY = 'waline_liked_articles'

const getLikedArticles = () => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(LIKED_STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const saveLikedArticles = (articles) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(articles))
}

export default function LikeButton({ post }) {
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
  const articlePath = post?.href

  useEffect(() => {
    if (!articlePath) return
    
    const likedArticles = getLikedArticles()
    setIsLiked(likedArticles.includes(articlePath))
    
    if (serverURL) {
      fetchLikes()
    }
  }, [articlePath, serverURL])

  const fetchLikes = async () => {
    if (!serverURL || !articlePath) return
    
    try {
      const response = await fetch(
        `${serverURL}/api/article?path=${encodeURIComponent(articlePath)}`,
        { method: 'GET' }
      )
      const data = await response.json()
      if (data && data.data && data.data.length > 0) {
        const articleData = data.data[0]
        setLikes(articleData.like || 0)
      }
    } catch (error) {
      console.error('Failed to fetch likes:', error)
    }
  }

  const handleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLiked || isLoading) return
    
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 500)
    
    const likedArticles = getLikedArticles()
    if (!likedArticles.includes(articlePath)) {
      likedArticles.push(articlePath)
      saveLikedArticles(likedArticles)
    }
    setIsLiked(true)
    setLikes(prev => prev + 1)

    if (serverURL && articlePath) {
      setIsLoading(true)
      try {
        await fetch(`${serverURL}/api/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: articlePath
          })
        })
      } catch (error) {
        console.error('Failed to sync like to Waline:', error)
      }
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLiked || isLoading}
      className={`flex items-center gap-1 text-xs transition-all duration-300 ${
        isLiked 
          ? 'text-red-400 dark:text-red-400 cursor-default' 
          : 'text-zinc-300 dark:text-zinc-600 hover:text-red-400 dark:hover:text-red-400 cursor-pointer'
      }`}
      title={isLiked ? '已点赞' : '点赞'}>
      <i 
        className={`${isLiked ? 'fas' : 'far'} fa-heart text-[10px] transition-transform duration-300 ${
          isAnimating ? 'animate-bounce' : ''
        }`}
        style={{
          transform: isAnimating ? 'scale(1.3)' : 'scale(1)'
        }}
      />
      {likes > 0 && (
        <span className="text-[10px]">{likes}</span>
      )}
    </button>
  )
}
