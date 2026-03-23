import SmartLink from '@/components/SmartLink'

export default function BlogArchiveItem({ archiveTitle, archivePosts }) {
  const posts = archivePosts[archiveTitle] || []
  const postCount = posts.length

  return (
    <div key={archiveTitle} className='mb-8'>
      <div 
        id={archiveTitle} 
        className='flex items-center gap-3 mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-700'>
        <div className='w-10 h-10 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center'>
          <i className='fas fa-calendar-alt text-violet-500'></i>
        </div>
        <div>
          <h2 className='text-xl font-bold text-zinc-800 dark:text-zinc-100'>
            {archiveTitle}
          </h2>
          <p className='text-xs text-zinc-400 dark:text-zinc-500'>
            共 {postCount} 篇文章
          </p>
        </div>
      </div>

      <div className='space-y-2 pl-2'>
        {posts.map((post, index) => (
          <SmartLink
            key={post.id}
            href={post?.href}
            className='group flex items-start gap-3 py-2 px-3 -mx-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors'>
            <span className='text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 w-20 flex-shrink-0'>
              {post.date?.start_date}
            </span>
            <span className='flex-1 text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors line-clamp-2'>
              {post.title}
            </span>
            {post.category && (
              <span className='text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex-shrink-0'>
                {post.category}
              </span>
            )}
          </SmartLink>
        ))}
      </div>
    </div>
  )
}
