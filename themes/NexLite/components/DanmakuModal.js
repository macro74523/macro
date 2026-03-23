import { useState, useRef, useEffect } from 'react'

const presetMessages = [
  '快来尝试发一个弹幕吧~',
  '这个网站真不错！',
  '欢迎来到这里~'
]

export default function DanmakuModal({ isOpen, onClose, onSubmit }) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!message.trim()) return
    
    setIsSending(true)
    try {
      await onSubmit(message.trim())
      setMessage('')
      onClose()
    } catch (error) {
      console.error('发送弹幕失败:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handlePresetClick = (preset) => {
    setMessage(preset)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className='fixed inset-0 z-50 flex items-center justify-center'
      onClick={onClose}>
      <div className='absolute inset-0 bg-black/30 backdrop-blur-sm' />
      <div 
        className='relative bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-4 w-[90%] max-w-md mx-auto'
        onClick={(e) => e.stopPropagation()}>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-base font-medium text-zinc-800 dark:text-zinc-100'>
            发送弹幕
          </h3>
          <button
            onClick={onClose}
            className='w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors'>
            <i className='fas fa-times text-sm' />
          </button>
        </div>

        <div className='flex flex-wrap gap-2 mb-3'>
          {presetMessages.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(preset)}
              className='px-3 py-1.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-violet-100 dark:hover:bg-violet-500/20 hover:text-violet-600 dark:hover:text-violet-400 transition-colors'>
              {preset}
            </button>
          ))}
        </div>

        <div className='relative'>
          <input
            ref={inputRef}
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='输入弹幕内容...'
            maxLength={50}
            className='w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all'
          />
          <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400'>
            {message.length}/50
          </span>
        </div>

        <div className='flex justify-end gap-2 mt-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors'>
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || isSending}
            className='px-4 py-2 text-sm bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5'>
            {isSending ? (
              <>
                <i className='fas fa-spinner animate-spin text-xs' />
                发送中
              </>
            ) : (
              <>
                <i className='fas fa-paper-plane text-xs' />
                发送
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
