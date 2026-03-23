import { useMemo } from 'react'
import SmartLink from '@/components/SmartLink'

export default function PostCalendar({ posts }) {
  const calendarData = useMemo(() => {
    if (!posts || posts.length === 0) return { weeks: [], months: [], total: 0 }

    const today = new Date()
    today.setHours(23, 59, 59, 999)
    
    const oneYearAgo = new Date(today)
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    oneYearAgo.setHours(0, 0, 0, 0)

    const parseDate = (dateStr) => {
      if (!dateStr) return null
      
      let match = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
      if (match) {
        return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`
      }
      
      match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
      if (match) {
        return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`
      }
      
      return null
    }

    const dateCount = {}
    posts.forEach(post => {
      if (post.publishDay) {
        const dateStr = parseDate(post.publishDay)
        if (dateStr) {
          dateCount[dateStr] = (dateCount[dateStr] || 0) + 1
        }
      }
    })

    const weeks = []
    const months = []
    let currentWeek = []
    let currentDate = new Date(oneYearAgo)
    
    const dayOfWeek = currentDate.getDay()
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push({ date: null, count: 0 })
    }

    let lastMonth = -1
    while (currentDate <= today) {
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`
      const count = dateCount[dateStr] || 0
      
      currentWeek.push({ date: dateStr, count })

      const monthNum = currentDate.getMonth()
      if (monthNum !== lastMonth && currentWeek.length > 0) {
        months.push({
          month: monthNum,
          label: currentDate.toLocaleDateString('zh-CN', { month: 'short' }),
          weekIndex: weeks.length
        })
        lastMonth = monthNum
      }

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    const total = Object.values(dateCount).reduce((a, b) => a + b, 0)

    return { weeks, months, total, dateCount }
  }, [posts])

  const getColor = (count) => {
    if (count === 0) return 'bg-zinc-100 dark:bg-zinc-800'
    if (count === 1) return 'bg-emerald-200 dark:bg-emerald-900'
    if (count === 2) return 'bg-emerald-300 dark:bg-emerald-700'
    if (count >= 3) return 'bg-emerald-400 dark:bg-emerald-500'
    return 'bg-zinc-100 dark:bg-zinc-800'
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getLevel = (count) => {
    if (count === 0) return '无发布'
    if (count === 1) return '1篇文章'
    return `${count}篇文章`
  }

  return (
    <div className='pt-6 border-t border-zinc-100 dark:border-zinc-800'>
      <h4 className='text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2'>
        <i className='fas fa-calendar-days text-emerald-500'></i>
        发布日历
        <span className='text-zinc-300 dark:text-zinc-600 font-normal normal-case'>
          {calendarData.total}篇
        </span>
      </h4>
      
      <div className='overflow-x-auto scrollbar-hide'>
        <div className='min-w-fit'>
          <div className='flex gap-0.5 mb-1'>
            <div className='w-3' />
            {calendarData.months?.map((m, i) => (
              <div
                key={i}
                className='text-[10px] text-zinc-400 dark:text-zinc-500'
                style={{ 
                  marginLeft: i === 0 ? `${m.weekIndex * 4}px` : '0',
                  position: 'relative',
                  left: `${m.weekIndex * 12}px`
                }}
              >
                {m.label}
              </div>
            ))}
          </div>
          
          <div className='flex gap-0.5'>
            <div className='flex flex-col gap-0.5 mr-1'>
              {['日', '一', '二', '三', '四', '五', '六'].map((day, i) => (
                <div
                  key={i}
                  className='h-[10px] text-[9px] text-zinc-400 dark:text-zinc-500 flex items-center'
                >
                  {i % 2 === 0 ? day : ''}
                </div>
              ))}
            </div>
            
            <div className='flex gap-0.5'>
              {calendarData.weeks?.map((week, weekIndex) => (
                <div key={weekIndex} className='flex flex-col gap-0.5'>
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-[10px] h-[10px] rounded-sm ${getColor(day.count)} transition-all hover:ring-1 hover:ring-zinc-400 dark:hover:ring-zinc-500 cursor-pointer`}
                      title={day.date ? `${formatDate(day.date)} - ${getLevel(day.count)}` : ''}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className='flex items-center justify-end gap-1 mt-2 text-[10px] text-zinc-400 dark:text-zinc-500'>
            <span>少</span>
            <div className='w-[10px] h-[10px] rounded-sm bg-zinc-100 dark:bg-zinc-800' />
            <div className='w-[10px] h-[10px] rounded-sm bg-emerald-200 dark:bg-emerald-900' />
            <div className='w-[10px] h-[10px] rounded-sm bg-emerald-300 dark:bg-emerald-700' />
            <div className='w-[10px] h-[10px] rounded-sm bg-emerald-400 dark:bg-emerald-500' />
            <span>多</span>
          </div>
        </div>
      </div>
    </div>
  )
}
