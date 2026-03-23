import { useState, useEffect, useCallback, memo } from 'react'

const DanmakuItem = memo(function DanmakuItem({ id, text, top, duration, delay, onFinish }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onFinish?.()
    }, (duration + delay) * 1000)

    return () => clearTimeout(timer)
  }, [duration, delay, onFinish])

  if (!isVisible) return null

  return (
    <div
      className='fixed whitespace-nowrap pointer-events-none z-40 animate-danmaku'
      style={{
        top: `${top}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        opacity: 0.7
      }}>
      <span className='text-shadow-sm px-2 py-1 text-sm md:text-base lg:text-lg text-white dark:text-zinc-100 font-medium'>
        {text}
      </span>
    </div>
  )
})

export default function Danmaku({ danmakuList, enabled = true }) {
  const [activeDanmaku, setActiveDanmaku] = useState([])
  const [index, setIndex] = useState(0)

  const addDanmaku = useCallback(() => {
    if (!danmakuList || danmakuList.length === 0) return

    const item = danmakuList[index % danmakuList.length]
    const top = Math.random() * 60 + 10
    const duration = Math.random() * 3 + 4

    const newItem = {
      id: Date.now() + Math.random(),
      text: typeof item === 'string' ? item : item?.comment || item?.nick || '弹幕',
      top,
      duration,
      delay: 0
    }

    setActiveDanmaku(prev => [...prev.slice(-10), newItem])
    setIndex(prev => prev + 1)
  }, [danmakuList, index])

  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      addDanmaku()
    }, 3000)

    return () => clearInterval(interval)
  }, [enabled, addDanmaku])

  const handleFinish = useCallback((id) => {
    setActiveDanmaku(prev => prev.filter(item => item.id !== id))
  }, [])

  if (!enabled || !danmakuList || danmakuList.length === 0) return null

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
