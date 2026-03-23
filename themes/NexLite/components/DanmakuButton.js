import { useState } from 'react'

export default function DanmakuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className='w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-violet-500 dark:hover:text-violet-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all'
      title='发送弹幕'>
      <span className='text-xs font-bold'>弹</span>
    </button>
  )
}
