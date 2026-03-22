export default function ArticleSkeleton({ count = 6 }) {
  const heights = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[1/1]', 'aspect-[4/6]', 'aspect-[3/5]']

  return (
    <div className='columns-2 gap-3 space-y-3'>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className='break-inside-avoid bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm'
        >
          <div className={`${heights[index % heights.length]} bg-zinc-100 dark:bg-zinc-800 overflow-hidden`}>
            <div className='w-full h-full bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 animate-shimmer bg-[length:200%_100%]' />
          </div>
          <div className='p-3'>
            <div className='h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4 mb-2 animate-pulse' />
            <div className='h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2 animate-pulse' />
          </div>
        </div>
      ))}
    </div>
  )
}
