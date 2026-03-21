import { siteConfig } from '@/lib/config'
import { useState, useEffect } from 'react'

const LIKES_STORAGE_KEY = 'article_likes_data'
const LIKED_STORAGE_KEY = 'waline_liked_articles'

const getLikesData = () => {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

const saveLikesData = (data) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(data))
}

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
  
  const articleKey = post?.id || post?.slug || post?.href

  useEffect(() => {
    if (!articleKey) return
    
    const likesData = getLikesData()
    setLikes(likesData[articleKey] || 0)
    
    const likedArticles = getLikedArticles()
    setIsLiked(likedArticles.includes(articleKey))
  }, [articleKey])

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLiked) return
    
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 500)
    
    const likesData = getLikesData()
    const newCount = (likesData[articleKey] || 0) + 1
    likesData[articleKey] = newCount
    saveLikesData(likesData)
    setLikes(newCount)
    
    const likedArticles = getLikedArticles()
    if (!likedArticles.includes(articleKey)) {
      likedArticles.push(articleKey)
      saveLikedArticles(likedArticles)
    }
    setIsLiked(true)

    syncToWaline(articleKey, newCount)
  }

  const syncToWaline = async (path, count) => {
    const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
    if (!serverURL || !path) return
    
    try {
      await fetch(`${serverURL}/api/article`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: path,
          like: count
        })
      })
    } catch (error) {
      console.error('Failed to sync like to server:', error)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLiked}
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
