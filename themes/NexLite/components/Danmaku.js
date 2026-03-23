import { useState, useEffect, useCallback, memo } from 'react'
import { siteConfig } from '@/lib/config'

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
      <span className='text-shadow-sm px-2 py-1 text-sm md:text-base lg:text-lg text-white dark:text-zinc-100 font-medium'>
        {text}
      </span>
    </div>
  )
})

export default function Danmaku({ enabled = true }) {
  const [activeDanmaku, setActiveDanmaku] = useState([])
  const [comments, setComments] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const fetchComments = async () => {
      const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
      if (!serverURL) return

      try {
        const res = await fetch(`${serverURL}/api/comment?path=/&pageSize=50`)
        const data = await res.json()
        if (data.data && data.data.length > 0) {
          const formattedComments = data.data.map(comment => ({
            id: comment.objectId,
            text: comment.comment,
            nick: comment.nick
          }))
          setComments(formattedComments)
        }
      } catch (error) {
        console.error('获取弹幕失败:', error)
      }
    }

    fetchComments()
    const interval = setInterval(fetchComments, 60000)
    return () => clearInterval(interval)
  }, [])

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

    const interval = setInterval(() => {
      addDanmaku()
    }, 3000)

    return () => clearInterval(interval)
  }, [enabled, addDanmaku, comments.length])

  const handleFinish = useCallback((id) => {
    setActiveDanmaku(prev => prev.filter(item => item.id !== id))
  }, [])

  if (!enabled || comments.length === 0) return null

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
