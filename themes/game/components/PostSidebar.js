import DarkModeButton from './DarkModeButton'
import PostToc from './PostToc'
import ReadingProgress from './ReadingProgress'
import WordCount from '@/components/WordCount'
import SmartLink from '@/components/SmartLink'

export default function PostSidebar({ post }) {
  const toc = post?.toc || []
  const hasToc = toc.length > 0

  return (
    <aside className='w-[280px] hidden xl:block flex-shrink-0 border-l border-zinc-100 dark:border-zinc-800'>
      <div className='sticky top-8 p-5'>
        <div className='space-y-6'>
          <ReadingProgress />

          {hasToc && (
            <div className='pt-6 border-t border-zinc-100 dark:border-zinc-800'>
              <h4 className='text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2'>
                <span className='w-6 h-6 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center'>
                  <i className='fas fa-list text-violet-500 text-[10px]'></i>
                </span>
                目录
              </h4>
              <PostToc toc={toc} />
            </div>
          )}

          <div className='pt-6 border-t border-zinc-100 dark:border-zinc-800'>
            <h4 className='text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2'>
              <span className='w-6 h-6 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center'>
                <i className='fas fa-info-circle text-violet-500 text-[10px]'></i>
              </span>
              文章信息
            </h4>
            <div className='space-y-3 text-sm text-zinc-600 dark:text-zinc-400'>
              {post?.publishDay && (
                <div className='flex items-start gap-3'>
                  <span className='w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0'>
                    <i className='far fa-calendar text-[10px] text-zinc-400'></i>
                  </span>
                  <span className='leading-6'>{post.publishDay}</span>
                </div>
              )}
              {post?.category && (
                <div className='flex items-start gap-3'>
                  <span className='w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0'>
                    <i className='fas fa-folder text-[10px] text-zinc-400'></i>
                  </span>
                  <SmartLink 
                    href={`/category/${post.category}`}
                    className='hover:text-violet-500 dark:hover:text-violet-400 transition-colors leading-6'>
                    {post.category}
                  </SmartLink>
                </div>
              )}
              {post?.tags && post.tags.length > 0 && (
                <div className='flex items-start gap-3'>
                  <span className='w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0'>
                    <i className='fas fa-tags text-[10px] text-zinc-400'></i>
                  </span>
                  <div className='flex flex-wrap gap-1.5 pt-1'>
                    {post.tags.slice(0, 5).map((tag, index) => (
                      <SmartLink
                        key={index}
                        href={`/tag/${encodeURIComponent(tag)}`}
                        className='px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded text-xs hover:bg-violet-100 dark:hover:bg-violet-500/20 hover:text-violet-600 dark:hover:text-violet-400 transition-colors'>
                        #{tag}
                      </SmartLink>
                    ))}
                  </div>
                </div>
              )}
              {(post?.wordCount || post?.readTime) && (
                <div className='flex items-start gap-3'>
                  <span className='w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0'>
                    <i className='fas fa-file-alt text-[10px] text-zinc-400'></i>
                  </span>
                  <div className='text-xs pt-1.5'>
                    <WordCount wordCount={post.wordCount} readTime={post.readTime} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='pt-6 border-t border-zinc-100 dark:border-zinc-800'>
            <div className='flex items-center justify-between'>
              <span className='text-xs text-zinc-400 dark:text-zinc-500 font-medium'>主题切换</span>
              <DarkModeButton />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
