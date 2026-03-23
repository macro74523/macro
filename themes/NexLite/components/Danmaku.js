import { useState, useEffect, useCallback, memo } from 'react'
import { siteConfig } from '@/lib/config'
import { RecentComments } from '@waline/client'

const DanmakuItem = memo(function DanmakuItem({ id, text, top, duration, onFinish }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onFinish?.()
    }, duration * 1000)

    return () => clearTimeout(timer)
  }, [duration, onFinish])

  if (!isVisible) return null

  return (
    <div
      className='fixed whitespace-nowrap pointer-events-none z-40 animate-danmaku'
      style={{
        top: `${top}%`,
        animationDuration: `${duration}s`,
        opacity: 0.7
      }}>
      <span className='text-shadow-sm px-2 py-1 text-sm md:text-base lg:text-lg text-white dark:text-zinc-100 font-medium bg-black/20 rounded-full'>
        {text}
      </span>
    </div>
  )
})

export default function Danmaku({ enabled = true }) {
  const [activeDanmaku, setActiveDanmaku] = useState([])
  const [comments, setComments] = useState([])
  const [index, setIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
    if (!serverURL || !enabled) return

    const fetchComments = async () => {
      try {
        const result = await RecentComments({
          serverURL,
          count: 50
        })
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[Danmaku] Waline response:', result)
        }
        
        if (result && result.comments && result.comments.length > 0) {
          const formattedComments = result.comments.map(comment => ({
            id: comment.objectId,
            text: comment.comment.replace(/<[^>]*>/g, '').substring(0, 50),
            nick: comment.nick
          }))
          setComments(formattedComments)
          if (process.env.NODE_ENV === 'development') {
            console.log('[Danmaku] Loaded comments:', formattedComments.length)
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Danmaku] No comments found')
          }
        }
        setIsLoaded(true)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[Danmaku] Failed to fetch comments:', error)
        }
        setIsLoaded(true)
      }
    }

    fetchComments()
    const interval = setInterval(fetchComments, 60000)
    return () => clearInterval(interval)
  }, [enabled])

  const addDanmaku = useCallback(() => {
    if (!comments || comments.length === 0) return

    const item = comments[index % comments.length]
    const top = Math.random() * 60 + 10
    const duration = Math.random() * 3 + 4

    const newItem = {
      id: Date.now() + Math.random(),
      text: `${item.nick}: ${item.text}`,
      top,
      duration
    }

    setActiveDanmaku(prev => [...prev.slice(-10), newItem])
    setIndex(prev => prev + 1)
  }, [comments, index])

  useEffect(() => {
    if (!enabled || comments.length === 0) return

    addDanmaku()
    const interval = setInterval(() => {
      addDanmaku()
    }, 3000)

    return () => clearInterval(interval)
  }, [enabled, addDanmaku, comments.length])

  const handleFinish = useCallback((id) => {
    setActiveDanmaku(prev => prev.filter(item => item.id !== id))
  }, [])

  if (!enabled || !isLoaded || comments.length === 0) return null

  return (
    <div className='fixed inset-0 overflow-hidden pointer-events-none'>
      {activeDanmaku.map(item => (
        <DanmakuItem
          key={item.id}
          {...item}
          onFinish={() => handleFinish(item.id)}
        />
      ))}
    </div>
  )
}
