import { useEffect, useState, useMemo } from 'react'

export default function PostCalendar({ posts }) {
  const [contributions, setContributions] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchGitHubContributions = async () => {
      try {
        const response = await fetch('/api/github-contributions')
        const data = await response.json()
        
        if (data.contributions) {
          setContributions(data.contributions)
          const totalCount = data.contributions.reduce((sum, day) => sum + day.level, 0)
          setTotal(totalCount)
        }
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch GitHub contributions:', error)
        setLoading(false)
      }
    }

    fetchGitHubContributions()
  }, [])

  const calendarData = useMemo(() => {
    if (contributions.length === 0) return { weeks: [], months: [] }

    const today = new Date()
    today.setHours(23, 59, 59, 999)
    
    const oneYearAgo = new Date(today)
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    oneYearAgo.setHours(0, 0, 0, 0)

    const dateMap = {}
    contributions.forEach(day => {
      dateMap[day.date] = day.level
    })

    const weeks = []
    const months = []
    let currentWeek = []
    let currentDate = new Date(oneYearAgo)
    
    const dayOfWeek = currentDate.getDay()
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push({ date: null, level: 0 })
    }

    let lastMonth = -1
    while (currentDate <= today) {
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`
      const level = dateMap[dateStr] || 0
      
      currentWeek.push({ date: dateStr, level })

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

    return { weeks, months }
  }, [contributions])

  const getColor = (level) => {
    if (level === 0) return 'bg-zinc-100 dark:bg-zinc-800'
    if (level === 1) return 'bg-emerald-200 dark:bg-emerald-900'
    if (level === 2) return 'bg-emerald-300 dark:bg-emerald-700'
    if (level === 3) return 'bg-emerald-400 dark:bg-emerald-600'
    return 'bg-emerald-500 dark:bg-emerald-500'
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className='pt-6 border-t border-zinc-100 dark:border-zinc-800'>
        <h4 className='text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2'>
          <i className='fab fa-github text-emerald-500'></i>
          GitHub 贡献
        </h4>
        <div className='h-24 flex items-center justify-center'>
          <i className='fas fa-spinner animate-spin text-zinc-400'></i>
        </div>
      </div>
    )
  }

  return (
    <div className='pt-6 border-t border-zinc-100 dark:border-zinc-800'>
      <h4 className='text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2'>
        <i className='fab fa-github text-emerald-500'></i>
        GitHub 贡献
        <span className='text-zinc-300 dark:text-zinc-600 font-normal normal-case'>
          {total}次
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
                      className={`w-[10px] h-[10px] rounded-sm ${getColor(day.level)} transition-all hover:ring-1 hover:ring-zinc-400 dark:hover:ring-zinc-500 cursor-pointer`}
                      title={day.date ? `${formatDate(day.date)} - 贡献等级: ${day.level}` : ''}
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
            <div className='w-[10px] h-[10px] rounded-sm bg-emerald-400 dark:bg-emerald-600' />
            <div className='w-[10px] h-[10px] rounded-sm bg-emerald-500 dark:bg-emerald-500' />
            <span>多</span>
          </div>
        </div>
      </div>
      
      <div className='flex items-center justify-center gap-2 mt-3 text-[10px] text-zinc-400 dark:text-zinc-500'>
        <a 
          href='https://github.com/macro74523' 
          target='_blank' 
          rel='noreferrer'
          className='hover:text-violet-500 transition-colors'>
          @macro74523
        </a>
      </div>
    </div>
  )
}
