import { useMemo } from 'react'

export default function PostCalendar({ posts }) {
  const chartData = useMemo(() => {
    if (!posts || posts.length === 0) return { months: [], maxCount: 0, total: 0 }

    const today = new Date()
    const months = []
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      months.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        label: date.toLocaleDateString('zh-CN', { month: 'short' }),
        count: 0
      })
    }

    const parseDate = (dateStr) => {
      if (!dateStr) return null
      
      let match = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
      if (match) {
        return { year: parseInt(match[1]), month: parseInt(match[2]) }
      }
      
      match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
      if (match) {
        return { year: parseInt(match[1]), month: parseInt(match[2]) }
      }
      
      return null
    }

    posts.forEach(post => {
      const dateStr = post.date?.start_date || post.publishDay || post.lastEditedDay
      if (dateStr) {
        const date = parseDate(dateStr)
        if (date) {
          const monthData = months.find(m => m.year === date.year && m.month === date.month)
          if (monthData) {
            monthData.count++
          }
        }
      }
    })

    const maxCount = Math.max(...months.map(m => m.count), 1)
    const total = months.reduce((sum, m) => sum + m.count, 0)

    return { months, maxCount, total }
  }, [posts])

  const getBarHeight = (count, maxCount) => {
    if (maxCount === 0) return 0
    return Math.max((count / maxCount) * 100, 0)
  }

  const getBarColor = (count) => {
    if (count === 0) return 'bg-zinc-200 dark:bg-zinc-700'
    if (count === 1) return 'bg-emerald-300 dark:bg-emerald-700'
    if (count === 2) return 'bg-emerald-400 dark:bg-emerald-600'
    return 'bg-emerald-500 dark:bg-emerald-500'
  }

  return (
    <div className='pt-6 border-t border-zinc-100 dark:border-zinc-800'>
      <h4 className='text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2'>
        <i className='fas fa-chart-line text-emerald-500'></i>
        发布曲线
        <span className='text-zinc-300 dark:text-zinc-600 font-normal normal-case'>
          {chartData.total}篇
        </span>
      </h4>
      
      <div className='relative h-24'>
        <div className='absolute inset-0 flex items-end gap-1'>
          {chartData.months?.map((month, index) => (
            <div
              key={index}
              className='flex-1 flex flex-col items-center justify-end group'
              title={`${month.year}年${month.month}月 - ${month.count}篇文章`}>
              <div
                className={`w-full rounded-t transition-all ${getBarColor(month.count)} group-hover:opacity-80`}
                style={{ height: `${getBarHeight(month.count, chartData.maxCount)}%` }}
              />
            </div>
          ))}
        </div>
        
        <div className='absolute bottom-0 left-0 right-0 h-px bg-zinc-200 dark:bg-zinc-700' />
      </div>
      
      <div className='flex gap-1 mt-2'>
        {chartData.months?.map((month, index) => (
          <div
            key={index}
            className='flex-1 text-center text-[9px] text-zinc-400 dark:text-zinc-500'>
            {month.label}
          </div>
        ))}
      </div>
      
      <div className='flex items-center justify-center gap-2 mt-3 text-[10px] text-zinc-400 dark:text-zinc-500'>
        <span>最近12个月</span>
      </div>
    </div>
  )
}
